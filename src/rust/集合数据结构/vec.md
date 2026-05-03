# Vec
## 速览

| 方法 | 作用 | 快速访问 |
| --- | --- | --- |
| `push` | 尾部添加元素 | [增删](#添加和删除) |
| `pop` | 尾部弹出元素 |
| `insert` | 指定位置插入 |
| `remove` | 指定位置删除，保持顺序 |
| `swap_remove` | 指定位置删除，不保持顺序 |
| `get` | 获取元素的引用，越界返回 None | [访问元素](#访问元素) |
| `get_mut` | 获取元素的可变引用，越界返回 None |
| `first` | 获取第一个元素的引用 |
| `last` | 获取最后一个元素的引用 |
| `sort` | 升序排序 | [排序](#原地排序) |
| `sort_by` | 自定义排序 |
| `sort_by_key` | 按 key 排序 |
| `reverse` | 翻转 |
| `dedup` | 删除相邻重复元素 | [去重](#原地去重) |
| `retain` | 原地过滤 | [过滤](#原地过滤-retain) |
| `contains` | 判断是否包含元素 | [查找](#查找) |
| `binary_search` | 有序数组二分查找 |
| `windows` | 滑动窗口 | [切片相关方法](#切片相关方法) |
| `chunks` | 分块遍历 |
| `split_at` | 切分切片 |


## 创建 Vec

- `vec![]` 宏
- Vec::new() 
- Vec::with_capacity(capacity)

## 添加和删除

- `push` 和 `pop` 用于在尾部添加和删除元素，是最常见的栈操作

- `insert` 可以在指定位置插入元素，`remove` 可以删除指定位置的元素：

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

- 使用下标访问时，如果越界会 panic

- 如果不确定下标是否合法，使用 `get` 更安全：

```rust
let nums = vec![1, 2, 3];

if let Some(x) = nums.get(10) {
    println!("{}", x);
}
```

- 只需首尾访问方法：

```rust
let nums = vec![1, 2, 3];

assert_eq!(nums.first(), Some(&1));
assert_eq!(nums.last(), Some(&3));
```

如果需要修改元素，可以使用 `get_mut`获取元素的可变引用：

```rust
let mut nums = vec![1, 2, 3];

if let Some(x) = nums.get_mut(0) {
    *x = 10;
}

assert_eq!(nums, vec![10, 2, 3]);
```

## 原地排序

- `sort` 默认升序排序：

- 降序可以使用 `sort_by`：

```rust
let mut nums = vec![3, 1, 2];

nums.sort_by(|a, b| b.cmp(a));

assert_eq!(nums, vec![3, 2, 1]);
```

- 如果按某个字段或计算结果排序，使用 `sort_by_key`：

```rust
let mut words = vec!["aaa", "b", "cc"];

words.sort_by_key(|s| s.len());

assert_eq!(words, vec!["b", "cc", "aaa"]);
```

- `reverse` 会直接翻转整个 `Vec`：

```rust
let mut nums = vec![1, 2, 3];

nums.reverse();

assert_eq!(nums, vec![3, 2, 1]);
```

## 原地去重

- `dedup` 只会删除相邻重复元素，所以常见用法是先排序，再去重：

```rust
let mut nums = vec![3, 1, 2, 3, 2];

nums.sort();
nums.dedup();

assert_eq!(nums, vec![1, 2, 3]);
```

## 原地过滤 retain

- `retain` 会保留满足条件的元素，相当于原地过滤：

```rust
let mut nums = vec![1, 2, 3, 4, 5];

nums.retain(|x| *x % 2 == 1);

assert_eq!(nums, vec![1, 3, 5]);
```


## 查找

- `contains` 用于判断元素是否存在：

```rust
let nums = vec![1, 2, 3];

assert!(nums.contains(&2));
```

- 如果 `Vec` 已经有序，可以使用 `binary_search` 二分查找：

```rust
let nums = vec![1, 3, 5, 7];

assert_eq!(nums.binary_search(&5), Ok(2));
assert_eq!(nums.binary_search(&4), Err(2));
```

`Ok(index)` 表示找到了元素，`Err(index)` 表示没找到，并给出可以插入的位置。

## 切片相关方法

很多 `Vec` 方法其实来自切片 `[T]`，所以数组、切片、`Vec` 都能用。

- `windows` 用于生成固定长度的滑动窗口：

```rust
let nums = vec![1, 2, 3, 4];

for w in nums.windows(2) {
    println!("{:?}", w);
}
```

输出的窗口依次是 `[1, 2]`、`[2, 3]`、`[3, 4]`。

- `chunks` 用于按固定大小分组：

```rust
let nums = vec![1, 2, 3, 4, 5];

for chunk in nums.chunks(2) {
    println!("{:?}", chunk);
}
```

输出的分组是 `[1, 2]`、`[3, 4]`、`[5]`。

- `split_at` 可以把切片从某个位置分成两段：

```rust
let nums = vec![1, 2, 3, 4];

let (left, right) = nums.split_at(2);

assert_eq!(left, &[1, 2]);
assert_eq!(right, &[3, 4]);
```

## 二维数组遍历

对于矩阵的上下左右方向遍历时，索引（usize类型）与方向（i32类型）相加使用 `checked_add_signed`：

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
