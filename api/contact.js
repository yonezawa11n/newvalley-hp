/**
 * お問い合わせフォーム送信 API
 * POST /api/contact
 * 必要な環境変数: RESEND_API_KEY
 * 任意: MAIL_TO（届け先。未設定なら newvalley.it@gmail.com）
 * 任意: MAIL_FROM（送信元。未設定なら noreply@newvalleyhp.com。Resend で newvalleyhp.com は認証済み）
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) return res.status(500).json({ error: 'RESEND_API_KEY が設定されていません' });

  const { name, email, facility, type, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: '必須項目が不足しています' });
  }

  const subject = `【NewValley お問い合わせ】${type || 'その他'} — ${name} 様`;
  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
  <h2 style="color:#43332a;border-bottom:2px solid #ece4d4;padding-bottom:12px;">お問い合わせが届きました</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <tr><td style="padding:10px 0;color:#a99c8f;width:120px;">お名前</td><td style="padding:10px 0;color:#43332a;font-weight:bold;">${escHtml(name)}</td></tr>
    <tr><td style="padding:10px 0;color:#a99c8f;">メール</td><td style="padding:10px 0;"><a href="mailto:${escHtml(email)}" style="color:#6f9fc1;">${escHtml(email)}</a></td></tr>
    <tr><td style="padding:10px 0;color:#a99c8f;">事業所</td><td style="padding:10px 0;color:#43332a;">${escHtml(facility || '未選択')}</td></tr>
    <tr><td style="padding:10px 0;color:#a99c8f;">種別</td><td style="padding:10px 0;color:#43332a;">${escHtml(type || '未選択')}</td></tr>
  </table>
  <h3 style="color:#43332a;margin-top:24px;">お問い合わせ内容</h3>
  <div style="background:#faf7f0;border-radius:12px;padding:16px;font-size:14px;line-height:1.8;color:#6b6358;white-space:pre-wrap;">${escHtml(message)}</div>
  <p style="font-size:12px;color:#a99c8f;margin-top:24px;">このメールは newvalleyhp.com のお問い合わせフォームから自動送信されました。</p>
</div>`;

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'NewValley お問い合わせ <noreply@newvalleyhp.com>',
      to: [process.env.MAIL_TO || 'newvalley.it@gmail.com'],
      reply_to: email,
      subject,
      html,
    }),
  });

  const result = await emailRes.json();
  if (!emailRes.ok) {
    // 原因の確認用。氏名・メール・本文などの個人情報はログに出さない
    // Resend の message には宛先アドレスが入ることがあるので name だけ出す
    console.error('contact: resend failed', emailRes.status, (result && result.name) || '');
    return res.status(500).json({ error: '送信に失敗しました' });
  }
  return res.json({ ok: true });
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
