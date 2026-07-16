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

  const pages = verifyData.data ? verifyData.data.map(p => p.name) : [];
  const pagesError = verifyData.error ? verifyData.error.message : null;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>Instagram トークン設定</title>
<style>
  body{font-family:sans-serif;max-width:640px;margin:40px auto;padding:20px;background:#f9fafb}
  h1{font-size:1.4rem;color:#1f2937}
  .card{background:#fff;border-radius:12px;padding:24px;margin:16px 0;box-shadow:0 1px 4px rgba(0,0,0,.1)}
  .ok{color:#16a34a;font-weight:bold}
  .err{color:#dc2626;font-weight:bold}
  label{display:block;font-size:.85rem;color:#6b7280;margin-bottom:6px}
  textarea{width:100%;box-sizing:border-box;height:120px;padding:10px;border:2px solid #d1fae5;border-radius:8px;font-size:.75rem;font-family:monospace;resize:none;background:#f0fdf4}
  .copy-btn{display:block;width:100%;margin-top:10px;padding:14px;background:#16a34a;color:#fff;border:none;border-radius:8px;font-size:1rem;font-weight:bold;cursor:pointer}
  .copy-btn:active{background:#15803d}
  .steps{counter-reset:step}
  .step{counter-increment:step;margin:10px 0;padding-left:28px;position:relative}
  .step::before{content:counter(step);position:absolute;left:0;top:0;background:#16a34a;color:#fff;width:20px;height:20px;border-radius:50%;font-size:.75rem;display:flex;align-items:center;justify-content:center}
  .len{font-size:.8rem;color:#6b7280;margin-top:4px}
</style>
</head>
<body>
<h1>Instagram トークン設定</h1>
<div class="card">
  <p class="ok">✅ 長期トークン取得成功（有効期限 約${days}日）</p>
  ${pages.length ? `<p>Facebookページ: <strong>${pages.join(', ')}</strong></p>` : ''}
  ${pagesError ? `<p class="err">⚠️ ページ確認エラー: ${pagesError}</p>` : ''}
</div>
<div class="card">
  <label>① 下のトークンをコピーしてください（${longToken.length}文字）</label>
  <textarea id="tok" readonly>${longToken}</textarea>
  <p class="len">全選択して確実にコピーするには「すべて選択」ボタンを使ってください</p>
  <button class="copy-btn" onclick="
    var t=document.getElementById('tok');
    t.select();t.setSelectionRange(0,99999);
    navigator.clipboard.writeText(t.value).then(function(){
      this.textContent='✅ コピーしました！（'+t.value.length+'文字）';
    }.bind(this)).catch(function(){
      this.textContent='⚠️ 手動でテキストを選択してコピーしてください';
    }.bind(this));
  ">📋 クリップボードにコピー（${longToken.length}文字）</button>
</div>
<div class="card">
  <strong>② Vercelに保存する</strong>
  <div class="steps">
    <div class="step"><a href="https://vercel.com/yonezawa11n-4906/newvalley-hp/settings/environment-variables" target="_blank">このリンク</a>を開く</div>
    <div class="step">INSTAGRAM_ACCESS_TOKEN の右の「…」→「Edit」をクリック</div>
    <div class="step">フィールドを全選択（Cmd+A）してから貼り付け（Cmd+V）</div>
    <div class="step">「Save」→「Redeploy」</div>
  </div>
</div>
</body>
</html>`);
}
