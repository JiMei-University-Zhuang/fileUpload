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
    // multer 会在其他字段之前处理文件，所以我们从 file.originalname 中获取信息
    console.log('Upload request body:', req.body); // 添加调试日志
    console.log('File info:', file); // 添加调试日志
    
    // 直接使用请求体中的数据
    const chunkIndex = req.body.index;
    const originalFilename = req.body.filename;
    const chunkFilename = `${originalFilename}-${chunkIndex}`;
    
    console.log('Saving chunk:', chunkFilename); // 添加调试日志
    cb(null, chunkFilename);
  }
});

const upload = multer({ storage });

// 处理分片上传
app.post('/upload', (req, res, next) => {
  console.log('Received upload request'); // 添加调试日志
  
  upload.single('chunk')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err); // 添加调试日志
      return res.status(400).json({
        success: false,
        message: '文件上传失败',
        error: err.message
      });
    }

    const { filename, index } = req.body;
    const chunkPath = path.join(chunksDir, `${filename}-${index}`);
    
    console.log('Upload completed, checking file:', chunkPath); // 添加调试日志
    
    if (fs.existsSync(chunkPath)) {
      console.log(`分片 ${index} 上传成功，保存在: ${chunkPath}`);
      res.json({
        success: true,
        message: `分片 ${index} 上传成功`
      });
    } else {
      console.error(`分片 ${index} 保存失败`);
      res.status(400).json({
        success: false,
        message: `分片 ${index} 保存失败`
      });
    }
  });
});

// 合并文件
app.post('/merge', async (req, res) => {
  const { filename, totalChunks } = req.body;
  
  console.log('开始合并文件:', filename);
  console.log('总分片数:', totalChunks);
  
  try {
    // 检查所有分片是否存在
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(chunksDir, `${filename}-${i}`);
      if (!fs.existsSync(chunkPath)) {
        console.error(`分片 ${i} 不存在，路径: ${chunkPath}`);
        return res.status(400).json({
          success: false,
          message: `分片 ${i} 不存在`
        });
      } else {
        console.log(`找到分片 ${i}: ${chunkPath}`);
      }
    }
    
    // 创建写入流
    const writeStream = fs.createWriteStream(path.join(uploadsDir, filename));
    
    // 按顺序合并分片
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(chunksDir, `${filename}-${i}`);
      const chunkBuffer = await fs.promises.readFile(chunkPath);
      writeStream.write(chunkBuffer);
      
      // 删除分片文件
      await fs.promises.unlink(chunkPath);
      console.log(`分片 ${i} 已合并并删除`);
    }
    
    writeStream.end();
    console.log('文件合并完成');
    
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