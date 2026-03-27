import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Missing query parameter "q"' });
  }

  try {
    const response = await fetch(
      `https://www.songsterr.com/a/ra/songs.json?pattern=${encodeURIComponent(q)}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Songsterr API error' });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch from Songsterr' });
  }
}
