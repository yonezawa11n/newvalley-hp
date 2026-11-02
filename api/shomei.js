/**
 * 実務経験証明書・在職証明書 申し込み API
 * POST /api/shomei
 * 必要な環境変数: RESEND_API_KEY
 * 任意: MAIL_TO（会社の届け先。未設定なら newvalley.it@gmail.com）
 * 任意: SHOMEI_BANK_INFO（申込者への自動返信に載せる振込先。改行可。未設定なら「担当者から改めて連絡」と送る）
 */
const FEE = 1650;
const TYPES = ['実務経験証明書', '在職証明書'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) return res.status(500).json({ error: 'RESEND_API_KEY が設定されていません' });

  const b = req.body || {};
  const counts = TYPES.map((t, i) => ({ t, n: Math.max(0, Math.min(10, parseInt(b['count' + i], 10) || 0)) }));
  const total = counts.reduce((s, c) => s + c.n, 0);
  const need = ['name', 'kana', 'birth', 'email', 'tel', 'zip', 'address', 'facility', 'period', 'job', 'purpose', 'payer'];
  if (!total || need.some(k => !String(b[k] || '').trim())) {
    return res.status(400).json({ error: '必須項目が不足しています' });
  }
  const amount = total * FEE;
  const docs = counts.filter(c => c.n).map(c => `${c.t} ${c.n}通`).join('、');
  const yen = n => n.toLocaleString('ja-JP') + '円';

  const rows = [
    ['申し込み内容', docs], ['合計金額', `${yen(amount)}（${total}通 × ${yen(FEE)}）`],
    ['氏名', b.name], ['フリガナ', b.kana], ['旧姓', b.oldname || 'なし'], ['生年月日', b.birth],
    ['メール', b.email], ['電話番号', b.tel], ['送付先', `〒${b.zip} ${b.address}`],
    ['在籍事業所', b.facility], ['在籍期間', b.period], ['職種', b.job], ['提出先・用途', b.purpose],
    ['振込名義', b.payer], ['備考', b.note || ''],
  ];
  const table = rows.map(([k, v]) => `<tr><td style="padding:8px 0;color:#a99c8f;width:120px;vertical-align:top;">${k}</td><td style="padding:8px 0;color:#43332a;white-space:pre-wrap;">${escHtml(v)}</td></tr>`).join('');

  const send = (payload) => fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.MAIL_FROM || 'NewValley <noreply@newvalleyhp.com>', ...payload }),
  });

  // 会社あて
  const r1 = await send({
    to: [process.env.MAIL_TO || 'newvalley.it@gmail.com'],
    reply_to: b.email,
    subject: `【証明書申し込み】${docs} — ${b.name} 様（${yen(amount)}）`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
  <h2 style="color:#43332a;border-bottom:2px solid #ece4d4;padding-bottom:12px;">証明書の申し込みが届きました</h2>
  <p style="font-size:14px;color:#6b6358;">入金を確認したら、証明書を準備して郵送してください。申込者には振込のご案内を自動で送っています。</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">${table}</table></div>`,
  });
  if (!r1.ok) {
    console.error('shomei: resend failed (company)', r1.status);
    return res.status(500).json({ error: '送信に失敗しました' });
  }

  // 申込者あて（振込のご案内）
  const bank = (process.env.SHOMEI_BANK_INFO || '').trim();
  const bankHtml = bank
    ? `<div style="background:#faf7f0;border-radius:12px;padding:16px;font-size:14px;line-height:1.9;color:#43332a;white-space:pre-wrap;">${escHtml(bank)}</div>`
    : `<p style="font-size:14px;line-height:1.9;color:#43332a;">振込先は、担当者から改めてメールでご連絡いたします。</p>`;
  const r2 = await send({
    to: [b.email],
    reply_to: process.env.MAIL_TO || 'newvalley.it@gmail.com',
    subject: '【株式会社NewValley】証明書のお申し込みを受け付けました（お振込のご案内）',
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#43332a;">
  <p>${escHtml(b.name)} 様</p>
  <p style="font-size:14px;line-height:1.9;">株式会社NewValleyです。証明書のお申し込みを受け付けました。<br>下記の金額をお振込みください。<strong>入金を確認したのち、証明書を準備して郵送</strong>いたします。</p>
  <h3 style="margin:24px 0 8px;">お振込金額</h3>
  <p style="font-size:20px;font-weight:bold;margin:0;">${yen(amount)}</p>
  <p style="font-size:13px;color:#6b6358;margin:4px 0 0;">${escHtml(docs)}（1通 ${yen(FEE)}・返信用封筒と送料を含みます）<br>振込手数料はご負担ください。振込名義は「${escHtml(b.payer)}」でお願いします。</p>
  <h3 style="margin:24px 0 8px;">お振込先</h3>
  ${bankHtml}
  <h3 style="margin:24px 0 8px;">お届けの目安</h3>
  <p style="font-size:14px;line-height:1.9;">入金確認の翌営業日に準備・発送します（土日の入金確認は週明けの対応になります）。</p>
  <h3 style="margin:24px 0 8px;">お申し込み内容</h3>
  <table style="width:100%;border-collapse:collapse;font-size:13px;">${table}</table>
  <p style="font-size:12px;color:#a99c8f;margin-top:24px;">このメールは newvalleyhp.com から自動送信されています。ご不明な点は、このメールにご返信ください。</p>
</div>`,
  });
  if (!r2.ok) console.error('shomei: resend failed (applicant)', r2.status);
  return res.json({ ok: true, amount, autoReply: r2.ok });
}

function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
