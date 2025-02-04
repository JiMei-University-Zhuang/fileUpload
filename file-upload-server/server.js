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

// 添加合并文件的接口
app.post('/merge', async (req, res) => {
  const { filename, totalChunks } = req.body;
  
  try {
    // 创建写入流，写入最终文件
    const writeStream = fs.createWriteStream(path.join(uploadsDir, filename));
    
    // 按顺序合并分片
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(chunksDir, `${filename}-${i}`);
      // 判断分片是否存在
      if (!fs.existsSync(chunkPath)) {
        return res.status(400).json({
          success: false,
          message: `分片 ${i} 不存在`
        });
      }
      
      // 读取分片并写入
      const chunkBuffer = await fs.promises.readFile(chunkPath);
      writeStream.write(chunkBuffer);
      
      // 删除分片文件
      await fs.promises.unlink(chunkPath);
    }
    
    // 完成写入
    writeStream.end();
    
    console.log(`文件 ${filename} 合并完成`);
    res.json({
      success: true,
      message: '文件合并成功',
      path: path.join(uploadsDir, filename)
    });
    
  } catch (error) {
    console.error('合并文件失败:', error);
    res.status(500).json({
      success: false,
      message: '文件合并失败',
      error: error.message
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`文件上传目录: ${uploadsDir}`);
  console.log(`分片存储目录: ${chunksDir}`);
});