
export interface SongsterrTrack {
  instrumentId: number;
  instrument: string;
  views: number;
  name: string;
  tuning?: number[];
  difficulty?: number;
  hash: string;
}

export interface SongResult {
  songId: number;
  artistId: number;
  artist: string;
  title: string;
  hasChords: boolean;
  hasPlayer: boolean;
  tracks: SongsterrTrack[];
  defaultTrack: number;
  popularTrack: number;
}

export const searchSongs = async (query: string): Promise<SongResult[]> => {
  if (!query.trim()) return [];

  const res = await fetch(`/api/songsterr?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Search failed');

  const data = await res.json();
  return data as SongResult[];
};
