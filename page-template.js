// helper to generate business page HTML
function page(cfg) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="./support.js"><\/script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&family=Noto+Sans+JP:wght@400;500;700&family=Quicksand:wght@500;600;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;}body{margin:0;background:#faf7f0;}</style>
</helmet>
<div style="background:#faf7f0;font-family:'Noto Sans JP',sans-serif;">
  <dc-import name="Header" hint-size="100%,80px"></dc-import>

  <!-- HERO -->
  <section style="position:relative;height:420px;overflow:hidden;background:${cfg.color};">
    ${cfg.photo ? `<img src="${cfg.photo}" alt="${cfg.name}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;">` : ''}
    <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.05),rgba(0,0,0,0.52));"></div>
    <div style="position:absolute;bottom:0;left:0;right:0;padding:44px 52px;">
      <span style="display:inline-block;font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:12px;color:#fff;background:${cfg.color};padding:5px 16px;border-radius:999px;margin-bottom:14px;">${cfg.tag}</span>
      <h1 style="font-family:'Zen Maru Gothic',sans-serif;font-weight:900;font-size:38px;color:#fff;margin:0 0 8px;line-height:1.3;">${cfg.name}</h1>
      <p style="font-family:'Noto Sans JP',sans-serif;font-size:15px;color:rgba(255,255,255,.88);margin:0;">${cfg.subtitle}</p>
    </div>
  </section>

  <!-- INFO -->
  <section style="padding:80px 52px;">
    <div style="max-width:860px;margin:0 auto;">
      <div style="width:48px;height:5px;border-radius:999px;background:${cfg.color};margin-bottom:32px;"></div>
      <p style="font-size:16px;line-height:2.1;color:#6b6358;margin:0 0 48px;">${cfg.desc}</p>
      <div style="background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 6px 18px rgba(67,51,42,.06);">
        <div style="display:flex;gap:0;padding:22px 28px;border-bottom:1px solid #f0e8d8;align-items:flex-start;">
          <span style="flex:none;width:90px;font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:12px;color:#a99c8f;">住所</span>
          <span style="font-size:14px;color:#43332a;line-height:1.7;">${cfg.area}</span>
        </div>
        <div style="display:flex;gap:0;padding:22px 28px;border-bottom:1px solid #f0e8d8;align-items:flex-start;">
          <span style="flex:none;width:90px;font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:12px;color:#a99c8f;">アクセス</span>
          <span style="font-size:14px;color:#43332a;line-height:1.7;">${cfg.access}</span>
        </div>
        <div style="display:flex;gap:0;padding:22px 28px;align-items:flex-start;">
          <span style="flex:none;width:90px;font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:12px;color:#a99c8f;">営業時間</span>
          <span style="font-size:14px;color:#43332a;line-height:1.7;">${cfg.hours || 'お問い合わせください'}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- RECRUIT CTA -->
  <section style="background:${cfg.color};padding:72px 44px;text-align:center;">
    <div style="font-family:'Quicksand',sans-serif;font-weight:700;font-size:13px;letter-spacing:.22em;color:rgba(255,255,255,.7);margin-bottom:12px;">RECRUIT</div>
    <h2 style="font-family:'Zen Maru Gothic',sans-serif;font-weight:900;font-size:28px;color:#fff;margin:0 0 14px;line-height:1.5;">一緒に働きませんか？</h2>
    <p style="font-size:14px;color:rgba(255,255,255,.85);margin:0 0 28px;">ニューバリーで、あなたのチカラを活かしてください。</p>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">
      <a href="entry.dc.html" style="text-decoration:none;font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:15px;color:#43332a;background:#d6e06a;padding:14px 32px;border-radius:999px;box-shadow:0 4px 0 #b9c44f;">エントリーする</a>
      <a href="https://line.me/R/ti/p/@296dkcwv" target="_blank" style="text-decoration:none;font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:15px;color:#fff;background:#06C755;padding:14px 32px;border-radius:999px;box-shadow:0 4px 0 #059440;">LINEで相談する</a>
    </div>
  </section>

  <dc-import name="Footer" hint-size="100%,260px"></dc-import>
</div>
</x-dc>
</body>
</html>`;
}
