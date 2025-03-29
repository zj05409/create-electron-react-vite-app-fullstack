import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import './App.css'

function App() {
    const [serverInfo, setServerInfo] = useState(null)
    const [isElectron, setIsElectron] = useState(false)

    useEffect(() => {
        // 检查是否在Electron环境中运行
        if (window.appConfig) {
            setIsElectron(true)
            setServerInfo({
                ip: window.appConfig.localIp,
                port: window.appConfig.serverPort
            })
        } else {
            // 如果不是在Electron中运行，则从API获取服务器信息
            fetch('/api/server-config')
                .then(res => res.json())
                .then(data => {
                    setServerInfo(data)
                })
                .catch(err => {
                    console.error('获取服务器信息失败:', err)
                })
        }
    }, [])

    return (
        <div className="app">
            <header className="app-header">
                <h1>Electron React Vite 全栈应用</h1>
                <nav>
                    <Link to="/">首页</Link>
                    <Link to="/about">关于</Link>
                </nav>
            </header>

            <main className="app-content">
                <div className="environment-info">
                    <p>运行环境: {isElectron ? 'Electron 应用' : 'Web 浏览器'}</p>
                    {serverInfo && (
                        <p>
                            服务器: {serverInfo.ip}:{serverInfo.port}
                        </p>
                    )}
                </div>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </main>

            <footer className="app-footer">
                <p>Electron + React + Vite + Express + Socket.IO</p>
            </footer>
        </div>
    )
}

export default App 