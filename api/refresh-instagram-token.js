/**
 * Instagram アクセストークン自動更新
 *
 * Vercel Cron から毎月1日 09:00 JST に呼び出される。
 * 処理フロー:
 *   1. Instagram Graph API でトークンを更新（長期トークンは更新すると新しい60日トークンが返る）
 *   2. Vercel API で INSTAGRAM_ACCESS_TOKEN 環境変数を上書き
 *   3. Deploy Hook で本番を再デプロイ → 新しいトークンが即時反映
 *
 * 必要な環境変数 (Vercel Settings > Environment Variables に設定):
 *   INSTAGRAM_ACCESS_TOKEN   - 現在のトークン（更新後に自動上書きされる）
 *   VERCEL_API_TOKEN         - Vercel 個人アクセストークン（Account Settings > Tokens）
 *   VERCEL_PROJECT_ID        - プロジェクト ID（Vercel ダッシュボード > Settings > General）
 *   VERCEL_TEAM_ID           - チーム ID（個人アカウントの場合は空文字でOK）
 *   VERCEL_DEPLOY_HOOK_URL   - Deploy Hook URL（Settings > Git > Deploy Hooks で作成）
 *   CRON_SECRET              - Vercel が自動で生成・注入するシークレット（手動設定不要）
 */

export default async function handler(req, res) {
  /* Vercel Cron は Authorization: Bearer {CRON_SECRET} を自動で付与する */
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!currentToken) {
    return res.status(500).json({ error: 'INSTAGRAM_ACCESS_TOKEN not set' });
  }

  const log = [];

  try {
    /* ── Step 1: Instagram でトークンを更新 ── */
    const igUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`;
    const igRes = await fetch(igUrl);
    const igData = await igRes.json();

    if (!igData.access_token) {
      return res.status(500).json({
        error: 'Instagram refresh failed',
        detail: igData,
        log
      });
    }

    const newToken = igData.access_token;
    const expiresInDays = Math.floor((igData.expires_in || 0) / 86400);
    log.push(`✅ Token refreshed (expires in ~${expiresInDays} days)`);

    /* ── Step 2: Vercel API で環境変数を更新 ── */
    const vercelApiToken = process.env.VERCEL_API_TOKEN;
    const projectId      = process.env.VERCEL_PROJECT_ID;
    const teamId         = process.env.VERCEL_TEAM_ID || '';

    if (vercelApiToken && projectId) {
      const qs = teamId ? `?teamId=${teamId}` : '';

      /* 既存の env var 一覧を取得して ID を探す */
      const listRes = await fetch(
        `https://api.vercel.com/v9/projects/${projectId}/env${qs}`,
        { headers: { Authorization: `Bearer ${vercelApiToken}` } }
      );
      const listData = await listRes.json();
      const envVar = (listData.envs || []).find(e => e.key === 'INSTAGRAM_ACCESS_TOKEN');

      if (envVar) {
        const patchRes = await fetch(
          `https://api.vercel.com/v9/projects/${projectId}/env/${envVar.id}${qs}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${vercelApiToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ value: newToken })
          }
        );
        const patchData = await patchRes.json();
        log.push(patchData.key ? '✅ Vercel env var updated' : `⚠️ Patch response: ${JSON.stringify(patchData)}`);
      } else {
        log.push('⚠️ INSTAGRAM_ACCESS_TOKEN env var not found in project');
      }
    } else {
      log.push('⚠️ VERCEL_API_TOKEN or VERCEL_PROJECT_ID not set — skipping env update');
    }

    /* ── Step 3: Deploy Hook で再デプロイ ── */
    const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
    if (deployHookUrl) {
      await fetch(deployHookUrl, { method: 'POST' });
      log.push('✅ Redeploy triggered via Deploy Hook');
    } else {
      log.push('⚠️ VERCEL_DEPLOY_HOOK_URL not set — new token will apply on next manual deploy');
    }

    return res.json({ success: true, log });

  } catch (e) {
    return res.status(500).json({ error: e.message, log });
  }
}
