import type { VercelRequest, VercelResponse } from '@vercel/node';

// Fetches tab data for a specific song/track from Songsterr's CDN
// Requires: songId, revisionId, image (from revision API), partId (track index)
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { songId, revisionId, image, partId } = req.query;

  if (!songId || !partId) {
    return res.status(400).json({ error: 'Missing songId or partId' });
  }

  try {
    // Step 1: If no revisionId/image provided, fetch from revision API
    let revId = revisionId as string;
    let img = image as string;

    if (!revId || !img) {
      const metaRes = await fetch(
        `https://www.songsterr.com/api/meta/${songId}/revisions`
      );
      if (!metaRes.ok) {
        return res.status(404).json({ error: 'Song not found' });
      }
      const revisions = await metaRes.json();
      // Find first non-moderation revision
      const revision = revisions.find((r: { isOnModeration: boolean }) => !r.isOnModeration);
      if (!revision) {
        return res.status(404).json({ error: 'No published revision found' });
      }
      revId = revision.revisionId.toString();

      // Fetch full revision data from SSR page to get image field
      const pageRes = await fetch(
        `https://www.songsterr.com/a/wa/song?id=${songId}`,
        { redirect: 'follow' }
      );
      const pageUrl = pageRes.url;
      const fullPageRes = await fetch(pageUrl);
      const html = await fullPageRes.text();
      const jsonMatch = html.match(/application\/json[^>]*>(\{.*?\})<\/script>/s);
      if (jsonMatch) {
        try {
          const ssrData = JSON.parse(jsonMatch[1]);
          img = ssrData?.meta?.current?.image || '';
        } catch {
          img = '';
        }
      }
    }

    // Step 2: Fetch tab data from CDN
    const cdnDomain = 'd3d3l6a6rcgkaf';
    let url: string;
    if (img) {
      url = `https://${cdnDomain}.cloudfront.net/${songId}/${revId}/${img}/${partId}.json`;
    } else {
      // Fallback without image
      url = `https://d3rrfvx08uyjp1.cloudfront.net/part/${revId}/${partId}`;
    }

    const tabRes = await fetch(url, {
      headers: { 'Accept-Encoding': 'gzip, deflate' },
    });

    if (!tabRes.ok) {
      return res.status(tabRes.status).json({ error: 'Tab data not available' });
    }

    const buffer = await tabRes.arrayBuffer();

    // Try to decompress if gzipped
    let data: string;
    try {
      const { gunzipSync } = await import('zlib').then(m => m);
      data = gunzipSync(Buffer.from(buffer)).toString('utf-8');
    } catch {
      data = new TextDecoder().decode(buffer);
    }

    const tabData = JSON.parse(data);
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    return res.status(200).json(tabData);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch tab data', details: String(err) });
  }
}
