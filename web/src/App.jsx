import { useState } from 'react'
import './App.css'

function App() {
  const notesUrl = import.meta.env.DEV ? 'http://localhost:3000/' : '/notes/'
  const githubUrl = 'https://github.com/wzufmebungquvswfmn/wzufmebungquvswfmn.github.io'
  const [introOpen, setIntroOpen] = useState(false)
  const [projectOpen, setProjectOpen] = useState(null)

  const projects = [
    {
      level: '简单',
      hint: '先做这些，快速上手异步与并发。',
      items: [
        {
          title: '异步终端聊天室',
          summary: 'Tokio + Channel 的经典练手项目，多人消息广播。',
          chips: 'Tokio · mpsc · broadcast',
          detail:
            '目标：写一个服务端和一个客户端，多人通过 TCP 连接到服务端，任意人发消息，全体实时收到。你会练到：tokio::net::TcpListener 接收连接；为每个连接 tokio::spawn 独立任务；用 mpsc 处理单用户上行消息、用 tokio::sync::broadcast 进行全员广播。挑战点：跨任务共享状态（如在线用户列表）的并发安全。',
        },
        {
          title: '高并发链接检测器',
          summary: '抓取页面链接并并发验证 200/404。',
          chips: 'reqwest · Semaphore',
          detail:
            '目标：给一个起始 URL，抓取页面内所有超链接，并发请求这些链接，统计 200/404。你会练到：reqwest 发起异步 HTTP 请求；tokio::sync::mpsc::channel 汇总结果到主任务并打印/写入文件；tokio::sync::Semaphore 限制并发（例如同时最多 50 个请求，防止网络被打崩或被拉黑）。',
        },
        {
          title: '目录监控与自动备份',
          summary: 'notify 监听文件变更，异步备份。',
          chips: 'notify · tokio::fs',
          detail:
            '目标：使用 notify 监控某个文件夹，一旦文件新建/修改，立即压缩或拷贝到备份目录。你会练到：把同步的事件系统桥接到 Tokio 的异步世界（mpsc 传递事件）；使用 tokio::fs 进行异步读写，保证监控主线程不被阻塞。',
        },
      ],
    },
    {
      level: '中等',
      hint: '更复杂的并发编排与系统工程。',
      items: [
        {
          title: '异步 Redis 代理',
          summary: '并发请求多节点 Redis，竞速或聚合返回。',
          chips: 'tokio::select! · 连接池',
          detail:
            '目标：写一个 Proxy 服务端，客户端请求进来后并发请求 3 个真实 Redis 节点（可 Docker 起 3 个），谁先返回用谁的结果，或聚合 3 份结果返回。你会练到：连接池管理；tokio::select! 处理超时与竞速；错误处理（3 个 Redis 挂 2 个是否还能工作）；理解 Arc + Mutex 在多任务共享连接中的权衡。',
        },
        {
          title: '多线程下载器',
          summary: 'HTTP Range + 并行分段下载，合并文件。',
          chips: 'mpsc · 进度条',
          detail:
            '目标：CLI 工具输入大文件 URL（如 Ubuntu 镜像），分成 10 段并行下载，最后合并成一个文件。你会练到：HTTP Range 请求；通过 mpsc 汇总 10 个任务的进度，绘制实时进度条；并发写同一文件的不同位置（tokio::fs 的 seek）。',
        },
        {
          title: '异步端口扫描器',
          summary: '高并发扫描 IP 段常用端口。',
          chips: 'Semaphore · TCP/UDP',
          detail:
            '目标：扫描某 IP 段（如 192.168.1.0/24）常用端口，输出开放端口列表。你会练到：并发控制（Semaphore 或 mpsc 维护“工作池”，避免瞬间 spawn 过多任务）；抽象 Scanner trait，支持 TCP/UDP 两种实现；体会性能优化带来的差距。',
        },
      ],
    },
    {
      level: '困难',
      hint: '高吞吐与系统级设计挑战。',
      items: [
        {
          title: '区块链 Mempool 监控',
          summary: 'WebSocket 实时流处理与统计。',
          chips: 'Streams · Actor',
          detail:
            '目标：通过 WebSocket 连接链节点（如 Infura/Alchemy/Solana），实时监听 Pending Transactions，过滤特定类型交易（大额转账/合约调用），并统计 Gas 费用波动曲线。你会练到：高并发 WebSocket 流处理；Actor 模型解耦接收与处理；内存中维护滑动窗口（如最近 5 分钟）并用 VecDeque + 读写锁优化。',
        },
        {
          title: '撮合交易引擎',
          summary: '内存订单簿，价格优先/时间优先撮合。',
          chips: 'BTreeMap · 高并发',
          detail:
            '目标：实现纯内存限价订单簿，接收高频买卖单流，按“价格优先、时间优先”撮合，输出成交记录。你会练到：BTreeMap 维护价格档位；双向链表或 VecDeque 维护同价订单队列；无锁并发或细粒度锁减少争用；用 enum 定义订单状态机并模式匹配推进状态。',
        },
        {
          title: '极简编译器前端',
          summary: '手写 Lexer/Parser，输出 AST。',
          chips: 'AST · 错误恢复',
          detail:
            '目标：为微型语言（或现有语言子集）编写 Lexer/Parser，输出 AST。你会练到：用 enum 表达 AST 节点、Box<Node> 处理递归；解析错误恢复而不是 panic；通过生命周期标注 (&\'a str) 在不大量 clone 的前提下切片源代码。',
        },
      ],
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
            <a className="btn btn-accent" href={notesUrl} target="_blank" rel="noopener noreferrer">进入笔记</a>
          </nav>
        </div>
      </header>

      <main className="main">
        <section className="hero container">
          <div className="hero-copy">
            <p className="eyebrow">Personal Learning Journal</p>
            <h1>My Learning Journey.</h1>
            <p className="lead">
              记录我在编程与技术上的学习与实践。。。
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={notesUrl} target="_blank" rel="noopener noreferrer">进入笔记</a>
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

        <section className="section container">
          <div className="section-header">
            <h2>Projects Radar</h2>
            <a className="section-link" href={notesUrl} target="_blank" rel="noopener noreferrer">查看笔记</a>
          </div>
          <div className="projects">
            {projects.map((group) => (
              <section className="project-group" key={group.level}>
                <div className="project-head">
                  <p className="project-level">{group.level}</p>
                  <p className="project-hint">{group.hint}</p>
                </div>
                <div className="project-list">
                  {group.items.map((item) => (
                    <button
                      className="project-card"
                      type="button"
                      key={item.title}
                      onClick={() => setProjectOpen(item)}
                    >
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                      <span className="chip">{item.chips}</span>
                    </button>
                  ))}
                </div>
              </section>
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
              <button className="icon-btn" type="button" onClick={() => setIntroOpen(false)} aria-label="Close">✕</button>
            </div>
            <div className="modal-body">
              <p>这里是我的个人学习主页，记录 Rust、并发、系统设计与工程实践的笔记。</p>
              <p>主页保留清晰的结构与强对比视觉，用来提醒我在做什么，以及下一步做什么。</p>
            </div>
            <div className="modal-actions">
              <a className="btn btn-primary" href={notesUrl} target="_blank" rel="noopener noreferrer">进入笔记</a>
              <a className="btn btn-ghost" href={githubUrl} target="_blank" rel="noopener noreferrer">访问 GitHub</a>
            </div>
          </div>
        </div>
      )}

      {projectOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setProjectOpen(null)}>
          <div className="modal-card" role="dialog" aria-modal="true" aria-label={projectOpen.title} onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <p className="modal-title">{projectOpen.title}</p>
              <button className="icon-btn" type="button" onClick={() => setProjectOpen(null)} aria-label="Close">✕</button>
            </div>
            <div className="modal-body">
              <p>{projectOpen.summary}</p>
              <p>{projectOpen.detail}</p>
            </div>
            <div className="modal-actions">
              <span className="chip">{projectOpen.chips}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
