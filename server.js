import jsonServer from 'json-server';

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

server.listen(3001, () => {
  console.log('模擬伺服器已啟動，請透過 http://localhost:3001 測試');
});
