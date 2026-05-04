import { useState } from 'react'
import './App.css'

function App() {
  const notesUrl = import.meta.env.DEV ? 'http://localhost:3000/' : '/notes/'
  const githubUrl = 'https://github.com/wzufmebungquvswfmn/wzufmebungquvswfmn.github.io'
  const [introOpen, setIntroOpen] = useState(false)
  const noteHref = (path = '') => `${notesUrl}${path}`

  const knowledgeNodes = [
    {
      title: '所有权',
      href: noteHref('rust/所有权.html'),
      description: '移动、借用与所有权规则。',
      tone: 'rose',
      size: 'md',
      x: 20,
      y: 28,
      delay: '0s',
    },
    {
      title: '结构体',
      href: noteHref('rust/结构体.html'),
      description: '结构体定义、方法与数据建模。',
      tone: 'amber',
      size: 'sm',
      x: 38,
      y: 20,
      delay: '-2.2s',
    },
    {
      title: '字符串',
      href: noteHref('rust/字符串.html'),
      description: 'String、切片、输入与常见转换。',
      tone: 'pink',
      size: 'md',
      x: 58,
      y: 23,
      delay: '-3.6s',
    },
    {
      title: '集合数据结构',
      href: noteHref('rust/集合数据结构.html'),
      description: 'Vec、HashMap、BTreeMap、BinaryHeap、VecDeque。',
      tone: 'blue',
      size: 'lg',
      x: 78,
      y: 31,
      delay: '-2.7s',
    },
    {
      title: '模式匹配',
      href: noteHref('rust/模式匹配.html'),
      description: 'match、if let 与常用模式整理。',
      tone: 'violet',
      size: 'md',
      x: 28,
      y: 50,
      delay: '-1.1s',
    },
    {
      title: '泛型和特征',
      href: noteHref('rust/泛型和特征.html'),
      description: '泛型约束、trait 与抽象表达。',
      tone: 'teal',
      size: 'lg',
      x: 50,
      y: 45,
      delay: '-4.1s',
    },
    {
      title: '生命周期',
      href: noteHref('rust/生命周期.html'),
      description: '引用有效性与生命周期标注。',
      tone: 'stone',
      size: 'md',
      x: 70,
      y: 54,
      delay: '-0.8s',
    },
    {
      title: '智能指针',
      href: noteHref('rust/智能指针.html'),
      description: 'Box、Rc、Arc 与内部可变性相关笔记。',
      tone: 'cyan',
      size: 'md',
      x: 18,
      y: 72,
      delay: '-3.1s',
    },
    {
      title: '多线程',
      href: noteHref('rust/多线程.html'),
      description: '线程、共享状态与并发基础。',
      tone: 'green',
      size: 'sm',
      x: 42,
      y: 72,
      delay: '-1.8s',
    },
    {
      title: '异步',
      href: noteHref('rust/异步.html'),
      description: 'Future、await 与异步模型。',
      tone: 'rose',
      size: 'md',
      x: 62,
      y: 76,
      delay: '-4.6s',
    },
    {
      title: '宏',
      href: noteHref('rust/宏.html'),
      description: 'Rust 宏相关记录。',
      tone: 'amber',
      size: 'sm',
      x: 84,
      y: 72,
      delay: '-2.9s',
    },
    {
      title: '迭代器',
      href: noteHref('rust/迭代器.html'),
      description: '迭代器适配器与常用写法。',
      tone: 'slate',
      size: 'sm',
      x: 84,
      y: 50,
      delay: '-5.1s',
    },
    {
      title: 'Tokio',
      href: noteHref('tokio/'),
      description: '异步运行时、任务调度，以及把并发程序写稳的实践。',
      tone: 'cyan',
      size: 'md',
      x: 50,
      y: 88,
      delay: '-1.4s',
    },
    {
      title: '系统编程',
      href: noteHref('notes/os/系统编程.html'),
      description: '系统编程相关笔记，偏底层机制、环境与工程问题。',
      tone: 'slate',
      size: 'sm',
      x: 10,
      y: 49,
      delay: '-5.4s',
    },
    {
      title: '网络编程',
      href: noteHref('notes/web/网络编程.html'),
      description: '网络编程、协议、服务端实践，以及那些容易被忽略的边界。',
      tone: 'green',
      size: 'sm',
      x: 91,
      y: 39,
      delay: '-4.3s',
    },
    {
      title: 'Problems',
      href: noteHref('problem/'),
      description: '真实踩坑记录：环境、工具链、mdBook 与编辑器问题。',
      tone: 'stone',
      size: 'sm',
      x: 8,
      y: 66,
      delay: '-6.1s',
    },
  ]

  return (
    <div className="app">
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="brand">
            <span className="brand-mark">LN</span>
            <div className="brand-text">
              <p className="brand-title">Learning Notes</p>
              <p className="brand-sub">Personal Tech Journal</p>
            </div>
          </div>
          <nav className="nav">
            <a href="/">Home</a>
            <a href={notesUrl} target="_blank" rel="noopener noreferrer">Notes</a>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
            <button className="btn btn-ghost" type="button" onClick={() => setIntroOpen(true)}>简介</button>
          </nav>
        </div>
      </header>

      <main className="main">
        <section className="hero container">
          <div className="hero-copy">
            <p className="eyebrow">Personal Learning Journal</p>
            <h1>My Learning Journey.</h1>
            <p className="lead">
              一个更自由的技术主页：笔记、想法、项目和那些正在形成中的知识结构。
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#knowledge-map">往下看看</a>
              <a className="btn btn-ghost" href={githubUrl} target="_blank" rel="noopener noreferrer">访问 GitHub</a>
            </div>
            <div className="hero-meta">
              <div>
                <p className="meta-number">Rust · Tokio · Web</p>
                <p className="meta-label">学习方向</p>
              </div>
              <div>
                <p className="meta-number">持续更新</p>
                <p className="meta-label">记录与复盘</p>
              </div>
            </div>
          </div>
          <aside className="hero-card">
            <p className="card-kicker">Quick Entry</p>
            <h2>学习笔记</h2>
            <p className="card-body">
              Rust、Tokio、网络编程等技术学习笔记与实践记录。
            </p>
            <a className="card-link" href={notesUrl} target="_blank" rel="noopener noreferrer">进入笔记</a>
          </aside>
        </section>

        <section className="section container knowledge-section" id="knowledge-map">
          <div className="section-header">
            <div>
              <p className="eyebrow">Topics</p>
              <h2>技术札记</h2>
            </div>
            <a className="section-link" href={notesUrl} target="_blank" rel="noopener noreferrer">All Notes</a>
          </div>
          <div className="knowledge-map" aria-label="Topics">
            {knowledgeNodes.map((node) => (
              <a
                className={`knowledge-node node-${node.tone} node-${node.size}`}
                href={node.href}
                key={node.title}
                rel="noopener noreferrer"
                style={{
                  '--x': `${node.x}%`,
                  '--y': `${node.y}%`,
                  '--delay': node.delay,
                }}
                target="_blank"
              >
                <span className="node-label">{node.title}</span>
                <span className="node-tooltip">
                  <strong>{node.title}</strong>
                  <span>{node.description}</span>
                  <em>Open notes</em>
                </span>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>2026 Learning Notes. Built for clarity.</p>
      </footer>

      {introOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setIntroOpen(false)}>
          <div className="modal-card" role="dialog" aria-modal="true" aria-label="简介" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <p className="modal-title">简介</p>
              <button className="icon-btn" type="button" onClick={() => setIntroOpen(false)} aria-label="Close">x</button>
            </div>
            <div className="modal-body">
              <p>这里放一些学习记录、工程实践，以及偶尔冒出来的新想法。</p>
              <p>内容会慢慢长出来。现在先从 Rust、Tokio、系统和网络开始。</p>
            </div>
            <div className="modal-actions">
              <a className="btn btn-primary" href={notesUrl} target="_blank" rel="noopener noreferrer">进入笔记库</a>
              <a className="btn btn-ghost" href={githubUrl} target="_blank" rel="noopener noreferrer">访问 GitHub</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
