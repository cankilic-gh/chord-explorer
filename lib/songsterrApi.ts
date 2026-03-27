
export interface SongsterrArtist {
  id: number;
  name: string;
  nameWithoutThePrefix: string;
}

export interface SongResult {
  id: number;
  title: string;
  artist: SongsterrArtist;
  chordsPresent: boolean;
  tabTypes: string[];
}

export const searchSongs = async (query: string): Promise<SongResult[]> => {
  if (!query.trim()) return [];

  const res = await fetch(`/api/songsterr?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Search failed');

  const data = await res.json();
  return data as SongResult[];
};
