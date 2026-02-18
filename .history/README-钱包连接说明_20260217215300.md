# 钱包连接说明

## 为什么显示「未检测到 Phantom」？

如果你是通过**双击 HTML 文件**或**从资源管理器打开**的页面，地址栏会是：

```
file:///C:/Users/justi/Desktop/games/index-standalone.html
```

在这种 `file://` 协议下，浏览器**不会**把 Phantom、Solflare 等扩展注入到页面里，所以页面检测不到钱包。

## 正确打开方式：用本地服务器

必须用 **http://** 打开页面，扩展才会被注入。

### 方法一：双击 `start-server.bat`（推荐）

1. 双击运行 **start-server.bat**
2. 在浏览器地址栏输入：**http://localhost:8080**
3. 再点击「连接钱包」，Phantom 就会被检测到并自动弹窗

### 方法二：VS Code / Cursor 的 Live Server

1. 安装扩展 **Live Server**
2. 右键 `index-standalone.html` → 选择 **Open with Live Server**
3. 浏览器会打开类似 `http://127.0.0.1:5500` 的地址，即可正常连接钱包

### 方法三：命令行

在项目文件夹打开终端，任选其一：

```bash
# 有 Python 时
python -m http.server 8080

# 或有 Node 时
npx serve -p 8080
```

然后在浏览器打开 **http://localhost:8080**。

---

总结：**不要用 file:// 打开，用 http://localhost 打开**，钱包就能被检测到。
