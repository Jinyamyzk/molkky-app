"use client";

import { useGameState } from "@/hooks/useGameState";
import TeamSetup from "@/components/TeamSetup";
import GameBoard from "@/components/GameBoard";
import GameExport from "@/components/GameExport";

export default function Home() {
  const {
    gameState,
    addTeam,
    removeTeam,
    addPlayer,
    removePlayer,
    recordScore,
    startGame,
    resetGame,
    undoLastAction,
    canUndo,
    getGameStats,
  } = useGameState();

  const gameStats = getGameStats();

  return (
    <main>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#007bff", marginBottom: "10px" }}>
          🎯 Mölkky Game
        </h1>
        <p style={{ color: "#666" }}>
          Digital scoring app for the traditional Finnish throwing game
        </p>
      </div>

      {gameState.gameStatus === "setup" ? (
        <TeamSetup
          teams={gameState.teams}
          onAddTeam={addTeam}
          onRemoveTeam={removeTeam}
          onAddPlayer={addPlayer}
          onRemovePlayer={removePlayer}
          onStartGame={startGame}
        />
      ) : (
        <>
          <GameBoard
            gameState={gameState}
            onScore={recordScore}
            onUndoLastAction={undoLastAction}
            canUndo={canUndo}
            onResetGame={resetGame}
          />

          {(gameState.gameStatus === "finished" ||
            gameState.history.length > 0) && (
            <GameExport gameStats={gameStats} gameState={gameState} />
          )}
        </>
      )}

      {gameState.gameStatus !== "setup" && gameState.history.length > 0 && (
        <div className="card">
          <h3>Game Statistics</h3>
          <div className="game-stats">
            <div className="stat-card">
              <div className="stat-value">{gameStats.totalRounds}</div>
              <div className="stat-label">Total Rounds</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {gameState.teams.filter((t) => !t.isEliminated).length}
              </div>
              <div className="stat-label">Active Teams</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {gameStats.gameStartTime
                  ? Math.floor(
                      (Date.now() - gameStats.gameStartTime.getTime()) / 60000
                    )
                  : 0}
                m
              </div>
              <div className="stat-label">Game Duration</div>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h4>Team Performance</h4>
            {gameState.teams.map((team) => {
              const teamStats = gameStats.teamStats.find(
                (ts) => ts.teamId === team.id
              );
              return (
                <div
                  key={team.id}
                  style={{
                    padding: "10px",
                    margin: "5px 0",
                    background: "#f8f9fa",
                    borderRadius: "4px",
                    opacity: team.isEliminated ? 0.7 : 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <strong>{team.name}</strong>
                    <span>Score: {team.score}/50</span>
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      marginTop: "5px",
                    }}
                  >
                    Successful throws: {teamStats?.successfulThrows || 0} |
                    Misses: {teamStats?.missCount || 0} | Avg:{" "}
                    {teamStats?.averageScore.toFixed(1) || "0.0"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
