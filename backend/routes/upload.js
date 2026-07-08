const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authMiddleware } = require('../middleware/auth');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const sub = req.query.dir || 'general';
    const dir = path.join(uploadsDir, sub);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg|ico|pdf)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('不支援的檔案格式'));
    }
  }
});

router.post('/', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: '未選擇檔案' });
  const sub = req.query.dir || 'general';
  const url = `/uploads/${sub}/${req.file.filename}`;
  res.json({ url, filename: req.file.filename, size: req.file.size });
});

// 多文件上传
router.post('/multiple', authMiddleware, upload.array('files', 10), (req, res) => {
  if (!req.files?.length) return res.status(400).json({ error: '未選擇檔案' });
  const sub = req.query.dir || 'general';
  const results = req.files.map(f => ({
    url: `/uploads/${sub}/${f.filename}`,
    filename: f.filename,
    size: f.size,
  }));
  res.json(results);
});

module.exports = router;
