// Regenerate with Node.js after installing marked: node scripts/build-kernel-skills.mjs
// Or set MARKED_MODULE to an installed marked ES module. No runtime dependencies in the output.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const markedPath = process.env.MARKED_MODULE || require.resolve('marked');
const { Marked } = await import(pathToFileURL(markedPath).href);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = JSON.parse(fs.readFileSync(path.join(root, 'scripts/kernel-skills-source.json'), 'utf8'));
const repo = 'https://github.com/ZJLi2013/awesome-kernel-skills';
const out = path.join(root, 'kernel-skills');
fs.mkdirSync(out, { recursive: true });
const groups = [
  ['优化方法', 'optimization', [
    ['tier1-block-tiling', '分块与线程配置'], ['tier2-memory-access', '内存访问与层级'],
    ['tier3-compute-fusion', '计算优化与融合'], ['tier4-advanced-scheduling', '高级调度'],
    ['tier5-arch-nvidia', 'NVIDIA 架构'], ['tier5-arch-amd-rocm', 'AMD / ROCm 架构']]],
  ['算子实践', 'kernels', [
    ['gemm', 'GEMM · 矩阵乘'], ['flash-attention', 'FlashAttention'], ['fused-moe', 'Fused MoE'],
    ['softmax', 'Softmax'], ['rmsnorm', 'RMSNorm'], ['cross-entropy', 'Cross-Entropy'],
    ['rotary-embedding', 'RoPE · 旋转位置编码']]],
  ['优化流程', 'system', [
    ['optimize-loop', '优化循环'], ['profiling', '性能分析'], ['bottleneck-diagnosis', '瓶颈诊断'],
    ['verification', '正确性验证'], ['benchmark', '基准测试']]],
];
const pages = [{ slug: 'index', title: '学习路径', group: '学习路径', path: 'LEARNING_PATH.md' }];
for (const [group, dir, entries] of groups) for (const [slug, title] of entries)
  pages.push({ slug, title, group, path: `skills/${dir}/${slug}/SKILL.md` });
if (Object.keys(source.files).length !== 19 || pages.some(p => !(p.path in source.files)))
  throw new Error('Expected the learning path and all 18 skill files.');
