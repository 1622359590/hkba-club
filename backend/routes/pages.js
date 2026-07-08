const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getDb } = require('../db/init');
// 公开：按 slug 获取页面
router.get('/:slug', (req, res) => {
  const db = getDb();
  const page = db.prepare('SELECT * FROM pages WHERE slug = ?').get(req.params.slug);
  if (!page) return res.status(404).json({ error: '未找到' });
  res.json(page);
});

// 管理：获取所有页面
router.get('/', authMiddleware, (req, res) => {
  const db = getDb();
  const pages = db.prepare('SELECT * FROM pages ORDER BY slug').all();
  res.json(pages);
});

// 管理：更新页面
router.put('/:slug', authMiddleware, (req, res) => {
  const { title_zh, title_en, content_zh, content_en, meta_title_zh, meta_title_en, meta_desc_zh, meta_desc_en } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT id FROM pages WHERE slug = ?').get(req.params.slug);
  if (!existing) {
    // 创建新页面
    db.prepare(
      'INSERT INTO pages (slug, title_zh, title_en, content_zh, content_en, meta_title_zh, meta_title_en, meta_desc_zh, meta_desc_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(req.params.slug, title_zh||'', title_en||'', content_zh||'', content_en||'', meta_title_zh||'', meta_title_en||'', meta_desc_zh||'', meta_desc_en||'');
  } else {
    db.prepare(
      'UPDATE pages SET title_zh=?, title_en=?, content_zh=?, content_en=?, meta_title_zh=?, meta_title_en=?, meta_desc_zh=?, meta_desc_en=?, updated_at=CURRENT_TIMESTAMP WHERE slug=?'
    ).run(title_zh||'', title_en||'', content_zh||'', content_en||'', meta_title_zh||'', meta_title_en||'', meta_desc_zh||'', meta_desc_en||'', req.params.slug);
  }
  res.json({ success: true });
});

module.exports = router;
