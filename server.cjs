
const jsonServer = require('json-server');

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.get('/test/401', (req, res) =>
  res.status(401).json({ message: '登入已過期，請重新登入' }),
);
server.get('/test/403', (req, res) =>
  res.status(403).json({ message: '權限不足，無法執行此操作' }),
);
server.get('/test/500', (req, res) =>
  res.status(500).json({ message: '伺服器錯誤，請稍後再試' }),
);

// 註冊測試路由
server.post('/auth/register/400', (req, res) =>
  res.status(400).json({ message: '請求資料錯誤' }),
);
server.post('/auth/register/409', (req, res) =>
  res.status(409).json({ message: '資料衝突' }),
);
server.post('/auth/register', (req, res) =>
  res.status(201).json({ message: '註冊成功' }),
);

server.listen(3001, () => {
  console.log('模擬伺服器已啟動，請透過 http://localhost:3001 測試');
});
