'use client'

import { useState } from 'react';

const GAMES: Record<string, { label: string; playlists: Record<string, string>; statLabel: string }> = {
  rocket_league: {
    label: 'Rocket League',
    playlists: { duel: '1v1 Duel', doubles: '2v2 Doubles', standard: '3v3 Standard' },
    statLabel: 'MMR',
  },
  r6_siege: {
    label: 'Rainbow Six Siege',
    playlists: { ranked: 'Ranked' },
    statLabel: 'MMR',
  },
  fortnite: {
    label: 'Fortnite',
    playlists: { battle_royale: 'Battle Royale' },
    statLabel: 'Wins',
  },
  overwatch: {
    label: 'Overwatch',
    playlists: { tank: 'Tank', damage: 'Damage', support: 'Support' },
    statLabel: 'Rank',
  },
};

type Row = {
  accountId: string;
  username: string;
  platformUsername: string;
  game: string;
  playlist: string;
  rankTier: string | null;
  mmr: number | null;
};

export default function GroupLeaderboard({ rows }: { rows: Row[] }) {
  const [activeGame, setActiveGame] = useState('rocket_league');
  const [activePlaylist, setActivePlaylist] = useState('duel');

  const gameConfig = GAMES[activeGame];
  const playlistKeys = Object.keys(gameConfig.playlists);
  const currentPlaylist = playlistKeys.includes(activePlaylist) ? activePlaylist : playlistKeys[0];

  const filteredRows = rows
    .filter((r) => r.game === activeGame && r.playlist === currentPlaylist)
    .sort((a, b) => (b.mmr ?? -1) - (a.mmr ?? -1));

  const handleGameChange = (game: string) => {
    setActiveGame(game);
    setActivePlaylist(Object.keys(GAMES[game].playlists)[0]);
  };

  return (
    <div>
      <div className="tab-row">
        {Object.entries(GAMES).map(([key, cfg]) => (
          <button
            key={key}
            className={`tab ${activeGame === key ? 'tab-active' : ''}`}
            onClick={() => handleGameChange(key)}
          >
            {cfg.label}
          </button>
        ))}
      </div>

      <div className="tab-row tab-row-sub">
        {playlistKeys.map((key) => (
          <button
            key={key}
            className={`tab tab-sub ${currentPlaylist === key ? 'tab-active' : ''}`}
            onClick={() => setActivePlaylist(key)}
          >
            {gameConfig.playlists[key]}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Account</th>
              <th>Tier</th>
              <th>{gameConfig.statLabel}</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="subtitle" style={{ padding: '20px 16px' }}>
                  No {gameConfig.label} data for this playlist yet.
                </td>
              </tr>
            ) : (
              filteredRows.map((row, i) => (
                <tr key={row.accountId}>
                  <td style={{ fontFamily: "'Baloo 2', sans-serif" }}>#{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{row.username}</td>
                  <td className="subtitle">{row.platformUsername}</td>
                  <td>
                    {row.rankTier ? <span className="rank-badge">{row.rankTier}</span> : <span className="subtitle">—</span>}
                  </td>
                  <td className="subtitle">{row.mmr ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}