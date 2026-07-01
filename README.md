# Handoff: NewValley（ニューバリー）コーポレートHP

## Overview
神奈川県大和市・東京都町田市を拠点とする障害福祉会社「NewValley（ニューバリー）」のコーポレートHP兼採用サイト。
参考サイト: https://recruit.life-design.okinawa/  
現行HP: https://www.newvalleyhp.com/

5ページ構成（トップ / 事業紹介 / 採用情報 / 会社概要 / エントリー）＋共通Header・Footer。

## About the Design Files
このフォルダ内の `.dc.html` ファイルは **HTMLで制作したハイファイデザインプロトタイプ** です。本番コードとして直接使用するのではなく、ターゲットコードベース（WordPress / React / Next.js 等）の環境に合わせて **デザインを参照しながら再実装** してください。

## Fidelity
**High-fidelity（ハイファイ）**: カラー・タイポグラフィ・スペーシング・インタラクションすべて最終仕様に近い状態です。ピクセル単位での忠実な再現を目指してください。

---

## Pages / Screens

### 1. トップページ（index）

#### Hero セクション（最重要）
- **レイアウト**: 全幅。`uploads/nv-tree.png`（1536×1024px）をフルワイド表示し、その上に透明なホットスポットdivを `position:absolute` で重ねる
- **ホットスポット**: 7か所（下表参照）。各Blobの形に合わせた `border-radius:50%` or `14px` の透明div
- **パネル**: ホバー時に右からスライドインするパネル（幅420px）。`position:absolute; right:0; top:0; bottom:0`
  - パネルが出ると右側のホットスポットが隠れる問題あり（**要修正**: パネル表示中は右端のホットスポット位置を左にシフトするか、パネルをページ外レイヤーに持つ設計を推奨）
- **ヒントピル**: `position:absolute; bottom:22px; left:50%` に「各事業の葉にカーソルを…」テキスト

#### ホットスポット座標（1536×1024画像基準 → %指定）
| ID | 事業所 | left | top | width | height | shape |
|----|--------|------|-----|-------|--------|-------|
| B0 | えみたすサポート（緑） | 19.5% | 42% | 23.4% | 35.2% | ellipse |
| B1 | マーチ（ピンク・最大） | 45.6% | 24.4% | 28.6% | 43% | ellipse |
| B2 | びよんど（青紫） | 70.3% | 30.8% | 24.1% | 36.1% | ellipse |
| B3 | クラージュ（ティール） | 15.6% | 64% | 23.4% | 35.2% | ellipse |
| B4 | エックスモバイル（オリーブ） | 49.5% | 67.9% | 21.5% | 32.2% | ellipse |
| B5 | DX/IT（紫） | 78.1% | 55.2% | 22.8% | 34.2% | ellipse |
| B6 | 生活介護・GH（珊瑚・破線） | 81.7% | 79.1% | 13% | 16.1% | rounded rect |

> 各divは `transform: translate(-50%, -50%)` を適用（left/topが中心座標になるよう）

