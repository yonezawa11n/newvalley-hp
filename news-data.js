/* ============================================================
   お知らせ データファイル
   新しい記事は先頭に追加してください。

   フィールド:
     id       : 一意のID（URLに使用）
     date     : 'YYYY-MM-DD' 形式
     category : カテゴリ名
     title    : 記事タイトル
     excerpt  : 一覧に表示する概要文（100〜150字程度）
     image    : サムネイル画像パス（省略可）
     body     : 記事本文（HTML可）
============================================================ */

var NEWS_DATA = [
  {
    id: 'halloween-2026',
    date: '2026-10-30',
    category: 'イベント',
    title: '1日前ハロウィンを開催しました',
    excerpt: '今年のハロウィン当日（10/31）は土曜日で本部がお休みのため、1日前の10月30日にハロウィンを開催しました。仮装をして、いつもお世話になっている方へおやつを配ったり、事業所をまわったりしました。',
    image: 'uploads/oshirase/halloween2026-main.jpg',
    body: `
      <p style="font-size:15px;line-height:2.0;color:#6b6358;">今年のハロウィン当日（10月31日）は土曜日で、本部はお休み。<br>ということで、NewValley は<strong>1日前の10月30日にハロウィン</strong>を開催しました🎃</p>
      <p style="font-size:15px;line-height:2.0;color:#6b6358;">朝のオンライン会議からみんな仮装で参加。この日のお仕事は「お菓子詰め」からスタートです。</p>
      <div style="max-width:300px;margin:20px auto;"><img src="uploads/oshirase/halloween2026-okashi.jpg" alt="お菓子詰めの様子" style="width:100%;height:auto;border-radius:14px;display:block;" loading="lazy"></div>

      <h3 style="font-family:'Zen Maru Gothic',sans-serif;font-weight:900;font-size:18px;color:#43332a;margin:36px 0 12px;">いつもお世話になっている方へ</h3>
      <p style="font-size:15px;line-height:2.0;color:#6b6358;">仮装のまま、いつもお世話になっている不動産屋さん・整骨院さん・近所のお店へおやつを配りにまわりました。整骨院さんとは一緒に動画撮影、お店では逆におやつをいただいてしまいました。ありがとうございました！</p>
      <div style="max-width:300px;margin:20px auto;"><img src="uploads/oshirase/halloween2026-seikotsu.jpg" alt="整骨院さんと一緒に" style="width:100%;height:auto;border-radius:14px;display:block;" loading="lazy"></div>

      <h3 style="font-family:'Zen Maru Gothic',sans-serif;font-weight:900;font-size:18px;color:#43332a;margin:36px 0 12px;">事業所めぐり</h3>
      <p style="font-size:15px;line-height:2.0;color:#6b6358;">マーチ大和では、スタッフのみんなが笑顔で迎えてくれました。放課後等デイサービス びよんど にもおじゃましました。しょうが人形の正体は…ちょっと明かせません🤫</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:560px;margin:20px auto;"><img src="uploads/oshirase/halloween2026-march.jpg" alt="マーチ大和のスタッフ" style="width:100%;height:auto;border-radius:14px;display:block;" loading="lazy"><img src="uploads/oshirase/halloween2026-biyondo.jpg" alt="びよんどにて" style="width:100%;height:auto;border-radius:14px;display:block;" loading="lazy"></div>

      <h3 style="font-family:'Zen Maru Gothic',sans-serif;font-weight:900;font-size:18px;color:#43332a;margin:36px 0 12px;">最後は高座渋谷駅へ</h3>
      <div style="max-width:300px;margin:20px auto;"><img src="uploads/oshirase/halloween2026-station.jpg" alt="高座渋谷駅にて" style="width:100%;height:auto;border-radius:14px;display:block;" loading="lazy"></div>

      <div style="background:#faf7f0;border-radius:16px;padding:24px 28px;margin:32px 0;">
        <p style="font-size:15px;line-height:2.0;color:#6b6358;margin:0;">「イベントやろう！」と社長が積極的に盛り上げる会社です。<br>来年は<strong>放課後デイのスタッフも一緒に、大和市のハロウィンイベントに参加予定</strong>です🎃</p>
      </div>

      <p style="font-size:15px;line-height:2.0;color:#6b6358;">楽しく働く会社で、一緒に働きませんか？</p>
      <div style="text-align:center;margin:32px 0 0;">
        <a href="/careers/" style="display:inline-flex;align-items:center;gap:10px;text-decoration:none;font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:16px;color:#fff;background:#4a7a3f;padding:16px 36px;border-radius:999px;box-shadow:0 4px 0 #365c2e;">採用情報を見る →</a>
      </div>
    `
  },
  {
    id: 'waku-award-2026',
    date: '2026-02-23',
    category: 'お知らせ',
    title: '大和市よりワーク・ライフ・バランス推進企業として表彰されました',
    excerpt: '令和7年度 大和市女性活躍及びワーク・ライフ・バランス推進企業表彰において、株式会社 New Valley が選考されました。令和7年11月21日の大和市産業人表彰式にて、大和市長より表彰状と記念品が贈られました。',
    image: 'uploads/oshirase/大和市より-ワークバランス推進企業として表彰.jpg',
    body: `
      <p style="font-size:15px;line-height:2.0;color:#6b6358;">令和7年度 大和市女性活躍及びワーク・ライフ・バランス推進企業表彰において、株式会社 New Valley が選考されました。</p>
      <p style="font-size:15px;line-height:2.0;color:#6b6358;">令和7年11月21日（金）に開催した大和市産業人表彰式にて、大和市長より表彰状と記念品が贈られました。</p>

      <div style="background:#faf7f0;border-radius:16px;padding:24px 28px;margin:28px 0;">
        <h3 style="font-family:'Zen Maru Gothic',sans-serif;font-weight:900;font-size:17px;color:#43332a;margin:0 0 14px;">評価いただいた取り組み</h3>
        <ul style="font-size:15px;line-height:2.0;color:#6b6358;margin:0;padding-left:20px;">
          <li>多様性を受け入れる風土</li>
          <li>リラクゼーション支援制度（事業所でのマッサージ施術料無料、理美容代の補助等）</li>
          <li>資格取得支援制度</li>
          <li>家庭都合による復職制度</li>
        </ul>
      </div>

      <p style="font-size:14px;line-height:2.0;color:#6b6358;">今後もスタッフが働きやすい職場環境づくりに取り組んでまいります。</p>

      <p style="font-size:13px;color:#a99c8f;margin-top:28px;">出典：わくわくWAKU（男女共同参画社会を目指す情報誌） MAR 2026 Volume38</p>
    `
  },
  {
    id: 'training-qualification-2025',
    date: '2026-06-26',
    category: '採用情報',
    title: '社内研修で各種資格取得できます',
    excerpt: '当社では在職中に強度行動障がい（行動援護）・同行援護などの資格取得を支援しています。資格がなくても研修生として働きながら取得を目指せます。',
    image: '',
    body: `
      <h2 style="font-family:'Zen Maru Gothic',sans-serif;font-weight:900;font-size:22px;color:#43332a;margin:0 0 8px;">社内研修で各種資格取得できます</h2>

      <div style="background:#faf7f0;border-radius:16px;padding:28px 32px;margin:32px 0;">
        <h3 style="font-family:'Zen Maru Gothic',sans-serif;font-weight:900;font-size:18px;color:#43332a;margin:0 0 14px;">強度行動障害（行動援護）</h3>
        <p style="font-size:15px;line-height:2.0;color:#6b6358;margin:0;">行動援護と呼び方が２通りあります。対象者への支援は同じです。<br>当社ではよりカリキュラムの濃い<strong>強度行動障がいの資格取得</strong>を目指します。</p>
      </div>

      <div style="background:#faf7f0;border-radius:16px;padding:28px 32px;margin:32px 0;">
        <h3 style="font-family:'Zen Maru Gothic',sans-serif;font-weight:900;font-size:18px;color:#43332a;margin:0 0 14px;">同行援護</h3>
        <p style="font-size:15px;line-height:2.0;color:#6b6358;margin:0;">視覚障がい者の支援に必要な資格です。</p>
      </div>

      <div style="background:#fff8f0;border:2px solid #e8c898;border-radius:16px;padding:28px 32px;margin:32px 0;">
        <p style="font-size:15px;line-height:2.0;color:#6b6358;margin:0;">資格がなくても<strong>研修生としてお仕事可能</strong>です。<br>その間に初任者などの資格取得を目指します。<br>取得と現場の両輪でより実務的な能力が身に付きます。</p>
      </div>

      <div style="text-align:center;margin:40px 0 0;">
        <p style="font-size:14px;color:#a99c8f;margin:0 0 18px;">研修はリフルカレッジで受講できます</p>
        <a href="https://www.liful-college.com/" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:10px;text-decoration:none;font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:16px;color:#fff;background:#4a7a3f;padding:16px 36px;border-radius:999px;box-shadow:0 4px 0 #365c2e;">リフルカレッジのサイトへ →</a>
      </div>
    `
  },
  {
    id: 'welcome-2025',
    date: '2026-06-26',
    category: 'お知らせ',
    title: 'ニューバリー公式サイトをリニューアルしました',
    excerpt: '株式会社ニューバリーの公式ウェブサイトをリニューアルしました。各事業所の情報や採用情報を随時更新してまいります。ぜひお気軽にご覧ください。',
    image: 'uploads/company.jpg',
    body: `
      <p>株式会社ニューバリーの公式ウェブサイトをリニューアルしました。</p>
      <p>各事業所（マーチ大和・マーチ町田・びよんど・クラージュ・えみたすサポート）の最新情報や、採用情報を随時更新してまいります。</p>
      <p>ご不明な点はLINEまたはお問い合わせフォームよりお気軽にご連絡ください。</p>
    `
  }
];

