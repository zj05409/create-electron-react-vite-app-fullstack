const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const os = require('os');

// 获取本机IP地址
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

let mainWindow;
const SERVER_PORT = 3001;
const isDev = process.env.ELECTRON_START_URL ? true : false;

async function startServer() {
    try {
        console.log('正在启动服务器...');

        // 设置服务器环境变量
        process.env.PORT = SERVER_PORT;
        process.env.NODE_ENV = isDev ? 'development' : 'production';
        process.env.ELECTRON_IS_DEV = isDev ? '1' : '0';
        process.env.IS_ELECTRON = '1';

        // 直接在主进程中加载服务器
        console.log(`服务器路径: ${path.join(__dirname, '../server/index.js')}`);
        require(path.join(__dirname, '../server/index.js'));

        console.log(`服务器已成功启动在端口: ${SERVER_PORT}`);
        return true;
    } catch (error) {
        console.error('启动服务器时出错:', error);
        return false;
    }
}

async function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // 根据环境加载URL
    if (isDev) {
        // 开发环境: 从Vite开发服务器加载
        await mainWindow.loadURL(process.env.ELECTRON_START_URL);
        mainWindow.webContents.openDevTools();
    } else {
        // 生产环境: 从本地后端服务器加载
        const localIP = getLocalIP();
        const serverUrl = `http://localhost:${SERVER_PORT}`;
        console.log(`加载应用URL: ${serverUrl}`);
        await mainWindow.loadURL(serverUrl);
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// 应用初始化
app.whenReady().then(async () => {
    console.log('Electron应用启动中...');
    const serverStarted = await startServer();

    if (serverStarted) {
        await createMainWindow();
        console.log('主窗口已创建');
    } else {
        console.error('服务器启动失败，应用将退出');
        app.exit(1);
    }
});

// 当所有窗口关闭时退出应用
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', async () => {
    if (mainWindow === null) {
        await createMainWindow();
    }
});

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
});

// IPC通信 - 获取应用信息
ipcMain.handle('get-app-info', () => {
    return {
        isDev,
        serverPort: SERVER_PORT,
        localIP: getLocalIP()
    };
}); 