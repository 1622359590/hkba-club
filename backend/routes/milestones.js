const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getDb } = require('../db/init');
router.get('/', (req, res) => {
  const db = getDb();
  const items = db.prepare('SELECT * FROM milestones WHERE is_active = 1 ORDER BY sort_order ASC').all();
  res.json(items);
});

router.get('/all', authMiddleware, (req, res) => {
  const db = getDb();
  const items = db.prepare('SELECT * FROM milestones ORDER BY sort_order ASC').all();
  res.json(items);
});

router.post('/', authMiddleware, (req, res) => {
  const { year, title_zh, title_en, description_zh, description_en, sort_order, is_active } = req.body;
  const db = getDb();
  const result = db.prepare('INSERT INTO milestones (year, title_zh, title_en, description_zh, description_en, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)').run(year, title_zh||'', title_en||'', description_zh||'', description_en||'', sort_order||0, is_active!==undefined?is_active:1);
  res.json({ id: result.lastInsertRowid, success: true });
});

router.put('/:id', authMiddleware, (req, res) => {
  const { year, title_zh, title_en, description_zh, description_en, sort_order, is_active } = req.body;
  const db = getDb();
  db.prepare('UPDATE milestones SET year=?, title_zh=?, title_en=?, description_zh=?, description_en=?, sort_order=?, is_active=? WHERE id=?').run(year, title_zh||'', title_en||'', description_zh||'', description_en||'', sort_order||0, is_active!==undefined?is_active:1, req.params.id);
  res.json({ success: true });
});

router.delete('/:id', authMiddleware, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM milestones WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
