const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

// 启用 CORS
app.use(cors());
// 解析 JSON
app.use(express.json());

// 创建上传目录
const uploadsDir = path.join(__dirname, 'uploads');
const chunksDir = path.join(__dirname, 'chunks');

// 确保目录存在
[uploadsDir, chunksDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 配置 multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, chunksDir);
  },
  filename: function (req, file, cb) {
    // 使用文件名-分片索引作为分片文件名
    const filename = `${req.body.filename}-${req.body.index}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

// 处理分片上传
app.post('/upload', upload.single('chunk'), (req, res) => {
  console.log(`接收到分片 ${req.body.index}`);
  res.json({
    success: true,
    message: `分片 ${req.body.index} 上传成功`
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`文件上传目录: ${uploadsDir}`);
  console.log(`分片存储目录: ${chunksDir}`);
});