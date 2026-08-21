# スマホ用ボトムタブバー 実装指示書（newvalleyhp.com）

本番プロジェクトへ、**スマホ表示時に画面下へ固定のタブバー**を追加してください。
PC表示は現状の上部ナビのまま **変更しないでください**。デザイン見本での見た目・動作は確認済みです。この仕様どおりに再現すれば同じになります。

---

## 1. 概要（何を作るか）
- **スマホ（画面幅 767px 以下）のときだけ**、画面最下部に固定表示されるナビゲーション（ボトムタブバー）。
- 5項目。各項目は「アイコン（上）＋ラベル（下）」の縦積み、横幅は均等割り。
- **現在表示中のページに対応するタブをアクティブ色**にする。
- スクロールしても常に画面下に固定。本文がバーに隠れないよう下に余白を確保。
- 上部ヘッダー（左ロゴ＋ハンバーガー）と全画面メニューは現状のまま併用。

## 2. 項目とリンク先
| ラベル | アイコン | リンク先（本番のルートに合わせて調整可） |
|---|---|---|
| ホーム | 家 | `/`（トップ） |
| 事業紹介 | 書類ケース | 事業紹介ページ |
| 採用情報 | 人 | 採用ページ |
| 会社概要 | ビル | 会社概要ページ |
| お問い合わせ | メール | 問い合わせページ |

## 3. 配色・タイポ（サイト準拠）
| 用途 | 値 |
|---|---|
| バー背景 | `#ffffff` |
| 上境界線 | `1px solid #ece4d4` |
| 影 | `0 -3px 16px rgba(67,51,42,.07)` |
| 非アクティブ 文字/アイコン | `#9c8f7f` |
| **アクティブ 文字/アイコン** | `#6f9fc1` |
| フォント | `'Zen Maru Gothic', sans-serif` / 太さ 700 |
| ラベル文字サイズ | `10px` |
| アイコンサイズ | `22px`（線幅 1.7、stroke） |

## 4. 寸法・挙動
- 配置：`position:fixed; left:0; right:0; bottom:0;`（画面下に固定）
- 重なり順：本文より前面。ただしハンバーガーの全画面メニューより背面（例：タブバー `z-index:150`、全画面メニュー `z-index:200`）。
- 各項目：`flex:1`（均等）、縦積み、`gap:4px`、上下 `padding:6px`。
- **ノッチ対応**：下パディングに `env(safe-area-inset-bottom)` を加算。`<meta name="viewport" ... viewport-fit=cover>` を付与。
- **本文クリアランス**：スマホ時のみ `body { padding-bottom: 62px }`（バー高さ＋safe-area）。
- **表示切替**：`@media (max-width:767px)` でのみ表示。768px以上では `display:none`。

## 5. ⚠️ 実装上の最重要注意（ハマりどころ）
このタブバーを、**`backdrop-filter` や `transform` が効いた親要素の内側に置かないこと**。
（CSSの仕様上、`backdrop-filter`/`transform` を持つ要素は子の `position:fixed` の基準になり、タブバーが「画面下」ではなく「その親の下」に貼り付いてしまう。）
本番のヘッダーは `backdrop-filter: blur()` を使っている可能性が高いので、**タブバーはヘッダーの外**（例：`document.body` 直下、または最上位レイアウトの直下）に置いてください。

---

## 6. そのまま使えるコード（フレームワーク非依存 / HTML+CSS+JS）

