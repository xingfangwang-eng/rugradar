# Vercel 部署指南

## 前提条件

1. 安装 Node.js 18.0 或更高版本
2. 注册 Vercel 账户
3. 安装 Vercel CLI（可选）：`npm install -g vercel`

## 部署步骤

### 方法 1：通过 Vercel 网站部署

1. **登录 Vercel**：访问 [Vercel 网站](https://vercel.com) 并登录您的账户。

2. **导入项目**：
   - 点击 "Add New" -> "Project"
   - 选择 "Import Git Repository"
   - 连接您的 GitHub/GitLab/Bitbucket 仓库
   - 选择 Audit Pulse 项目仓库

3. **配置项目**：
   - 项目名称：保持默认或自定义
   - Framework Preset：选择 "Next.js"
   - 根目录：保持默认
   - 环境变量：点击 "Environment Variables" 并添加以下变量：
     - `NEXT_PUBLIC_GEMINI_API_KEY`：您的 Gemini API 密钥
     - `NEXT_PUBLIC_ETHERSCAN_API_KEY`：您的 Etherscan API 密钥

4. **部署**：点击 "Deploy" 按钮开始部署过程。

5. **访问应用**：部署完成后，Vercel 会提供一个 URL，您可以通过该 URL 访问您的应用。

### 方法 2：通过 Vercel CLI 部署

1. **安装 Vercel CLI**（如果尚未安装）：
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**：
   ```bash
   vercel login
   ```

3. **部署项目**：
   ```bash
   vercel
   ```

4. **配置环境变量**：
   - 按照提示输入项目信息
   - 当要求输入环境变量时，添加：
     - `NEXT_PUBLIC_GEMINI_API_KEY`：您的 Gemini API 密钥
     - `NEXT_PUBLIC_ETHERSCAN_API_KEY`：您的 Etherscan API 密钥

5. **完成部署**：部署完成后，Vercel CLI 会提供访问 URL。

## 验证部署

1. **访问应用**：打开 Vercel 提供的 URL
2. **测试功能**：
   - 输入一个已验证的智能合约地址
   - 点击 "开始审计"
   - 检查审计结果是否正确显示

## 环境变量配置

| 变量名 | 描述 | 示例值 |
|-------|------|--------|
| NEXT_PUBLIC_GEMINI_API_KEY | Google Gemini API 密钥 | `AIzaSy...` |
| NEXT_PUBLIC_ETHERSCAN_API_KEY | Etherscan API 密钥 | `YourEtherscanAPIKey` |

## 常见问题

### 1. 部署失败
- **原因**：可能是环境变量未正确设置或构建过程中出现错误
- **解决方法**：检查 Vercel 控制台的构建日志，确保环境变量正确配置

### 2. API 调用失败
- **原因**：API 密钥无效或达到限制
- **解决方法**：检查 API 密钥是否正确，考虑升级 API 计划

### 3. 缓存不工作
- **原因**：浏览器 localStorage 被禁用或存储空间不足
- **解决方法**：确保浏览器允许 localStorage，清除浏览器缓存后重试

## 本地开发

要在本地运行项目：

1. **安装依赖**：
   ```bash
   npm install
   ```

2. **启动开发服务器**：
   ```bash
   npm run dev
   ```

3. **访问本地应用**：打开 `http://localhost:3000`

## 构建生产版本

要构建生产版本：

```bash
npm run build
```

构建完成后，可以使用：

```bash
npm start
```

启动生产服务器。