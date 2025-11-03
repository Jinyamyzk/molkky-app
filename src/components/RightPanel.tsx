"use client";

import { useState } from "react";
import { GameState } from "@/types/game";
import ConfirmationModal from "./ConfirmationModal";

interface RightPanelProps {
  gameState: GameState;
  onScore: (points: number, pinsKnocked?: number) => void;
  onUndoLastAction: () => void;
  canUndo: boolean;
  onResetGame: () => void;
}

export default function RightPanel({
  gameState,
  onScore,
  onUndoLastAction,
  canUndo,
  onResetGame,
}: RightPanelProps) {
  const currentTeam = gameState.teams[gameState.currentTeamIndex];
  const currentPlayer = currentTeam?.players[gameState.currentPlayerIndex];
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleScore = (points: number, pinsKnocked?: number) => {
    onScore(points, pinsKnocked);
  };

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const handleResetConfirm = () => {
    onResetGame();
    setShowResetConfirm(false);
  };

  const handleResetCancel = () => {
    setShowResetConfirm(false);
  };

  if (gameState.gameStatus === "finished" && gameState.winner) {
    return (
      <div className="right-panel">
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h2 style={{ color: "#28a745", marginBottom: "15px" }}>🎉 Winner!</h2>
          <div style={{ fontSize: "24px", marginBottom: "15px" }}>🏆</div>
          <h3 style={{ marginBottom: "20px" }}>{gameState.winner.name}</h3>
          <button className="button success" onClick={handleResetClick}>
            New Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="right-panel">
      <div className="current-turn-panel">
        <h3>🎯 Current Turn</h3>

        {currentTeam && currentPlayer && (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              {currentPlayer.name}
            </div>
            <div style={{ color: "#666", marginBottom: "10px" }}>
              Team: {currentTeam.name}
            </div>
            <div style={{ color: "#007bff", fontWeight: "bold" }}>
              Score: {currentTeam.score}/50
            </div>
            {currentTeam.consecutiveMisses > 0 && (
              <div
                style={{ color: "#dc3545", fontSize: "14px", marginTop: "5px" }}
              >
                Misses: {currentTeam.consecutiveMisses}/3
              </div>
            )}
          </div>
        )}

        <div
          className="game-controls"
          style={{ justifyContent: "center", marginBottom: "20px" }}
        >
          <button
            className="button secondary"
            onClick={onUndoLastAction}
            disabled={!canUndo}
          >
            ↶ Undo
          </button>
          <button className="button danger" onClick={handleResetClick}>
            🔄 Reset
          </button>
        </div>
      </div>

      {gameState.gameStatus === "playing" && (
        <div className="scoring-section">
          <h4>📌 Single Pin</h4>
          <div className="scoring-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((pin) => (
              <button
                key={pin}
                className="button"
                onClick={() => handleScore(pin, 1)}
              >
                {pin}
              </button>
            ))}
          </div>

          <h4 style={{ marginTop: "20px" }}>🎳 Multiple Pins</h4>
          <div className="scoring-grid">
            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((count) => (
              <button
                key={count}
                className="button"
                onClick={() => handleScore(count, count)}
              >
                {count}
              </button>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              className="button danger"
              onClick={() => handleScore(0)}
              style={{ fontSize: "16px", padding: "12px 24px", width: "100%" }}
            >
              ❌ Miss (0 points)
            </button>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showResetConfirm}
        title="Reset Game"
        message="Are you sure you want to reset the game? All progress will be lost and you'll return to team setup."
        onConfirm={handleResetConfirm}
        onCancel={handleResetCancel}
        confirmText="Reset Game"
        cancelText="Cancel"
        dangerous={true}
      />
    </div>
  );
}
