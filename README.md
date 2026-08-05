# NAVSITE

基于 Next.js 15（App Router）的个人导航站点，使用 Notion 作为内容数据源（CMS）。部署于 Cloudflare Pages。

## 技术栈

- Next.js 15 + React 19
- TypeScript + Tailwind CSS
- Notion API（@notionhq/client）作为数据库
- OpenNext 适配 Cloudflare Pages / Workers
- Cloudflare KV 用于 ISR 增量缓存

## 本地开发

```bash
pnpm install
cp .env.local.example .env.local   # 填写 Notion 配置
pnpm dev
```

## 环境变量

在 `.env.local`（本地）与 Cloudflare Pages 后台（生产）中配置：

| 变量 | 说明 |
|---|---|
| `NOTION_TOKEN` | Notion 集成令牌（Internal Integration Secret） |
| `NOTION_LINKS_DB_ID` | 导航链接数据库 ID |
| `NOTION_WEBSITE_CONFIG_ID` | 网站配置数据库 ID |
| `NOTION_CATEGORIES_DB_ID` | 分类数据库 ID |
| `NEXT_PUBLIC_SITE_URL` | 站点公开地址，如 `https://navsite.pages.dev` |
| `GA_ID` / `NEXT_PUBLIC_CLARITY_ID` | 可选，Google Analytics / Microsoft Clarity |

## 部署（Cloudflare Pages）

```bash
pnpm build        # 由 OpenNext 生成 .open-next 产物
pnpm preview      # 本地 Workers 运行时预览
```

在 Cloudflare Pages 中关联本仓库，构建命令 `pnpm build`、输出目录由 OpenNext 处理，并绑定 KV namespace 用于 ISR 缓存。
