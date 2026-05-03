# BinaryHeap

`BinaryHeap<T>` 是 Rust 标准库中的二叉堆，可以当作优先队列使用。它默认是**大顶堆**，也就是说每次 `pop` 都会弹出当前最大的元素。  

它的比较标准是根据字段顺序来的，所以元组或结构体（需要实现 `Ord` trait）的字段顺序也会影响比较结果。

**注意:**

`BinaryHeap` 只能保证堆顶是最大值，并不保证整体有序，如果想得到有序结果，需要不断 `pop`。

## 速览

| 方法 | 作用 | 快速访问 |
| --- | --- | --- |
| `push` | 插入元素 | [大顶堆](#大顶堆) |
| `pop` | 弹出最大元素 |
| `peek` | 查看最大元素但不弹出 |
| `len` / `is_empty` | 元素个数 / 是否为空 |
| `Reverse` | 变成小顶堆 | [小顶堆-reverse](#小顶堆-reverse) |
| | | [top-k-模板](#top-k-模板) |

## 大顶堆

```rust
use std::collections::BinaryHeap;

let mut heap = BinaryHeap::new();

heap.push(5);
heap.push(2);
heap.push(8);

assert_eq!(heap.peek(), Some(&8));
assert_eq!(heap.pop(), Some(8));
assert_eq!(heap.pop(), Some(5));
assert_eq!(heap.pop(), Some(2));
assert_eq!(heap.pop(), None);
```

## 小顶堆 Reverse

可以使用 `std::cmp::Reverse` 把排序规则反过来，从而得到小顶堆：

```rust
use std::cmp::Reverse;
use std::collections::BinaryHeap;

let mut heap = BinaryHeap::new();

heap.push(Reverse(5));
heap.push(Reverse(2));
heap.push(Reverse(8));

assert_eq!(heap.pop(), Some(Reverse(2)));
assert_eq!(heap.pop(), Some(Reverse(5)));
assert_eq!(heap.pop(), Some(Reverse(8)));
```

弹出时可以常使用模式匹配接收：

```rust
while let Some(Reverse(x)) = heap.pop() {
    println!("{}", x);
}
```

## Top K 模板

如果要找最大的 k 个元素，可以直接用大顶堆全部加入后弹出 k 次。

```rust
use std::collections::BinaryHeap;

let nums = vec![3, 1, 5, 2, 4];
let mut heap = BinaryHeap::from(nums);

let mut ans = Vec::new();
for _ in 0..3 {
    if let Some(x) = heap.pop() {
        ans.push(x);
    }
}

assert_eq!(ans, vec![5, 4, 3]);
```

如果数据很多，只想维护最大的 k 个元素，也可以用小顶堆。堆中只保留 k 个元素，堆顶就是当前 top k 中最小的那个：

```rust
use std::cmp::Reverse;
use std::collections::BinaryHeap;

let nums = vec![3, 1, 5, 2, 4];
let k = 3;
let mut heap = BinaryHeap::new();

for x in nums {
    heap.push(Reverse(x));
    if heap.len() > k {
        heap.pop();
    }
}

let mut ans: Vec<_> = heap.into_iter().map(|Reverse(x)| x).collect();
ans.sort();

assert_eq!(ans, vec![3, 4, 5]);
```
