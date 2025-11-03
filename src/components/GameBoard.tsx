"use client";

import { GameState } from "@/types/game";
import LeftPanel from "./LeftPanel";
import CenterPanel from "./CenterPanel";
import RightPanel from "./RightPanel";

interface GameBoardProps {
  gameState: GameState;
  onScore: (points: number, pinsKnocked?: number) => void;
  onUndoLastAction: () => void;
  canUndo: boolean;
  onResetGame: () => void;
}

export default function GameBoard({
  gameState,
  onScore,
  onUndoLastAction,
  canUndo,
  onResetGame,
}: GameBoardProps) {
  if (gameState.gameStatus === "finished" && gameState.winner) {
    return (
      <div className="card">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h1 style={{ color: "#28a745", marginBottom: "20px" }}>
            🎉 Game Finished! 🎉
          </h1>
          <h2 style={{ marginBottom: "30px" }}>
            {gameState.winner.name} Wins!
          </h2>
          <div style={{ fontSize: "48px", marginBottom: "30px" }}>🏆</div>
          <button className="button success" onClick={onResetGame}>
            New Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-layout">
      <LeftPanel gameState={gameState} />
      <CenterPanel gameState={gameState} />
      <RightPanel
        gameState={gameState}
        onScore={onScore}
        onUndoLastAction={onUndoLastAction}
        canUndo={canUndo}
        onResetGame={onResetGame}
      />
    </div>
  );
}
