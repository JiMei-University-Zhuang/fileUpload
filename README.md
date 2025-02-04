# Vue3 文件分片上传项目

这是一个使用 Vue3 和 Express 实现的文件分片上传项目。

## 项目结构 
vue-fileUpload/
├── file-upload-front/ # 前端项目 (Vue3)
│ ├── src/
│ │ ├── components/
│ │ │ └── FileUpload.vue
│ │ └── App.vue
│ └── package.json
└── file-upload-server/ # 后端项目 (Express)
├── server.js
└── package.json

## 当前功能

- [x] 基础项目搭建
  - [x] Vue3 前端项目初始化
  - [x] Express 后端项目初始化
  - [x] 基础组件结构搭建

- [x] 文件选择功能
  - [x] 文件选择界面
  - [x] 文件信息显示（文件名、大小）
  - [x] 文件分片逻辑实现（2MB/片）

- [x] 用户界面
  - [x] 基础样式实现
  - [x] 进度条组件
  - [x] 文件信息展示区域

## 待完成功能

- [ ] 前端功能
  - [ ] 文件分片上传实现
  - [ ] 上传进度实时显示
  - [ ] 断点续传功能
  - [ ] 文件秒传功能
  - [ ] 上传状态管理
  - [ ] 错误处理机制

- [ ] 后端功能
  - [ ] 文件分片接收
  - [ ] 分片存储管理
  - [ ] 文件合并功能
  - [ ] 文件完整性校验
  - [ ] 临时文件清理
  - [ ] 并发控制

- [ ] 优化功能
  - [ ] 文件类型限制
  - [ ] 文件大小限制
  - [ ] 上传队列管理
  - [ ] 性能优化
  - [ ] 安全性增强

## 技术栈

- 前端：Vue3 + Vite
- 后端：Express
- 工具：multer (预计使用)

## 开发进度

### 已完成
1. 项目基础架构搭建
2. 文件选择和分片逻辑实现
3. 基础UI组件开发

### 进行中
1. 文件上传功能实现
2. 后端接口开发

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

## 贡献指南

欢迎提交 Issue 和 Pull Request

## 许可证

MIT
