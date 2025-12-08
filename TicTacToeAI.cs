namespace CombinationOfSchoolCode.Shared;
public static class TicTacToeAI
{
    // Simple AI: First empty slot
    public static (int,int) Move(char[,] board)
    {
        for (int i=0;i<3;i++) for(int j=0;j<3;j++) if (board[i,j]==' ') return (i,j);
        return (0,0);
    }
}