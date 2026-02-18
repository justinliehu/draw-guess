# 你画我猜 - 线上版

支持 Phantom/Solflare 钱包的多人你画我猜游戏，单页 + Node 服务，可部署上线并上架 **Solana Seeker dApp Store**。

## 流程

```
登录 → 游戏大厅 → 进入房间 → 等待玩家(Ready/聊天) → 游戏进行中 → 回合结算 → 最终结算
```

## 页面说明

| 路由 | 页面 | 说明 |
|------|------|------|
| `/login` | 登录 | 钱包/匿名登录、昵称、进入大厅 |
| `/lobby` | 游戏大厅 | 游戏列表、创建/加入房间、在线人数 |
| `/room/:roomId` | 房间 | 房间号、玩家列表、Ready、倒计时、聊天、退出 |
| `/game/:roomId` | 游戏进行 | 画板、工具栏、猜词聊天、状态、积分榜、词语提示 |
| `/round-end/:roomId` | 回合结束 | 正确答案、得分、3 秒后下一轮 |
| `/game-end/:roomId` | 游戏结束 | 最终排名、再来一局/回到大厅 |

## 开发优先级（建议）

- **第一阶段**：房间页、玩家 Ready、聊天
- **第二阶段**：游戏页、画板同步、猜词系统
- **第三阶段**：得分系统、回合轮换、游戏结束

## 本地运行（单页版，推荐）

```bash
node server.cjs
```

浏览器打开 `http://localhost:8080/index-standalone.html`。手机和电脑同一局域网可共用房间。

## 上线与上架 Solana dApp Store

图标、部署配置和上架步骤见：**[DEPLOY-SOLANA-DAPP-STORE.md](./DEPLOY-SOLANA-DAPP-STORE.md)**。
