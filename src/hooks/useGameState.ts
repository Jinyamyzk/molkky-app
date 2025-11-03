'use client';

import { useState, useCallback, useRef } from "react";
import { Team, Player, GameState, GameEvent, GameStats } from "@/types/game";

export const useGameState = () => {
    const [gameState, setGameState] = useState<GameState>({
        teams: [],
        currentTeamIndex: 0,
        currentPlayerIndex: 0,
        gameStatus: "setup",
        history: []
    });

    const [gameStateHistory, setGameStateHistory] = useState<GameState[]>([]);
    const isProcessingScore = useRef(false);

    const addTeam = useCallback((name: string) => {
        const newTeam : Team = {
            id: Date.now().toString(),
            name, 
            players: [],
            score: 0,
            consecutiveMisses: 0,
            isEliminated: false,
            isActive: true
        }

        setGameState(prev => ({
            ...prev,
            teams: [...prev.teams, newTeam]
        }));
    }, []);

    const removeTeam = useCallback((teamId: string) => {
        setGameState(prev => ({
            ...prev,
            teams: prev.teams.filter(team => team.id !== teamId)
        }))
    }, []);

    const addPlayer = useCallback((teamId: string, playerName: string) => {
        const newPlayer: Player = {
            id: Date.now.toString(),
            name: playerName
        };

        setGameState(prev => ({
            ...prev,
            teams: prev.teams.map(team => 
                team.id === teamId
                ? { ...team, players: [...team.players, newPlayer]}
                : team
            )
        }));
    }, []);

    const removePlayer = useCallback((teamId: string, playerId: string) => {
        setGameState(prev => ({
            ...prev,
            teams: prev.teams.map(team => 
                team.id === teamId
                ? { ...team, players: team.players.filter(player => player.id !== playerId)} : team
            )
        }))
    }, []);

    const recordScore = useCallback((points: number, pinsKnocked? : number) => {
        // Prevent rapid clicking bug
        if (isProcessingScore.current) return;
        isProcessingScore.current = true;

        setGameState(prev => {
            setGameStateHistory(history => [...history, prev]);

            const currentTeam = prev.teams[prev.currentTeamIndex];
            if (!currentTeam) {
                isProcessingScore.current = false;
                return prev;
            }

            const currentPlayer = currentTeam.players[prev.currentPlayerIndex];
            if (!currentPlayer) {
                isProcessingScore.current = false;
                return prev;
            }

            const newScore = currentTeam.score + points;
            let finalScore = newScore;
            let resetScore = false;

            if (newScore > 50) {
                finalScore = 25;
                resetScore = true;
            }

            const newEvent: GameEvent = {
                id: Date.now().toString(),
                timestamp: new Date(),
                teamId: currentTeam.id,
                playerId: currentPlayer.id,
                action: points > 0 ? 'score' : 'miss',
                points,
                pinsKnocked,
                details: resetScore ? 'Score reset to 25 (exceeded 50)' : undefined
            }

            const updatedTeams = prev.teams.map(team => 
                team.id === currentTeam.id
                ? {
                    ...team,
                    score: finalScore,
                    consecutiveMisses: points > 0 ? 0 : team.consecutiveMisses + 1
                }
                : team
            )

            const eliminatedTeams = updatedTeams.map(team => ({
                ...team,
                isEliminated: team.consecutiveMisses >= 3 || team.isEliminated
            }));

            // Check for winner
            const scoreWinner = eliminatedTeams.find(team => team.score === 50);

            // Check for last team standing
            const activeTeams = eliminatedTeams.filter(team => !team.isEliminated);
            const lastTeamWinner = activeTeams.length === 1 ? activeTeams[0] : null;

            const winner = scoreWinner || lastTeamWinner;

            // Calculate next turn
            let nextTeamIndex = prev.currentTeamIndex;
            let nextPlayerIndex = prev.currentPlayerIndex;

            if (!winner) {
                // Advance to next turn
                nextTeamIndex = (prev.currentTeamIndex + 1) % prev.teams.length;

                // Skip eliminated teams
                while (eliminatedTeams[nextTeamIndex]?.isEliminated && activeTeams.length > 0) {
                    nextTeamIndex = (nextTeamIndex + 1) % prev.teams.length;
                }

                const nextTeam = eliminatedTeams[nextTeamIndex];
                nextPlayerIndex = nextTeam ? (prev.currentPlayerIndex + 1) % nextTeam.players.length : 0;

            }

            // Reset processing flag after a shor delay
            setTimeout(() => {
                isProcessingScore.current = false;
            }, 300);

            return {
                ...prev,
                teams: eliminatedTeams,
                history: [...prev.history, newEvent],
                gameStatus: winner ? 'finished' : prev.gameStatus,
                winner,
                currentTeamIndex: nextTeamIndex,
                currentPlayerIndex: nextPlayerIndex
            }
        })
    }, []); 

    const nextTurn = useCallback(() => {
        setGameState(prev => {
            const activeTeams = prev.teams.filter(team => !team.isEliminated);
            if (activeTeams.length === 0) return prev;

            let nextTeamIndex = (prev.currentTeamIndex + 1) % prev.teams.length;

            while (prev.teams[nextTeamIndex]?.isEliminated && activeTeams.length > 0) {
                nextTeamIndex = (nextTeamIndex + 1) % prev.teams.length;
            }

            const currentTeam = prev.teams[nextTeamIndex];
            const nextPlayerIndex = currentTeam ?
                (prev.currentPlayerIndex + 1) % currentTeam.players.length : 0;

            return {
                ...prev,
                currentTeamIndex: nextTeamIndex,
                currentPlayerIndex: nextPlayerIndex
            };
        })
    }, [])

    const startGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            gameStatus: 'playing'
        }))
    }, []);

    const resetGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            teams: prev.teams.map(team => ({
                ...team,
                score: 0,
                consecutiveMisses: 0,
                isEliminated: false,
                isActive: true
            })),
            currentTeamIndex: 0,
            currentPlayerIndex: 0,
            gameStatus: 'setup',
            winner: undefined,
            history: []
        }));
        setGameStateHistory([]);
    }, []);

    const undoLastAction = useCallback(()=>{
        if (gameStateHistory.length === 0) return;

        const previousState = gameStateHistory[gameStateHistory.length - 1];
        setGameState(previousState);
        setGameStateHistory(history => history.slice(0, -1));
    }, [gameStateHistory]);

    const getGameStats = useCallback((): GameStats => {
        const gameStartTime = gameState.history[0]?.timestamp || new Date();
        const gameEndTime = gameState.gameStatus === 'finished' ? new Date() : undefined;

        const teamStats = gameState.teams.map(team => {
            const teamEvents = gameState.history.filter(event => event.teamId === team.id);
            const successfulThrows = teamEvents.filter(event => event.action === 'score' && event.points! > 0).length;
            const missCount = teamEvents.filter(event => event.action === 'miss').length;
            const totalPoints = teamEvents.reduce((sum, event) => sum + (event.points || 0), 0);

            return {
                teamId: team.id,
                totalPoints,
                averageScore: successfulThrows > 0 ? totalPoints / successfulThrows : 0,
                missCount,
                successfulThrows
            }
        });

        return {
            totalRounds: Math.max(...gameState.teams.map(team => 
                gameState.history.filter(event => event.teamId === team.id).length
            ), 0),
            gameStartTime,
            gameEndTime,
            teamStats
        }
    }, [gameState]);

    return {
        gameState,
        addTeam,
        removeTeam,
        addPlayer,
        removePlayer,
        recordScore,
        nextTurn,
        startGame,
        resetGame,
        undoLastAction,
        canUndo: gameStateHistory.length > 0,
        getGameStats
    };
};