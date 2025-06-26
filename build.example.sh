#!/bin/bash

# 示例构建脚本 for Claudia
# 请复制为 build-notarized.sh 并填入您的真实信息

# 设置公证所需的环境变量
# 请将下面的值替换为您的真实信息

export APPLE_ID="your-apple-id@example.com"
export APPLE_PASSWORD="your-app-specific-password"  # App专用密码
export APPLE_TEAM_ID="YOUR_TEAM_ID"

# 确保Rust环境已加载
source "$HOME/.cargo/env"

echo "开始构建并公证Claudia应用（ARM64版本）..."
echo "Apple ID: $APPLE_ID"
echo "Team ID: $APPLE_TEAM_ID"
echo "密码: [已设置]"

# 构建应用
cargo tauri build --target aarch64-apple-darwin

echo "构建完成！如果公证成功，应用将可以在其他Mac上正常运行。"
echo "生成的DMG文件位置："
echo "src-tauri/target/aarch64-apple-darwin/release/bundle/dmg/Claudia_0.1.0_aarch64.dmg" 