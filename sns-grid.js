/**
 * SnsGrid — 再利用可能な SNS フィードグリッドコンポーネント
 *
 * 使い方:
 *   SnsGrid.render({
 *     containerId: 'sns-grid-biyondo',
 *     errorId:     'sns-error-biyondo',
 *     handle:      'nv.biyondo',
 *     source:      'instagram',   // future: 'threads' | 'youtube' | 'tiktok'
 *     color:       '#6878b8',
 *     limit:       6,
 *   });
 */
window.SnsGrid = (function () {
  var MONTH_NAMES = ['1','2','3','4','5','6','7','8','9','10','11','12'];

  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return d.getFullYear() + '年' + MONTH_NAMES[d.getMonth()] + '月' + d.getDate() + '日';
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function injectResponsiveCss(containerId, color) {
    var styleId = 'sns-grid-style-' + containerId;
    if (document.getElementById(styleId)) return;
    var style = document.createElement('style');
    style.id = styleId;
    style.textContent = [
      '#' + containerId + ' { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }',
      '@media(max-width:900px){',
      '  #' + containerId + ' { grid-template-columns:repeat(2,1fr); gap:16px; }',
      '}',
      '@media(max-width:600px){',
      '  #' + containerId + ' { grid-template-columns:1fr; gap:14px; }',
      '}',
    ].join('');
    document.head.appendChild(style);
  }

  function buildCard(item, color) {
    var card = document.createElement('a');
    card.href = item.url || '#';
    card.target = '_blank';
    card.rel = 'noopener';
    card.style.cssText = [
      'display:block;text-decoration:none;background:#fff;border-radius:18px;',
      'overflow:hidden;box-shadow:0 4px 18px rgba(67,51,42,.09);',
      'transition:transform .25s cubic-bezier(.22,.61,.36,1),box-shadow .25s;',
    ].join('');
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-6px)';
      this.style.boxShadow = '0 14px 36px rgba(67,51,42,.18)';
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 18px rgba(67,51,42,.09)';
    });

    // 画像
    var imgWrap = document.createElement('div');
    imgWrap.style.cssText = 'aspect-ratio:1;overflow:hidden;background:#e8e0d4;';
    var img = document.createElement('img');
    img.src = item.image || '';
    img.alt = '';
    img.loading = 'lazy';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s;';
    imgWrap.addEventListener('mouseenter', function () { img.style.transform = 'scale(1.05)'; });
    imgWrap.addEventListener('mouseleave', function () { img.style.transform = 'scale(1)'; });
    imgWrap.appendChild(img);

    // テキスト本文
    var body = document.createElement('div');
    body.style.cssText = 'padding:14px 18px 16px;';

    // キャプション
    if (item.caption) {
      var cap = document.createElement('p');
      cap.style.cssText = [
        'font-size:12px;line-height:1.8;color:#6b6358;margin:0 0 10px;',
        'display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;',
      ].join('');
      cap.textContent = item.caption;
      body.appendChild(cap);
    }

    // 日付 + ソースバッジ
    var meta = document.createElement('div');
    meta.style.cssText = 'display:flex;align-items:center;justify-content:space-between;';

    var dateEl = document.createElement('span');
    dateEl.style.cssText = 'font-size:11px;color:#b0a89e;font-family:\'Quicksand\',sans-serif;';
    dateEl.textContent = formatDate(item.date);
    meta.appendChild(dateEl);

    var badge = document.createElement('span');
    badge.style.cssText = 'font-size:10px;font-weight:700;letter-spacing:.06em;color:' + color + ';opacity:.7;text-transform:uppercase;';
    badge.textContent = item.source || 'instagram';
    meta.appendChild(badge);

    body.appendChild(meta);
    card.appendChild(imgWrap);
    card.appendChild(body);
    return card;
  }

  function render(opts) {
    var containerId = opts.containerId;
    var errorId     = opts.errorId;
    var handle      = opts.handle || '';
    var source      = opts.source || 'instagram';
    var color       = opts.color  || '#6f9fc1';
    var limit       = opts.limit  || 6;

    var container = document.getElementById(containerId);
    var errEl     = errorId ? document.getElementById(errorId) : null;
    if (!container) return;

    injectResponsiveCss(containerId, color);

    var url = '/api/sns-feed?source=' + encodeURIComponent(source) +
              '&handle=' + encodeURIComponent(handle) +
              '&limit=' + limit;

    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var items = data.items || [];
        if (!items.length) {
          if (errEl) errEl.style.display = 'block';
          return;
        }
        items.forEach(function (item) {
          if (!item.image) return;
          container.appendChild(buildCard(item, color));
        });
      })
      .catch(function () {
        if (errEl) errEl.style.display = 'block';
      });
  }

  return { render: render };
})();
