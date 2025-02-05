# Vue3 文件分片上传项目

这是一个使用 Vue3 和 Express 实现的文件分片上传项目。

## 项目结构
```bash
vue-fileUpload/
├── file-upload-front/ # 前端项目 (Vue3)
│ ├── src/
│ │ ├── components/
│ │ │ └── FileUpload.vue # 文件上传组件
│ │ └── App.vue
│ └── package.json
└── file-upload-server/ # 后端项目 (Express)
├── server.js # 服务器入口文件
├── uploads/ # 最终文件存储目录
├── chunks/ # 文件分片存储目录
└── package.json
```

## 当前功能

- [x] 基础项目搭建
  - [x] Vue3 前端项目初始化
  - [x] Express 后端项目初始化
  - [x] 基础组件结构搭建

- [x] 前端功能
  - [x] 文件选择界面
  - [x] 文件信息显示（文件名、大小）
  - [x] 文件分片逻辑实现（2MB/片）
  - [x] 分片上传实现
  - [x] 上传进度实时显示
  - [x] 上传状态管理
  - [x] 基础错误处理

- [x] 后端功能
  - [x] Express 服务器搭建
  - [x] 文件上传接口 (/upload)
  - [x] 文件合并接口 (/merge)
  - [x] Multer 配置
  - [x] 文件存储目录结构
  - [x] 分片文件合并
  - [x] 临时文件清理

## 待完成功能

- [ ] 前端功能
  - [ ] 断点续传功能
  - [ ] 文件秒传功能
  - [ ] 高级错误处理机制

- [ ] 后端功能
  - [ ] 文件完整性校验
  - [ ] 并发控制
  - [ ] 断点续传支持

## 技术栈

- 前端：Vue3 + Vite
- 后端：Express + Multer
- 工具：
  - cors (跨域处理)
  - multer (文件上传)

## 开发进度

### 已完成
1. 项目基础架构搭建
2. 前端文件选择和分片逻辑
3. 后端文件上传基础功能
4. 文件存储目录结构
5. 文件分片上传和合并
6. 上传进度和状态显示
7. 基础错误处理

### 进行中
1. 断点续传功能
2. 文件完整性校验

## 踩坑记录

### 1. 文件分片上传失败 (状态码 400)

**问题现象：**
- 上传接口返回 400 错误
- 服务器日志显示 "保存分片: undefined-undefined"
- 前端报错 "分片上传失败: Error: HTTP error! status: 400"

**原因分析：**
1. Multer 中间件的执行顺序问题：
   - Multer 会在处理其他 form 字段之前处理文件
   - 在 storage.filename 回调中，req.body 尚未被解析，因此无法访问到 index 和 filename

2. FormData 的构建顺序问题：
   - 之前的代码直接将 Blob 对象添加到 FormData
   - 没有正确设置文件名和类型信息

**解决方案：**
1. 前端改进：
```javascript
const formData = new FormData()
// 确保先添加其他字段，再添加文件
formData.append('index', chunk.index.toString())
formData.append('filename', filename)
// 创建带有正确文件名的 File 对象
const chunkFile = new File(
[chunk.data],
${filename}-${chunk.index},
{ type: 'application/octet-stream' }
)
formData.append('chunk', chunkFile)
```
2. 后端改进：
```javascript
const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, chunksDir);
},
filename: function (req, file, cb) {
// 从请求体中获取信息
const chunkIndex = req.body.index;
const originalFilename = req.body.filename;
const chunkFilename = ${originalFilename}-${chunkIndex};
cb(null, chunkFilename);
}
});
```

**最佳实践：**
1. 在构建 FormData 时，始终先添加普通字段，再添加文件字段
2. 为上传的文件块创建合适的 File 对象，包含正确的文件名和类型
3. 在服务器端添加足够的日志，便于调试
4. 考虑请求中间件的执行顺序


## 本地开发

1. 启动前端项目

```bash
cd file-upload-front
npm install
npm run dev
```

2. 启动后端项目
```bash
cd file-upload-server
npm install
node server.js
```
## 目录说明

- `uploads/`: 存储最终合并后的完整文件
- `chunks/`: 存储上传的文件分片

## 贡献指南

欢迎提交 Issue 和 Pull Request

## 许可证

MIT