#### スライドパネルのデータ
```js
const businesses = [
  {
    id: 'emitas',
    name: 'えみたすサポート',
    tag: '相談支援事業',
    subtitle: '相談支援・計画相談',
    color: '#3a6b30',
    grad: 'linear-gradient(135deg, #6f9e5a, #3a6b30)',
    area: '大和・町田エリア',
    access: '大和市・町田市内',
    desc: '一人ひとりに寄り添い、安心できる未来へつなぐ相談支援。福祉サービスの利用計画づくりや日常の相談対応を丁寧に行います。',
  },
  {
    id: 'march',
    name: '放課後等デイサービス マーチ',
    tag: '放デイ',
    subtitle: '子どもたちの「できた！」を育む',
    color: '#c86880',
    grad: 'linear-gradient(135deg, #f0a8b8, #c86880)',
    area: '大和市中央1-7-20 / 町田市金森3-23-1',
    access: '大和駅・成瀬駅より各アクセス',
    desc: '子どもたちの「できた！」を育み、笑顔の毎日をサポート。運動特化型のプログラムで身体を動かしながら自信をつけていきます。',
  },
  {
    id: 'beyond',
    name: '放課後等デイサービス びよんど',
    tag: '放デイ',
    subtitle: 'その子らしさを大切に',
    color: '#6878b8',
    grad: 'linear-gradient(135deg, #98a8d8, #6878b8)',
    area: '〒242-0023 大和市渋谷5-19-6',
    access: '小田急 高座渋谷駅より徒歩約2分',
    desc: 'その子らしさを大切に、可能性を広げる支援を。自立支援型の放課後等デイサービス。',
  },
  {
    id: 'courage',
    name: '訪問介護 クラージュ',
    tag: '訪問介護',
    subtitle: 'ご自宅での暮らしを支える',
    color: '#3a9090',
    grad: 'linear-gradient(135deg, #60c0c0, #3a9090)',
    area: '〒194-0012 町田市金森3-23-1-2F',
    access: 'JR横浜線 成瀬駅より徒歩約18分',
    desc: 'ご自宅での暮らしを支えるやさしく、あたたかな介護。障がいに特化した訪問介護。',
  },
  {
    id: 'xmobile',
    name: 'エックスモバイル大和桜ヶ丘駅前店',
    tag: 'モバイル事業',
    subtitle: '通信のチカラで、暮らしもビジネスも',
    color: '#808820',
    grad: 'linear-gradient(135deg, #c0c840, #808820)',
    area: '大和市桜ヶ丘（大和桜ヶ丘駅前）',
    access: '小田急 大和桜ヶ丘駅前',
    desc: '通信のチカラで、暮らしもビジネスももっと快適に。地域密着型の携帯ショップ。',
  },
  {
    id: 'dx',
    name: 'DX / IT デザイン事業',
    tag: 'DX・IT',
    subtitle: '未来をつくるパートナーに',
    color: '#7850a8',
    grad: 'linear-gradient(135deg, #a878d0, #7850a8)',
    area: '大和市・町田市エリア',
    access: 'お問い合わせよりご相談ください',
    desc: '課題を見つけ、仕組みで解決するDXとデザインのチカラで未来をつくるパートナーに。',
  },
  {
    id: 'gh',
    name: '生活介護・GH事業',
    tag: '★ 展開予定',
    subtitle: '地域のニーズに応じた安心の場づくり',
    color: '#c88a5a',
    grad: 'linear-gradient(135deg, #dba878, #c88a5a)',
    area: '開設準備中',
    access: '詳細は決まり次第お知らせします',
    desc: '生活介護・グループホームの両面から地域での自立生活を支えます。',
  },
];
```

#### パネル構造
```
[パネル 幅420px, position:absolute, right:0, top:0, bottom:0]
  ├── [カラーヘッダー 高さ220px, background: grad]
  │     ├── タグピル (top:18px left:22px)
  │     ├── ✕閉じるボタン (top:18px right:22px)
  │     └── 事業所名テキスト (bottom:14px left:22px)
  └── [コンテンツエリア padding:28px 30px]
        ├── カラーアクセントバー (40px×5px, border-radius:999px)
        ├── 事業所名 h3 (22px, font-weight:900)
        ├── サブタイトル (12px, color:current.color)
        ├── 説明文 (13px, line-height:2)
        ├── 住所 📍 (12px, color:#8a8276)
        ├── アクセス 🚃 (12px, color:#8a8276)
        └── 詳しく見るボタン (青, 自己align-self:flex-start)
```

#### パネルのアニメーション仕様
- **表示**: `transform: translateX(0)`, `opacity: 1`
- **非表示**: `transform: translateX(28px)`, `opacity: 0`, `pointer-events: none`
- **transition**: `transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1)`, `opacity 0.35s ease`
- **トリガー**: ホットスポットにhover → パネル表示、パネル外にmouseleaveから200ms後 → 閉じる（パネル自体にhoverすると閉じないよう `clearTimeout` で制御）

#### お知らせセクション
- 背景: `#faf7f0`, padding: `72px 44px`
- max-width: `920px`
- カード: `background:#fff; border-radius:16px; box-shadow:0 4px 18px rgba(67,51,42,.06)`
- 各行: flex, gap:18px, padding:18px 24px, border-bottom:1px solid #f0e8d8
- 日付: Quicksand 600 13px `#a99c8f` min-width:76px
- タグピル: Zen Maru Gothic 700 11px, 背景色は種別ごと, border-radius:999px, padding:3px 10px
- テキスト: Noto Sans JP 14px `#43332a` line-height:1.6

#### ABOUT USセクション
- 背景: `#fff`, padding: `88px 44px`, text-align:center, max-width:920px
- h2: Zen Maru Gothic 700 34px line-height:1.6 `#43332a`
- p: 16px line-height:2.1 `#6b6358`

