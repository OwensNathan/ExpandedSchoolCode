namespace CombinationOfSchoolCode.Shared;
public static class Connect4AI
{
    public static int Move(char[,] b)
    {
        var r = new System.Random();
        for (int tries=0; tries<50; tries++)
        {
            int col = r.Next(0, 7);
            if (b[0, col] == ' ') return col;
        }
        for (int i=0; i<7; i++) if (b[0, i] == ' ') return i;
        return 0;
    }
}