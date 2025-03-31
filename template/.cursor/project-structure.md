# 项目结构说明

本项目是一个基于 Electron + React + Vite + Express 的全栈应用，支持同时作为桌面应用和Web应用运行。

## 目录结构

```
├── electron/           # Electron 主进程代码
│   ├── index.js        # 主进程入口
│   └── preload.js      # 预加载脚本
├── server/             # 后端服务器代码
│   └── index.js        # Express 服务器
├── src/                # 前端代码
│   ├── components/     # 组件目录
│   ├── pages/          # 页面组件
│   ├── styles/         # CSS样式
│   ├── App.jsx         # 主应用组件
│   └── main.jsx        # React 入口
├── public/             # 静态资源
├── logs/               # 日志目录
├── .cursor/            # Cursor 编辑器配置
├── index.html          # HTML 模板
├── vite.config.js      # Vite 配置
└── package.json        # 项目配置
```

## 主要功能模块

1. **前端 (src/)**: 基于 React 的用户界面
2. **后端 (server/)**: Express 服务器，提供 API 和 Socket.IO
3. **桌面应用 (electron/)**: Electron 主进程代码

## 开发工作流

1. `npm run dev`: 同时启动前端、后端和 Electron
2. `npm run build`: 构建前端代码
3. `npm run build:electron`: 构建桌面应用

## 技术栈

- 前端: React + Vite
- 后端: Express + Socket.IO
- 桌面: Electron

## 提示

- 可以使用 Cursor 编辑器的任务功能（从命令面板中选择"Tasks: Run Task"）快速执行常用命令
- 所有前端代码更改将自动热重载
- API 服务器运行在 3001 端口
- 前端开发服务器运行在 5173 端口 