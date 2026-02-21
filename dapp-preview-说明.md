# dApp 商店截图规范与生成步骤

## 要求（Matching dimensions, Minimum 4）

- **尺寸一致**：建议统一 **1920×1080**（横屏）
- **至少 4 张**
- **格式**：jpg / png / webp，单张 **≤ 3MB**；或 mp4 ≤ 30MB

## 步骤一：把截图放进「截图」文件夹

1. 在项目里找到 **截图** 文件夹（与 `index-standalone.html` 同级）。
2. 把你的游戏截图（任意尺寸、至少 4 张）放进去，支持 `.png` / `.jpg` / `.webp`。

## 步骤二：安装依赖并运行脚本

在项目根目录（`games`）打开命令行，执行：

```bash
npm install sharp
node prepare-dapp-screenshots.cjs
```

## 步骤三：使用输出文件

- 脚本会在项目里生成 **dapp-preview** 文件夹。
- 里面有 **screenshot-1.png**、**screenshot-2.png** … 全部为 **1920×1080**，且体积控制在 3MB 以内。
- 上传到 dApp 商店时，选 **dapp-preview** 里的这 4 张（或更多）即可。

## 若没有「截图」文件夹

在项目根目录新建一个名为 **截图** 的文件夹，把至少 4 张游戏截图放进去，再执行上面的 `node prepare-dapp-screenshots.cjs`。