/* カテゴリカラーマップ */
var NEWS_CATEGORY_COLORS = {
  'お知らせ':   '#4a7a3f',
  '採用情報':   '#6f9fc1',
  'イベント':   '#c86880',
  '活動報告':   '#c88a5a',
  'スタッフ':   '#6878b8',
  'その他':     '#a99c8f'
};

function newsCategoryColor(cat) {
  return NEWS_CATEGORY_COLORS[cat] || '#a99c8f';
}

function newsFormatDate(str) {
  var d = new Date(str);
  return d.getFullYear() + '年' + (d.getMonth()+1) + '月' + d.getDate() + '日';
}

/* 投稿日から5日間は NEW を表示 */
function newsIsNew(dateStr) {
  if (!dateStr) return false;
  var p = String(dateStr).split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]);
  var t = new Date(); t.setHours(0, 0, 0, 0);
  var days = Math.round((t - d) / 86400000);
  return days >= 0 && days < 5;
}
function newsNewBadge(dateStr) {
  return newsIsNew(dateStr) ? '<span style="flex:none;font-family:\'Quicksand\',sans-serif;font-weight:700;font-size:11px;letter-spacing:.06em;color:#fff;background:#e0564a;padding:2px 9px;border-radius:999px;line-height:1.6;">NEW</span>' : '';
}
