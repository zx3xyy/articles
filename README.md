# articles

技术文章合集，每篇一个目录，`index.html` 即文章页。

- [DFlash2 讲解](https://zx3xyy.github.io/articles/dflash2/) — speculative decoding：一次 forward 猜完一整个 token block

- [Kernel Skills 学习手册](https://zx3xyy.github.io/articles/kernel-skills/) — 学习路径与 18 篇原文笔记，支持浅色 / 深色阅读。来源：[ZJLi2013/awesome-kernel-skills](https://github.com/ZJLi2013/awesome-kernel-skills)。

## Kernel Skills 阅读版

保留原文内容、代码、表格、自测题和 Agent Instructions；每页标注原文链接及固定源版本。页面由 `scripts/build-kernel-skills.mjs` 从 `scripts/kernel-skills-source.json` 生成，静态 HTML 无需客户端 Markdown 库。

重新生成：在已安装 `marked` 的 Node.js 环境中运行 `node scripts/build-kernel-skills.mjs`，或通过 `MARKED_MODULE` 指定 marked 模块的绝对路径。
