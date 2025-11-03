export interface Player {
    id: string;
    name: string;
  }
  
  export interface Team {
    id: string;
    name: string;
    players: Player[];
    score: number;
    consecutiveMisses: number;
    isEliminated: boolean;
    isActive: boolean;
  }
  
  export interface GameState {
    teams: Team[];
    currentTeamIndex: number;
    currentPlayerIndex: number;
    gameStatus: 'setup' | 'playing' | 'paused' | 'finished';
    winner?: Team | null;
    history: GameEvent[];
  }
  
  export interface GameEvent {
    id: string;
    timestamp: Date;
    teamId: string;
    playerId: string;
    action: 'score' | 'miss' | 'eliminate' | 'reset_score';
    points?: number;
    pinsKnocked?: number;
    details?: string;
  }
  
  export interface GameStats {
    totalRounds: number;
    gameStartTime: Date;
    gameEndTime?: Date;
    teamStats: {
      teamId: string;
      totalPoints: number;
      averageScore: number;
      missCount: number;
      successfulThrows: number;
    }[];
  }