const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { getDb } = require('../db/init');
const { authMiddleware } = require('../middleware/auth');
// 获取媒体列表
router.get('/', authMiddleware, (req, res) => {
  const db = getDb();
  const items = db.prepare('SELECT * FROM media ORDER BY created_at DESC LIMIT 100').all();
  res.json(items);
});

// 删除媒体
router.delete('/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const item = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id);
  if (item) {
    const filePath = path.join(__dirname, '..', item.url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    db.prepare('DELETE FROM media WHERE id = ?').run(req.params.id);
  }
  res.json({ success: true });
});

module.exports = router;