#### 事業紹介セクション（カードグリッド）
- 背景: `#faf7f0`, padding: `88px 44px`
- グリッド: `grid-template-columns: repeat(3, 1fr)`, gap:20px
- カード: background:#fff, border-radius:18px, overflow:hidden
  - カラーバナー: height:110px, グラデ背景
  - border-top:5px solid [accent color]
  - hover: translateY(-4px), box-shadow強化
- 最後のカード（生活介護・GH）: border:2px dashed #c88a5a, opacity:.85

#### 関連事業セクション
- 背景: `#fef9f0`, padding: `88px 44px`
- グリッド: 3カラム, gap:24px
- カード: background:#fff, border-radius:18px, padding:28px
  - アイコン: 52×52px, border-radius:14px, グラデ背景
  - カテゴリラベル: 11px, letter-spacing:.08em
  - h3: 17px font-weight:900
  - 説明文: 13px line-height:1.85 `#8a8276`
  - 外部リンク: 「サイトを見る →」

#### RECRUITセクション
- 背景: `#6f9e5a`, padding: `88px 44px`
- flex layout: テキスト + 写真プレースホルダー(360×240px)
- h2: Zen Maru Gothic 900 32px `#fff`

#### CTA（最下部）
- 背景: `#43332a`, padding: `80px 44px`, text-align:center
- エントリーボタン: `#d6e06a` → `#43332a` テキスト
- LINEボタン: `#06C755`

---

### 2. 事業紹介ページ（business.dc.html）
`business.dc.html` を参照。各事業所のカード詳細ページ。

### 3. 採用情報ページ（recruit.dc.html）
`recruit.dc.html` を参照。募集要項・福利厚生・エントリーフォームへの誘導。

### 4. 会社概要ページ（company.dc.html）
`company.dc.html` を参照。会社情報テーブル・ミッション。

### 5. エントリーページ（entry.dc.html）
`entry.dc.html` を参照。採用エントリーフォーム。

---

## Interactions & Behavior

### Hoverパネル（Hero）
```
1. ユーザーがホットスポットにhover
2. clearTimeout(closeTimer)
3. setState({ active: blobIndex })
4. パネルが右からスライドイン（transform + opacity transition）
5. ユーザーがホットスポットエリアを離れる → setTimeout(200ms) → setState({ active: null })
6. ユーザーがパネル自体にhover → clearTimeout → パネル維持
7. パネルにmouseleave → setTimeout(200ms) → 閉じる
8. ✕ボタンclick → 即座に閉じる
```

### カードホバー
- 全カード: `transform: translateY(-4px)` + `box-shadow` 強化
- transition: `0.15s`

### ナビゲーション（sticky header）
- `position: sticky; top: 0; z-index: 50`
- `background: rgba(250,247,240,.92); backdrop-filter: blur(10px)`
- ボーダーボトム: `1px solid #ece4d4`

---

## State Management
```js
// Hero セクション
state = {
  active: null,    // 現在アクティブなblob index (null = パネル非表示)
  last: 0,         // 最後にアクティブだったindex（パネル内容のちらつき防止）
}
closeTimer = null; // mouseLeaveのdelay用タイマー
```

---

## Design Tokens

### Colors
```css
/* Brand */
--nv-brown-dark:    #43332a;  /* テキスト・背景 */
--nv-brown-mid:     #6b6358;  /* ボディテキスト */
--nv-brown-light:   #8a8276;  /* サブテキスト */
--nv-cream:         #faf7f0;  /* ページ背景 */
--nv-cream-warm:    #fef9f0;  /* 関連事業背景 */
--nv-border:        #f0e8d8;  /* ボーダー */

/* Primary */
--nv-blue:          #6f9fc1;  /* メインアクセント */
--nv-blue-dark:     #5a89ab;  /* ボタンシャドウ */

/* Businesses */
--march-green:      #8faa2e;  /* マーチ大和 */
--march-lime:       #b8c235;  /* マーチ町田 */
--march-pink:       #c86880;  /* マーチ（tree blob） */
--beyond-blue:      #6878b8;  /* びよんど */
--courage-teal:     #3a9090;  /* クラージュ */
--emitas-green:     #3a6b30;  /* えみたす */
--xmobile-olive:    #808820;  /* エックスモバイル */
--dx-purple:        #7850a8;  /* DX/IT */
--gh-coral:         #c88a5a;  /* 生活介護・GH（予定） */

/* CTA */
--cta-lime:         #d6e06a;  /* メインCTAボタン */
--cta-lime-shadow:  #b9c44f;
--line-green:       #06C755;
--line-shadow:      #059440;
```

