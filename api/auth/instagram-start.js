// Instagram Login OAuth (NOT Facebook Login — works without Facebook Page)
export default function handler(req, res) {
  const appId = process.env.META_APP_ID;
  const redirectUri = 'https://newvalleyhp.com/api/auth/instagram-callback';
  const scope = 'instagram_basic,instagram_content_publish';
  const url =
    `https://www.instagram.com/oauth/authorize` +
    `?client_id=${appId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&response_type=code`;
  res.redirect(url);
}
