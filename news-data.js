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
