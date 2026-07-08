const jwt = require('jsonwebtoken');

// 强制要求 JWT_SECRET：未配置直接退出，避免硬编码 fallback 泄露
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET 环境变量未设置');
  console.error('请在 backend/.env 中配置 JWT_SECRET=<至少 32 位随机字符串>');
  process.exit(1);
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: '未登入' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token 已過期' });
  }
}

module.exports = { authMiddleware, JWT_SECRET };
