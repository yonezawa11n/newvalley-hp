export default async function handler(req, res) {
  const shortToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;

  if (!shortToken || !appId || !appSecret) {
    return res.status(500).json({ error: 'Missing env vars: INSTAGRAM_ACCESS_TOKEN, META_APP_ID, META_APP_SECRET' });
  }

  const url = `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken}`;
  const r = await fetch(url);
  const data = await r.json();

  if (data.error) {
    return res.status(400).json({ error: data.error.message, detail: data });
  }

  const days = Math.floor((data.expires_in || 0) / 86400);
  res.json({
    message: `長期トークン取得成功（有効期限 約${days}日）`,
    access_token: data.access_token,
    next: 'このaccess_tokenをVercelのINSTAGRAM_ACCESS_TOKENに上書き保存してください'
  });
}
