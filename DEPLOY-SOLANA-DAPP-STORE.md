# 上线 Solana Seeker dApp Store 完整指南

本游戏已准备好部署并上架 **Solana Mobile dApp Store**（Seeker 手机应用商店）。按下面步骤操作即可。

---

## 一、准备图标（首次必做）

1. 用**本地服务器**打开导出页（否则 SVG 可能无法加载）：
   - 在项目根目录运行：`node server.cjs`
   - 浏览器打开：`http://localhost:8080/export-icons.html`
2. 点击页面上的 **「下载 icon-512.png」** 和 **「下载 icon-192.png」**，保存到项目**根目录**（与 `index-standalone.html` 同级）。
3. 确认根目录下有这两个文件：`icon-512.png`、`icon-192.png`。

---

## 二、部署到公网（拿到可访问的 URL）

dApp Store 的 APK 需要包一个**已上线**的网页地址，所以必须先部署。

### 方式 A：Render.com（推荐，免费）

1. 把本仓库推到 **GitHub**（如 `yourname/draw-guess-online`）。
2. 打开 [Render Dashboard](https://dashboard.render.com) → **New** → **Web Service**。
3. 连接该 GitHub 仓库。
4. 配置：
   - **Runtime**: Node
   - **Build Command**: 留空或填 `echo 'no build'`
   - **Start Command**: `node server.cjs`
   - **Root Directory**: 留空（若项目就在仓库根目录）
5. 若 Render 未自动识别 `render.yaml`，可手动按上面填写。
6. 部署完成后会得到：`https://draw-guess-online-xxxx.onrender.com`。
7. 在浏览器打开：`https://你的服务名.onrender.com/index-standalone.html`，确认游戏和钱包连接正常。

### 方式 B：Railway / Fly.io / 自己的 VPS

- 确保能执行：`node server.cjs`，并对外提供 80/443。
- 若用 Nginx，把根目录指到本项目，并代理 `/api` 到 `http://127.0.0.1:8080`（或你改的端口）。

**重要**：部署后前端和 API 必须在**同一域名**下（例如都走 `https://你的域名.com`），否则需改 `index-standalone.html` 里的 `apiBase` 指向你的后端地址。

---

## 三、用 Bubblewrap 把网页打成 Android APK

1. **安装 Node.js**（建议 18+）：[https://nodejs.org](https://nodejs.org)
2. **安装 Bubblewrap**：
   ```bash
   npm install -g @bubblewrap/cli
   ```
3. **初始化 TWA 项目**（把下面的地址换成你第二步部署好的**首页地址**）：
   ```bash
   bubblewrap init --manifest https://你的域名.com/manifest.json
   ```
   - 若没有 `/manifest.json`，可先用：`https://你的域名.com/index-standalone.html`
   - 按提示填写包名（如 `com.yourname.drawguess`）、应用名等；**签名密钥选「生成新密钥」**（不要用 Google Play 的密钥）。
4. **构建 release APK**：
   ```bash
   bubblewrap build
   ```
5. 在生成的 `app-release-signed.apk` 所在目录找到该文件，备用。

---

## 四、在 Solana dApp Store 提交

1. 打开发布门户：**[https://publish.solanamobile.com](https://publish.solanamobile.com)**
2. **注册/登录**发布者账号（按页面完成 KYC/KYB 等）。
3. **连接钱包**（Phantom / Solflare 等），准备约 **0.2 SOL**（手续费 + 存储）。
4. 点击 **「Add a dApp」**，填写：
   - **Name**: 你画我猜（或英文名 Draw & Guess）
   - **Short description**: 一句话介绍
   - **Full description**: 玩法、支持钱包等
   - **Icon**: 上传 **512×512 PNG**（可用项目里的 `icon-512.png`）
   - **Banner**: **1200×600 PNG**（可用设计工具把 icon 放大/加背景生成）
   - **Screenshots / 视频**：至少 **4 张** 1080p（1920×1080）截图或短视频，横竖一致
5. **上传 APK**：选择第三步得到的 `app-release-signed.apk`。
6. 选择**存储方式**（文档推荐 ArDrive），按提示完成并**提交**。
7. 审核约 **2–5 个工作日**，通过后即可在 **Solana Seeker 的 dApp Store** 中看到你的应用。

---

## 五、素材清单速查

| 用途           | 规格              | 说明                    |
|----------------|-------------------|-------------------------|
| PWA 图标       | 192×192, 512×512 | 用 `export-icons.html` 导出 |
| dApp Store 图标 | 512×512 PNG       | 同上或单独设计          |
| Banner         | 1200×600 PNG      | 商店头图                |
| Screenshots    | 至少 4 张 1080p  | 游戏内截图或录屏        |

---

## 六、常见问题

- **Bubblewrap 报错「manifest」**：确保部署后的 `https://你的域名/manifest.json` 能访问，且其中 `start_url`、`icons` 为绝对路径或可访问的相对路径。
- **手机里钱包连不上**：确认是 https，且 Phantom/Solflare 支持当前浏览器/WebView；Seeker 系统一般支持。
- **审核被拒**：按邮件说明修改描述或截图后重新提交。

有问题可到 **Solana Mobile Discord** 的 `#dapp-store` 频道询问。
