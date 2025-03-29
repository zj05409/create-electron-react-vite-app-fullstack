import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import '../styles/Home.css'

function Home() {
    const [socket, setSocket] = useState(null)
    const [socketId, setSocketId] = useState(null)
    const [connected, setConnected] = useState(false)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [isElectron, setIsElectron] = useState(false)
    const [serverInfo, setServerInfo] = useState(null)

    // 检查是否在Electron环境中
    useEffect(() => {
        const checkElectron = async () => {
            try {
                // 检查window.electronAPI是否存在
                if (window.electronAPI) {
                    setIsElectron(true)
                    const appInfo = await window.electronAPI.getAppInfo()
                    console.log('Electron app info:', appInfo)
                }
            } catch (error) {
                console.error('检查Electron环境失败:', error)
            }
        }

        checkElectron()
    }, [])

    // 获取Socket.IO服务器URL
    const getSocketUrl = () => {
        // 开发环境 - 使用Vite代理
        if (import.meta.env.DEV) {
            return '' // 空字符串让Socket.IO使用当前主机
        }

        // 生产环境 - 使用窗口位置
        return window.location.origin
    }

    // 创建Socket连接
    useEffect(() => {
        const connectSocket = async () => {
            try {
                // 获取Socket.IO服务器URL
                const socketUrl = getSocketUrl()
                console.log(`连接Socket.IO服务器: ${socketUrl || '当前主机'}`)

                // 配置Socket.IO客户端
                const socketOptions = {
                    transports: ['websocket', 'polling'],
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                    autoConnect: true
                }

                if (socketUrl) {
                    socketOptions.path = '/socket.io/'
                }

                // 创建Socket实例
                const newSocket = io(socketUrl, socketOptions)

                // 监听连接事件
                newSocket.on('connect', () => {
                    console.log('Socket.IO已连接')
                    setConnected(true)
                    setSocketId(newSocket.id)
                })

                // 监听欢迎消息
                newSocket.on('welcome', (data) => {
                    console.log('收到欢迎消息:', data)
                    setMessages(prev => [...prev, { type: 'server', text: data.message, timestamp: data.timestamp }])
                })

                // 监听服务器消息
                newSocket.on('serverMessage', (data) => {
                    console.log('收到服务器消息:', data)
                    setMessages(prev => [...prev, { type: 'received', text: data.message, from: data.from, timestamp: data.timestamp }])
                })

                // 监听断开连接事件
                newSocket.on('disconnect', (reason) => {
                    console.log(`Socket.IO断开连接: ${reason}`)
                    setConnected(false)
                })

                // 监听错误事件
                newSocket.on('connect_error', (error) => {
                    console.error('Socket.IO连接错误:', error)
                    setConnected(false)
                })

                // 保存Socket实例
                setSocket(newSocket)

                // 组件卸载时清理
                return () => {
                    newSocket.disconnect()
                }
            } catch (error) {
                console.error('创建Socket.IO连接时出错:', error)
            }
        }

        connectSocket()
    }, [])

    // 获取服务器信息
    useEffect(() => {
        const getServerInfo = async () => {
            try {
                const response = await fetch('/api/server-info')
                if (response.ok) {
                    const data = await response.json()
                    setServerInfo(data)
                    console.log('服务器信息:', data)
                }
            } catch (error) {
                console.error('获取服务器信息失败:', error)
            }
        }

        if (connected) {
            getServerInfo()
        }
    }, [connected])

    // 发送消息
    const sendMessage = (e) => {
        e.preventDefault()
        if (socket && message.trim() && connected) {
            console.log('发送消息:', message)
            socket.emit('clientMessage', { message })
            setMessages(prev => [...prev, { type: 'sent', text: message, timestamp: new Date().toISOString() }])
            setMessage('')
        }
    }

    return (
        <div className="home-container">
            <h1>全栈应用模板</h1>

            <div className="status-section">
                <div className="connection-status">
                    <span>状态:</span>
                    <span className={connected ? "connected" : "disconnected"}>
                        {connected ? "已连接" : "未连接"}
                    </span>
                </div>

                {socketId && (
                    <div className="socket-id">
                        <span>Socket ID:</span>
                        <span>{socketId}</span>
                    </div>
                )}

                <div className="environment-info">
                    <span>环境:</span>
                    <span>{isElectron ? "Electron" : "Web"}</span>
                    <span>{import.meta.env.DEV ? "(开发)" : "(生产)"}</span>
                </div>
            </div>

            {serverInfo && (
                <div className="server-info">
                    <h3>服务器信息</h3>
                    <p>IP: {serverInfo.localIP}</p>
                    <p>端口: {serverInfo.port}</p>
                    <p>平台: {serverInfo.platform}</p>
                    <p>Node版本: {serverInfo.nodeVersion}</p>
                </div>
            )}

            <div className="chat-section">
                <div className="messages-container">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.type}`}>
                            <div className="message-content">{msg.text}</div>
                            <div className="message-info">
                                {msg.from && <span className="message-from">{msg.from}</span>}
                                <span className="message-time">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <form className="message-form" onSubmit={sendMessage}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="输入消息..."
                        disabled={!connected}
                    />
                    <button type="submit" disabled={!connected || !message.trim()}>
                        发送
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Home 