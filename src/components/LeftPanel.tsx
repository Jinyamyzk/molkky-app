"use client";

import { GameState, GameEvent } from "@/types/game";

interface LeftPanelProps {
  gameState: GameState;
}

export default function LeftPanel({ gameState }: LeftPanelProps) {
  const getNextPlayers = () => {
    const activeTeams = gameState.teams.filter((team) => !team.isEliminated);
    const nextPlayers: {
      teamName: string;
      playerName: string;
      isCurrent: boolean;
    }[] = [];

    for (let i = 0; i < 8; i++) {
      const teamIndex =
        (gameState.currentTeamIndex + i) % gameState.teams.length;
      const team = gameState.teams[teamIndex];

      if (!team || team.isEliminated) continue;

      const playerIndex =
        i === 0
          ? gameState.currentPlayerIndex
          : (gameState.currentPlayerIndex +
              Math.floor(i / activeTeams.length)) %
            team.players.length;

      const player = team.players[playerIndex];

      if (player) {
        nextPlayers.push({
          teamName: team.name,
          playerName: player.name,
          isCurrent: i === 0,
        });
      }

      if (nextPlayers.length >= 5) break;
    }

    return nextPlayers;
  };

  const getRecentLogs = () => {
    return gameState.history
      .slice(-10)
      .reverse()
      .map((event) => {
        const team = gameState.teams.find((t) => t.id === event.teamId);
        const player = team?.players.find((p) => p.id === event.playerId);

        return {
          ...event,
          teamName: team?.name || "Unknown",
          playerName: player?.name || "Unknown",
        };
      });
  };

  const nextPlayers = getNextPlayers();
  const recentLogs = getRecentLogs();

  return (
    <div className="left-panel">
      <div className="next-players">
        <h3>🎯 Turn Order</h3>
        <ul className="player-queue">
          {nextPlayers.map((player, index) => (
            <li
              key={`${player.teamName}-${player.playerName}-${index}`}
              className={player.isCurrent ? "current-turn" : ""}
            >
              <div>
                <div
                  style={{ fontWeight: player.isCurrent ? "bold" : "normal" }}
                >
                  {player.playerName}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {player.teamName}
                </div>
              </div>
              {player.isCurrent && (
                <div style={{ color: "#ffc107", fontSize: "14px" }}>← Now</div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="score-logs">
        <h4>📋 Recent Activity</h4>
        {recentLogs.length === 0 ? (
          <p
            style={{
              color: "#666",
              fontStyle: "italic",
              textAlign: "center",
              padding: "20px",
            }}
          >
            No activity yet
          </p>
        ) : (
          <div>
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className={`log-entry ${
                  log.action === "miss"
                    ? "miss"
                    : log.action === "score"
                    ? "score"
                    : ""
                }`}
              >
                <div style={{ fontWeight: "bold", marginBottom: "2px" }}>
                  {log.playerName} ({log.teamName})
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    {log.action === "miss" && "❌ Miss (0 pts)"}
                    {log.action === "score" &&
                      log.pinsKnocked === 1 &&
                      `🎯 Pin ${log.points} (${log.points} pts)`}
                    {log.action === "score" &&
                      log.pinsKnocked! > 1 &&
                      `🎳 ${log.pinsKnocked} pins (${log.points} pts)`}
                    {log.action === "reset_score" && "🔄 Score reset to 25"}
                    {log.action === "eliminate" && "💀 Eliminated"}
                  </span>
                  <span style={{ fontSize: "10px", color: "#666" }}>
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                {log.details && (
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#666",
                      marginTop: "2px",
                      fontStyle: "italic",
                    }}
                  >
                    {log.details}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
