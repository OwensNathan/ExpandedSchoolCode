<?php
// Security: Disable error display in production, log errors instead
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Security Headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header("Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:;");
header('X-XSS-Protection: 1; mode=block');

/**
 * Safe stack-based arithmetic expression evaluator
 */
function evaluateExpression($expr) {
    $expr = str_replace(' ', '', $expr);

    // Global implicit multiplication:
    // 1. Number or ')' followed by '('
    $expr = preg_replace('/(\d|\))(\()/','${1}*${2}',$expr);
    // 2. ')' followed by number
    $expr = preg_replace('/(\))(\d)/','${1}*${2}',$expr);
    // 3. Number followed by number (e.g., "2 3" becomes "2*3")
    $expr = preg_replace('/(\d)(?=\d)/','${1}*',$expr);

    if (preg_match('/[^0-9+\-*\/^().]/', $expr)) {
        throw new Exception("Invalid characters in expression");
    }
    return evaluateTokens(tokenize($expr));
}

function tokenize($expr) {
    $tokens = [];
    $number = '';
    $length = strlen($expr);
    for ($i = 0; $i < $length; $i++) {
        $char = $expr[$i];

        // Number or decimal
        if (ctype_digit($char) || $char === '.') {
            $number .= $char;
        } else {
            if ($number !== '') {
                $tokens[] = $number;
                $number = '';
            }

            // Handle negative numbers
            if ($char === '-' && ($i === 0 || in_array($expr[$i-1], '+-*/(^'))) {
                $number = '-';
            } else {
                $tokens[] = $char;
            }
        }
    }
    if ($number !== '') $tokens[] = $number;
    return $tokens;
}

function evaluateTokens($tokens) {
    $values = [];
    $ops = [];
    $precedence = ['+' => [1,'L'], '-' => [1,'L'], '*' => [2,'L'], '/' => [2,'L'], '^' => [3,'R']];
    $applyOp = function() use (&$values, &$ops) {
        $b = array_pop($values);
        $a = array_pop($values);
        $op = array_pop($ops);
        switch ($op) {
            case '+': $values[] = $a + $b; break;
            case '-': $values[] = $a - $b; break;
            case '*': $values[] = $a * $b; break;
            case '/': if ($b == 0) throw new Exception("Division by zero"); $values[] = $a / $b; break;
            case '^': $values[] = pow($a, $b); break;
        }
    };
    foreach ($tokens as $token) {
        if (is_numeric($token)) {
            $values[] = (float)$token;
        } elseif ($token === '(') {
            $ops[] = $token;
        } elseif ($token === ')') {
            while (!empty($ops) && end($ops) !== '(') $applyOp();
            if (empty($ops)) throw new Exception("Mismatched parentheses");
            array_pop($ops);
        } elseif (isset($precedence[$token])) {
            list($p1,$assoc1) = $precedence[$token];
            while (!empty($ops) && isset($precedence[end($ops)])) {
                list($p2,$assoc2) = $precedence[end($ops)];
                if (($assoc1 === 'L' && $p1 <= $p2) || ($assoc1 === 'R' && $p1 < $p2)) $applyOp();
                else break;
            }
            $ops[] = $token;
        } else throw new Exception("Invalid token: $token");
    }
    while (!empty($ops)) {
        if (end($ops) === '(' || end($ops) === ')') throw new Exception("Mismatched parentheses");
        $applyOp();
    }
    if (count($values) !== 1) throw new Exception("Invalid expression");
    return $values[0];
}

