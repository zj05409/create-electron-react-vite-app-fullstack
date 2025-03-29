import { useState, useEffect } from 'react'
import '../styles/About.css'

export default function About() {
    const [electronInfo, setElectronInfo] = useState(null)

    useEffect(() => {
        // 检查是否在Electron环境中
        if (window.electron) {
            // 获取Electron应用信息
            window.electron.getAppInfo().then(info => {
                setElectronInfo(info)
            })
        }
    }, [])

    return (
        <div className="about-page">
            <h2>关于</h2>

            <div className="about-content">
                <p>这是一个基于 Electron + React + Vite + Express + Socket.IO 的全栈应用示例。</p>
                <p>该应用既可以作为桌面应用运行，也可以通过浏览器访问。</p>
                <p>通过统一的API和WebSocket服务，桌面应用和Web应用可以无缝地进行通信和数据共享。</p>

                <h3>特性</h3>
                <ul>
                    <li>使用Vite构建高性能的React前端应用</li>
                    <li>Express提供后端API服务</li>
                    <li>Socket.IO实现实时通信</li>
                    <li>支持多平台，包括Web、Windows、macOS和Linux</li>
                    <li>自动发现局域网中的服务器</li>
                </ul>

                {electronInfo && (
                    <div className="electron-info">
                        <h3>Electron应用信息</h3>
                        <ul>
                            <li>应用名称: {electronInfo.name}</li>
                            <li>版本: {electronInfo.version}</li>
                            <li>是否已打包: {electronInfo.isPackaged ? '是' : '否'}</li>
                            <li>本地IP地址: {electronInfo.localIp}</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
} 