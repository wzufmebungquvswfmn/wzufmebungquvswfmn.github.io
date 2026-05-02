# Vec

`Vec<T>` 是 Rust 中最常用的动态数组，元素在内存中连续存储，可以通过下标快速访问。刷题时，只要需要存储一组有顺序的数据，基本都会优先想到 `Vec`。

如果是为了查阅相关方法，可以直接跳转：
- [常用方法速查](#常用速查)

## 创建 Vec

最常用的是 `vec![]` 宏：

```rust
let nums = vec![1, 2, 3];
let empty: Vec<i32> = Vec::new();
```

如果已经知道大概需要存多少元素，可以使用 `with_capacity` 预先分配容量：

```rust
let mut nums = Vec::with_capacity(100);
```

`capacity` 是已经分配的容量，`len` 是当前实际元素个数：

```rust
let nums = vec![1, 2, 3];

assert_eq!(nums.len(), 3);
```

## 添加和删除

`push` 和 `pop` 用于在尾部添加和删除元素，是最常见的栈操作：

```rust
let mut nums = vec![1, 2];

nums.push(3);
assert_eq!(nums.pop(), Some(3));
```

`insert` 可以在指定位置插入元素，`remove` 可以删除指定位置的元素：

```rust
let mut nums = vec![1, 3];

nums.insert(1, 2);
assert_eq!(nums, vec![1, 2, 3]);

let x = nums.remove(1);
assert_eq!(x, 2);
assert_eq!(nums, vec![1, 3]);
```

需要注意，`insert` 和 `remove` 会移动后面的元素，时间复杂度是 `O(n)`。

如果不关心元素顺序，可以使用 `swap_remove`，它会把最后一个元素换到被删除的位置，因此更快：

```rust
let mut nums = vec![10, 20, 30, 40];

let x = nums.swap_remove(1);

assert_eq!(x, 20);
assert_eq!(nums, vec![10, 40, 30]);
```

## 访问元素

使用下标访问时，如果越界会 panic：

```rust
let nums = vec![1, 2, 3];

let x = nums[0];
```

如果不确定下标是否合法，使用 `get` 更安全：

```rust
let nums = vec![1, 2, 3];

if let Some(x) = nums.get(10) {
    println!("{}", x);
}
```

常用的首尾访问方法：

```rust
let nums = vec![1, 2, 3];

assert_eq!(nums.first(), Some(&1));
assert_eq!(nums.last(), Some(&3));
```

如果需要修改元素，可以使用 `get_mut`：

```rust
let mut nums = vec![1, 2, 3];

if let Some(x) = nums.get_mut(0) {
    *x = 10;
}

assert_eq!(nums, vec![10, 2, 3]);
```

## 排序

`sort` 默认升序排序：

```rust
let mut nums = vec![3, 1, 2];

nums.sort();

assert_eq!(nums, vec![1, 2, 3]);
```

降序可以使用 `sort_by`：

```rust
let mut nums = vec![3, 1, 2];

nums.sort_by(|a, b| b.cmp(a));

assert_eq!(nums, vec![3, 2, 1]);
```

如果按某个字段或计算结果排序，使用 `sort_by_key`：

```rust
let mut words = vec!["aaa", "b", "cc"];

words.sort_by_key(|s| s.len());

assert_eq!(words, vec!["b", "cc", "aaa"]);
```

`reverse` 会直接翻转整个 `Vec`：

```rust
let mut nums = vec![1, 2, 3];

nums.reverse();

assert_eq!(nums, vec![3, 2, 1]);
```

## 去重

`dedup` 只会删除相邻重复元素，所以常见用法是先排序，再去重：

```rust
let mut nums = vec![3, 1, 2, 3, 2];

nums.sort();
nums.dedup();

assert_eq!(nums, vec![1, 2, 3]);
```

如果原本就只需要删除连续重复元素，可以直接使用 `dedup`。

```rust
let mut nums = vec![1, 1, 2, 2, 1];

nums.dedup();

assert_eq!(nums, vec![1, 2, 1]);
```

## 原地过滤 retain

`retain` 会保留满足条件的元素，相当于原地过滤：

```rust
let mut nums = vec![1, 2, 3, 4, 5];

nums.retain(|x| *x % 2 == 1);

assert_eq!(nums, vec![1, 3, 5]);
```

它和迭代器里的 `filter().collect()` 很像，不过 `retain` 是直接修改原来的 `Vec`。

## 查找

`contains` 用于判断元素是否存在：

```rust
let nums = vec![1, 2, 3];

assert!(nums.contains(&2));
```

如果 `Vec` 已经有序，可以使用 `binary_search` 二分查找：

```rust
let nums = vec![1, 3, 5, 7];

assert_eq!(nums.binary_search(&5), Ok(2));
assert_eq!(nums.binary_search(&4), Err(2));
```

`Ok(index)` 表示找到了元素，`Err(index)` 表示没找到，并给出可以插入的位置。

## 切片相关方法

很多 `Vec` 方法其实来自切片 `[T]`，所以数组、切片、`Vec` 都能用。

`windows` 用于生成固定长度的滑动窗口：

```rust
let nums = vec![1, 2, 3, 4];

for w in nums.windows(2) {
    println!("{:?}", w);
}
```

输出的窗口依次是 `[1, 2]`、`[2, 3]`、`[3, 4]`。

`chunks` 用于按固定大小分组：

```rust
let nums = vec![1, 2, 3, 4, 5];

for chunk in nums.chunks(2) {
    println!("{:?}", chunk);
}
```

输出的分组是 `[1, 2]`、`[3, 4]`、`[5]`。

`split_at` 可以把切片从某个位置分成两段：

```rust
let nums = vec![1, 2, 3, 4];

let (left, right) = nums.split_at(2);

assert_eq!(left, &[1, 2]);
assert_eq!(right, &[3, 4]);
```

## 二维数组和方向数组

刷题中常用 `Vec<Vec<T>>` 表示二维矩阵：

```rust
let grid = vec![
    vec![1, 2, 3],
    vec![4, 5, 6],
];

let m = grid.len();
let n = grid[0].len();
```

遍历上下左右方向时，可以使用方向数组：

```rust
let dirs = [-1, 0, 1, 0, -1];

for i in 0..m {
    for j in 0..n {
        for d in dirs.windows(2) {
            if let (Some(r), Some(c)) = (
                i.checked_add_signed(d[0]),
                j.checked_add_signed(d[1]),
            ) {
                if r < m && c < n {
                    println!("{}", grid[r][c]);
                }
            }
        }
    }
}
```

这里使用 `checked_add_signed` 是为了避免 `usize` 在做 `i - 1` 时发生下溢。

## 常用速查

| 方法 | 作用 |
| --- | --- |
| `push` | 尾部添加元素 |
| `pop` | 尾部弹出元素 |
| `insert` | 指定位置插入 |
| `remove` | 指定位置删除，保持顺序 |
| `swap_remove` | 指定位置删除，不保持顺序 |
| `sort` | 升序排序 |
| `sort_by` | 自定义排序 |
| `sort_by_key` | 按 key 排序 |
| `reverse` | 翻转 |
| `dedup` | 删除相邻重复元素 |
| `retain` | 原地过滤 |
| `contains` | 判断是否包含元素 |
| `binary_search` | 有序数组二分查找 |
| `windows` | 滑动窗口 |
| `chunks` | 分块遍历 |
| `split_at` | 切分切片 |