const escaped = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const known = new Map();
for (const p of pages) for (const name of [p.path, p.path.replace(/^skills\//, ''), `${p.slug}/SKILL.md`, `${p.slug}/`, p.slug]) known.set(name, p.slug+'.html');
known.set('LEARNING_PATH.md', 'index.html');
const filePaths = new Set(source.tree.filter(t => t.type === 'blob').map(t => t.path));
const sourceUrl = p => `${repo}/blob/${source.sha}/${p}`;
function localRef(text, page) {
  if (known.has(text)) return known.get(text);
  const fromDir = path.posix.normalize(path.posix.join(path.posix.dirname(page.path), text));
  if (known.has(fromDir)) return known.get(fromDir);
  if (filePaths.has(text)) return sourceUrl(text);
  if (filePaths.has(fromDir)) return sourceUrl(fromDir);
  return null;
}
function rewriteLink(href, page) {
  if (/^(https?:|mailto:|#)/i.test(href)) return href;
  return localRef(href, page) || `${repo}/blob/${source.sha}/${path.posix.normalize(path.posix.join(path.posix.dirname(page.path), href))}`;
}
function nav(page) {
  let html = `<a class="path-link ${page.slug==='index'?'current':''}" ${page.slug==='index'?'aria-current="page"':''} href="index.html"><span>00</span> 学习路径</a>`;
  let i=0;
  for (const [label,,entries] of groups) {
    html += `<div class="nav-group"><p>${label}</p><ol>`;
    for (const [slug,title] of entries) { i++; html += `<li><a ${slug===page.slug?'class="current" aria-current="page"':''} href="${slug}.html"><span>${String(i).padStart(2,'0')}</span>${escaped(title)}</a></li>`; }
    html += '</ol></div>';
  }
  return html;
}
const manifest = [];
for (let pi=0; pi<pages.length; pi++) {
  const page=pages[pi];
  let md=source.files[page.path];
  const front=md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (front) md=md.slice(front[0].length);
  const headings=[], ids=new Map();
  const renderer = {
    heading(token) {
      const text=this.parser.parseInline(token.tokens);
      const plain=token.text.replace(/[`*_]/g,'');
      const base=plain.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,'').trim().replace(/\s+/g,'-') || 'section';
      const n=ids.get(base)||0; ids.set(base,n+1);
      const id=base+(n?'-'+n:'');
      if(token.depth>=2 && token.depth<=3) headings.push({id,text:plain,depth:token.depth});
      return `<h${token.depth} id="${escaped(id)}">${text}</h${token.depth}>\n`;
    },
    codespan(token) {
      const code=`<code>${escaped(token.text)}</code>`;
      const href=localRef(token.text,page);
      return href?`<a class="file-ref" href="${escaped(href)}">${code}</a>`:code;
    },
    link(token) {
      const href=rewriteLink(token.href,page);
      // Prevent nested links if a source link label itself contains a file reference.
      const label=this.parser.parseInline(token.tokens).replace(/<a\b[^>]*>([\s\S]*?)<\/a>/g,'$1');
      return `<a href="${escaped(href)}"${token.title?` title="${escaped(token.title)}"`:''}>${label}</a>`;
    },
    html(token) { return escaped(token.text); },
  };
  const marked=new Marked({gfm:true,breaks:false,renderer});
  let content=marked.parse(md);
  content=content.replace(/<table>/g,'<div class="table-scroll" tabindex="0" role="region" aria-label="表格，可横向滚动"><table>').replace(/<\/table>/g,'</table></div>');
  const titleText=md.match(/^#\s+(.+)$/m)?.[1]||page.title;
  const chapterNav=nav(page);
  const prev=pages[pi-1],next=pages[pi+1];
  const pager=`<nav class="pager" aria-label="相邻篇目">${prev?`<a href="${prev.slug}.html"><span>← 上一篇</span><strong>${escaped(prev.title)}</strong></a>`:'<span></span>'}${next?`<a class="next" href="${next.slug}.html"><span>下一篇 →</span><strong>${escaped(next.title)}</strong></a>`:'<a class="next" href="index.html"><span>返回</span><strong>学习路径 →</strong></a>'}</nav>`;
  const toc=`<details class="outline"><summary>本页目录 <span>${headings.length} 个章节</span></summary><ol>${headings.map(h=>`<li class="depth-${h.depth}"><a href="#${escaped(h.id)}">${escaped(h.text)}</a></li>`).join('')}</ol></details>`;
  const meta=front?`<details class="metadata"><summary>Skill 元信息</summary><pre><code>${escaped(front[1])}</code></pre></details>`:'';
  const html=`<!doctype html>
<html lang="${page.slug==='index'?'zh-CN':'en'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<script>try{const t=localStorage.getItem('kernel-skills-theme');document.documentElement.dataset.theme=t==='light'||t==='dark'?t:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch{document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}</script>
<meta name="description" content="${escaped(page.title)} · Awesome Kernel Skills：GPU kernel 优化学习路径与 18 篇笔记。">
<meta name="author" content="ZJLi2013 / awesome-kernel-skills">
<title>${escaped(page.title)} · Kernel Skills · 文章</title>
<link rel="canonical" href="https://zx3xyy.github.io/articles/kernel-skills/${page.slug==='index'?'':page.slug+'.html'}">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230d1117'/%3E%3Cpath d='M9 7v18m2-9L23 7M11 16l12 9' stroke='%2358a6ff' stroke-width='3' fill='none'/%3E%3C/svg%3E">
<link rel="stylesheet" href="reader.css">
<script src="theme.js" defer></script>
</head>
<body>
<a class="skip" href="#main">跳到正文</a>
<header class="topbar" lang="zh-CN"><a href="../">← 文章</a><a class="brand" href="index.html">Kernel Skills</a><a class="upstream" href="${repo}">原仓库 ↗</a><button class="theme-toggle" type="button" aria-label="切换深色模式" aria-pressed="false">深色</button></header>
<div class="layout">
<aside class="sidebar" lang="zh-CN"><p class="sidebar-label">学习目录 <span>18 篇</span></p><nav aria-label="学习目录">${chapterNav}</nav></aside>
<main id="main" tabindex="-1">
<details class="mobile-nav" lang="zh-CN"><summary>学习目录 · ${escaped(page.title)}</summary><nav aria-label="移动端学习目录">${chapterNav}</nav></details>
<div class="page-meta" lang="zh-CN"><span>${escaped(page.group)}</span><span>${String(pi).padStart(2,'0')} / 18</span></div>
<div class="source-note" lang="zh-CN">原文：<a href="${sourceUrl(page.path)}">ZJLi2013 / ${escaped(page.path)}</a><span>原文内容保留 · HTML 阅读版</span></div>
${toc}
<article class="prose" aria-label="${escaped(titleText)}">${content}</article>
${meta}
${pager}
<footer class="page-footer" lang="zh-CN">来源：<a href="${repo}">Awesome Kernel Skills</a> · <a href="${repo}/commit/${source.sha}">版本 ${source.sha.slice(0,7)}</a> · <a href="../">文章首页</a></footer>
</main>
</div>
<script defer src="../assets/analytics.js"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(out,page.slug+'.html'),html);
  manifest.push({...page,headings:headings.length});
}
console.log(`Generated ${manifest.length} HTML pages from source ${source.sha.slice(0,7)}.`);
