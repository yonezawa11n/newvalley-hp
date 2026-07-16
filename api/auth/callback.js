// Step 2: Exchange code for long-lived token, auto-save to Vercel env var
export default async function handler(req, res) {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).send(`<h2>認証エラー: ${error}</h2>`);
  }
  if (!code) {
    return res.status(400).send('<h2>codeが見つかりません</h2>');
  }

  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const redirectUri = 'https://newvalleyhp.com/api/auth/callback';

  try {
    // Exchange code → short-lived token
    const shortRes = await fetch(
      `https://graph.facebook.com/oauth/access_token` +
      `?client_id=${appId}` +
      `&client_secret=${appSecret}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&code=${code}`
    );
    const shortData = await shortRes.json();
    if (shortData.error) throw new Error('短期トークン取得失敗: ' + shortData.error.message);
    const shortToken = shortData.access_token;

    // Exchange short-lived → long-lived (~60 days)
    const longRes = await fetch(
      `https://graph.facebook.com/oauth/access_token` +
      `?grant_type=fb_exchange_token` +
      `&client_id=${appId}` +
      `&client_secret=${appSecret}` +
      `&fb_exchange_token=${shortToken}`
    );
    const longData = await longRes.json();
    if (longData.error) throw new Error('長期トークン取得失敗: ' + longData.error.message);
    const longToken = longData.access_token;
    const days = Math.floor((longData.expires_in || 0) / 86400);

    // Verify token works
    const verifyRes = await fetch(`https://graph.facebook.com/me/accounts?access_token=${longToken}`);
    const verifyData = await verifyRes.json();
    const pages = verifyData.data ? verifyData.data.map(p => p.name) : [];

    // Auto-save to Vercel env var
    const vercelToken = process.env.VERCEL_API_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID || 'prj_vLdS2ejPHqErKuDECIkr08wnL5nh';
    const teamId = process.env.VERCEL_TEAM_ID || 'team_yiOgrGBR1WaFFaX7vUBI9lUh';
    let saveStatus = '⚠️ VERCEL_API_TOKENが未設定のため自動保存できませんでした';

    if (vercelToken) {
      const qs = `?teamId=${teamId}`;
      const listRes = await fetch(
        `https://api.vercel.com/v9/projects/${projectId}/env${qs}`,
        { headers: { Authorization: `Bearer ${vercelToken}` } }
      );
      const listData = await listRes.json();
      const envVar = (listData.envs || []).find(e => e.key === 'INSTAGRAM_ACCESS_TOKEN');

      if (envVar) {
        const patchRes = await fetch(
          `https://api.vercel.com/v9/projects/${projectId}/env/${envVar.id}${qs}`,
          {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${vercelToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: longToken })
          }
        );
        const patchData = await patchRes.json();
        saveStatus = patchData.key ? '✅ Vercelに自動保存しました！' : `⚠️ 保存エラー: ${JSON.stringify(patchData)}`;
      }

      // Trigger redeploy
      const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
      if (hookUrl && saveStatus.startsWith('✅')) {
        await fetch(hookUrl, { method: 'POST' });
        saveStatus += ' 再デプロイを開始しました（1〜2分で反映）';
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>Instagram連携完了</title>
<style>
  body { font-family: sans-serif; max-width: 600px; margin: 60px auto; padding: 20px; }
  .ok { color: #22c55e; } .warn { color: #f59e0b; }
  pre { background: #f3f4f6; padding: 12px; border-radius: 8px; word-break: break-all; white-space: pre-wrap; font-size: 12px; }
</style>
</head>
<body>
  <h1>Instagram連携</h1>
  <p class="${saveStatus.startsWith('✅') ? 'ok' : 'warn'}">${saveStatus}</p>
  <p>有効期限: 約${days}日</p>
  <p>Facebookページ: ${pages.length ? pages.join(', ') : '（なし）'}</p>
  ${!saveStatus.startsWith('✅') ? `
  <hr>
  <h3>手動で保存する場合</h3>
  <p>以下のトークンをVercelの<code>INSTAGRAM_ACCESS_TOKEN</code>にコピーしてください（${longToken.length}文字）:</p>
  <pre>${longToken}</pre>
  ` : ''}
  <p><a href="/">← ホームに戻る</a></p>
</body>
</html>`);

  } catch (e) {
    res.status(500).send(`<h2>エラー: ${e.message}</h2>`);
  }
}
