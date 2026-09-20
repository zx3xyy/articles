# articles

技术文章合集，每篇一个目录，`index.html` 即文章页。

- [TPU Sync 数据面学习手册](https://zx3xyy.github.io/articles/tpu-sync/) — 面向 NVIDIA 工程师的 TorchTPU / TPU7x 英文学习路径，含 XLA / PJRT 基础、源码导读和 4 个交互演示。

- [DFlash2 讲解](https://zx3xyy.github.io/articles/dflash2/) — speculative decoding：一次 forward 猜完一整个 token block

- [Kernel Skills 学习手册](https://zx3xyy.github.io/articles/kernel-skills/) — 学习路径与 18 篇原文笔记，支持浅色 / 深色阅读。来源：[ZJLi2013/awesome-kernel-skills](https://github.com/ZJLi2013/awesome-kernel-skills)。

## Kernel Skills 阅读版

保留原文内容、代码、表格、自测题和 Agent Instructions；每页标注原文链接及固定源版本。页面由 `scripts/build-kernel-skills.mjs` 从 `scripts/kernel-skills-source.json` 生成，静态 HTML 无需客户端 Markdown 库。

重新生成：在已安装 `marked` 的 Node.js 环境中运行 `node scripts/build-kernel-skills.mjs`，或通过 `MARKED_MODULE` 指定 marked 模块的绝对路径。

## Visitor analytics

All 22 HTML pages load `assets/analytics.js`. This loads Cloudflare Web Analytics only on the production `https://zx3xyy.github.io/articles/` site, when a public beacon token is configured. Local files/previews and visitors sending Do Not Track or Global Privacy Control are excluded. No custom click events or user identifiers are added. Anchor navigation is not treated as a new page view (`spa: false`).

Setup: in [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/get-started/), add the hostname `zx3xyy.github.io` and copy the public token from Manage site → JavaScript snippet into `assets/analytics.js`. Do not use an API key. An empty token keeps analytics disabled. View statistics in that Cloudflare account; blocker extensions and opt-outs mean counts are estimates, not an exact census.

For new article pages, add `<script defer src="../assets/analytics.js"></script>` before `</body>` (use `assets/analytics.js` at the collection root). The Kernel Skills generator includes this automatically. If an external generator rebuilds another article, preserve this tag and the hosted article's analytics notice.