// ---------------- Webpage logic ----------------
$result = "";
$input = isset($_COOKIE['last_expression']) ? $_COOKIE['last_expression'] : "";
$selectedFunction = isset($_COOKIE['last_function']) ? $_COOKIE['last_function'] : "";
$evaluatorFunctions = ['evaluateExpression'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['expression'])) $input = $_POST['expression'];
    if (isset($_POST['function'])) $selectedFunction = $_POST['function'];

    if (in_array($selectedFunction, $evaluatorFunctions)) {
        try {
            $result = call_user_func($selectedFunction, $input);
        } catch (Throwable $e) {
            $result = "Error: " . $e->getMessage();
        }
    } else {
        $result = "Please select a valid evaluator function.";
    }

    // Security: Set cookies with HttpOnly, Secure (if HTTPS), and SameSite flags
    $cookieOptions = [
        'expires' => time() + 30*24*60*60,
        'path' => '/',
        'domain' => '',
        'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
        'httponly' => true,
        'samesite' => 'Strict'
    ];
    setcookie('last_expression', $input, $cookieOptions);
    setcookie('last_function', $selectedFunction, $cookieOptions);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PHP Calculator Page</title>
<style>
body { margin:0; padding:0; background:black; font-family:Arial,sans-serif; position:relative; overflow-x:hidden; min-height:100vh; color:#fff; }
#raindrops { position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:0; }
.raindrop { position:absolute; top:-20px; width:2px; background:#00f; opacity:0.7; animation:fall linear infinite; transform:rotate(-10deg); box-shadow:0 0 5px #00f,0 0 10px #00f,0 0 20px #0ff; }
@keyframes fall { 0%{transform:translateY(0) rotate(-10deg);opacity:0.7;} 100%{transform:translateY(110vh) rotate(-10deg);opacity:0.1;} }
header, footer { padding:10px; background:rgba(255,255,255,0.1); margin-bottom:20px; position:relative; z-index:1; }
nav a { margin-right:15px; color:#0ff; text-decoration:none; }
nav a:hover { text-decoration:underline; }
.content { max-width:600px; margin:auto; position:relative; z-index:1; }
input[type="text"], select { width:100%; padding:5px; margin-bottom:10px; }
button { padding:5px 10px; cursor:pointer; }
.result { background:rgba(255,255,255,0.1); padding:10px; margin-top:10px; }
</style>
</head>
<body>
<div id="raindrops"></div>

<header>
<h1>My PHP Webpage</h1>
<nav>
<a href="#home">Home</a>
<a href="#calc">Calculator</a>
<a href="#about">About</a>
</nav>
</header>

<section id="home" class="content">
<h2>Welcome</h2>
<p>This webpage uses a safe, stack-based PHP evaluator with exponent, negative numbers, parentheses, and full implicit multiplication support, including numbers next to numbers like "2 3".</p>
</section>

<section id="calc" class="content">
<h2>Expression Calculator</h2>
<?php if ($result !== ""): ?>
<div class="result"><strong>Result:</strong> <?php echo htmlspecialchars($result); ?></div>
<?php endif; ?>
<form method="POST">
<label>Select evaluator function:</label><br>
<select name="function" required>
<option value="">-- Select Function --</option>
<?php foreach ($evaluatorFunctions as $func): ?>
<option value="<?php echo htmlspecialchars($func); ?>" <?php if ($func === $selectedFunction) echo 'selected'; ?>>
<?php echo htmlspecialchars($func); ?></option>
<?php endforeach; ?>
</select>

<label>Enter expression:</label><br>
<input type="text" name="expression" value="<?php echo htmlspecialchars($input); ?>"><br><br>
<button type="submit">Calculate</button>
</form>
</section>

<section id="about" class="content">
<h2>About</h2>
<p>This evaluator safely handles +, -, *, /, ^, negative numbers, parentheses, and implicit multiplication—including numbers next to numbers like "2 3" and chained parentheses "(2+3)(4+5)(6+7)".</p>
</section>

<footer>
<p>&copy; 2025 My Webpage</p>
</footer>

<script>
const raindropCount = 150;
const container = document.getElementById('raindrops');
for (let i=0;i<raindropCount;i++){
    const drop=document.createElement('div');
    drop.classList.add('raindrop');
    drop.style.left=Math.random()*100+'vw';
    drop.style.height=5+Math.random()*25+'px';
    drop.style.opacity=0.3+Math.random()*0.7;
    drop.style.animationDuration=0.5+Math.random()*2+'s';
    drop.style.transform=`rotate(${ -10 + Math.random()*20 }deg)`;
    container.appendChild(drop);
}
</script>
</body>
</html>
