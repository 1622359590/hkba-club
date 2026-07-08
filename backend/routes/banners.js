const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getDb } = require('../db/init');
// 公开：获取所有活跃 banner
router.get('/', (req, res) => {
  const db = getDb();
  const banners = db.prepare('SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order ASC').all();
  res.json(banners);
});

// 管理：获取所有 banner
router.get('/all', authMiddleware, (req, res) => {
  const db = getDb();
  const banners = db.prepare('SELECT * FROM banners ORDER BY sort_order ASC').all();
  res.json(banners);
});

// 创建
router.post('/', authMiddleware, (req, res) => {
  const { title_zh, title_en, subtitle_zh, subtitle_en, description_zh, description_en, image_url, link_url, video_url, sort_order, is_active } = req.body;
  const db = getDb();
  const result = db.prepare(
    'INSERT INTO banners (title_zh, title_en, subtitle_zh, subtitle_en, description_zh, description_en, image_url, link_url, video_url, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(title_zh || '', title_en || '', subtitle_zh || '', subtitle_en || '', description_zh || '', description_en || '', image_url, link_url || '', video_url || '', sort_order || 0, is_active !== undefined ? is_active : 1);
  res.json({ id: result.lastInsertRowid, success: true });
});

// 更新
router.put('/:id', authMiddleware, (req, res) => {
  const { title_zh, title_en, subtitle_zh, subtitle_en, description_zh, description_en, image_url, link_url, video_url, sort_order, is_active } = req.body;
  const db = getDb();
  db.prepare(
    'UPDATE banners SET title_zh=?, title_en=?, subtitle_zh=?, subtitle_en=?, description_zh=?, description_en=?, image_url=?, link_url=?, video_url=?, sort_order=?, is_active=? WHERE id=?'
  ).run(title_zh || '', title_en || '', subtitle_zh || '', subtitle_en || '', description_zh || '', description_en || '', image_url, link_url || '', video_url || '', sort_order || 0, is_active !== undefined ? is_active : 1, req.params.id);
  res.json({ success: true });
});

// 删除
router.delete('/:id', authMiddleware, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM banners WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// 排序
router.post('/reorder', authMiddleware, (req, res) => {
  const { orders } = req.body; // [{id, sort_order}]
  const db = getDb();
  const stmt = db.prepare('UPDATE banners SET sort_order = ? WHERE id = ?');
  for (const item of orders) {
    stmt.run(item.sort_order, item.id);
  }
  res.json({ success: true });
});

module.exports = router;
