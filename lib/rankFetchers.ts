const PLATFORM_MAP: Record<string, string> = {
  steam: 'steam',
  epic: 'epic',
  psn: 'psn',
  xbox: 'xbl',
};

const PLAYLIST_MAP: Record<string, 'duel' | 'doubles' | 'standard'> = {
  'Ranked Duel 1v1': 'duel',
  'Ranked Doubles 2v2': 'doubles',
  'Ranked Standard 3v3': 'standard',
};

const DIVISION_SCORES: Record<string, number> = {
  bronze: 0, silver: 500, gold: 1000, platinum: 1500,
  diamond: 2000, master: 2500, grandmaster: 3000, champion: 3500,
};

function overwatchScore(division: string, tier: number): number {
  const base = DIVISION_SCORES[division.toLowerCase()] ?? 0;
  return base + (5 - tier) * 100;
}

export type Snapshot = { playlist: string; rank_tier: string; mmr: number | null };

export async function fetchRocketLeagueSnapshots(platform: string, username: string): Promise<Snapshot[] | null> {
  const apiPlatform = PLATFORM_MAP[platform];
  if (!apiPlatform) return null;

  const res = await fetch(
    `https://rocket-league10.p.rapidapi.com/stats/${apiPlatform}/${encodeURIComponent(username)}`,
    {
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
        'x-rapidapi-host': 'rocket-league10.p.rapidapi.com',
        'x-rapidapi-ua': 'RapidAPI-Playground',
      },
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.ranked || !Array.isArray(data.ranked)) return null;

  return data.ranked
    .filter((entry: any) => PLAYLIST_MAP[entry.playlistName])
    .map((entry: any) => ({
      playlist: PLAYLIST_MAP[entry.playlistName],
      rank_tier: `${entry.tier} ${entry.division}`,
      mmr: entry.rating,
    }));
}

export async function fetchFortniteSnapshots(username: string): Promise<Snapshot[] | null> {
  const accountRes = await fetch(
    `https://prod.api-fortnite.com/api/v1/account/displayName/${encodeURIComponent(username)}`,
    { headers: { 'x-api-key': process.env.FORTNITE_API_KEY! } }
  );
  if (!accountRes.ok) return null;
  const accountData = await accountRes.json();

  const statsRes = await fetch(
    `https://prod.api-fortnite.com/api/v2/stats/${accountData.id}`,
    { headers: { 'x-api-key': process.env.FORTNITE_API_KEY! } }
  );
  if (!statsRes.ok) return null;
  const statsData = await statsRes.json();

  const stats = statsData.stats ?? {};
  let totalWins = 0;
  for (const key in stats) {
    if (key.includes('placetop1')) totalWins += stats[key];
  }

  return [{ playlist: 'battle_royale', rank_tier: `${totalWins} wins`, mmr: totalWins }];
}

export async function fetchOverwatchSnapshots(battleTag: string): Promise<Snapshot[] | null> {
  const formatted = battleTag.replace('#', '-');
  const res = await fetch(`https://overfast-api.tekrop.fr/players/${encodeURIComponent(formatted)}/summary`);
  if (!res.ok) return null;
  const data = await res.json();
  const pc = data.competitive?.pc;
  if (!pc) return null;

  const roles: { role: string; data: any }[] = [
    { role: 'tank', data: pc.tank },
    { role: 'damage', data: pc.damage },
    { role: 'support', data: pc.support },
  ];

  return roles
    .filter((r) => r.data)
    .map((r) => ({
      playlist: r.role,
      rank_tier: `${r.data.division.charAt(0).toUpperCase() + r.data.division.slice(1)} ${r.data.tier}`,
      mmr: overwatchScore(r.data.division, r.data.tier),
    }));
}

export async function fetchSnapshotsForAccount(game: string, platform: string, username: string): Promise<Snapshot[] | null> {
  if (game === 'rocket_league') return fetchRocketLeagueSnapshots(platform, username);
  if (game === 'fortnite') return fetchFortniteSnapshots(username);
  if (game === 'overwatch') return fetchOverwatchSnapshots(username);
  return null;
}