/**
 * News Admin API — Vercel Blob ストレージ使用
 * GET  /api/news-admin          — 動的記事一覧
 * POST /api/news-admin          — 記事追加（パスワード必須）
 * DELETE /api/news-admin        — 記事削除（パスワード必須）
 *
 * 必要な環境変数:
 *   BLOB_READ_WRITE_TOKEN  — Vercel Blob 作成時に自動追加
 *   ADMIN_PASSWORD         — 管理者パスワード（手動設定）
 */

const BLOB_FILE = 'nv-news-articles.json';

async function readArticles(token) {
  try {
    // BlobストアのURLを一覧から検索
    const listRes = await fetch(
      `https://blob.vercel-storage.com?prefix=${BLOB_FILE}&limit=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const listData = await listRes.json();
    const blob = listData.blobs && listData.blobs[0];
    if (!blob) return [];
    const dataRes = await fetch(blob.url + '?cache=' + Date.now());
    if (!dataRes.ok) return [];
    return await dataRes.json();
  } catch (e) {
    return [];
  }
}

async function writeArticles(token, articles) {
  // 既存ファイルを削除してから新規作成（上書き保存）
  try {
    const listRes = await fetch(
      `https://blob.vercel-storage.com?prefix=${BLOB_FILE}&limit=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const listData = await listRes.json();
    const old = listData.blobs && listData.blobs[0];
    if (old) {
      await fetch('https://blob.vercel-storage.com/delete', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: [old.url] }),
      });
    }
  } catch (e) { /* ignore delete error */ }

  // 新規保存
  const putRes = await fetch(`https://blob.vercel-storage.com/${BLOB_FILE}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-add-random-suffix': '0',
      'x-cache-control-max-age': '0',
    },
    body: JSON.stringify(articles),
  });
  return await putRes.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
  const PASS  = process.env.ADMIN_PASSWORD || 'newvalley2025';

  if (!TOKEN) {
    return res.status(500).json({ error: 'Blob not configured. Please create a Vercel Blob store.' });
  }

  if (req.method === 'GET') {
    const articles = await readArticles(TOKEN);
    return res.json({ articles });
  }

  if (req.method === 'POST') {
    const { password, article } = req.body;
    if (password !== PASS) return res.status(401).json({ error: 'パスワードが違います' });
    const articles = await readArticles(TOKEN);
    articles.unshift(article);
    await writeArticles(TOKEN, articles);
    return res.json({ ok: true });
  }

  if (req.method === 'DELETE') {
    const { password, id } = req.body;
    if (password !== PASS) return res.status(401).json({ error: 'パスワードが違います' });
    const articles = await readArticles(TOKEN);
    await writeArticles(TOKEN, articles.filter(a => a.id !== id));
    return res.json({ ok: true });
  }

  // 記事更新: PATCH /api/news-admin  body: { password, id, article }
  if (req.method === 'PATCH') {
    const { password, id, article } = req.body;
    if (password !== PASS) return res.status(401).json({ error: 'パスワードが違います' });
    const articles = await readArticles(TOKEN);
    const idx = articles.findIndex(a => a.id === id);
    if (idx === -1) return res.status(404).json({ error: '記事が見つかりません' });
    articles[idx] = { ...articles[idx], ...article, id };
    await writeArticles(TOKEN, articles);
    return res.json({ ok: true });
  }

  // 画像アップロード: PUT /api/news-admin  body: { password, filename, base64 }
  if (req.method === 'PUT') {
    const { password, filename, base64 } = req.body;
    if (password !== PASS) return res.status(401).json({ error: 'パスワードが違います' });
    if (!filename || !base64) return res.status(400).json({ error: 'filename と base64 が必要です' });

    const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ error: 'base64形式が不正です' });
    const contentType = matches[1];
    const data = Buffer.from(matches[2], 'base64');

    const safeName = 'nv-uploads/' + Date.now() + '-' + filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const putRes = await fetch(`https://blob.vercel-storage.com/${safeName}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': contentType,
        'x-add-random-suffix': '0',
        'x-cache-control-max-age': '31536000',
      },
      body: data,
    });
    const putData = await putRes.json();
    if (!putData.url) return res.status(500).json({ error: '画像のアップロードに失敗しました', detail: putData });
    return res.json({ ok: true, url: putData.url });
  }

  return res.status(405).end();
}
