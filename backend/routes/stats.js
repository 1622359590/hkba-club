const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getDb } = require('../db/init');
router.get('/', (req, res) => {
  const db = getDb();
  const items = db.prepare('SELECT * FROM stats WHERE is_active = 1 ORDER BY sort_order ASC').all();
  res.json(items);
});

router.get('/all', authMiddleware, (req, res) => {
  const db = getDb();
  const items = db.prepare('SELECT * FROM stats ORDER BY sort_order ASC').all();
  res.json(items);
});

router.post('/', authMiddleware, (req, res) => {
  const { label_zh, label_en, value, icon, sort_order, is_active } = req.body;
  const db = getDb();
  const result = db.prepare('INSERT INTO stats (label_zh, label_en, value, icon, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)').run(label_zh||'', label_en||'', value||'0', icon||'', sort_order||0, is_active!==undefined?is_active:1);
  res.json({ id: result.lastInsertRowid, success: true });
});

router.put('/:id', authMiddleware, (req, res) => {
  const { label_zh, label_en, value, icon, sort_order, is_active } = req.body;
  const db = getDb();
  db.prepare('UPDATE stats SET label_zh=?, label_en=?, value=?, icon=?, sort_order=?, is_active=? WHERE id=?').run(label_zh||'', label_en||'', value||'0', icon||'', sort_order||0, is_active!==undefined?is_active:1, req.params.id);
  res.json({ success: true });
});

router.delete('/:id', authMiddleware, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM stats WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
