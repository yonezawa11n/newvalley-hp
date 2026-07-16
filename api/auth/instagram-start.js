// Instagram Login OAuth (NOT Facebook Login — works without Facebook Page)
export default function handler(req, res) {
  // Instagram Login uses the Instagram App ID (separate from Facebook App ID)
  const appId = process.env.META_IG_APP_ID || process.env.META_APP_ID;
  const redirectUri = 'https://newvalleyhp.com/api/auth/instagram-callback';
  const scope = 'instagram_business_basic';
  const url =
    `https://www.instagram.com/oauth/authorize` +
    `?client_id=${appId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&response_type=code`;
  res.redirect(url);
}