### CSS
```css
.nv-tabbar { display: none; }
@media (max-width: 767px) {
  .nv-tabbar {
    display: flex;
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 150;
    background: #ffffff;
    border-top: 1px solid #ece4d4;
    box-shadow: 0 -3px 16px rgba(67,51,42,.07);
    padding: 6px 2px calc(6px + env(safe-area-inset-bottom, 0px));
    justify-content: space-around; align-items: stretch;
    font-family: 'Zen Maru Gothic', sans-serif;
  }
  .nv-tabbar a {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 4px;
    text-decoration: none; color: #9c8f7f;
    font-size: 10px; font-weight: 700; line-height: 1; padding: 4px 2px;
  }
  .nv-tabbar a span { white-space: nowrap; }
  .nv-tabbar a svg { width: 22px; height: 22px; stroke: #9c8f7f; fill: none; stroke-width: 1.7; transition: stroke .2s; }
  .nv-tabbar a.active { color: #6f9fc1; }
  .nv-tabbar a.active svg { stroke: #6f9fc1; }
  body { padding-bottom: 62px; }
}
```

### HTML（`</body>` 直前に置く。※ヘッダーの中には入れない）
```html
<nav class="nv-tabbar" aria-label="メインナビゲーション">
  <a href="/" data-key="home">
    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
    <span>ホーム</span>
  </a>
  <a href="/business" data-key="business">
    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/></svg>
    <span>事業紹介</span>
  </a>
  <a href="/recruit" data-key="recruit">
    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="8" r="4"/></svg>
    <span>採用情報</span>
  </a>
  <a href="/company" data-key="company">
    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16"/><path d="M15 10h3a1 1 0 0 1 1 1v10"/><path d="M8 8h2M8 12h2M8 16h2"/></svg>
    <span>会社概要</span>
  </a>
  <a href="/contact" data-key="contact">
    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
    <span>お問い合わせ</span>
  </a>
</nav>
```

### JS（現在ページをアクティブに。ルートは本番に合わせて調整）
```html
<script>
(function(){
  var path = location.pathname.replace(/\/$/, '') || '/';
  var map = { '/':'home', '/business':'business', '/recruit':'recruit', '/company':'company', '/contact':'contact' };
  var key = map[path];
  if (key) {
    var el = document.querySelector('.nv-tabbar a[data-key="'+key+'"]');
    if (el) el.classList.add('active');
  }
}());
</script>
```

---

## 7. React / Next.js の場合（App Router 例）
```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/',         key: 'home',     label: 'ホーム',      icon: <><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></> },
  { href: '/business', key: 'business', label: '事業紹介',    icon: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/></> },
  { href: '/recruit',  key: 'recruit',  label: '採用情報',    icon: <><path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="8" r="4"/></> },
  { href: '/company',  key: 'company',  label: '会社概要',    icon: <><path d="M3 21h18"/><path d="M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16"/><path d="M15 10h3a1 1 0 0 1 1 1v10"/><path d="M8 8h2M8 12h2M8 16h2"/></> },
  { href: '/contact',  key: 'contact',  label: 'お問い合わせ', icon: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></> },
];

export default function MobileTabBar() {
  const path = (usePathname() || '/').replace(/\/$/, '') || '/';
  return (
    <nav className="nv-tabbar" aria-label="メインナビゲーション">
      {items.map(it => (
        <Link key={it.key} href={it.href} className={path === it.href ? 'active' : ''}>
          <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">{it.icon}</svg>
          <span>{it.label}</span>
        </Link>
      ))}
    </nav>
  );
}
```
- `<MobileTabBar />` は**最上位レイアウト（body直下相当）に配置**。ヘッダー(backdrop-filter有り)の中には入れない。
- 上記CSSをグローバルCSSに追加。`body { padding-bottom: 62px }` はスマホ時のみ。
- Google Fonts で `Zen Maru Gothic` を読み込むこと。

---

## 8. チェックリスト（受け入れ確認）
- [ ] スマホ幅（≤767px）で画面下にタブバーが固定表示される
- [ ] PC幅（≥768px）ではタブバーが出ない（上部ナビのまま）
- [ ] スクロールしてもバーが下に固定され続ける
- [ ] 現在ページのタブがアクティブ色 `#6f9fc1` になる
- [ ] 本文の一番下がバーに隠れない（余白OK）
- [ ] iPhoneのホームバー/ノッチと重ならない（safe-area）
- [ ] 横スクロールが発生しない
