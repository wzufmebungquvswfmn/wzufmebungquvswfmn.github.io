# mdBook 目录结构说明

这个仓库使用 `mdBook` 来编写博客与知识库。所有页面内容在 `src/` 下，目录结构由 `src/SUMMARY.md` 控制，构建输出在 `book/` 目录。

## 目录结构

- `book.toml`：mdBook 配置文件（站点标题、语言、输出设置等）
- `src/`：所有 Markdown 内容所在目录
- `src/SUMMARY.md`：站点目录树（左侧导航），按需添加/调整条目
- `src/index.md`：首页
- `src/blog/`：博客分区
- `src/blog/README.md`：博客目录页
- `src/blog/2026-02-05-hello.md`：示例文章
- `src/notes/`：知识库分区
- `src/notes/README.md`：知识库目录页
- `src/notes/tooling.md`：示例笔记
- `book/`：构建输出目录（自动生成，已在 `.gitignore` 里忽略）

## 写作流程（简要）

1. 在 `src/` 下创建/编辑 Markdown 文件
2. 同步在 `src/SUMMARY.md` 中添加对应条目
3. 本地预览（自动刷新）：

```powershell
mdbook serve
```

浏览器访问 `http://localhost:3000` 查看效果。

## 站点样式自定义（本仓库的做法）

本仓库只修改了代码块字体为 Cascadia Code，正文仍使用 mdBook 默认字体。

涉及的配置点：

- `book.toml` 中配置自定义样式文件：

```toml
[output.html]
additional-css = ["src/theme/custom.css"]
```

- `src/theme/custom.css` 中仅为代码相关元素设置字体：

```css
code,
pre,
kbd,
samp {
  font-family: "Cascadia Code", "Cascadia Mono", "Fira Code", "JetBrains Mono",
    "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
}
```

## Markdown 写作小抄（常用语法）

- 标题：`#` 到 `######`
- 强调：`**加粗**`、`*斜体*`、`~~删除线~~`
- 列表：`-` 无序列表，`1.` 有序列表
- 链接：`[标题](链接)`
- 图片：`![alt 文本](图片路径)`
- 引用：`> 引用内容`
- 行内代码：`` `code` ``
- 代码块：

```text
```rust
fn main() {
    println!("hello");
}
```
```

- 表格：

```text
| 名称 | 说明 |
| --- | --- |
| mdBook | 文档工具 |
```

## 在本仓库里的写作习惯

- 每新增页面，要同步在 `src/SUMMARY.md` 里加一条导航
- 目录页用 `README.md`（比如 `src/blog/README.md`）
- 文件名尽量用 `yyyy-mm-dd-title.md` 或 `kebab-case.md`