### Typography
```css
/* Font families */
font-family: 'Zen Maru Gothic', sans-serif;   /* 見出し・ボタン・ブランド */
font-family: 'Noto Sans JP', sans-serif;       /* ボディ・説明文 */
font-family: 'Quicksand', sans-serif;          /* 英語アクセント・ラベル */

/* Scale */
h1 hero:      46px / font-weight:900 / line-height:1.5
h2 section:   32–34px / font-weight:700 / line-height:1.5–1.6
h3 card:      16–22px / font-weight:900
label:        11–13px / font-weight:700 / letter-spacing:.08–.22em
body:         13–16px / font-weight:400–500 / line-height:1.85–2.1
caption:      11–12px / color:#8a8276 or #a99c8f
```

### Spacing
```css
section-padding:     88px 44px  (主要セクション)
section-padding-sm:  72px 44px  (ニュース)
max-width-content:   1120px
max-width-narrow:    920px
card-padding:        18px
card-padding-lg:     28px
card-gap:            20px (business grid) / 24px (related)
```

### Borders & Shadows
```css
border-radius-card:   18px
border-radius-pill:   999px
border-radius-icon:   14px
border-radius-sm:     16px

shadow-card:          0 6px 18px rgba(67,51,42,.06)
shadow-card-hover:    0 12px 28px rgba(67,51,42,.10)
shadow-card-sm:       0 4px 14px rgba(67,51,42,.06)
shadow-panel:         -18px 0 50px rgba(0,0,0,.22)
shadow-btn-blue:      0 4px 0 #5a89ab
shadow-btn-lime:      0 5px 0 #b9c44f
shadow-btn-line:      0 5px 0 #059440
```

---

## Assets

| ファイル | 説明 |
|----------|------|
| `uploads/nv-tree.png` | Heroイラスト（1536×1024px）。各Blobが事業所を表すカラフルなツリー |
| `uploads/ニューバリーロゴ.png` | 会社ロゴ PNG |
| `uploads/ニューバリーロゴ 1.jpeg` | 会社ロゴ JPEG |
| `assets/newvalley-logo.png` | Header用ロゴ（height:50px） |
| `hero-bg.mp4` | （未実装）Heroの動画背景。用意でき次第追加 |

---

## External Links
| 用途 | URL |
|------|-----|
| 現行HP | https://www.newvalleyhp.com/ |
| ブログ/お知らせ | https://www.newvalleyhp.com/ブログ/ |
| 採用専用サイト | https://newvalley-recruit.com/ |
| LINE公式 | https://line.me/R/ti/p/@296dkcwv |
| リフルカレッジ | http://www.liful-college.com/ |
| エックスモバイル | https://www.xmobile-yamatosakuragaoka.com/ |
| コカローチG大学 | https://cockroach.shopselect.net/ |

---

## Files in This Package

| ファイル | 内容 |
|----------|------|
| `index.dc.html` | トップページ（Hero+ホットスポット+全セクション） |
| `Header.dc.html` | 共通ヘッダー（sticky, glassmorphism） |
| `Footer.dc.html` | 共通フッター（3カラム） |
| `business.dc.html` | 事業紹介ページ |
| `recruit.dc.html` | 採用情報ページ |
| `company.dc.html` | 会社概要ページ |
| `entry.dc.html` | エントリーフォームページ |
| `uploads/nv-tree.png` | Heroイラスト |
| `uploads/ニューバリーロゴ.png` | ロゴ |

## Known Issues / 要対応事項

1. **パネルが右側ホットスポットを隠す問題**: パネル（幅420px）が表示されると右側のBlob（B2:びよんど, B5:DX/IT, B6:GH）が操作できなくなる。推奨対応: パネルをbody直下の固定要素として配置し、ツリー画像のz-layerから分離する
2. **レスポンシブ未対応**: 現在デスクトップ専用レイアウト。スマホ対応時はホットスポット方式をタップ可能なリストUI等に変更を推奨
3. **動画背景**: `hero-bg.mp4` 未実装。動画が用意でき次第、`<video autoplay muted loop playsinline>` として追加
4. **写真プレースホルダー**: RECRUITセクション・COMPANYセクションに写真プレースホルダーあり。実写に差し替え必要
