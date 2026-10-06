/* =====================================================================
   NewValley キャリア診断
   - 年収・時給・手当などの数字は CONFIG だけで管理しています
   - 金額は「目安」です。実際の条件は面談で決まります
   ===================================================================== */
(function () {
  var CONFIG = {
    // 訪問介護（正社員・週40時間）の年収モデル（万円）
    homon: { year1: 350, mid: 420, satsu: 500, manager: [500], director: 920 },
    // 放課後等デイ（正社員）の目安（万円）※訪問介護の年収モデルに合わせた目安
    hoday: { staff: [350, 420], jihatsu: [420, 500] },
    // 短時間社員（契約社員）は正社員の何割で計算するか
    ratio: { ft: 1, s32: 0.8, s28: 0.7 },
    // 放デイ パートの時給（円）
    partWage: [1226, 1500],
    weeksPerYear: 52,
    // 資格手当（訪問介護の正社員の例・月額・円）
    allowance: { kaifuku: 5000, jitsumu: 4000, shoninsha: 2000, kodo: 1000 }
  };

  var R = document.body.getAttribute('data-root') || '../';
  var SITE = R + '../';
  var LINE_URL = 'https://line.me/R/ti/p/@296dkcwv';

  /* ---------- 質問 ---------- */
  var Q = [
    { id: 'field', q: '働きたいのは？', type: 'one', opts: [
      { v: 'homon', t: '訪問介護', d: 'ご自宅を訪問して、大人の暮らしを支える' },
      { v: 'hoday', t: '放課後等デイサービス', d: '子どもたちの成長と「できた！」を支える' },
      { v: 'undecided', t: 'まだ決めていない', d: '資格や経験から、合いそうな方をおすすめします' }
    ]},
    { id: 'style', q: '希望の働き方は？', type: 'one', opts: [
      { v: 'ft', t: '正社員（週40時間）', d: 'しっかり働いて収入もキャリアも伸ばしたい' },
      { v: 's32', t: '短時間社員（週32時間）', d: '契約社員。家庭やプライベートと両立したい' },
      { v: 's28', t: '短時間社員（週28時間）', d: '契約社員。もう少し時間を短くしたい' },
      { v: 'part', t: 'パート・アルバイト', d: '週の時間を決めて、自分のペースで働きたい' }
    ]},
    { id: 'hours', q: '週に何時間くらい働きたいですか？', type: 'one', when: function (a) { return a.style === 'part'; }, opts: [
      { v: 10, t: '週10時間くらい', d: '例：週2日 × 5時間' },
      { v: 20, t: '週20時間くらい', d: '例：週4日 × 5時間' },
      { v: 30, t: '週30時間くらい', d: '例：週5日 × 6時間' }
    ]},
    { id: 'quals', q: '持っている資格は？', sub: 'あてはまるものをすべて選んでください', type: 'multi', opts: [
      { v: 'none', t: 'まだ資格はない', excl: true },
      { v: 'shoninsha', t: '介護職員初任者研修' },
      { v: 'jitsumu', t: '実務者研修' },
      { v: 'kaifuku', t: '介護福祉士' },
      { v: 'kodo', t: '行動援護・同行援護・強度行動障害' },
      { v: 'child', t: '保育士・教員免許・児童指導員任用資格' },
      { v: 'kanri', t: '児発管・サビ管の研修修了' }
    ]},
    { id: 'exp', q: '福祉・介護・子どもに関わる仕事の経験は？', type: 'one', opts: [
      { v: 0, t: '経験なし' }, { v: 0.5, t: '1年未満' }, { v: 2, t: '1〜3年' }, { v: 4, t: '3〜5年' }, { v: 5, t: '5年以上' }
    ]},
    { id: 'lic', q: '運転免許は？', type: 'one', opts: [
      { v: 'car', t: '普通自動車免許がある' }, { v: 'moped', t: '原付・バイクの免許だけ' }, { v: 'none', t: '運転免許はない' }
    ]}
  ];

  var A = {}, hist = [], box = document.getElementById('dg');
  if (!box) return;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function visible() { return Q.filter(function (q) { return !q.when || q.when(A); }); }
  function has(k) { return (A.quals || []).indexOf(k) >= 0; }
  function label(id, v) {
    var q = Q.filter(function (x) { return x.id === id; })[0];
    var o = q.opts.filter(function (x) { return x.v === v; })[0];
    return o ? o.t : '';
  }

  /* ---------- 画面 ---------- */
  function start() {
    A = {}; hist = [];
    box.innerHTML =
      '<div class="dg-card dg-start">' +
        '<div class="dg-eyebrow">CAREER CHECK</div>' +
        '<h2>あなたは、どの道を選ぶ？</h2>' +
        '<p>働きたい分野・働き方・資格・経験・運転免許の5つに答えるだけ。<br>おすすめの職種と、推定年収・目指せるポジションがわかります。</p>' +
        '<ul class="dg-points"><li>所要時間 約1分</li><li>登録・個人情報の入力なし</li></ul>' +
        '<button type="button" class="btn btn-ink dg-go">診断をはじめる →</button>' +
      '</div>';
    box.querySelector('.dg-go').onclick = function () { ask(0); };
  }

  function ask(i) {
    var qs = visible(), q = qs[i];
    if (!q) return result();
    var cur = A[q.id];
    var opts = q.opts.map(function (o, k) {
      var on = q.type === 'multi' ? (cur || []).indexOf(o.v) >= 0 : cur === o.v;
      return '<button type="button" class="opt" data-k="' + k + '" aria-pressed="' + on + '"><b>' + esc(o.t) + '</b>' + (o.d ? '<small>' + esc(o.d) + '</small>' : '') + '</button>';
    }).join('');
    box.innerHTML =
      '<div class="dg-card">' +
        '<div class="dg-prog"><span style="width:' + Math.round(i / qs.length * 100) + '%"></span></div>' +
        '<div class="dg-step">Q' + (i + 1) + ' / ' + qs.length + '</div>' +
        '<h2 class="dg-q">' + esc(q.q) + '</h2>' + (q.sub ? '<p class="dg-sub">' + esc(q.sub) + '</p>' : '') +
        '<div class="opts' + (q.opts.length > 4 ? ' two' : '') + '">' + opts + '</div>' +
        '<div class="dg-nav">' +
          (i > 0 ? '<button type="button" class="dg-back">← 戻る</button>' : '<span></span>') +
          (q.type === 'multi' ? '<button type="button" class="btn btn-ink dg-next"' + ((cur || []).length ? '' : ' disabled') + '>次へ →</button>' : '') +
        '</div>' +
      '</div>';
    box.querySelectorAll('.opt').forEach(function (b) {
      b.onclick = function () {
        var o = q.opts[+b.getAttribute('data-k')];
        if (q.type === 'one') { A[q.id] = o.v; ask(i + 1); return; }
        var list = (A[q.id] || []).slice(), at = list.indexOf(o.v);
        if (at >= 0) list.splice(at, 1);
        else if (o.excl) list = [o.v];
        else { list = list.filter(function (v) { return v !== 'none'; }); list.push(o.v); }
        A[q.id] = list; ask(i);
      };
    });
    var back = box.querySelector('.dg-back'); if (back) back.onclick = function () { ask(i - 1); };
    var next = box.querySelector('.dg-next'); if (next) next.onclick = function () { ask(i + 1); };
    box.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  /* ---------- 計算 ---------- */
  function man(n) { return Math.round(n).toLocaleString(); }
  function range(lo, hi, plus) {
    if (hi == null || lo === hi) return man(lo) + '万円' + (plus ? '〜' : '');
    return man(lo) + '〜' + man(hi) + '万円' + (plus ? '〜' : '');
  }
  function scale(v) { return v * CONFIG.ratio[A.style === 'part' ? 'ft' : A.style]; }
  function styleName() {
    return { ft: '正社員（週40時間）', s32: '短時間社員（週32時間・契約社員）', s28: '短時間社員（週28時間・契約社員）', part: 'パート' }[A.style];
  }

  function planHomon() {
    var c = CONFIG.homon, careQual = has('shoninsha') || has('jitsumu') || has('kaifuku') || has('kodo');
    var senior = (has('jitsumu') || has('kaifuku')) && A.exp >= 4;
    var p = { field: 'homon', job: '介護職（訪問介護）', href: R + 'career/kaigo/' };
    var steps = [];
    if (!careQual) steps.push({ t: '研修生・パートで入社', s: '先輩と同行訪問しながらスタート。お休みの日の研修はバイト代支給で、費用ゼロで資格取得', inc: null });
    steps.push({ t: '正社員', s: careQual ? '資格を活かして正社員でスタート' : '資格取得・6か月の勤務後、管理者面談のうえ正社員へ', inc: [c.year1] });
    steps.push({ t: '中堅ヘルパー', s: '入社2年目〜', inc: [c.mid] });
    steps.push({ t: 'サービス提供責任者', s: '実務者研修以上が目安。入社1年半〜2年でサ責になった先輩も', inc: [c.satsu], plus: true });
    steps.push({ t: '管理者', s: '入社3年半で管理者になった先輩も。固定給＋成果給', inc: c.manager, plus: true, fixed: true });
    steps.push({ t: '事業部長', s: '事業全体の運営。固定給＋成果給', inc: [c.director], plus: true, fixed: true });
    var now;
    if (!careQual) { now = 0; p.pos = '研修生・パートからスタート'; p.inc = [c.year1]; }
    else if (senior) { now = 2; p.pos = '正社員（サービス提供責任者候補）'; p.inc = [c.mid]; }
    else if (A.exp >= 2) { now = 0; p.pos = '正社員（経験者）'; p.inc = [c.year1, c.mid]; }
    else { now = 0; p.pos = '正社員'; p.inc = [c.year1]; }
    p.steps = steps; p.now = now;
    if (A.style === 'part') { p.pos = 'パート（登録ヘルパー）'; p.wage = '時給は資格・経験により応相談'; }
    // 次に取れる資格
    p.next = [];
    if (!careQual) p.next.push('介護職員初任者研修（研修日はバイト代支給・費用ゼロ）');
    else if (!has('jitsumu') && !has('kaifuku')) p.next.push('実務者研修（サ責へのステップ）');
    else if (!has('kaifuku')) p.next.push('介護福祉士（国家資格）');
    if (!has('kodo')) p.next.push('強度行動障害（行動援護）・同行援護（社内研修で取得可）');
    // 資格手当
    var al = CONFIG.allowance, list = [];
    if (has('kaifuku')) list.push('介護福祉士 月' + al.kaifuku.toLocaleString() + '円');
    if (has('jitsumu')) list.push('実務者研修 月' + al.jitsumu.toLocaleString() + '円');
    if (has('shoninsha')) list.push('初任者研修 月' + al.shoninsha.toLocaleString() + '円');
    if (has('kodo')) list.push('行動援護・同行援護 各月' + al.kodo.toLocaleString() + '円');
    p.allow = list;
    p.lic = A.lic === 'none' ? '訪問介護は運転免許（原付可）があれば未経験からスタートできます。免許がない場合は、面談でご相談ください。' : '';
    if (has('kanri')) p.extra = { t: 'サービス管理責任者（サビ管）としての応募もご相談ください', href: R + 'career/kanri/' };
    return p;
  }

  function planHoday() {
    var c = CONFIG.hoday, child = has('child');
    var p = { field: 'hoday', job: '児童指導員・指導員（放課後等デイ）', href: R + 'career/jido/' };
    var steps = [
      { t: '指導員', s: '資格要件なし。強度行動障害の資格は社内で取得できます', wage: true },
      { t: '児童指導員（正社員）', s: '保育士・教員免許・児童指導員任用資格など。児童福祉事業に2年以上従事でも対象', inc: c.staff },
      { t: '児童発達支援管理責任者', s: '実務経験と研修修了が必要。個別支援計画・現場マネジメントを担う', inc: c.jihatsu, plus: true }
    ];
    var now;
    if (has('kanri') && A.exp >= 4) { now = 2; p.pos = '児童発達支援管理責任者（児発管）'; p.inc = c.jihatsu; p.plus = true; p.job = '管理・専門職（児発管）'; p.href = R + 'career/kanri/'; }
    else if (child) { now = 1; p.pos = '児童指導員'; p.inc = c.staff; }
    else { now = 0; p.pos = '指導員'; p.inc = c.staff; p.note = '資格がない場合はパートでのスタートが中心です。正社員の条件は面談でご相談ください。'; }
    p.steps = steps; p.now = now;
    if (A.style === 'part') {
      var w = CONFIG.partWage, h = A.hours || 20, wk = CONFIG.weeksPerYear;
      p.pos = (now === 1 ? '児童指導員' : '指導員') + '（パート）';
      p.wage = '時給 ' + w[0].toLocaleString() + '〜' + w[1].toLocaleString() + '円';
      p.partInc = [w[0] * h * wk / 10000, w[1] * h * wk / 10000];
    }
    p.next = [];
    if (!has('kodo')) p.next.push('強度行動障害（社内で取得可）');
    if (!child) p.next.push('児童指導員任用資格（児童福祉事業に2年以上従事で対象）');
    if (child && !has('kanri')) p.next.push('児童発達支援管理責任者の研修（実務経験を積んでから）');
    p.allow = [];
    p.lic = A.lic !== 'car' ? '放課後等デイサービスは送迎があるため、普通自動車免許が必要です（学生は応相談）。' : '';
    return p;
  }

  function incText(p) {
    if (p.partInc) return range(p.partInc[0], p.partInc[1]);
    if (A.style === 'part') return null;
    var lo = scale(p.inc[0]), hi = p.inc[1] != null ? scale(p.inc[1]) : null;
    return range(lo, hi, p.plus);
  }

  /* ---------- 結果 ---------- */
  function result() {
    var main, sub;
    if (A.field === 'undecided') {
      var childLean = has('child') && !(has('jitsumu') || has('kaifuku'));
      main = childLean ? planHoday() : planHomon();
      sub = childLean ? planHomon() : planHoday();
    } else main = A.field === 'homon' ? planHomon() : planHoday();

    var inc = incText(main);
    var road = main.steps.map(function (s, k) {
      var v = s.wage ? '時給 ' + CONFIG.partWage[0].toLocaleString() + '円〜（パート）' :
        s.inc ? (s.fixed ? '正社員 ' + range(s.inc[0], s.inc[1], s.plus) : A.style === 'part' ? '正社員なら ' + range(s.inc[0], s.inc[1], s.plus) : range(scale(s.inc[0]), s.inc[1] != null ? scale(s.inc[1]) : null, s.plus)) : '';
      return '<li class="' + (k === main.now ? 'now' : k < main.now ? 'done' : '') + '">' +
        (k === main.now ? '<span class="here">いまのあなた</span>' : '') +
        '<b>' + esc(s.t) + '</b>' + (v ? '<em>' + esc(v) + '</em>' : '') + '<p>' + esc(s.s) + '</p></li>';
    }).join('');

    var copy = [
      '【NewValley キャリア診断の結果】',
      '働きたい分野：' + label('field', A.field),
      '働き方：' + styleName() + (A.style === 'part' ? '（週' + A.hours + '時間）' : ''),
      '資格：' + (A.quals || []).map(function (v) { return label('quals', v); }).join('、'),
      '経験：' + label('exp', A.exp),
      '運転免許：' + label('lic', A.lic),
      'おすすめ：' + main.job + '／' + main.pos,
      '推定年収：' + (inc || main.wage)
    ].join('\n');

    var styleNote = A.style === 's32' ? '週32時間の短時間社員（契約社員）として、正社員の8割で計算しています。' :
      A.style === 's28' ? '週28時間の短時間社員（契約社員）として、正社員の7割で計算しています。' :
      A.style === 'part' && main.partInc ? '時給 × 週' + A.hours + '時間 × 52週で計算しています。' : '';

    box.innerHTML =
      '<div class="dg-card rs">' +
        '<div class="dg-eyebrow">RESULT</div>' +
        '<p class="rs-lead">あなたにおすすめの道は…</p>' +
        '<h2 class="rs-job">' + esc(main.job) + '</h2>' +
        '<div class="rs-main">' +
          '<div><div class="k">スタート時のポジション</div><div class="v">' + esc(main.pos) + '</div></div>' +
          '<div><div class="k">推定年収（目安）</div><div class="v big">' + esc(inc || '—') + '</div>' + (main.wage ? '<div class="w">' + esc(main.wage) + '</div>' : '') + '</div>' +
        '</div>' +
        (styleNote ? '<p class="note">' + esc(styleNote) + '</p>' : '') +
        (main.note ? '<p class="rs-warn">' + esc(main.note) + '</p>' : '') +
        (main.lic ? '<p class="rs-warn">🚗 ' + esc(main.lic) + '</p>' : '') +

        '<h3 class="rs-h">目指せるポジション</h3>' +
        '<ol class="road">' + road + '</ol>' +

        (main.next.length ? '<h3 class="rs-h">次に取れる資格</h3><ul class="chips">' + main.next.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' : '') +
        (main.allow.length ? '<h3 class="rs-h">あなたの資格の手当（訪問介護の正社員の例）</h3><ul class="chips">' + main.allow.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' : '') +
        (main.extra ? '<p class="rs-extra"><a href="' + main.extra.href + '">' + esc(main.extra.t) + ' →</a></p>' : '') +

        (sub ? '<div class="rs-sub"><div class="k">こちらの道も</div><a href="' + sub.href + '"><b>' + esc(sub.job) + '</b><span>' + esc(sub.pos) + '／推定年収 ' + esc(incText(sub) || sub.wage || '応相談') + '</span></a></div>' : '') +

        '<div class="rs-btns">' +
          '<a class="btn btn-ink" href="' + main.href + '">' + esc(main.job) + 'を詳しく見る →</a>' +
          '<a class="btn btn-lime" href="' + SITE + 'entry.dc.html">この内容でエントリー</a>' +
          '<a class="btn btn-line" href="' + LINE_URL + '" target="_blank" rel="noopener">LINEで相談する</a>' +
        '</div>' +
        '<div class="rs-tools"><button type="button" class="dg-copy">結果をコピー（LINEに貼り付けできます）</button><button type="button" class="dg-retry">もう一度診断する</button></div>' +
        '<p class="note">※金額は目安です。実際の給与・ポジションは、経験・資格・勤務内容により面談で決まります。放課後等デイ・児発管の年収は、訪問介護の年収モデルに合わせた目安です。</p>' +
      '</div>';

    box.querySelector('.dg-retry').onclick = start;
    box.querySelector('.dg-copy').onclick = function () {
      var b = this;
      var done = function () { b.textContent = 'コピーしました！'; setTimeout(function () { b.textContent = '結果をコピー（LINEに貼り付けできます）'; }, 2000); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(copy).then(done, function () { fallback(copy); done(); });
      else { fallback(copy); done(); }
    };
    box.setAttribute('data-result', JSON.stringify({ job: main.job, pos: main.pos, inc: inc, sub: sub ? sub.job : null }));
    box.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
  function fallback(t) {
    var ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {} document.body.removeChild(ta);
  }

  start();
})();
