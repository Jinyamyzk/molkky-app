"use client";

import { GameState, Team } from "@/types/game";
import { join } from "path";

interface CenterPanelProps {
  gameState: GameState;
}

export default function CenterPanel({ gameState }: CenterPanelProps) {
  const getTeamStatus = (team: Team, index: number) => {
    if (gameState.winner?.id === team.id) return "winner";
    if (team.isEliminated) return "eliminated";
    if (index === gameState.currentTeamIndex) return "active";
    return "";
  };

  return (
    <div className="center-panel">
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h2 style={{ color: "#007bff", marginBottom: "10px" }}>
          🏆 Team Scores
        </h2>
        <div style={{ fontSize: "14px", color: "#666" }}>
          Goal: First to exactly 50 points wins!
        </div>
      </div>

      <div className="team-grid">
        {gameState.teams.map((team, index) => (
          <div
            key={team.id}
            className={`team-score-card ${getTeamStatus(team, index)}`}
          >
            <div className="team-name">{team.name}</div>
            <div className="team-score">{team.score}</div>
            <div
              style={{ fontSize: "16px", color: "#666", marginBottom: "10px" }}
            >
              / 50
            </div>

            <div className="team-players">
              👥 {team.players.map((p) => p.name).join(", ")}
            </div>

            <div style={{ marginBottom: "10px" }}>
              {team.consecutiveMisses > 0 && (
                <div
                  style={{
                    color: "#dc3545",
                    fontSize: "12px",
                    marginBottom: "5px",
                  }}
                >
                  ❌ {team.consecutiveMisses}/3 misses
                </div>
              )}
            </div>

            <div className={`team-status ${getTeamStatus(team, index)}`}>
              {gameState.winner?.id === team.id && "🏆 WINNER"}
              {team.isEliminated &&
                gameState.winner?.id !== team.id &&
                "💀 ELIMINATED"}
              {!team.isEliminated &&
                index === gameState.currentTeamIndex &&
                gameState.winner?.id === team.id &&
                "⚡️ ACTIVE"}
              {!team.isEliminated &&
                index !== gameState.currentTeamIndex &&
                gameState.winner?.id === team.id &&
                "⏳ WAITING"}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "auto",
          padding: "20px",
          background: "#f8f9fa",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "15px",
          }}
        >
          <div>
            <div
              style={{ fontSize: "20px", fontWeight: "bold", color: "#007bff" }}
            >
              {gameState.teams.filter((t) => !t.isEliminated).length}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>Teams Left</div>
          </div>
          <div>
            <div
              style={{ fontSize: "20px", fontWeight: "bold", color: "#007bff" }}
            >
              {gameState.history.length}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>Total Turns</div>
          </div>
          <div>
            <div
              style={{ fontSize: "20px", fontWeight: "bold", color: "#007bff" }}
            >
              {Math.max(...gameState.teams.map((t) => t.score), 0)}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>Highest Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}
