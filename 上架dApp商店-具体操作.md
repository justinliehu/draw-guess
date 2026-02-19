# 上架 Solana dApp 商店 — 手把手具体操作

你的游戏已部署在：**https://draw-guess-ev2q.onrender.com**  
按下面顺序做，即可上架到 **Solana Seeker 的 dApp 商店**。

---

## 第一步：准备素材（先准备好再提交）

### 1.1 应用图标 512×512

1. 在项目文件夹打开命令行，执行：`node server.cjs`
2. 浏览器打开：`http://localhost:8080/export-icons.html`
3. 点击 **「下载 icon-512.png」**，保存到电脑（记住路径，后面上传要用）。

### 1.2 商店横幅图 1200×600

- 需要一张 **1200 像素宽 × 600 像素高** 的 PNG。
- 没有设计软件的话可以：
  - 用 [Canva](https://www.canva.com) 新建 1200×600 画布，放游戏名「你画我猜」+ 紫色背景，导出 PNG；
  - 或用 [Photopea](https://www.photopea.com)（在线 PS）把 icon-512 放大、加背景做成 1200×600，导出 PNG。
- 保存好文件，例如命名为 `banner-1200x600.png`。

### 1.3 截图至少 4 张（1080p）

- 用手机或电脑浏览器打开：`https://draw-guess-ev2q.onrender.com/index-standalone.html`
- 截以下画面（每张建议 **1920×1080** 或同比例）：
  1. 游戏大厅（有「连接钱包」「你画我猜」那一页）
  2. 房间页（玩家列表、准备）
  3. 游戏进行中（画板 + 猜词）
  4. 回合结束或最终排名
- 保存为 4 张 PNG 或 JPG，命名如 `screenshot1.png` … `screenshot4.png`。

---

## 第二步：用 Bubblewrap 打出 APK

### 2.1 安装 Node.js

1. 打开 https://nodejs.org ，下载 **LTS** 版本并安装。
2. 安装完成后，打开 **Git Bash** 或 **命令提示符**，输入：
   ```bash
   node -v
   ```
   能看到版本号（如 v18.x）即可。

### 2.2 安装 Bubblewrap

在 Git Bash 里执行：

```bash
npm install -g @bubblewrap/cli
```

若报错「权限」或「找不到命令」，可试：

```bash
npm install -g @bubblewrap/cli --unsafe-perm
```

安装完成后执行：

```bash
bubblewrap --version
```

有版本号即安装成功。

### 2.3 新建一个空文件夹并进入

例如在桌面建文件夹 `twa-app`，然后：

```bash
cd /c/Users/justi/Desktop/twa-app
```

（路径按你实际放文件夹的位置改。）

### 2.4 用你的网址初始化 TWA 项目

在**同一文件夹**里执行（一行整段复制）：

```bash
bubblewrap init --manifest https://draw-guess-ev2q.onrender.com/manifest.json
```

- 若提示 **Package ID**：填例如 `com.justi.drawguess`（只能英文、数字、点）。
- 若提示 **App name**：填 `Draw Guess` 或 `你画我猜`。
- 若提示 **Launcher name**：可直接回车用默认，或填同上。
- 若问 **Signing key**：选 **Generate new key**（生成新密钥），不要用 Google Play 的。
- 若问 **Key path / password**：可回车用默认路径，密码自己设一个并记住（打 APK 时要输）。

按提示一路完成，直到出现 “Project created” 或类似成功提示。

### 2.5 构建 APK

在同一文件夹里执行：

```bash
bubblewrap build
```

- 若提示输入密钥密码，填你 2.4 步设的密码。
- 等待几分钟，完成后再当前目录下的 **app/build/outputs/apk/release/** 里找到 **app-release-signed.apk**（或类似名字的 signed apk）。
- 把这个 **.apk** 文件复制到桌面或一个你容易找到的文件夹，后面上传商店要用。

---

## 第三步：在 Solana 发布门户提交 dApp

### 3.1 打开发布门户并登录

1. 浏览器打开：**https://publish.solanamobile.com**
2. 点 **Sign in** / **登录**，用 **GitHub** 或 **Google** 登录（按页面提供的选项）。
3. 若首次使用，按提示完成 **发布者注册**（可能需邮箱验证、KYC 等，按页面一步步做）。

### 3.2 连接钱包

1. 在门户里找到 **Connect Wallet** / **连接钱包**。
2. 选择 **Phantom** 或 **Solflare**（需浏览器已装对应扩展）。
3. 连接后确认钱包里有约 **0.2 SOL**（用于上架手续费和存储；没有的话先买或转入）。

### 3.3 添加新 dApp

1. 在 Dashboard 里点 **Add a dApp** / **添加 dApp**（或 **Submit dApp**，按网站实际按钮文字）。
2. 进入「新建 dApp」的表单页面。

### 3.4 填写 dApp 信息

按表单一项项填（不同时期网站可能略有差异，以页面为准）：

| 表单项 | 建议填写 |
|--------|----------|
| **Name / 应用名称** | 你画我猜（或 Draw & Guess） |
| **Short description / 简短描述** | 一句话，如：支持 Phantom/Solflare 的多人你画我猜 |
| **Full description / 详细描述** | 玩法说明、支持钱包、多人同房间等 |
| **Category / 分类** | 选 **Games** 或 **Entertainment** |
| **Website / 网址** | https://draw-guess-ev2q.onrender.com |

### 3.5 上传素材

- **Icon / 图标**：上传你在 1.1 步下载的 **icon-512.png**（512×512）。
- **Banner / 横幅**：上传 1.2 步做的 **1200×600** 图。
- **Screenshots / 截图**：上传 1.3 步的 **至少 4 张** 截图（1080p，横竖一致）。

若还有「Video」等可选，可先不填，只填必填项。

### 3.6 上传 APK

- 找到 **Upload APK** / **上传 APK** 或 **Release** 相关区域。
- 选择你在 2.5 步得到的 **app-release-signed.apk** 文件上传。
- 等待上传和校验完成。

### 3.7 存储与提交

- 若页面要求选择 **Storage provider**（如 ArDrive），按提示选一个并完成授权/付费（会从你钱包扣少量 SOL）。
- 最后检查一遍名称、描述、图标、截图、APK 无误后，点 **Submit** / **提交**。

---

## 第四步：提交之后

- 状态会变成「待审核」或类似。
- 审核一般 **2～5 个工作日**，结果会发到你注册用的邮箱。
- 若通过，你的 dApp 会出现在 **Solana Seeker 手机**的 dApp 商店里，用户可搜索「你画我猜」或 Draw & Guess 下载。
- 若被拒，邮件里会写原因，按说明改描述或截图后重新提交即可。

---

## 常见问题

**Bubblewrap 报错找不到 manifest**  
- 先浏览器打开：https://draw-guess-ev2q.onrender.com/manifest.json  
- 若打不开或报错，说明服务器没返回 manifest，需要检查 Render 部署是否包含 `manifest.json` 文件。

**Bubblewrap 报错 Java / JDK**  
- Bubblewrap 依赖 Java。若提示缺少 Java，请安装 JDK 11 或 17：https://adoptium.net  
- 安装后重启终端再执行 `bubblewrap build`。

**发布门户打不开或一直转圈**  
- 换浏览器或开无痕/隐私模式再试；确认网络能访问国外网站。

**没有 0.2 SOL**  
- 在交易所（如 Binance、OKX）买 SOL 提到 Phantom/Solflare 钱包，或从别的钱包转入。

---

按上面顺序做完，就完成了从「准备素材 → 打 APK → 上架 dApp 商店」的整条流程。若某一步的页面和本文不一致，以 **publish.solanamobile.com** 当前页面为准即可。
