const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getDb } = require('../db/init');
router.get('/', (req, res) => {
  const db = getDb();
  const items = db.prepare('SELECT * FROM events WHERE is_published = 1 ORDER BY event_date DESC').all();
  res.json(items);
});

router.get('/upcoming', (req, res) => {
  const db = getDb();
  const items = db.prepare("SELECT * FROM events WHERE is_published = 1 AND event_date >= date('now') ORDER BY event_date ASC").all();
  res.json(items);
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const item = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: '未找到' });
  res.json(item);
});

router.get('/admin/all', authMiddleware, (req, res) => {
  const db = getDb();
  const items = db.prepare('SELECT * FROM events ORDER BY event_date DESC').all();
  res.json(items);
});

router.post('/', authMiddleware, (req, res) => {
  const { title_zh, title_en, description_zh, description_en, content_zh, content_en, cover_image, event_date, end_date, location_zh, location_en, max_attendees, registration_url, is_published } = req.body;
  const db = getDb();
  const result = db.prepare(
    `INSERT INTO events (title_zh, title_en, description_zh, description_en, content_zh, content_en, cover_image, event_date, end_date, location_zh, location_en, max_attendees, registration_url, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(title_zh||'', title_en||'', description_zh||'', description_en||'', content_zh||'', content_en||'', cover_image||'', event_date, end_date||null, location_zh||'', location_en||'', max_attendees||0, registration_url||'', is_published?1:0);
  res.json({ id: result.lastInsertRowid, success: true });
});

router.put('/:id', authMiddleware, (req, res) => {
  const { title_zh, title_en, description_zh, description_en, content_zh, content_en, cover_image, event_date, end_date, location_zh, location_en, max_attendees, registration_url, is_published } = req.body;
  const db = getDb();
  db.prepare(
    `UPDATE events SET title_zh=?, title_en=?, description_zh=?, description_en=?, content_zh=?, content_en=?, cover_image=?, event_date=?, end_date=?, location_zh=?, location_en=?, max_attendees=?, registration_url=?, is_published=? WHERE id=?`
  ).run(title_zh||'', title_en||'', description_zh||'', description_en||'', content_zh||'', content_en||'', cover_image||'', event_date, end_date||null, location_zh||'', location_en||'', max_attendees||0, registration_url||'', is_published?1:0, req.params.id);
  res.json({ success: true });
});

router.delete('/:id', authMiddleware, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
