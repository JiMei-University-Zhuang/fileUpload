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
  - [x] 基础UI组件（进度条、按钮等）

- [x] 后端功能
  - [x] Express 服务器搭建
  - [x] 文件上传接口 (/upload)
  - [x] Multer 配置
  - [x] 文件存储目录结构

## 待完成功能

- [ ] 前端功能
  - [ ] 文件分片上传实现
  - [ ] 上传进度实时显示
  - [ ] 断点续传功能
  - [ ] 文件秒传功能
  - [ ] 上传状态管理
  - [ ] 错误处理机制

- [ ] 后端功能
  - [ ] 分片文件合并
  - [ ] 文件完整性校验
  - [ ] 临时文件清理
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

### 进行中
1. 前端上传功能实现
2. 后端分片处理逻辑

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
