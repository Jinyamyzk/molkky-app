"use client";

import { useState } from "react";
import { Team } from "@/types/game";

interface TeamSetupProps {
  teams: Team[];
  onAddTeam: (name: string) => void;
  onRemoveTeam: (teamId: string) => void;
  onAddPlayer: (teamId: string, playerName: string) => void;
  onRemovePlayer: (teamId: string, playerName: string) => void;
  onStartGame: () => void;
}

export default function TeamSetup({
  teams,
  onAddTeam,
  onRemoveTeam,
  onAddPlayer,
  onRemovePlayer,
  onStartGame,
}: TeamSetupProps) {
  const [teamName, setTeamName] = useState("");
  const [playerNames, setPlayerNames] = useState<{ [key: string]: string }>({});

  const handleAddTeam = () => {
    if (teamName.trim() && teams.length < 4) {
      onAddTeam(teamName.trim());
      setTeamName("");
    }
  };

  const handleAddPlayer = (teamId: string) => {
    const playerName = playerNames[teamId];
    if (playerName.trim()) {
      const team = teams.find((t) => t.id === teamId);
      if (team && team.players.length < 4) {
        onAddPlayer(teamId, playerName.trim());
        setPlayerNames((prev) => ({ ...prev, [teamId]: "" }));
      }
    }
  };

  const canStartGame =
    teams.length >= 2 && teams.every((team) => team.players.length > 0);

  return (
    <div className="card">
      <h2>Game Setup</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>Add Team ({teams.length}/4)</h3>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            className="input"
            placeholder="Team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTeam()}
            maxLength={20}
          />
          <button
            className="button"
            onClick={handleAddTeam}
            disabled={!teamName.trim() || teams.length >= 4}
          >
            Add Team
          </button>
        </div>
      </div>

      {teams.map((team) => (
        <div key={team.id} className="team-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h4>{team.name}</h4>
            <button
              className="button danger"
              onClick={() => onRemoveTeam(team.id)}
              style={{ padding: "5px 10px", fontSize: "12px" }}
            >
              Remove Team
            </button>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <strong>Players ({team.players.length}/4):</strong>
            {team.players.length === 0 ? (
              <p style={{ color: "#666", fontStyle: "italic" }}>No Players</p>
            ) : (
              <ul className="player-list">
                {team.players.map((player) => (
                  <li
                    key={player.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{player.name}</span>
                    <button
                      className="button danger"
                      onClick={() => onRemovePlayer(team.id, player.id)}
                      style={{ padding: "2px 8px", fontSize: "11px" }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              className="input"
              placeholder="Player name"
              value={playerNames[team.id] || ""}
              onChange={(e) =>
                setPlayerNames((prev) => ({
                  ...prev,
                  [team.id]: e.target.value,
                }))
              }
              onKeyDown={(e) => e.key === "Enter" && handleAddPlayer(team.id)}
              maxLength={20}
              style={{ width: "150px" }}
            />
            <button
              className="button"
              onClick={() => handleAddPlayer(team.id)}
              disabled={
                !playerNames[team.id]?.trim() || team.players.length >= 4
              }
            >
              Add Player
            </button>
          </div>
        </div>
      ))}

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          className="button success"
          onClick={onStartGame}
          disabled={!canStartGame}
          style={{ fontSize: "16px", padding: "15px 30px" }}
        >
          Start Game
        </button>
        {!canStartGame && (
          <p style={{ marginTop: "10px", color: "#666", fontSize: "14px" }}>
            You need at least 2 teams with at least 1 player each to start the
            game
          </p>
        )}
      </div>
    </div>
  );
}
