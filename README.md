# Mölkky Game App

A scoring application for Mölkky, built with Next.js and TypeScript.

## Features

### Game Management

- **Team Setup**: Add up to 4 teams with 1-4 players each
- **Official Rules**: Implements complete Mölkky scoring rules and elimination logic
- **Auto Turn Management**: Automatic turn advancement and winner detection
- **Undo Functionality**: Revert the last scoring action with comprehensive state rollback

### Export & Analytics

- **Multiple Export Formats**: JSON and CSV
- **Game Statistics**: Comprehensive team performance analytics
- **Activity Logging**: Detailed game history with timestamps

## Game Rules

- **Objective**: First team to reach exactly 50 points wins
- **Single Pin**: Knock down one pin = that pin's number in points (1-12)
- **Multiple Pins**: Knock down multiple pins = number of pins knocked down
- **Over 50 Rule**: Score exceeding 50 automatically resets to 25 points
- **Elimination**: Three consecutive misses eliminates a team
- **Last Team Standing**: Game ends when only one team remains active

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
npm run build
npm start
```

## Project Structure

```
.github/workflows/deploy.yml #
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```
