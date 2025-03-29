#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const minimist = require('minimist');
const chalk = require('chalk');
const inquirer = require('inquirer');

// 解析命令行参数
const argv = minimist(process.argv.slice(2));
const targetDir = argv._[0] || '.';
const cwd = process.cwd();
const dest = path.resolve(cwd, targetDir);

async function init() {
    console.log(chalk.bold.blue('Create Electron React Vite App - 全栈版\n'));

    // 检查目标目录是否已存在
    if (fs.existsSync(dest) && fs.readdirSync(dest).length > 0) {
        const { overwrite } = await inquirer.prompt([
            {
                name: 'overwrite',
                type: 'confirm',
                message: `目标目录 ${targetDir} 不为空。是否继续?`,
                default: false
            }
        ]);

        if (!overwrite) {
            console.log(chalk.red('✖') + ' 操作已取消');
            process.exit(1);
        }

        // 清空目录
        console.log(`\n清空目录 ${targetDir}...`);
        await fs.emptyDir(dest);
    }

    // 询问用户配置选项
    const { useTypeScript } = await inquirer.prompt([
        {
            name: 'useTypeScript',
            type: 'confirm',
            message: '是否使用TypeScript?',
            default: false
        }
    ]);

    console.log(`\n在 ${targetDir} 创建Electron全栈应用...\n`);

    // 复制基础模板文件
    const templateDir = path.resolve(__dirname, '../template');
    await fs.copy(templateDir, dest);

    // 更新package.json中的应用名称
    console.log(chalk.blue('更新应用配置...'));
    const packageJsonPath = path.join(dest, 'package.json');
    const packageJson = require(packageJsonPath);

    // 获取项目名称（目录名）
    const projectName = path.basename(targetDir === '.' ? process.cwd() : targetDir);

    // 更新应用名称和相关配置
    packageJson.name = projectName;

    // 格式化显示名称：首字母大写，将连字符替换为空格
    const formattedName = projectName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    packageJson.build.productName = formattedName;
    packageJson.build.appId = `com.electron.${projectName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

    // 保存更新后的package.json
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 4 });
    console.log(chalk.green(`✓ 应用名称已更新为 "${formattedName}"`));

    // 如果选择了TypeScript模板，需要进行额外配置
    if (useTypeScript) {
        console.log(chalk.blue('配置TypeScript支持...'));

        // 添加TypeScript相关依赖
        packageJson.devDependencies = {
            ...packageJson.devDependencies,
            "typescript": "^5.0.2",
            "@types/node": "^20.2.5"
        };

        // 创建tsconfig.json
        const tsConfigContent = {
            "compilerOptions": {
                "target": "ES2020",
                "useDefineForClassFields": true,
                "lib": ["ES2020", "DOM", "DOM.Iterable"],
                "module": "ESNext",
                "skipLibCheck": true,
                "moduleResolution": "bundler",
                "allowImportingTsExtensions": true,
                "resolveJsonModule": true,
                "isolatedModules": true,
                "noEmit": true,
                "jsx": "react-jsx",
                "strict": true,
                "noUnusedLocals": true,
                "noUnusedParameters": true,
                "noFallthroughCasesInSwitch": true
            },
            "include": ["src", "electron", "server"],
            "references": [{ "path": "./tsconfig.node.json" }]
        };

        const tsConfigNodeContent = {
            "compilerOptions": {
                "composite": true,
                "skipLibCheck": true,
                "module": "ESNext",
                "moduleResolution": "bundler",
                "allowSyntheticDefaultImports": true
            },
            "include": ["vite.config.ts"]
        };

        // 写入配置文件
        await fs.writeJson(path.join(dest, 'tsconfig.json'), tsConfigContent, { spaces: 2 });
        await fs.writeJson(path.join(dest, 'tsconfig.node.json'), tsConfigNodeContent, { spaces: 2 });

        // 更新package.json
        await fs.writeJson(packageJsonPath, packageJson, { spaces: 4 });

        console.log(chalk.green('✓ TypeScript配置完成'));
    }

    // 添加错误处理和日志记录功能
    console.log(chalk.blue('添加增强的错误处理和日志记录...'));

    // 创建日志目录
    const logsDir = path.join(dest, 'logs');
    await fs.ensureDir(logsDir);
    await fs.writeFile(path.join(logsDir, '.gitkeep'), '');

    // 添加.gitignore条目
    const gitignorePath = path.join(dest, '.gitignore');
    let gitignoreContent = await fs.readFile(gitignorePath, 'utf8');
    gitignoreContent += '\n# 日志文件\nlogs/*\n!logs/.gitkeep\n';
    await fs.writeFile(gitignorePath, gitignoreContent);

    // 创建完成后的提示
    console.log(`\n${chalk.green('✓')} 项目创建成功!`);
    console.log('\n使用以下命令启动开发服务器:');
    console.log(`\n  ${chalk.cyan('cd')} ${targetDir}`);
    console.log(`  ${chalk.cyan('npm install')}`);
    console.log(`  ${chalk.cyan('npm run dev')}\n`);

    // 提供额外使用提示
    console.log(chalk.yellow('提示:'));
    console.log('- 网页应用运行在: http://localhost:5173');
    console.log('- 后端API运行在: http://localhost:3001');
    console.log(`- 使用 npm run build:electron 构建桌面应用，应用名称将为 "${formattedName}"\n`);
}

init().catch(e => {
    console.error(chalk.red('❌ 创建项目时出错:'));
    console.error(e);
    process.exit(1);
}); 