// Instagram Login callback — exchanges code for long-lived Instagram token
export default async function handler(req, res) {
  const { code, error } = req.query;
  if (error) return res.status(400).send(`<h2>エラー: ${error}</h2>`);
  if (!code) return res.status(400).send('<h2>codeが見つかりません</h2>');

  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const redirectUri = 'https://newvalleyhp.com/api/auth/instagram-callback';

  try {
    // Step 1: code → short-lived Instagram token
    const form = new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code,
    });
    const shortRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      body: form,
    });
    const shortData = await shortRes.json();
    if (shortData.error_type) throw new Error(shortData.error_message);
    const shortToken = shortData.access_token;

    // Step 2: short-lived → long-lived (~60 days)
    const longRes = await fetch(
      `https://graph.instagram.com/access_token` +
      `?grant_type=ig_exchange_token` +
      `&client_secret=${appSecret}` +
      `&access_token=${shortToken}`
    );
    const longData = await longRes.json();
    if (longData.error) throw new Error(longData.error.message);
    const longToken = longData.access_token;
    const days = Math.floor((longData.expires_in || 0) / 86400);

    // Step 3: Verify — get username
    const meRes = await fetch(`https://graph.instagram.com/me?fields=username&access_token=${longToken}`);
    const meData = await meRes.json();
    const username = meData.username || '不明';

    // Step 4: Auto-save to Vercel as IG_TOKEN_RECRUIT
    const vercelToken = process.env.VERCEL_API_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID || 'prj_vLdS2ejPHqErKuDECIkr08wnL5nh';
    const teamId = process.env.VERCEL_TEAM_ID || 'team_yiOgrGBR1WaFFaX7vUBI9lUh';
    let saveStatus = '⚠️ VERCEL_API_TOKENが未設定 — 手動で保存してください';

    if (vercelToken) {
      const qs = `?teamId=${teamId}`;
      const listRes = await fetch(
        `https://api.vercel.com/v9/projects/${projectId}/env${qs}`,
        { headers: { Authorization: `Bearer ${vercelToken}` } }
      );
      const listData = await listRes.json();
      const ENV_KEY = 'IG_LOGIN_TOKEN_RECRUIT';
      const existing = (listData.envs || []).find(e => e.key === ENV_KEY);

      if (existing) {
        const patch = await fetch(
          `https://api.vercel.com/v9/projects/${projectId}/env/${existing.id}${qs}`,
          {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${vercelToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: longToken }),
          }
        );
        const patchData = await patch.json();
        saveStatus = patchData.key ? '✅ Vercelに自動保存しました！ 再デプロイが必要です' : `⚠️ ${JSON.stringify(patchData)}`;
      } else {
        // Create new env var
        const createRes = await fetch(
          `https://api.vercel.com/v9/projects/${projectId}/env${qs}`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${vercelToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: 'IG_LOGIN_TOKEN_RECRUIT', value: longToken, type: 'encrypted', target: ['production'] }),
          }
        );
        const createData = await createRes.json();
        saveStatus = createData.key ? '✅ Vercelに新規作成しました！ 再デプロイが必要です' : `⚠️ ${JSON.stringify(createData)}`;
      }

      if (saveStatus.startsWith('✅')) {
        const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
        if (hookUrl) {
          await fetch(hookUrl, { method: 'POST' });
          saveStatus += ' → 再デプロイ開始しました（1〜2分で反映）';
        }
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!DOCTYPE html>
<html lang="ja"><head><meta charset="utf-8"><title>Instagram連携完了</title>
<style>body{font-family:sans-serif;max-width:600px;margin:60px auto;padding:20px}
.ok{color:#16a34a;font-weight:bold}.warn{color:#f59e0b}
textarea{width:100%;height:80px;font-size:.7rem;font-family:monospace;padding:8px;border-radius:6px}</style>
</head><body>
<h1>✅ Instagram連携成功</h1>
<p>アカウント: <strong>@${username}</strong></p>
<p>有効期限: 約${days}日</p>
<p class="${saveStatus.startsWith('✅') ? 'ok' : 'warn'}">${saveStatus}</p>
${!saveStatus.startsWith('✅') ? `
<h3>手動保存する場合</h3>
<p>Vercelの環境変数 <code>IG_LOGIN_TOKEN_RECRUIT</code> に以下を設定してRedeploy：</p>
<textarea readonly>${longToken}</textarea>` : ''}
<p><a href="/">← ホームに戻る</a></p>
</body></html>`);

  } catch (e) {
    res.status(500).send(`<h2>エラー: ${e.message}</h2>`);
  }
}
