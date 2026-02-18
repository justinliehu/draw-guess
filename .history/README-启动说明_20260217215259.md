# 启动说明

## 方式一：直接打开 HTML（推荐，无需 Node.js）

**双击打开文件：**
```
index-standalone.html
```

这个文件包含了完整的单页应用，可以直接在浏览器中运行，无需安装任何依赖。

---

## 方式二：使用 Vite 开发服务器（需要 Node.js）

如果你已经安装了 Node.js，可以运行：

```bash
npm install
npm run dev
```

然后在浏览器打开显示的地址（通常是 `http://localhost:5173`）

---

## 如果遇到问题

1. **无法打开网页**：请使用方式一，直接双击 `index-standalone.html`
2. **Node.js 未安装**：使用方式一，或访问 [nodejs.org](https://nodejs.org) 下载安装
3. **端口被占用**：修改 `vite.config.ts` 中的端口号
