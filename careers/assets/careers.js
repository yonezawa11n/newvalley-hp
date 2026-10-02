/* =====================================================================
   NewValley 採用サイト 共通スクリプト
   - ヘッダー（メニュー）／エントリー欄／フッター／SP固定ボタンを描画
   - メニュー項目を変えるときは NAV だけ直せば全ページに反映されます
   - 各ページの <body data-root="../"> は、careers/ フォルダまでの相対パス
   ===================================================================== */
(function () {
  var body = document.body;
  var R = body.getAttribute('data-root') || './';   // careers/ への相対パス
  var SITE = R + '../';                              // サイトルートへの相対パス
  var LINE_URL = 'https://line.me/R/ti/p/@296dkcwv';

  var NAV = [
    { id: 'home', label: 'HOME', href: '' },
    { id: 'career', label: 'キャリア採用', href: 'career/', sub: [
      { id: 'kaigo', label: '介護職（訪問介護）', href: 'career/kaigo/' },
      { id: 'jido', label: '児童指導員・指導員（放課後等デイ）', href: 'career/jido/' },
      { id: 'kanri', label: '管理・専門職（児発管・サビ管）', href: 'career/kanri/' }
    ]},
    { id: 'shinsotsu', label: '新卒採用', href: 'shinsotsu/' },
    { id: 'careerpath', label: 'キャリアパス', href: 'careerpath/' },
    { id: 'data', label: 'データで見る', href: 'data/' },
    { id: 'message', label: '代表メッセージ', href: 'message/' },
    { id: 'interview', label: '社員インタビュー', href: 'interview/' },
    { id: 'news', label: 'おしらせ', href: 'news/' }
  ];
  var page = body.getAttribute('data-page') || '';
  var parent = body.getAttribute('data-parent') || '';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- Header ---------- */
  var hdSlot = document.getElementById('cr-header');
  if (hdSlot) {
    var items = NAV.map(function (n) {
      var cur = (n.id === page || n.id === parent) ? ' cur' : '';
      if (!n.sub) return '<li><a class="nl' + cur + '" href="' + R + n.href + '">' + esc(n.label) + '</a></li>';
      var subs = '<li><a href="' + R + n.href + '"' + (page === n.id ? ' class="cur"' : '') + '>キャリア採用トップ</a></li>' +
        n.sub.map(function (s) {
          return '<li><a href="' + R + s.href + '"' + (page === s.id ? ' class="cur"' : '') + '>' + esc(s.label) + '</a></li>';
        }).join('');
      return '<li class="has-sub"><button type="button" class="nl' + cur + '" aria-expanded="false">' + esc(n.label) + '</button><ul class="sub">' + subs + '</ul></li>';
    }).join('');
    hdSlot.outerHTML =
      '<header class="hd" id="hd"><div class="wrap">' +
        '<a class="logo" href="' + R + '"><span class="mark"><img src="' + SITE + 'assets/newvalley-logo.png" alt="株式会社NewValley"></span><span class="txt"><b>NewValley</b><span>RECRUIT</span></span></a>' +
        '<nav class="gnav" id="gnav" aria-label="採用サイトメニュー"><ul>' + items + '</ul><a class="diag" href="' + R + 'shindan/">キャリア診断</a><a class="entry" href="' + SITE + 'entry.dc.html">ENTRY</a></nav>' +
        '<button class="menu-btn" id="menuBtn" aria-label="メニューを開く" aria-expanded="false"><i></i><i></i><i></i></button>' +
      '</div></header>';
  }

  /* ---------- Entry ---------- */
  var enSlot = document.getElementById('cr-entry');
  if (enSlot) {
    enSlot.outerHTML =
      '<section class="entry-sec" id="entry">' +
        '<div class="bg"><img src="' + SITE + 'homon/images/cta.jpg" alt="" loading="lazy"></div>' +
        '<div class="wrap">' +
          '<div class="en">Entry</div>' +
          '<h2>あなたの色で、この木を育てよう。</h2>' +
          '<p>まずは「話だけ」でも大歓迎です。お気軽にご連絡ください。</p>' +
          '<div class="entry-btns">' +
            '<a class="btn btn-lime" href="' + SITE + 'entry.dc.html">エントリーフォームへ</a>' +
            '<a class="btn btn-line" href="' + LINE_URL + '" target="_blank" rel="noopener">LINEで相談する</a>' +
          '</div>' +
        '</div>' +
      '</section>';
  }

  /* ---------- Footer ---------- */
  var ftSlot = document.getElementById('cr-footer');
  if (ftSlot) {
    var fl = NAV.map(function (n) { return '<a href="' + R + n.href + '">' + esc(n.label) + '</a>'; }).join('');
    ftSlot.outerHTML =
      '<footer class="ft"><div class="wrap">' +
        '<div><b>株式会社NewValley</b>神奈川県大和市・東京都町田市</div>' +
        '<nav>' + fl + '</nav>' +
        '<nav><a href="' + R + 'shindan/">キャリア診断</a><a href="' + SITE + 'find.dc.html">コーポレートサイト</a><a href="' + SITE + 'company.dc.html">会社概要</a><a href="' + SITE + 'kyujin.dc.html">求人一覧</a><a href="' + SITE + 'contact.dc.html">お問い合わせ</a></nav>' +
        '<small>&copy; NewValley Inc.</small>' +
      '</div></footer>' +
      '<div class="fix-entry" id="fixEntry">' +
        '<a href="' + SITE + 'entry.dc.html" style="background:var(--ink)">エントリー</a>' +
        '<a href="' + LINE_URL + '" target="_blank" rel="noopener" style="background:var(--line-brand)">LINEで相談</a>' +
      '</div>';
  }

  /* ---------- Behaviour ---------- */
  var hd = document.getElementById('hd'), fix = document.getElementById('fixEntry');
  function onScroll() {
    var y = window.scrollY;
    if (hd) hd.classList.toggle('scrolled', y > 10);
    if (fix) fix.classList.toggle('show', y > window.innerHeight * .6);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var btn = document.getElementById('menuBtn');
  function closeMenu() { body.classList.remove('menu-open'); if (btn) btn.setAttribute('aria-expanded', 'false'); }
  if (btn) btn.addEventListener('click', function () {
    var open = body.classList.toggle('menu-open');
    btn.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('#gnav a').forEach(function (a) { a.addEventListener('click', closeMenu); });

  // キャリア採用のドロップダウン（タップ・キーボードでも開閉）
  document.querySelectorAll('.has-sub > .nl').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      var li = b.parentNode, open = !li.classList.contains('open');
      li.classList.toggle('open', open);
      b.setAttribute('aria-expanded', open);
    });
  });
  document.addEventListener('click', function (e) {
    if (window.innerWidth > 1320) document.querySelectorAll('.has-sub.open').forEach(function (li) {
      if (!li.contains(e.target)) { li.classList.remove('open'); li.firstChild.setAttribute('aria-expanded', 'false'); }
    });
  });

  // スクロールでふわっと表示
  var els = document.querySelectorAll('.fx');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- お知らせ（HPと共通：news-data.js + news-loader.js） ---------- */
  // <ul class="news" data-news data-limit="3"> を置くと描画されます
  // 記事はHPの管理画面（/api/news-admin）の投稿も含めて NewsLoader から取得します
  var lists = document.querySelectorAll('[data-news]');
  window.CR_NEWS_URL = function (id) { return R + 'news/detail.html?id=' + encodeURIComponent(id); };
  if (lists.length && window.NewsLoader) {
    var render = function (articles) {
      lists.forEach(function (ul) {
        var limit = +ul.getAttribute('data-limit') || 0;
        var filter = ul.getAttribute('data-filter') || '';
        var list = (articles || []).filter(function (a) { return !filter || a.category === filter; });
        if (limit) list = list.slice(0, limit);
        ul.innerHTML = list.length ? list.map(function (a) {
          return '<li><a href="' + window.CR_NEWS_URL(a.id) + '">' +
            '<time>' + esc((a.date || '').replace(/-/g, '.')) + '</time>' +
            '<span class="cat' + (a.category === '採用情報' ? ' rec' : '') + '">' + esc(a.category || 'お知らせ') + '</span>' +
            '<span class="t">' + esc(a.title) + '</span></a></li>';
        }).join('') : '<li class="news-empty">該当するおしらせはまだありません。</li>';
      });
    };
    NewsLoader.load().then(function (all) {
      window.CR_NEWS = all; render(all);
      window.CR_RENDER_NEWS = function (filter) {
        lists.forEach(function (ul) { ul.setAttribute('data-filter', filter || ''); });
        render(window.CR_NEWS);
      };
    });
  }
})();
