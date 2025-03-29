const { contextBridge, ipcRenderer } = require('electron');

// 暴露API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
    getAppInfo: () => ipcRenderer.invoke('get-app-info')
});

// 初始化时获取配置信息
ipcRenderer.invoke('get-app-info').then(appInfo => {
    // 为web应用提供配置信息
    contextBridge.exposeInMainWorld('appConfig', {
        ...appInfo,
        isElectron: true,
        serverPort: 3001
    });
}); 