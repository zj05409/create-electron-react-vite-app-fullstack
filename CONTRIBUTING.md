# 贡献指南

感谢您考虑为 create-electron-react-vite-app-fullstack 做出贡献！这是一个开源项目，我们欢迎任何形式的贡献，包括但不限于：

- 错误报告
- 功能请求
- 代码贡献
- 文档改进
- 测试用例

## 开发流程

1. Fork 这个仓库
2. 克隆你的 fork 到本地
   ```bash
   git clone https://github.com/你的用户名/create-electron-react-vite-app-fullstack.git
   cd create-electron-react-vite-app-fullstack
   ```
3. 安装依赖
   ```bash
   npm install
   ```
4. 创建一个新分支
   ```bash
   git checkout -b feature/你的功能名
   ```
5. 进行更改并提交
   ```bash
   git commit -m "添加了新功能：简短描述"
   ```
6. 推送到你的 fork
   ```bash
   git push origin feature/你的功能名
   ```
7. 创建一个 Pull Request

## 测试

在提交 PR 之前，请确保项目能够通过测试：

```bash
npm test
```

如果你添加了新功能，请添加相应的测试用例。

## 模板更新指南

如果你要更新模板中的内容，请遵循以下准则：

1. 保持与现有代码风格一致
2. 确保兼容性和可移植性
3. 注意不要引入过多的依赖
4. 添加适当的注释和文档

## 提交错误报告

如果您发现了 bug，请使用 issue 模板报告它。请包含：

- 错误的简短描述
- 复现步骤
- 预期行为
- 实际行为
- 环境信息（操作系统、Node.js 版本等）
- 如果可能，提供截图或代码示例

## 代码风格指南

- 使用2或4空格缩进（保持一致）
- 使用分号
- 变量使用驼峰命名法
- 类使用首字母大写的驼峰命名法
- 常量使用全大写加下划线
- 保持代码简洁，每个函数只做一件事
- 添加有意义的注释，但避免过度注释

## 许可证

通过贡献，您同意您的贡献将根据项目的 MIT 许可证进行许可。 