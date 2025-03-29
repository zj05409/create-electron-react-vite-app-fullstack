# create-electron-react-vite-app-fullstack

使用Vite创建支持Web访问的Electron全栈应用模板。这个模板集成了React, Vite, Express和Socket.IO，支持作为桌面应用和Web应用同时运行。

![模板截图](https://placeholder-for-screenshot.png)

## 特性

- ✅ Vite + React 构建高性能的前端界面
- ✅ Express 后端API服务
- ✅ Socket.IO 实时通信
- ✅ 支持同时作为Web应用和桌面应用运行
- ✅ 简单的开发和构建配置
- ✅ 多平台支持 (Windows, macOS, Linux)
- ✅ TypeScript支持（可选）
- ✅ 内置错误处理和日志记录
- ✅ 完整的项目结构和最佳实践示例

## 环境要求

- Node.js 16.x 或更高版本
- npm 8.x 或更高版本

## 快速开始

通过npx快速创建项目:

```bash
npx create-electron-react-vite-app-fullstack my-app
```

或者:

```bash
npm create electron-react-vite-app-fullstack my-app
```

然后按照提示进行操作。创建过程中，你可以选择是否使用TypeScript。

创建完成后，进入项目目录并启动开发服务器:

```bash
cd my-app
npm install
npm run dev
```

这将同时启动:
- Express服务器 (http://localhost:3001)
- Vite开发服务器 (http://localhost:5173)
- Electron应用程序

## 项目结构

创建的项目结构如下:

```
my-app/
├── electron/         # Electron 主进程代码
│   ├── index.js      # 主进程入口
│   └── preload.js    # 预加载脚本
├── server/           # 后端服务器代码
│   └── index.js      # Express 服务器
├── src/              # 前端代码
│   ├── components/   # 组件目录
│   ├── pages/        # 页面组件
│   ├── styles/       # CSS样式目录
│   ├── App.jsx       # React 应用主组件
│   └── main.jsx      # React 入口
├── public/           # 静态资源
├── logs/             # 日志目录
├── index.html        # HTML 模板
├── vite.config.js    # Vite 配置
├── tsconfig.json     # TypeScript配置(可选)
└── package.json      # 项目依赖和脚本
```

## 命令

创建的项目中包含以下命令：

- `npm run dev` - 启动所有服务 (同时启动Vite, Express和Electron)
- `npm run dev:web` - 只启动Vite开发服务器
- `npm run dev:server` - 只启动Express后端服务器
- `npm run dev:electron` - 只启动Electron应用
- `npm run build` - 构建前端代码
- `npm run build:electron` - 构建所有平台的Electron应用
- `npm run build:mac` - 构建MacOS平台的Electron应用
- `npm run build:win` - 构建Windows平台的Electron应用
- `npm run build:linux` - 构建Linux平台的Electron应用
- `npm run preview` - 预览构建后的Web应用

## 高级用法

### 1. 配置Socket.IO

Socket.IO已经在模板中配置好，客户端连接会根据环境自动选择正确的服务器地址:

```javascript
// 前端连接Socket.IO的示例代码
import { io } from 'socket.io-client';

// 自动检测是在Electron中还是在Web浏览器中运行
const socket = io();

socket.on('connect', () => {
  console.log('已连接到Socket.IO服务器');
});

socket.on('serverMessage', (data) => {
  console.log('收到服务器消息:', data);
});

// 发送消息到服务器
socket.emit('clientMessage', { message: '你好，服务器!' });
```

### 2. 使用Electron的主进程API

你可以通过预加载脚本安全地使用Electron API:

```javascript
// 在src/App.jsx中
useEffect(() => {
  if (window.electronAPI) {
    // 调用Electron API
    window.electronAPI.getAppInfo().then(info => {
      console.log('应用信息:', info);
    });
  }
}, []);
```

### 3. 添加新的Express路由

在server/index.js中添加新路由:

```javascript
// 示例API端点
app.get('/api/data', (req, res) => {
  res.json({
    items: [
      { id: 1, name: '项目 1' },
      { id: 2, name: '项目 2' }
    ]
  });
});
```

## 故障排除

### Socket.IO连接问题

如果Socket.IO无法连接:

1. 确保后端服务器已启动
2. 检查浏览器控制台中的CORS错误
3. 验证端口未被其他应用占用

### Electron应用无法启动

如果Electron应用无法启动:

1. 检查端口3001和5173是否被占用
2. 验证所有依赖都已正确安装
3. 检查logs目录中的日志文件

## 贡献指南

欢迎贡献代码、报告问题或提出新功能请求。请遵循以下步骤:

1. Fork这个仓库
2. 创建一个新的分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建一个Pull Request

## 版本历史

- 1.0.0 - 初始版本发布

## 开源协议

MIT 