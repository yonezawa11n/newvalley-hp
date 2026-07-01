/**
 * SNS Feed API — Instagram (+ future: Threads, YouTube, TikTok)
 *
 * GET /api/sns-feed?source=instagram&handle=nv.biyondo&limit=6
 *
 * Response: { source, handle, items: [{id,image,caption,date,url,source}], fetchedAt }
 * Caches per handle for 1 hour (in-memory). Falls back to stale cache on API error.
 */

const CACHE = {};
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Map Instagram handle → env var name
const IG_TOKEN_KEYS = {
  'nv.biyondo':             'IG_TOKEN_BIYONDO',
  'march2623244':           'IG_TOKEN_MARCH_YAMATO',
  'ma_chi.machida':         'IG_TOKEN_MARCH_MACHIDA',
  'shougai_houmon_courage': 'IG_TOKEN_COURAGE',
  'xmobile.sakuragaoka':    'IG_TOKEN_XMOBILE',
  'newvalley_official':     'IG_TOKEN_NEWVALLEY',
};

async function fetchInstagram(handle, limit) {
  const tokenKey = IG_TOKEN_KEYS[handle];
  const token = tokenKey ? process.env[tokenKey] : null;
  if (!token) throw new Error(`No token configured for @${handle} (set env var ${tokenKey || '?'})`);

  const url = `https://graph.instagram.com/me/media` +
    `?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp` +
    `&limit=${limit}&access_token=${token}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Instagram API HTTP ${r.status}`);
  const data = await r.json();
  if (data.error) throw new Error(data.error.message);

  return (data.data || []).map(p => ({
    id: p.id,
    image: p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url,
    caption: (p.caption || '').slice(0, 80),
    date: p.timestamp,
    url: p.permalink,
    source: 'instagram',
  }));
}

// Future fetchers go here:
// async function fetchThreads(handle, limit) { ... }
// async function fetchYouTube(handle, limit) { ... }
// async function fetchTikTok(handle, limit) { ... }

const FETCHERS = {
  instagram: fetchInstagram,
  // threads: fetchThreads,
  // youtube: fetchYouTube,
  // tiktok: fetchTikTok,
};

export default async function handler(req, res) {
  const source = req.query.source || 'instagram';
  const handle = req.query.handle || '';
  const limit  = Math.min(parseInt(req.query.limit) || 6, 12);
  const cacheKey = `${source}:${handle}`;
  const now = Date.now();
  const cached = CACHE[cacheKey];

  // Serve in-memory fresh cache
  if (cached && now - cached.ts < CACHE_TTL) {
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.setHeader('X-Cache', 'HIT');
    return res.json(cached.data);
  }

  const fetcher = FETCHERS[source];
  if (!fetcher) {
    return res.status(400).json({ error: `Source "${source}" is not supported yet` });
  }

  try {
    const items = await fetcher(handle, limit);
    const payload = { source, handle, items, fetchedAt: new Date().toISOString() };
    CACHE[cacheKey] = { ts: now, data: payload };

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.setHeader('X-Cache', 'MISS');
    return res.json(payload);
  } catch (e) {
    // Fallback: return stale cache rather than an error
    if (cached) {
      res.setHeader('X-Cache', 'STALE');
      return res.json({ ...cached.data, stale: true });
    }
    return res.status(503).json({ error: e.message, source, handle });
  }
}
