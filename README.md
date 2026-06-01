# 🤖 全自动AI好物推荐博客

> AI每天自动写文章 → 自动发布 → SEO获取免费流量 → 广告+联盟自动赚钱

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 设置环境变量
cp .env.example .env
# 编辑 .env 填入你的 ANTHROPIC_API_KEY

# 3. 手动生成一篇文章测试
npm run generate

# 4. 本地预览
npm run dev

# 5. 构建
npm run build
```

## 📁 项目结构

```
src/
  content/blog/     # 所有文章（AI自动生成到此处）
  components/       # UI组件（广告位、好物卡片等）
  layouts/          # 页面布局
  pages/            # 路由页面
  utils/            # 工具函数
scripts/
  generate-content.js  # 🤖 核心：AI自动写作管道
  keyword-research.js  # 🔍 关键词研究
.github/workflows/
  generate-daily.yml   # ⏰ 每日自动生成1篇
  generate-weekly-batch.yml  # 📚 每周批量生成5篇
  keyword-research.yml       # 🔍 双周关键词研究
  keepalive.yml              # 💓 防休眠
data/
  topic-queue.json    # 📋 话题队列
```

## ⚙️ 全自动运行

1. 将代码推送到 GitHub
2. 在 GitHub Settings → Secrets 中添加 `ANTHROPIC_API_KEY`
3. 连接 Cloudflare Pages 自动部署
4. 系统自动：
   - 每天生成1篇文章
   - 每周一批量生成5篇
   - 每两周做一次关键词研究
   - 每50天保活防止休眠

## 💰 变现方式

- Google AdSense 广告
- 淘宝联盟/京东联盟（好物推荐佣金）
- 品牌合作/软文

## 📋 前置准备

1. GitHub 账号 → 推送代码
2. Cloudflare 账号 → 免费托管
3. Anthropic API Key → AI写作
4. 域名（~60元/年）→ 绑定网站
5. Google AdSense → 广告变现（上线后申请）
