# 上架 Google Play Store 说明

当前项目是网页应用，要变成 **Google Play 里的 Android App**，可以用 **TWA（Trusted Web Activity）** 把网页“包”成一个安装包，再提交到 Play 商店。

---

## 一、整体流程概览

```
网页部署到 HTTPS
    → 配置 PWA manifest（本项目已有 manifest.json）
    → 用 Bubblewrap 生成 Android 工程并打 APK/AAB
    → 配置 Digital Asset Links（证明“这个 App 对应这个网站”）
    → 在 Google Play Console 创建应用并上传
```

---

## 二、前置条件

1. **网站已用 HTTPS 部署**  
   例如：`https://你的域名.com`，且访问  
   `https://你的域名.com/index-standalone.html` 能正常打开游戏。

2. **准备好应用图标**  
   - 在项目根目录放 `icon-192.png`（192×192）和 `icon-512.png`（512×512）  
   - 或在生成 TWA 时按提示替换图标路径。

3. **本机已安装**  
   - Node.js（建议 18+）  
   - Java JDK 11+（Bubblewrap 会用到）

---

## 三、用 Bubblewrap 生成 Android 应用（TWA）

Bubblewrap 是 Google 提供的命令行工具，把 PWA 打包成可上架 Play 的 Android 应用。

### 1. 安装 Bubblewrap

```bash
npm install -g @bubblewrap/cli
```

首次运行时会提示下载 Android SDK 等依赖，选允许即可。

### 2. 初始化 TWA 项目（必须用已上线的 HTTPS 地址）

先把网站部署到 HTTPS，记下地址，例如：  
`https://your-domain.com`

然后执行（**把下面的网址换成你的**）：

```bash
bubblewrap init --manifest=https://你的域名.com/manifest.json
```

- 会读取你线上的 `manifest.json`
- 按提示确认或填写：应用名、包名、图标等
- 包名建议：`com.yourname.drawguess`（唯一且小写）

### 3. 生成签名密钥（首次会提示）

- 选「生成新密钥」并设置密钥库路径和密码
- 务必**妥善备份**该密钥，以后更新应用要用同一把密钥

### 4. 打正式包

```bash
cd <生成的 TWA 项目目录>
bubblewrap build
```

完成后会得到：

- `app-release-signed.apk`（可安装测试）
- 若配置了 AAB，也会生成可上传 Play 的 `.aab`

### 5. 本机安装测试

```bash
bubblewrap install
```

或把 `app-release-signed.apk` 拷到手机安装。  
打开应用应会全屏打开你的网页（若未配置 Digital Asset Links，可能会带浏览器地址栏）。

---

## 四、Digital Asset Links（TWA 全屏必做）

要让应用以**全屏无地址栏**方式打开你的网站，必须在你的**网站**上声明“这个 Android 应用可以信任”。

### 1. 获取应用签名信息

在 TWA 项目目录执行：

```bash
bubblewrap fingerprint
```

会输出 SHA256 指纹，复制备用。

### 2. 在网站放置 assetlinks.json

在你网站根目录下创建：

**路径**：`https://你的域名.com/.well-known/assetlinks.json`

**内容示例**（把下面三处替换成你的）：

- `你的包名`：例如 `com.yourname.drawguess`
- `你的SHA256指纹`：上一步 `bubblewrap fingerprint` 的输出
- 若有多套签名（如 debug），可多加一条 `relation` 条目

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "你的包名",
      "sha256_cert_fingerprints": ["你的SHA256指纹"]
    }
  }
]
```

部署后确认：浏览器访问  
`https://你的域名.com/.well-known/assetlinks.json`  
能正常返回上述 JSON。

### 3. 重新安装 / 清除数据后再打开 App

配置好后，重新安装 APK 或在系统设置里清除该应用数据后再打开，应会以全屏 TWA 显示你的网页。

---

## 五、上传到 Google Play Console

1. **注册开发者**  
   打开 [Google Play Console](https://play.google.com/console)，用 Google 账号注册开发者（需一次性缴纳注册费，具体以当前政策为准）。

2. **创建应用**  
   - 点击「创建应用」  
   - 填写应用名称（如：你画我猜）、默认语言等

3. **准备商店信息**  
   - 应用图标、截图（手机截图即可）  
   - 简短说明、详细描述  
   - 分类选「游戏」  
   - 如需可设置内容分级、隐私政策链接等

4. **上传安装包**  
   - 在「发布」→「应用版本」里创建版本  
   - 上传 **AAB**（推荐）或 APK  
   - 若 Bubblewrap 默认只生成 APK，可在其项目里配置并重新执行 `bubblewrap build` 生成 AAB，或查阅 Bubblewrap 文档“生成 AAB”

5. **提交审核**  
   填写完必填项后提交审核，通过后即可在 Play 商店上架。

---

## 六、本项目已具备的内容

- **manifest.json**  
  已包含：`name`、`short_name`、`description`、`start_url`、`display`、`icons`、`theme_color` 等，满足 PWA/TWA 要求。  
  - 部署时请确保网站根路径下能访问到 `manifest.json`。  
  - 若首页不是 `index-standalone.html`，可在服务器做重定向或把 `start_url` 改成实际入口地址。

- **index-standalone.html**  
  已包含 `<link rel="manifest" href="manifest.json">` 和基础 meta，可直接作为 TWA 的入口页。

你只需要：

1. 把整站部署到 **HTTPS**
2. 准备好 **icon-192.png / icon-512.png**（或修改 manifest 里图标路径）
3. 按上面步骤用 **Bubblewrap** 初始化并打 APK/AAB
4. 配置 **.well-known/assetlinks.json**
5. 在 **Play Console** 创建应用、上传包、填信息、提交审核

---

## 七、不想用命令行的替代方式：PWA Builder

若不想用 Bubblewrap 命令行，可以用网页工具：

1. 打开 [PWA Builder](https://www.pwabuilder.com/)
2. 输入你**已上线**的网址（如 `https://你的域名.com/index-standalone.html`）
3. 按提示生成 Android 项目并下载
4. 用 Android Studio 打开项目，生成签名 APK/AAB 再上传 Play

本质也是 TWA，只是用图形界面完成“把 PWA 变成 Android 应用”这一步。

---

**总结**：把当前项目部署到 HTTPS，补全图标和 manifest，用 Bubblewrap（或 PWA Builder）打成 Android 安装包，配置好 Digital Asset Links，即可在 Google Play Console 提交上架，变成 Google Play 里的 App。
