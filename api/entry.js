/**
 * 採用エントリーフォーム送信 API
 * POST /api/entry
 * 必要な環境変数: RESEND_API_KEY（お問い合わせフォームと共通）
 * 応募者の個人情報はログ・エラー応答に出さないこと
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) {
    console.error('entry: RESEND_API_KEY missing');
    return res.status(500).json({ error: 'RESEND_API_KEY が設定されていません' });
  }

  const { name, email, tel, position, message } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: '必須項目が不足しています' });
  }
  if ([name, email, tel, position].some(v => v && String(v).length > 200) ||
      (message && String(message).length > 5000)) {
    return res.status(400).json({ error: '入力が長すぎます' });
  }

  const subject = `【NewValley エントリー】${position || '職種未選択'} — ${name} 様`;
  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
  <h2 style="color:#43332a;border-bottom:2px solid #ece4d4;padding-bottom:12px;">採用エントリーが届きました</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <tr><td style="padding:10px 0;color:#a99c8f;width:120px;">お名前</td><td style="padding:10px 0;color:#43332a;font-weight:bold;">${escHtml(name)}</td></tr>
    <tr><td style="padding:10px 0;color:#a99c8f;">メール</td><td style="padding:10px 0;"><a href="mailto:${escHtml(email)}" style="color:#6f9fc1;">${escHtml(email)}</a></td></tr>
    <tr><td style="padding:10px 0;color:#a99c8f;">電話番号</td><td style="padding:10px 0;color:#43332a;">${escHtml(tel || '未入力')}</td></tr>
    <tr><td style="padding:10px 0;color:#a99c8f;">希望職種</td><td style="padding:10px 0;color:#43332a;">${escHtml(position || '未選択')}</td></tr>
  </table>
  <h3 style="color:#43332a;margin-top:24px;">お問い合わせ内容</h3>
  <div style="background:#faf7f0;border-radius:12px;padding:16px;font-size:14px;line-height:1.8;color:#6b6358;white-space:pre-wrap;">${escHtml(message || '（なし）')}</div>
  <p style="font-size:12px;color:#a99c8f;margin-top:24px;">このメールは newvalleyhp.com のエントリーフォームから自動送信されました。応募者への連絡は24時間以内を目安にお願いします。</p>
</div>`;

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'NewValley エントリー <onboarding@resend.dev>',
      to: ['newvalleykouhou31@gmail.com'],
      reply_to: email,
      subject,
      html,
    }),
  });

  if (!emailRes.ok) {
    // 原因調査用。Resend の message には宛先アドレスが入ることがあるので name だけ出す
    const result = await emailRes.json().catch(() => ({}));
    console.error('entry: resend failed', emailRes.status, result.name || '');
    return res.status(500).json({ error: '送信に失敗しました' });
  }
  return res.json({ ok: true });
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
