
const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/auth/register', (req, res) => {
  const { userName, email, password, avatar } = req.body;
  const db = router.db;
  const users = db.get('users');

  const existingUser = users.find({ email }).value();
  if (existingUser) {
    return res.status(409).json({ message: '此信箱已被註冊' });
  }

  const newUser = {
    id: Date.now(),
    userName,
    email,
    password,
    avatar,
  };

  users.push(newUser).write();
  return res.status(201).json({ message: '註冊成功', user: newUser });
});

server.listen(3001, () => {
  console.log('模擬伺服器已啟動，請透過 http://localhost:3001 測試');
});
