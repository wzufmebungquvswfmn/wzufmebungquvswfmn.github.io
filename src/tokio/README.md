[rust 异步](rust/异步.md) 中介绍了 Rust 的异步编程模型和 Future 的概念，这里主要是对 Tokio 的介绍

# tokio
## 1. 运行时 Runtime
tokio 提供异步运行时，负责调度任务、I/O 事件和定时器。

```rust
#[tokio::main]
async fn main() {
	// async 入口
}
```

- 常用运行时模式:
  - multi_thread: 默认，多线程调度。
  - current_thread: 单线程调度，适合轻量场景。

## 2. 任务 Task

```rust
let handle = tokio::spawn(async {
	1 + 2
});

let v = handle.await?;
```

- `tokio::spawn` 要求任务是 `'static + Send`（多线程运行时）。
- 任务取消: `handle.abort()`。

## 3. 并发组合

```rust
let (a, b) = tokio::join!(task_a(), task_b());
let (x, y) = tokio::try_join!(op_x(), op_y())?;
```

- `join!`: 等全部完成，保留各自结果。
- `try_join!`: 任一返回错误则整体返回错误。

## 4. 超时与 select

```rust
use tokio::time::{timeout, Duration};

let r = timeout(Duration::from_secs(2), slow_op()).await;
```

```rust
tokio::select! {
	_ = shutdown.recv() => {},
	msg = rx.recv() => {
		// 处理消息
	}
}
```

- `timeout` 用于给异步操作设置时限。
- `select!` 用于等待多个异步分支，谁先完成就走谁。

## 5. 异步通道

```rust
use tokio::sync::{mpsc, oneshot};

let (tx, mut rx) = mpsc::channel::<String>(64);
let (done_tx, done_rx) = oneshot::channel::<u32>();
```

- `mpsc`: 多生产者单消费者。
- `oneshot`: 一次性响应，常用于请求-响应。

## 6. 同步原语

- `tokio::sync::Mutex` / `RwLock`: 异步锁。
- `Semaphore`: 并发限流。
- `Notify`: 轻量通知。

注意: 尽量避免在持锁期间做耗时 await。

## 7. 阻塞代码

```rust
let v = tokio::task::spawn_blocking(|| {
	heavy_cpu_or_blocking_io()
}).await?;
```

- CPU 密集或阻塞操作放入 `spawn_blocking`。
- 不要在 async 任务里直接长时间阻塞线程。

## 8. 常见坑

- 忘记 `.await`，future 实际没有执行。
- 在 async 任务中使用 `std::sync::Mutex` 并跨 await 持锁。
- 无限制 `spawn` 导致内存和调度压力过大。
- 任务里捕获了非 `'static` 引用，导致无法 `spawn`。

## 9. 学习顺序建议

1. `spawn` + `join!` + `try_join!`
2. `mpsc` + `oneshot`
3. `select!` + `timeout`
4. `Semaphore` + `spawn_blocking`
