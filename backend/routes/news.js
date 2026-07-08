const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getDb } = require('../db/init');
// 公开：已发布新闻列表
router.get('/', (req, res) => {
  const db = getDb();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const category = req.query.category;
  const offset = (page - 1) * limit;

  let where = 'WHERE is_published = 1';
  const params = [];
  if (category) { where += ' AND category = ?'; params.push(category); }

  const total = db.prepare(`SELECT COUNT(*) as count FROM news ${where}`).get(...params).count;
  const items = db.prepare(`SELECT * FROM news ${where} ORDER BY published_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset);
  res.json({ items, total, page, limit, pages: Math.ceil(total / limit) });
});

// 公开：单篇新闻
router.get('/:id', (req, res) => {
  const db = getDb();
  const item = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: '未找到' });
  res.json(item);
});

// 管理：所有新闻
router.get('/admin/all', authMiddleware, (req, res) => {
  const db = getDb();
  const items = db.prepare('SELECT * FROM news ORDER BY created_at DESC').all();
  res.json(items);
});

router.post('/', authMiddleware, (req, res) => {
  const { title_zh, title_en, summary_zh, summary_en, content_zh, content_en, cover_image, category, tags, is_published } = req.body;
  const published_at = is_published ? new Date().toISOString() : null;
  const db = getDb();
  const result = db.prepare(
    `INSERT INTO news (title_zh, title_en, summary_zh, summary_en, content_zh, content_en, cover_image, category, tags, is_published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(title_zh||'', title_en||'', summary_zh||'', summary_en||'', content_zh||'', content_en||'', cover_image||'', category||'general', tags||'', is_published?1:0, published_at);
  res.json({ id: result.lastInsertRowid, success: true });
});

router.put('/:id', authMiddleware, (req, res) => {
  const { title_zh, title_en, summary_zh, summary_en, content_zh, content_en, cover_image, category, tags, is_published } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
  if (!existing) { return res.status(404).json({ error: '未找到' }); }

  const published_at = is_published && !existing.published_at ? new Date().toISOString() : existing.published_at;
  db.prepare(
    `UPDATE news SET title_zh=?, title_en=?, summary_zh=?, summary_en=?, content_zh=?, content_en=?, cover_image=?, category=?, tags=?, is_published=?, published_at=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
  ).run(title_zh||'', title_en||'', summary_zh||'', summary_en||'', content_zh||'', content_en||'', cover_image||'', category||'general', tags||'', is_published?1:0, published_at, req.params.id);
  res.json({ success: true });
});

router.delete('/:id', authMiddleware, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
