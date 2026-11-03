/* サービスページ用の相談フォーム。<div data-soudan-form data-service="重度訪問介護" data-facility="訪問介護クラージュ"></div> に差し込む。送信先は /api/contact */
(function () {
  var CSS = '.sf{max-width:680px;margin:0 auto;background:#fff;border-radius:24px;padding:40px 36px;box-shadow:0 8px 28px rgba(67,51,42,.07);text-align:left;font-family:"Noto Sans JP",sans-serif;}'
    + '.sf h2{font-family:"Zen Maru Gothic",sans-serif;font-weight:900;font-size:24px;color:#43332a;margin:0 0 8px;text-align:center;}'
    + '.sf .lead{font-size:14px;color:#6b6358;text-align:center;line-height:1.9;margin:0 0 26px;}'
    + '.sf label{display:block;font-weight:700;font-size:13px;color:#6b6358;margin:0 0 8px;}.sf .req{color:#c86880;}'
    + '.sf .f{margin-bottom:20px;}.sf input,.sf select,.sf textarea{box-sizing:border-box;width:100%;font-family:inherit;font-size:16px;padding:13px 16px;border:2px solid #ece4d4;border-radius:12px;background:#fff;color:#43332a;outline:none;}'
    + '.sf input:focus,.sf select:focus,.sf textarea:focus{border-color:#3a9090;}.sf textarea{min-height:130px;line-height:1.8;resize:vertical;}'
    + '.sf .chips{display:flex;flex-wrap:wrap;gap:8px;}.sf .chips label{display:inline-flex;align-items:center;gap:6px;margin:0;padding:10px 14px;border:2px solid #ece4d4;border-radius:999px;font-weight:500;font-size:14px;color:#43332a;cursor:pointer;}'
    + '.sf .chips input{width:auto;margin:0;}.sf .chips label:has(input:checked){border-color:#3a9090;background:#e8f5f5;}'
    + '.sf .hint{font-size:12px;color:#a99c8f;margin-top:6px;}.sf button{width:100%;font-family:"Zen Maru Gothic",sans-serif;font-weight:900;font-size:17px;color:#fff;background:#3a9090;border:none;padding:17px;border-radius:999px;cursor:pointer;box-shadow:0 5px 0 #2c7373;}'
    + '.sf button:disabled{opacity:.6;}.sf .err{display:none;color:#c86880;font-size:13px;text-align:center;margin-top:12px;}.sf .ok{display:none;text-align:center;padding:24px 0;}';
  function chips(name, list) {
    return '<div class="chips">' + list.map(function (v, i) { return '<label><input type="radio" name="' + name + '" value="' + v + '"' + (i ? '' : ' checked') + '>' + v + '</label>'; }).join('') + '</div>';
  }
  function build(el) {
    if (el.dataset.ready) return; el.dataset.ready = '1';
    var svc = el.dataset.service || '';
    el.innerHTML = '<div class="sf"><h2>ご相談・お問い合わせ</h2>'
      + '<p class="lead">「使えるかどうかわからない」段階でも大丈夫です。<br>担当者から、お電話またはメールでご連絡します。ご相談は無料です。</p>'
      + '<form>'
      + '<div class="f"><label>ご相談されるのは</label>' + chips('who', ['ご本人', 'ご家族', '支援者・関係機関']) + '</div>'
      + '<div class="f"><label>お名前 <span class="req">*</span></label><input name="name" required placeholder="山田 花子"></div>'
      + '<div class="f"><label>お電話番号</label><input name="tel" type="tel" inputmode="tel" placeholder="090-0000-0000"></div>'
      + '<div class="f"><label>メールアドレス</label><input name="email" type="email" placeholder="example@email.com"><div class="hint">お電話番号かメールアドレスの、どちらかをご入力ください。</div></div>'
      + '<div class="f"><label>ご希望の連絡方法</label>' + chips('contact', ['どちらでも', 'お電話', 'メール']) + '</div>'
      + '<div class="f"><label>お住まいの市区町村</label><input name="city" placeholder="例：大和市、町田市"></div>'
      + '<div class="f"><label>ご相談内容 <span class="req">*</span></label><textarea name="message" required placeholder="例：' + (svc ? svc + 'を使いたいが、何から始めればいいか知りたい' : '使えるサービスを知りたい') + '"></textarea></div>'
      + '<button type="submit">相談内容を送る</button><div class="err"></div></form>'
      + '<div class="ok"><h2>送信しました</h2><p class="lead" style="margin:0;">ご相談ありがとうございます。<br>担当者から、あらためてご連絡します。</p></div></div>';
    var form = el.querySelector('form'), err = el.querySelector('.err'), btn = el.querySelector('button');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = Object.fromEntries(new FormData(form).entries());
      err.style.display = 'none';
      if (!d.tel.trim() && !d.email.trim()) { err.textContent = 'お電話番号かメールアドレスを入力してください。'; err.style.display = 'block'; return; }
      btn.disabled = true; btn.textContent = '送信中...';
      var msg = 'ご相談されるのは：' + d.who + '\nご希望の連絡方法：' + d.contact + '\nお住まい：' + (d.city || '未入力') + '\nページ：' + location.pathname + '\n\n' + d.message;
      fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: d.name, email: d.email, tel: d.tel, facility: el.dataset.facility || '', type: 'ご利用のご相談' + (svc ? '（' + svc + '）' : ''), message: msg }) })
        .then(function (r) { return r.json(); })
        .then(function (r) { if (!r.ok) throw 0; form.style.display = 'none'; el.querySelector('.ok').style.display = 'block'; })
        .catch(function () { err.textContent = '送信できませんでした。時間をおいて再度お試しいただくか、お電話でご連絡ください。'; err.style.display = 'block'; btn.disabled = false; btn.textContent = '相談内容を送る'; });
    });
  }
  function init() {
    if (!document.getElementById('sf-css')) { var s = document.createElement('style'); s.id = 'sf-css'; s.textContent = CSS; document.head.appendChild(s); }
    document.querySelectorAll('[data-soudan-form]').forEach(build);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  new MutationObserver(init).observe(document.documentElement, { childList: true, subtree: true });
})();
