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
  'newvalley_official':     'INSTAGRAM_ACCESS_TOKEN',
  'newvalley_recruit':      'INSTAGRAM_ACCESS_TOKEN',
};

function mapMedia(data, limit) {
  return (data || []).slice(0, limit).map(p => ({
    id: p.id,
    image: p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url,
    caption: (p.caption || '').slice(0, 80),
    date: p.timestamp,
    url: p.permalink,
    source: 'instagram',
  }));
}

async function fetchInstagramViaFacebook(token, limit, handle) {
  const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';

  // Approach 1: User token → Pages → Instagram Business Account (match by username)
  const pagesRes = await fetch(`https://graph.facebook.com/me/accounts?access_token=${token}`);
  const pagesData = await pagesRes.json();

  const pages = (!pagesData.error && pagesData.data) ? pagesData.data : [];
  for (const page of pages) {
    const igRes = await fetch(
      `https://graph.facebook.com/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
    );
    const igData = await igRes.json();
    const igId = igData.instagram_business_account && igData.instagram_business_account.id;
    if (!igId) continue;

    // Verify this is the correct Instagram account by checking username
    if (handle) {
      const profileRes = await fetch(
        `https://graph.facebook.com/${igId}?fields=username&access_token=${page.access_token}`
      );
      const profileData = await profileRes.json();
      if (profileData.username && profileData.username !== handle) continue;
    }

    const mediaRes = await fetch(
      `https://graph.facebook.com/${igId}/media?fields=${FIELDS}&limit=${limit}&access_token=${page.access_token}`
    );
    const mediaData = await mediaRes.json();
    if (!mediaData.error && mediaData.data) return mapMedia(mediaData.data, limit);
  }

  // Approach 1b: Business Portfolio → owned pages → Instagram
  const BUSINESS_ID = process.env.META_BUSINESS_ID || '2190043121437145';
  const bizPagesRes = await fetch(
    `https://graph.facebook.com/${BUSINESS_ID}/owned_pages?fields=id,name,access_token&access_token=${token}`
  );
  const bizPagesData = await bizPagesRes.json();
  const bizPages = (!bizPagesData.error && bizPagesData.data) ? bizPagesData.data : [];
  for (const page of bizPages) {
    const igRes = await fetch(
      `https://graph.facebook.com/${page.id}?fields=instagram_business_account&access_token=${page.access_token || token}`
    );
    const igData = await igRes.json();
    const igId = igData.instagram_business_account && igData.instagram_business_account.id;
    if (!igId) continue;
    if (handle) {
      const profileRes = await fetch(
        `https://graph.facebook.com/${igId}?fields=username&access_token=${page.access_token || token}`
      );
      const profileData = await profileRes.json();
      if (profileData.username && profileData.username !== handle) continue;
    }
    const mediaRes = await fetch(
      `https://graph.facebook.com/${igId}/media?fields=${FIELDS}&limit=${limit}&access_token=${page.access_token || token}`
    );
    const mediaData = await mediaRes.json();
    if (!mediaData.error && mediaData.data) return mapMedia(mediaData.data, limit);
  }

  // Approach 2: User token directly → instagram_business_account on /me
  const meRes = await fetch(
    `https://graph.facebook.com/me?fields=instagram_business_account&access_token=${token}`
  );
  const meData = await meRes.json();
  const igId2 = meData.instagram_business_account && meData.instagram_business_account.id;
  if (igId2) {
    const mediaRes = await fetch(
      `https://graph.facebook.com/${igId2}/media?fields=${FIELDS}&limit=${limit}&access_token=${token}`
    );
    const mediaData = await mediaRes.json();
    if (!mediaData.error && mediaData.data) return mapMedia(mediaData.data, limit);
  }

  // Approach 3: User token → Instagram Basic Display API
  const basicRes = await fetch(
    `https://graph.instagram.com/me/media?fields=${FIELDS}&limit=${limit}&access_token=${token}`
  );
  const basicData = await basicRes.json();
  if (!basicData.error && basicData.data) return mapMedia(basicData.data, limit);

  const pagesErrMsg = pagesData.error
    ? `pages_show_listパーミッションが必要です（${pagesData.error.message}）`
    : `Facebookページが見つかりません。@newvalley_recruitをFacebookページに接続してください`;
  throw new Error(pagesErrMsg);
}

async function fetchInstagram(handle, limit) {
  const tokenKey = IG_TOKEN_KEYS[handle];
  const token = tokenKey ? process.env[tokenKey] : null;
  if (!token) throw new Error(`No token configured for @${handle} (set env var ${tokenKey || '?'})`);

  // Try Instagram Basic Display API first, fall back to Facebook Graph API
  const url = `https://graph.instagram.com/me/media` +
    `?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp` +
    `&limit=${limit}&access_token=${token}`;
  const r = await fetch(url);
  const data = await r.json();

  if (data.error) {
    // For accounts with Facebook Pages, fall back to Facebook Login flow
    // For Instagram-Login tokens (IG_LOGIN_TOKEN_*), this won't help so skip
    return fetchInstagramViaFacebook(token, limit, handle);
  }

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
