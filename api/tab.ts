import type { VercelRequest, VercelResponse } from '@vercel/node';
import { gunzipSync } from 'zlib';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { songId, partId } = req.query;

  if (!songId || !partId) {
    return res.status(400).json({ error: 'Missing songId or partId' });
  }

  try {
    // Step 1: Get latest published revision
    const metaRes = await fetch(
      `https://www.songsterr.com/api/meta/${songId}/revisions`
    );
    if (!metaRes.ok) {
      return res.status(404).json({ error: 'Song not found' });
    }
    const revisions = await metaRes.json();
    const revision = revisions.find((r: { isOnModeration: boolean }) => !r.isOnModeration);
    if (!revision) {
      return res.status(404).json({ error: 'No published revision found' });
    }
    const revId = revision.revisionId;

    // Step 2: Get image hash from SSR page
    const pageRes = await fetch(
      `https://www.songsterr.com/a/wa/song?id=${songId}`,
      { redirect: 'follow' }
    );
    const html = await pageRes.text();

    let image = '';
    const match = html.match(/"image"\s*:\s*"([^"]+)"/);
    if (match) {
      image = match[1];
    }

    if (!image) {
      return res.status(404).json({ error: 'Could not resolve tab image hash' });
    }

    // Step 3: Fetch tab data from CDN
    const url = `https://d3d3l6a6rcgkaf.cloudfront.net/${songId}/${revId}/${image}/${partId}.json`;
    const tabRes = await fetch(url);

    if (!tabRes.ok) {
      return res.status(tabRes.status).json({ error: 'Tab data not available', url });
    }

    const buffer = Buffer.from(await tabRes.arrayBuffer());

    // Decompress gzipped response
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
