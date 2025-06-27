# GitHub CI/CD 设置指南

## 🔐 第三步：配置GitHub Secrets

现在您需要在GitHub仓库中设置以下Secrets。请按照以下步骤操作：

### 1. 进入GitHub仓库设置

1. 打开您的GitHub仓库页面
2. 点击 `Settings` 标签
3. 在左侧菜单找到 `Secrets and variables`
4. 点击 `Actions`

### 2. 添加以下Secrets

点击 `New repository secret` 按钮，逐一添加：

#### 🍎 苹果开发者相关
```
MACOS_CERTIFICATE
```
- **值**: 您剪贴板中的base64编码证书 (刚才复制的内容)
- **说明**: Developer ID Application证书的base64编码

```
MACOS_CERTIFICATE_PASSWORD
```
- **值**: `Claudia2024!SecureCert`
- **说明**: p12证书文件的密码

```
APPLE_ID
```
- **值**: `helloandworlder@icloud.com`
- **说明**: 您的Apple ID邮箱

```
APPLE_PASSWORD
```
- **值**: `cbhd-ijeg-hngb-ypco`
- **说明**: App专用密码

```
APPLE_TEAM_ID
```
- **值**: `63K3PAH23D`
- **说明**: 您的Apple Developer Team ID

```
APPLE_SIGNING_IDENTITY
```
- **值**: `Developer ID Application: Bu Yuxi (63K3PAH23D)`
- **说明**: 代码签名身份

#### 🔑 密钥链相关
```
KEYCHAIN_PASSWORD
```
- **值**: `github-actions-keychain`
- **说明**: GitHub Actions中临时密钥链的密码

## 🚀 第四步：测试CI/CD

### 创建第一个发布版本

1. **提交并推送工作流文件**:
   ```bash
   git add .github/workflows/release.yml
   git add GITHUB_CICD_SETUP.md
   git commit -m "Add GitHub Actions CI/CD workflow"
   git push origin main
   ```

2. **创建并推送tag**:
   ```bash
   git tag v0.2.0
   git push origin v0.2.0
   ```

3. **查看构建进度**:
   - 打开GitHub仓库页面
   - 点击 `Actions` 标签
   - 您应该能看到 "Release Build" 工作流正在运行

### 构建时间预估
- ARM64版本: ~8-12分钟
- x86_64版本: ~8-12分钟  
- Universal版本: ~12-18分钟
- 总计: ~30-40分钟

## 📦 构建产物

成功后将生成：
- `Claudia_v0.2.0_aarch64-apple-darwin.dmg` (ARM64版本)
- `Claudia_v0.2.0_x86_64-apple-darwin.dmg` (Intel版本)
- `Claudia_v0.2.0_universal-apple-darwin.dmg` (通用版本)

## 🔧 故障排除

### 常见问题

1. **证书问题**
   - 确保证书base64编码正确
   - 确保密码匹配

2. **公证失败**
   - 检查Apple ID和App专用密码
   - 确保Team ID正确

3. **构建失败**
   - 检查Tauri配置是否正确
   - 查看Actions日志获取详细错误信息

### 手动触发构建

如果tag触发失败，您可以手动触发：
1. 进入仓库的Actions页面
2. 选择"Release Build"工作流
3. 点击"Run workflow"
4. 输入版本号（如v0.2.0）
5. 点击"Run workflow"

## 🎯 下一步优化

1. **添加代码质量检查**
2. **添加自动化测试**
3. **优化构建缓存**
4. **添加发布前的审批流程**

---

## 💡 重要提醒

- ⚠️ 请妥善保管GitHub Secrets中的敏感信息
- 🔒 定期更新Apple Developer证书和密码
- 📊 监控构建时间和成功率
- 🧹 定期清理旧的构建产物 