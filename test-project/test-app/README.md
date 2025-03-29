# Electron + React + Vite 全栈应用模板

这是一个功能完整的全栈应用模板，集成了 Electron、React、Vite 和 Express，支持以下特性：

- ✅ 支持 Electron 桌面应用程序开发
- ✅ 支持 Web 浏览器访问（同一代码库）
- ✅ 内置 Express 后端服务器
- ✅ 集成 Socket.io 实时通信
- ✅ 开发和生产环境的完整配置
- ✅ 支持多平台打包 (Windows/Mac/Linux)

## 项目结构

```
├── electron/           # Electron 主进程代码
├── server/             # Express 后端服务器
├── src/                # React 前端代码
│   ├── components/     # React 组件
│   ├── pages/          # 页面组件
│   ├── styles/         # CSS 样式
│   └── App.jsx         # 主应用组件
├── public/             # 静态资源
└── package.json        # 项目配置
```

## 环境要求

- Node.js 16.x 或更高版本
- npm 8.x 或更高版本

## 快速开始

克隆并安装依赖:

```bash
# 安装依赖
npm install
```

### 开发模式

```bash
# 启动所有服务（后端服务器 + Vite 开发服务器 + Electron）
npm run dev

# 或者分别启动各个服务
npm run dev:server  # 启动后端服务器
npm run dev:web     # 启动 Vite 开发服务器
npm run dev:electron  # 启动 Electron 应用
```

### 构建与打包

```bash
# 构建 Web 应用（输出到 dist 目录）
npm run build

# 构建 Electron 应用程序（所有平台）
npm run build:electron

# 仅构建 Mac 版本
npm run build:mac

# 仅构建 Windows 版本
npm run build:win

# 仅构建 Linux 版本
npm run build:linux
```

打包后的文件位于 `release` 目录。

## 注意事项

### Socket.io 连接

Socket.io 客户端配置为自动检测环境：

- 在开发环境中，通过 Vite 代理连接到后端服务器
- 在生产环境和 Electron 中，直接连接到本地服务器

### Electron 打包说明

- 打包的 DMG/EXE 应用会自动启动内部的 Express 服务器
- 所有服务器端依赖都已正确配置为 `dependencies`，确保打包后可以正常工作
- 服务器在 Electron 主进程中直接启动，无需额外的 Node.js 环境

## 故障排除

### DMG 应用无法启动

如果遇到 DMG 应用无法启动的问题，通常是因为：

1. 权限问题：确保应用有足够的权限
2. 端口占用：检查 3001 端口是否被其他应用占用
3. 调试：可以通过 `Console.app` 查看应用日志

### Socket.io 连接问题

如果 Socket.io 无法连接：

1. 确保先启动后端服务器，再启动前端
2. 检查浏览器控制台是否有 CORS 错误
3. 确保网络环境允许 WebSocket 连接

## 许可证

MIT 