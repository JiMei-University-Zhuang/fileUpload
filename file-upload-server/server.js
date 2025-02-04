const express = require('express');
const cors = require('cors');

const app = express();

// 启用 CORS
app.use(cors());
// 解析 JSON
app.use(express.json());

const PORT = 3000;

app.get('/', (req, res) => {
  res.send('文件上传服务器运行中...');
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});