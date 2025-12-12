using System;

namespace CombinationOfSchoolCode.Shared;
public static class Connect4AI
{
    private static readonly Random _random = new();
    
    public static int Move(char[,] b)
    {
        for (int tries=0; tries<50; tries++)
        {
            int col = _random.Next(0, 7);
            if (b[0, col] == ' ') return col;
        }
        for (int i=0; i<7; i++) if (b[0, i] == ' ') return i;
        return 0;
    }
}