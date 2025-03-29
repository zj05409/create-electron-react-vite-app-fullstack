#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

// 检查模板文件是否存在
function checkTemplateFiles() {
    console.log(chalk.blue('正在检查模板文件...'));

    const requiredPaths = [
        'template',
        'template/electron',
        'template/electron/index.js',
        'template/electron/preload.js',
        'template/server',
        'template/server/index.js',
        'template/src',
        'template/src/App.jsx',
        'template/src/main.jsx',
        'template/package.json',
        'template/.gitignore',
        'template/vite.config.js',
        'bin/cli.js'
    ];

    let success = true;

    for (const filePath of requiredPaths) {
        const fullPath = path.join(__dirname, '..', filePath);
        if (!fs.existsSync(fullPath)) {
            console.log(chalk.red(`❌ 缺少关键文件: ${filePath}`));
            success = false;
        } else {
            console.log(chalk.green(`✓ 文件存在: ${filePath}`));
        }
    }

    return success;
}

// 检查CLI脚本是否正确设置
function checkCLIScript() {
    console.log(chalk.blue('\n正在检查CLI脚本...'));

    const cliPath = path.join(__dirname, '..', 'bin/cli.js');
    try {
        const stats = fs.statSync(cliPath);
        const isExecutable = !!(stats.mode & 0o111);

        if (!isExecutable) {
            console.log(chalk.yellow('⚠️ CLI脚本没有可执行权限'));
            console.log(chalk.yellow('  建议运行: chmod +x bin/cli.js'));
            return false;
        }

        console.log(chalk.green('✓ CLI脚本具有可执行权限'));
        return true;
    } catch (err) {
        console.log(chalk.red(`❌ 检查CLI脚本时出错: ${err.message}`));
        return false;
    }
}

// 检查package.json配置
function checkPackageJson() {
    console.log(chalk.blue('\n正在检查package.json配置...'));

    try {
        const packageJsonPath = path.join(__dirname, '..', 'package.json');
        const packageData = require(packageJsonPath);

        // 检查必要字段
        const requiredFields = ['name', 'version', 'description', 'bin', 'keywords', 'author', 'license'];
        let success = true;

        for (const field of requiredFields) {
            if (!packageData[field]) {
                console.log(chalk.red(`❌ package.json缺少字段: ${field}`));
                success = false;
            } else {
                console.log(chalk.green(`✓ package.json包含字段: ${field}`));
            }
        }

        return success;
    } catch (err) {
        console.log(chalk.red(`❌ 检查package.json时出错: ${err.message}`));
        return false;
    }
}

// 运行所有测试
(async function runTests() {
    console.log(chalk.bold.blue('开始测试 create-electron-react-vite-app-fullstack\n'));

    const testsResults = [
        checkTemplateFiles(),
        checkCLIScript(),
        checkPackageJson()
    ];

    const allPassed = testsResults.every(result => result);

    console.log('\n----------------------------------------');
    if (allPassed) {
        console.log(chalk.bold.green('✅ 所有测试通过!'));
        console.log(chalk.green('模板项目可以发布到npm'));
    } else {
        console.log(chalk.bold.red('❌ 测试失败'));
        console.log(chalk.red('请修复上述问题后再发布到npm'));
        process.exit(1);
    }
})(); 