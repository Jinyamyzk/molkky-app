"use client";

import { GameStats, GameState } from "@/types/game";

interface GameExportProps {
  gameStats: GameStats;
  gameState: GameState;
}

export default function GameExport({ gameStats, gameState }: GameExportProps) {
  const formatDateToJST = (date: Date): string => {
    return new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
      .format(date)
      .replace(/\//g, "-");
  };

  const exportToJSON = () => {
    const exportData = {
      gameStats,
      gameState: {
        ...gameState,
        history: gameState.history.map((event) => ({
          ...event,
          timestamp: formatDateToJST(event.timestamp),
        })),
      },
      exportTime: formatDateToJST(new Date()),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `molkky-game-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const headers = [
      "Team Name",
      "Final Score",
      "Total Points Scored",
      "Successful Throws",
      "Misses",
      "Average Score",
      "Status",
    ];

    const rows = gameState.teams.map((team) => {
      const teamStats = gameStats.teamStats.find((ts) => ts.teamId === team.id);
      return [
        team.name,
        team.score.toString(),
        teamStats?.totalPoints.toString() || "0",
        teamStats?.successfulThrows.toString() || "0",
        teamStats?.missCount.toString() || "0",
        teamStats?.averageScore.toFixed(2) || "0.00",
        team.isEliminated
          ? "Eliminated"
          : gameState.winner?.id === team.id
          ? "Winner"
          : "Active",
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const dataBlob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `molkky-results-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const exportGameHistory = () => {
    const headers = [
      "Timestamp (JST)",
      "Team",
      "Player",
      "Action",
      "Points",
      "Hit Type",
    ];

    const rows = gameState.history.map((event) => {
      const team = gameState.teams.find((t) => t.id === event.teamId);
      const player = team?.players.find((p) => p.id === event.playerId);

      let hitType = "";
      if (event.action === "score" && event.points! > 0) {
        hitType = event.pinsKnocked === 1 ? "Single" : "Multi";
      } else if (event.action === "miss") {
        hitType = "Miss";
      }

      return [
        formatDateToJST(event.timestamp),
        team?.name || "Unknown Team",
        player?.name || "Unknown Player",
        event.action === "score" ? "Score" : "Miss",
        event.points?.toString() || "0",
        hitType,
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const dataBlob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `molkky-history-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <h3>Export Game Data</h3>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        Download your game results and statistics in different formats.
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button className="button" onClick={exportToJSON}>
          📄 Export as JSON
        </button>
        <button className="button" onClick={exportToCSV}>
          📊 Export Results (CSV)
        </button>
        <button className="button" onClick={exportGameHistory}>
          📋 Export Game History (CSV)
        </button>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          background: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <h4>Export Information:</h4>
        <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
          <li>
            <strong>JSON:</strong> Complete game data including all events and
            statistics
          </li>
          <li>
            <strong>Results CSV:</strong> Final scores and team statistics in
            spreadsheet format
          </li>
          <li>
            <strong>History CSV:</strong> Detailed log of all game events and
            actions
          </li>
        </ul>
      </div>
    </div>
  );
}
