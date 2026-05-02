# BinaryHeap

`BinaryHeap<T>` 是 Rust 标准库中的二叉堆，可以当作优先队列使用。它默认是**大顶堆**，也就是说每次 `pop` 都会弹出当前最大的元素。

使用前需要引入：

```rust
use std::collections::BinaryHeap;
```

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

常用方法：

| 方法 | 作用 |
| --- | --- |
| `push` | 插入元素 |
| `pop` | 弹出最大元素 |
| `peek` | 查看最大元素但不弹出 |
| `len` | 元素个数 |
| `is_empty` | 是否为空 |

## 小顶堆 Reverse

很多题目需要每次取最小值，这时可以使用 `std::cmp::Reverse` 把排序规则反过来：

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

弹出时可以直接模式匹配：

```rust
while let Some(Reverse(x)) = heap.pop() {
    println!("{}", x);
}
```

## 存储元组

`BinaryHeap` 中可以放元组，元组会按照字典序比较：

```rust
use std::collections::BinaryHeap;

let mut heap = BinaryHeap::new();

heap.push((3, "a"));
heap.push((1, "b"));
heap.push((3, "c"));

assert_eq!(heap.pop(), Some((3, "c")));
assert_eq!(heap.pop(), Some((3, "a")));
assert_eq!(heap.pop(), Some((1, "b")));
```

比较时先看第一个元素，第一个相同再看第二个元素。

如果想用小顶堆存元组，可以套 `Reverse`：

```rust
use std::cmp::Reverse;
use std::collections::BinaryHeap;

let mut heap = BinaryHeap::new();

heap.push(Reverse((3, "a")));
heap.push(Reverse((1, "b")));
heap.push(Reverse((3, "c")));

assert_eq!(heap.pop(), Some(Reverse((1, "b"))));
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

## 注意事项

`BinaryHeap` 只能保证堆顶是最大值，并不保证整体有序。

如果想得到有序结果，需要不断 `pop`，或者最后再排序：

```rust
use std::collections::BinaryHeap;

let heap = BinaryHeap::from(vec![3, 1, 2]);
let sorted = heap.into_sorted_vec();

assert_eq!(sorted, vec![1, 2, 3]);
```
