const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const os = require('os');

// 检查环境
const isElectron = process.env.IS_ELECTRON === '1';
const isDev = process.env.NODE_ENV !== 'production';

// 如果在Electron打包环境下运行，输出一些调试信息
if (isElectron) {
    console.log('在Electron环境中运行服务器');
    console.log('当前工作目录:', process.cwd());
    console.log('__dirname:', __dirname);
    console.log('环境变量:', {
        NODE_ENV: process.env.NODE_ENV,
        IS_ELECTRON: process.env.IS_ELECTRON,
        PORT: process.env.PORT
    });
}

// 设置端口和主机
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0'; // 监听所有地址，包括IPv4和IPv6

const app = express();

// 允许跨域请求
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
}));

// 解析JSON请求体
app.use(express.json());

// 获取本地IP地址
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '127.0.0.1';
}

// API路由
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the server!' });
});

// 获取服务器信息API
app.get('/api/server-info', (req, res) => {
    res.json({
        localIP: getLocalIP(),
        port: PORT,
        isElectron,
        isDev,
        nodeVersion: process.version,
        platform: process.platform
    });
});

// 创建HTTP服务器
const server = http.createServer(app);

// 设置Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
    path: '/socket.io/'
});

// 处理Socket.IO连接
io.on('connection', (socket) => {
    console.log('新客户端连接:', socket.id);

    // 发送欢迎消息
    socket.emit('welcome', {
        message: '欢迎连接到服务器',
        socketId: socket.id,
        timestamp: new Date().toISOString()
    });

    // 监听客户端消息
    socket.on('clientMessage', (data) => {
        console.log('收到客户端消息:', data);
        io.emit('serverMessage', {
            from: socket.id,
            message: data.message,
            timestamp: new Date().toISOString()
        });
    });

    // 监听断开连接事件
    socket.on('disconnect', () => {
        console.log('客户端断开连接:', socket.id);
    });
});

// 为生产环境提供静态文件
if (!isDev) {
    // 确定静态文件目录
    let staticPath;

    if (isElectron) {
        // Electron环境中，使用相对路径
        staticPath = path.join(__dirname, '../dist');
    } else {
        // 普通Node.js环境，使用相对于当前进程的路径
        staticPath = path.join(process.cwd(), 'dist');
    }

    console.log('提供静态文件目录:', staticPath);

    // 提供静态文件
    app.use(express.static(staticPath));

    // 为所有未匹配的路由提供index.html
    app.get('*', (req, res) => {
        res.sendFile(path.join(staticPath, 'index.html'));
    });
}

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
});

// 处理未处理的Promise拒绝
process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', reason);
});

// 启动服务器
server.listen(PORT, HOST, () => {
    const localIP = getLocalIP();
    console.log(`服务器运行在:`);
    console.log(`- http://localhost:${PORT}`);
    console.log(`- http://${localIP}:${PORT}`);
}); 