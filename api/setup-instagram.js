export default async function handler(req, res) {
  // Accept token from query param (preferred) or env var
  const shortToken = req.query.token || process.env.INSTAGRAM_ACCESS_TOKEN;
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;

  if (!shortToken || !appId || !appSecret) {
    return res.status(500).json({
      error: 'Missing token or env vars',
      usage: 'GET /api/setup-instagram?token=YOUR_SHORT_LIVED_TOKEN',
      hint: 'Graph API Explorerでトークンを生成し、?token=xxx として渡してください'
    });
  }

  const url = `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken}`;
  const r = await fetch(url);
  const data = await r.json();

  if (data.error) {
    return res.status(400).json({ error: data.error.message, detail: data });
  }

  const days = Math.floor((data.expires_in || 0) / 86400);
  const longToken = data.access_token;

  // Verify token works by calling /me/accounts
  const verifyRes = await fetch(`https://graph.facebook.com/me/accounts?access_token=${longToken}`);
  const verifyData = await verifyRes.json();

  res.json({
    message: `長期トークン取得成功（有効期限 約${days}日）`,
    access_token: longToken,
    token_length: longToken.length,
    pages_found: verifyData.data ? verifyData.data.map(p => p.name) : null,
    pages_error: verifyData.error ? verifyData.error.message : null,
    next: 'このaccess_tokenをVercelのINSTAGRAM_ACCESS_TOKENに上書き保存してください'
  });
}
