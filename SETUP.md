# Claudia 开发环境设置指南

## 首次设置

为了保护开发者隐私，本仓库不包含任何个人开发者信息。如果您要构建和分发应用，请按以下步骤配置：

### 1. 配置 Tauri 构建

复制示例配置文件并填入您的信息：

```bash
cp src-tauri/tauri.conf.example.json src-tauri/tauri.conf.json
```

编辑 `src-tauri/tauri.conf.json`，将以下占位符替换为您的真实信息：

- `Your Name` → 您的开发者姓名
- `YOUR_TEAM_ID` → 您的 Apple Team ID

### 2. 配置构建脚本

复制示例构建脚本：

```bash
cp build.example.sh build-notarized.sh
chmod +x build-notarized.sh
```

编辑 `build-notarized.sh`，填入您的 Apple 开发者信息：

- `your-apple-id@example.com` → 您的 Apple ID
- `your-app-specific-password` → 您的 App 专用密码
- `YOUR_TEAM_ID` → 您的 Apple Team ID

### 3. Apple 开发者证书

确保您已安装正确的证书：

- **开发**: `Apple Development: Your Name (TEAM_ID)`
- **分发**: `Developer ID Application: Your Name (TEAM_ID)`

### 4. 构建应用

```bash
# 开发构建
cargo tauri dev

# 发布构建（含公证）
./build-notarized.sh
```

## 安全注意事项

- **绝不要**将包含真实开发者信息的文件提交到 Git
- 所有敏感文件都已添加到 `.gitignore`
- 使用 App 专用密码而不是 Apple ID 密码
- 定期轮换您的 App 专用密码

## 文件说明

- `src-tauri/tauri.conf.example.json` - 配置文件模板
- `build.example.sh` - 构建脚本模板
- `src-tauri/tauri.conf.json` - 您的真实配置（被 git 忽略）
- `build-notarized.sh` - 您的真实构建脚本（被 git 忽略） 