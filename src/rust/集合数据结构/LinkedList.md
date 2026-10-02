# LinkedList

`LinkedList<T>` 是标准库 `std::collections` 提供的双向链表，两端插入、删除都是 O(1)。

需要先说明的是：Rust 标准库文档自己就写道

> NOTE: It is almost always better to use `Vec` or `VecDeque` because array-based containers are generally faster, more memory efficient, and make better use of CPU cache.

所以在日常代码里几乎不会用它，但是可以学习一下思路。

## 速览

| 方法 | 作用 | 快速访问 |
| --- | --- | --- |
| `push_front` / `push_back` | 头部 / 尾部插入 | [基本操作](#基本操作) |
| `pop_front` / `pop_back` | 头部 / 尾部弹出 | [基本操作](#基本操作) |
| `front` / `back` | 查看头部 / 尾部 | [基本操作](#基本操作) |
| `len` / `is_empty` / `clear` | 长度 / 是否为空 / 清空 | [基本操作](#基本操作) |
| `iter` / `iter_mut` | 遍历（可修改） | [遍历](#遍历) |
| `append` / `split_off` | 拼接 / 分裂 | [拼接与分裂](#拼接与分裂) |
| `contains` | 是否包含某元素 | [拼接与分裂](#拼接与分裂) |

## 基本操作

两端都可以进出：

```rust
use std::collections::LinkedList;

let mut list: LinkedList<i32> = LinkedList::new();
assert!(list.is_empty());

// 两端插入
list.push_front(1); // [1]
list.push_back(2);  // [1, 2]
list.push_front(0); // [0, 1, 2]

// 查看两端
assert_eq!(list.front(), Some(&0));
assert_eq!(list.back(), Some(&2));

// 两端弹出
assert_eq!(list.pop_front(), Some(0));
assert_eq!(list.pop_back(), Some(2));

assert_eq!(list.len(), 1);
assert_eq!(list.pop_front(), Some(1));
assert_eq!(list.pop_front(), None);
```

注意 `front` / `back` 返回的是引用，`pop_front` / `pop_back` 返回的是 `Option<T>`（所有权）。

## 遍历

和 `Vec` 一样支持 `for` 循环与迭代器：

```rust
use std::collections::LinkedList;

let mut list = LinkedList::new();
list.push_back(1);
list.push_back(2);
list.push_back(3);

// 只读遍历
let mut sum = 0;
for &x in &list {
    sum += x;
}
assert_eq!(sum, 6);

// 可变遍历
for x in list.iter_mut() {
    *x *= 2;
}
assert_eq!(list.iter().copied().collect::<Vec<_>>(), vec![2, 4, 6]);
```

## 拼接与分裂

`append` 把另一个链表的元素搬到当前链表末尾，源链表会被清空（整个过程不重新分配节点）：

```rust
use std::collections::LinkedList;

let mut a: LinkedList<i32> = (1..=3).collect();
let mut b: LinkedList<i32> = (4..=6).collect();

a.append(&mut b);

assert_eq!(a.iter().copied().collect::<Vec<_>>(), vec![1, 2, 3, 4, 5, 6]);
assert!(b.is_empty());
```

`split_off` 在下标处把链表一分为二，返回后半部分：

```rust
use std::collections::LinkedList;

let mut c: LinkedList<i32> = (1..=6).collect();
let d = c.split_off(3);

assert_eq!(c.iter().copied().collect::<Vec<_>>(), vec![1, 2, 3]);
assert_eq!(d.iter().copied().collect::<Vec<_>>(), vec![4, 5, 6]);
```

## 为什么刷题很少直接用它

`LinkedList` 看着很美好，但缺少刷题真正需要的能力：

- 不能按下标访问，没有 `Index`，也没有 `remove(i)`；想找某个元素只能从头遍历。
- 稳定版没有 `Cursor`，拿不到“某个节点”的句柄，因此做不到“已知节点、O(1) 删除并移动到表头”。
- 每个元素单独分配内存，缓存不友好，常数比数组大很多。

像 LRU 缓存这种要求“任意节点 O(1) 删除 + 移到最近使用端”的题目，用标准库的 `LinkedList` 反而写不出来。这时一般有两种手写方案。

## 手写方案一：数组模拟（刷题推荐）

用几个平行数组存 `prev` / `next` / `value`，节点用下标表示。为了省掉首尾的边界判断，通常额外加一个头哨兵和一个尾哨兵。

数组模拟的本质就是把指针换成下标，核心操作就是下面这几行：

```rust
// 下标 0 为 head 哨兵，1 为 tail 哨兵，其余为数据节点
const HEAD: usize = 0;
const TAIL: usize = 1;

let n = 1000; // 数据节点上限
let mut prev: Vec<usize> = vec![0; n + 2];
let mut next: Vec<usize> = vec![0; n + 2];
let mut val: Vec<i32> = vec![0; n + 2];

// 初始为空链表：head <-> tail
next[HEAD] = TAIL;
prev[TAIL] = HEAD;

// 在 p 后面插入节点 x（p、x 都是下标）
let (p, x) = (HEAD, 2);
val[x] = 42;
next[x] = next[p];
prev[x] = p;
prev[next[p]] = x;
next[p] = x;

// 删除节点 x
next[prev[x]] = next[x];
prev[next[x]] = prev[x];
```

这种写法没有所有权问题，操作都是常数时间，而且内存连续、速度很快，是刷题时最常用的双向链表实现。

## 手写方案二：Rc<RefCell>

如果想让节点带有真正的“句柄”（可以安全地共享、互相指向），可以用 `Rc<RefCell<Node>>`，其中 `prev` 用 `Weak` 避免循环引用导致的泄漏：

```rust
use std::cell::RefCell;
use std::rc::{Rc, Weak};

struct Node {
    val: i32,
    prev: Weak<RefCell<Node>>,
    next: Option<Rc<RefCell<Node>>>,
}
```

这种方式写起来比较繁琐，还要配合 `Weak::upgrade` 处理悬空引用，适合作为学习用途，刷题时一般优先用上面的数组模拟。`Rc` / `RefCell` / `Weak` 的细节可以参考[智能指针](../智能指针.md)。

## 实战：LRU 缓存

下面用数组模拟实现一个 LRU 缓存。核心思路是：

- 用 `HashMap` 记录 key 到节点下标的映射，实现 O(1) 查找。
- 用双向链表维护访问顺序：头部是最近使用，尾部是最久未使用。
- `get` / `put` 命中的节点先摘下来，再插到头部；容量满时删掉尾部节点。

```rust
use std::collections::HashMap;

struct LRUCache {
    map: HashMap<i32, usize>, // key -> 节点下标
    key: Vec<i32>,
    val: Vec<i32>,
    prev: Vec<usize>,
    next: Vec<usize>,
    free: Vec<usize>, // 可复用的空闲下标
}

const HEAD: usize = 0;
const TAIL: usize = 1;

impl LRUCache {
    fn new(capacity: i32) -> Self {
        let total = capacity as usize + 2; // 加两个哨兵
        let mut prev: Vec<usize> = vec![0; total];
        let mut next: Vec<usize> = vec![0; total];

        // 初始为空：head <-> tail
        next[HEAD] = TAIL;
        prev[TAIL] = HEAD;

        LRUCache {
            map: HashMap::new(),
            key: vec![0; total],
            val: vec![0; total],
            prev,
            next,
            free: (2..total).rev().collect(),
        }
    }

    // 把下标 x 从链表中摘除
    fn detach(&mut self, x: usize) {
        let (p, n) = (self.prev[x], self.next[x]);
        self.next[p] = n;
        self.prev[n] = p;
    }

    // 把下标 x 插到 HEAD 之后（标记为最近使用）
    fn attach_front(&mut self, x: usize) {
        let n = self.next[HEAD];
        self.next[HEAD] = x;
        self.prev[x] = HEAD;
        self.next[x] = n;
        self.prev[n] = x;
    }

    fn get(&mut self, key: i32) -> i32 {
        let Some(&x) = self.map.get(&key) else {
            return -1;
        };
        self.detach(x);
        self.attach_front(x);
        self.val[x]
    }

    fn put(&mut self, key: i32, value: i32) {
        // 已存在：更新值并提到头部
        if let Some(&x) = self.map.get(&key) {
            self.val[x] = value;
            self.detach(x);
            self.attach_front(x);
            return;
        }

        // 取一个空位；没有空位就淘汰尾部（最久未使用）的节点复用
        let x = match self.free.pop() {
            Some(x) => x,
            None => {
                let old = self.prev[TAIL];
                self.detach(old);
                self.map.remove(&self.key[old]);
                old
            }
        };

        self.key[x] = key;
        self.val[x] = value;
        self.attach_front(x);
        self.map.insert(key, x);
    }
}

// 简单验证
let mut cache = LRUCache::new(2);
cache.put(1, 1);
cache.put(2, 2);
assert_eq!(cache.get(1), 1);    // 1 变为最近使用
cache.put(3, 3);                // 容量满，淘汰最久未使用的 2
assert_eq!(cache.get(2), -1);
cache.put(4, 4);                // 淘汰 1
assert_eq!(cache.get(1), -1);
assert_eq!(cache.get(3), 3);
assert_eq!(cache.get(4), 4);
```
