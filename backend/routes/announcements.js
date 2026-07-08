const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getDb } = require('../db/init');
router.get('/', (req, res) => {
  const db = getDb();
  const items = db.prepare('SELECT * FROM announcements WHERE is_active = 1 ORDER BY sort_order ASC').all();
  res.json(items);
});

router.get('/all', authMiddleware, (req, res) => {
  const db = getDb();
  const items = db.prepare('SELECT * FROM announcements ORDER BY sort_order ASC').all();
  res.json(items);
});

router.post('/', authMiddleware, (req, res) => {
  const { content_zh, content_en, link_url, is_active, sort_order } = req.body;
  const db = getDb();
  const result = db.prepare(
    'INSERT INTO announcements (content_zh, content_en, link_url, is_active, sort_order) VALUES (?, ?, ?, ?, ?)'
  ).run(content_zh || '', content_en || '', link_url || '', is_active !== undefined ? is_active : 1, sort_order || 0);
  res.json({ id: result.lastInsertRowid, success: true });
});

router.put('/:id', authMiddleware, (req, res) => {
  const { content_zh, content_en, link_url, is_active, sort_order } = req.body;
  const db = getDb();
  db.prepare(
    'UPDATE announcements SET content_zh=?, content_en=?, link_url=?, is_active=?, sort_order=? WHERE id=?'
  ).run(content_zh || '', content_en || '', link_url || '', is_active !== undefined ? is_active : 1, sort_order || 0, req.params.id);
  res.json({ success: true });
});

router.delete('/:id', authMiddleware, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM announcements WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
