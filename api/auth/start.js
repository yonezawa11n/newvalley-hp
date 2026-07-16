// Step 1: Redirect user to Facebook OAuth
export default function handler(req, res) {
  const appId = process.env.META_APP_ID;
  const redirectUri = 'https://newvalleyhp.com/api/auth/callback';
  const scope = 'instagram_basic,pages_show_list,pages_read_engagement';
  const url =
    `https://www.facebook.com/dialog/oauth` +
    `?client_id=${appId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&response_type=code`;
  res.redirect(url);
}
