const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getDb } = require('../db/init');
const GROUPS = ['honorary_chairman', 'chairman', 'vice_chairman', 'committee', 'advisor'];

// 公开：按分组获取
router.get('/', (req, res) => {
  const db = getDb();
  const group = req.query.group;
  let items;
  if (group) {
    items = db.prepare('SELECT * FROM team_members WHERE is_active = 1 AND group_name = ? ORDER BY sort_order ASC').all(group);
  } else {
    items = db.prepare('SELECT * FROM team_members WHERE is_active = 1 ORDER BY group_name, sort_order ASC').all();
  }
  res.json(items);
});

// 公开：获取所有分组
router.get('/groups', (req, res) => {
  const db = getDb();
  const groups = db.prepare('SELECT DISTINCT group_name FROM team_members WHERE is_active = 1').all().map(r => r.group_name);
  res.json(groups.length ? groups : GROUPS);
});

// 管理：获取全部
router.get('/all', authMiddleware, (req, res) => {
  const db = getDb();
  const items = db.prepare('SELECT * FROM team_members ORDER BY group_name, sort_order ASC').all();
  res.json(items);
});

router.post('/', authMiddleware, (req, res) => {
  const { name_zh, name_en, title_zh, title_en, bio_zh, bio_en, avatar_url, group_name, social_facebook, social_twitter, social_linkedin, social_instagram, sort_order, is_active } = req.body;
  const db = getDb();
  const result = db.prepare(
    `INSERT INTO team_members (name_zh, name_en, title_zh, title_en, bio_zh, bio_en, avatar_url, group_name, social_facebook, social_twitter, social_linkedin, social_instagram, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(name_zh||'', name_en||'', title_zh||'', title_en||'', bio_zh||'', bio_en||'', avatar_url, group_name||'committee', social_facebook||'', social_twitter||'', social_linkedin||'', social_instagram||'', sort_order||0, is_active!==undefined?is_active:1);
  res.json({ id: result.lastInsertRowid, success: true });
});

router.put('/:id', authMiddleware, (req, res) => {
  const { name_zh, name_en, title_zh, title_en, bio_zh, bio_en, avatar_url, group_name, social_facebook, social_twitter, social_linkedin, social_instagram, sort_order, is_active } = req.body;
  const db = getDb();
  db.prepare(
    `UPDATE team_members SET name_zh=?, name_en=?, title_zh=?, title_en=?, bio_zh=?, bio_en=?, avatar_url=?, group_name=?, social_facebook=?, social_twitter=?, social_linkedin=?, social_instagram=?, sort_order=?, is_active=? WHERE id=?`
  ).run(name_zh||'', name_en||'', title_zh||'', title_en||'', bio_zh||'', bio_en||'', avatar_url, group_name||'committee', social_facebook||'', social_twitter||'', social_linkedin||'', social_instagram||'', sort_order||0, is_active!==undefined?is_active:1, req.params.id);
  res.json({ success: true });
});

router.delete('/:id', authMiddleware, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM team_members WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
