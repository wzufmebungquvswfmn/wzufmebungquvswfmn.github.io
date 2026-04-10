# 刷题常用
本节记录刷题中经常会遇到的一些数据结构以及技巧的使用

## 哈希表 std::collections::HashMap
1. entry() + or_insert()  
用法：  
**entry(key).or_insert(new_val) -> &(orign_val|new_val)**：  

试图插入(key, new_val)，并返回插入值的引用；但如果key已存在，则返回原有值的引用,例如：

```*map.entry("banana").or_insert(0) += 1; // 插入 "banana” 并计数```

2. values()/into_values():
返回仅有“值”的迭代器，其它与iter()/into_iter()类似


## 二维数组边界的优雅处理 checked_add_signed(dir)
grid[m][n]是一个二维矩阵，如果对于一个格子，需要检查它相邻的四个格子，可使用以下标准方法
```rust
let dir = [-1, 0, 1, 0, -1];
for i in 0..m {
    for j in 0..n {
        for d in dir.windows(2) {
            if let (Some(r), Some(c)) = (i.checked_add_signed(d[0]), j.checked_add_signed(d[1])) {
                if r < m && c < n {print!("合法格子:{}",grid[r][c]);}
            }
        }
    }
}
```
但是由于usize类型小于0时会发生下溢，故即使不使用checked_add_signed可行”
```rust
for i in 0..m {
    for j in 0..n {
        for (r, c) in [(i - 1, j), (i, j - 1), (i + 1, j), (i, j + 1)] {
            if r < m && c < n {print!("合法格子:{}",grid[r][c]);}
        }
    }
}
```
但是[(i - 1, j), (i, j - 1), (i + 1, j), (i, j + 1)]写起来真的很烦人

## 大顶堆 std::collections::BinaryHeap
rust的BinaryHeap默认是大顶堆，如果需要小顶堆，可以使用Reverse
```rust
use std::collections::BinaryHeap;
use std::cmp::Reverse;
fn main() {
    let mut heap = BinaryHeap::new();
    heap.push(Reverse(5));
    heap.push(Reverse(2));
    heap.push(Reverse(8));

    while let Some(Reverse(value)) = heap.pop() {
        println!("{}", value); // 输出：2, 5, 8
    }

    let mut max_heap = BinaryHeap::new();
    max_heap.push(5);
    max_heap.push(2);
    max_heap.push(8);
    while let Some(value) = max_heap.pop() {
        println!("{}", value); // 输出：8, 5, 2
    }
}
```

## 优先队列 std::collections::VecDeque
rust的VecDeque是一个双端队列，可以在两端高效地添加和移除元素
```rust
use std::collections::VecDeque;
fn main() {
    let mut queue = VecDeque::new();
    queue.push_back(1); // 从队尾添加元素
    queue.push_back(2);
    queue.push_back(3);

    while let Some(value) = queue.pop_front() { // 从队头移除元素
        println!("{}", value); // 输出：1, 2, 3
    }
}
```

