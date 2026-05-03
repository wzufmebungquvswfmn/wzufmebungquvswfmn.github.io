# VecDeque

`VecDeque<T>` 是双端队列，可以在队头和队尾高效地添加、删除元素。最常见的用途是 BFS 队列，也可以用于滑动窗口。

## 速览

| 方法 | 作用 | 快速访问 |
| --- | --- | --- |
| `push_back` | 队尾入队 | [作为队列使用](#作为队列使用) |
| `pop_front` | 队头出队 | 
| `len` / `is_empty` | 元素个数 / 是否为空 |
| `push_front` | 队头入队 | [作为双端队列使用](#作为双端队列使用) |
| `pop_back` | 队尾出队 |
| `front` | 查看队头 |
| `back` | 查看队尾 |
| | | [单调队列](#单调队列) |

## 作为队列使用

普通队列是先进先出，通常从队尾加入，从队头弹出：

```rust
use std::collections::VecDeque;

let mut queue = VecDeque::new();

queue.push_back(1);
queue.push_back(2);
queue.push_back(3);

assert_eq!(queue.pop_front(), Some(1));
assert_eq!(queue.pop_front(), Some(2));
assert_eq!(queue.pop_front(), Some(3));
assert_eq!(queue.pop_front(), None);
```

BFS 中经常这样写：

```rust
while !queue.is_empty() {
    let (r, c) = queue.pop_front().unwrap();
    // 处理 (r, c) 与其邻居
}
// 或者直接写成
while let Some((r, c)) = queue.pop_front() {
    // 处理 (r, c) 与其邻居
}
```

## 作为双端队列使用

`VecDeque` 两端都可以操作：

```rust
use std::collections::VecDeque;

let mut deque = VecDeque::new();

deque.push_front(1);
deque.push_back(2);

assert_eq!(deque.front(), Some(&1));
assert_eq!(deque.back(), Some(&2));

assert_eq!(deque.pop_back(), Some(2));
assert_eq!(deque.pop_front(), Some(1));
```

## 单调队列

求滑动窗口最大值，经常会使用单调队列。队列里存下标，并让对应的值保持单调。

下面是维护窗口最大值的常见写法：

```rust
use std::collections::VecDeque;

let nums = vec![1, 3, -1, -3, 5, 3, 6, 7];
let k = 3; // 窗口大小
let mut deque: VecDeque<usize> = VecDeque::new();
let mut ans = Vec::new();

for i in 0..nums.len() {
    while let Some(&j) = deque.back() {
        if nums[j] <= nums[i] {
            deque.pop_back();
        } else {
            break;
        }
    }

    deque.push_back(i);

    if let Some(&j) = deque.front() {
        if j + k <= i {
            deque.pop_front();
        }
    }

    if i + 1 >= k {
        ans.push(nums[*deque.front().unwrap()]);
    }
}

assert_eq!(ans, vec![3, 3, 5, 5, 6, 7]);
```

这里的核心思想是：队头始终保存当前窗口最大值的下标。
