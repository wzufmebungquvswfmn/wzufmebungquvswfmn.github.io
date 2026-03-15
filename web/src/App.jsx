import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header className="header">
        <h1>📚 My Learning Journey</h1>
        <p>记录学习过程中的点滴</p>
      </header>

      <main className="main">
        <section className="hero">
          <h2>Welcome</h2>
          <p>
            这是我的个人学习博客，记录我在编程和技术方面的学习笔记。
          </p>
          <button
            className="counter"
            onClick={() => setCount((count) => count + 1)}
          >
            点击次数: {count}
          </button>
        </section>

        <section className="cards">
          <div className="card">
            <h3>📖 学习笔记</h3>
            <p>Rust、Tokio、网络编程等技术学习笔记</p>
            <a href="/notes/" className="card-link">
              进入笔记 →
            </a>
          </div>

          <div className="card">
            <h3>📝 博客文章</h3>
            <p>关于学习心得和技术分享</p>
            <a href="/blog/" className="card-link">
              查看博客 →
            </a>
          </div>

          <div className="card">
            <h3>🔗 GitHub</h3>
            <p>查看源代码和项目</p>
            <a 
              href="https://github.com/wzufmebungquvswfmn/wzufmebungquvswfmn.github.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="card-link"
            >
              访问仓库 →
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2024 My Learning Blog. Built with React + mdbook</p>
      </footer>
    </div>
  )
}

export default App
