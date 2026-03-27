import type { VercelRequest, VercelResponse } from '@vercel/node';
import { gunzipSync } from 'zlib';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { songId, partId } = req.query;

  if (!songId || !partId) {
    return res.status(400).json({ error: 'Missing songId or partId' });
  }

  try {
    // Fetch SSR page to get the active revisionId and image hash
    const pageRes = await fetch(
      `https://www.songsterr.com/a/wa/song?id=${songId}`,
      { redirect: 'follow' }
    );
    const html = await pageRes.text();

    // Extract image hash from SSR data
    const imageMatch = html.match(/"image"\s*:\s*"([^"]+)"/);
    if (!imageMatch) {
      return res.status(404).json({ error: 'Could not resolve tab image hash' });
    }
    const image = imageMatch[1];

    // Extract the active revisionId from SSR meta.current (not from revisions API)
    const revMatch = html.match(/"meta"\s*:\s*\{[^}]*"current"\s*:\s*\{[^}]*"revisionId"\s*:\s*(\d+)/);
    if (!revMatch) {
      return res.status(404).json({ error: 'Could not resolve revision ID' });
    }
    const revId = revMatch[1];

    // Fetch tab data from CDN
    const url = `https://d3d3l6a6rcgkaf.cloudfront.net/${songId}/${revId}/${image}/${partId}.json`;
    const tabRes = await fetch(url);

    if (!tabRes.ok) {
      return res.status(tabRes.status).json({ error: 'Tab data not available' });
    }

    const buffer = Buffer.from(await tabRes.arrayBuffer());

    let jsonStr: string;
    try {
      jsonStr = gunzipSync(buffer).toString('utf-8');
    } catch {
      jsonStr = buffer.toString('utf-8');
    }

    const tabData = JSON.parse(jsonStr);
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    return res.status(200).json(tabData);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch tab data', details: String(err) });
  }
}
