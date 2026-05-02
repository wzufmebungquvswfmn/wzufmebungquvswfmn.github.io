# BTreeMap与BTreeSet

`BTreeMap` 和 `BTreeSet` 是有序版本的映射和集合。它们来自 `std::collections`，底层是 B 树，元素会按照 key 的顺序存储。

和 `HashMap` / `HashSet` 相比，它们的单次操作通常是 `O(log n)`，但优势是有序，并且支持范围查询。

使用前需要引入：

```rust
use std::collections::{BTreeMap, BTreeSet};
```

如果是为了查阅相关方法，可以直接跳转：
- [常用方法速查](#常用速查)

# BTreeMap

`BTreeMap<K, V>` 可以看作有序的 `HashMap`。如果题目需要按照 key 的顺序遍历，或者需要找某个范围内的 key，就可以考虑它。

## 基本使用

```rust
use std::collections::BTreeMap;

let mut map = BTreeMap::new();

map.insert(3, "c");
map.insert(1, "a");
map.insert(2, "b");

assert_eq!(map.get(&1), Some(&"a"));
```

遍历时会按照 key 从小到大：

```rust
for (key, value) in &map {
    println!("{} {}", key, value);
}
```

输出顺序是 `1, 2, 3`。

## 首尾元素

```rust
use std::collections::BTreeMap;

let mut map = BTreeMap::new();

map.insert(3, "c");
map.insert(1, "a");
map.insert(2, "b");

assert_eq!(map.first_key_value(), Some((&1, &"a")));
assert_eq!(map.last_key_value(), Some((&3, &"c")));
```

如果要弹出最小或最大的键值对：

```rust
assert_eq!(map.pop_first(), Some((1, "a")));
assert_eq!(map.pop_last(), Some((3, "c")));
```

## 范围查询 range

`range` 可以遍历某个 key 范围内的元素：

```rust
use std::collections::BTreeMap;

let mut map = BTreeMap::new();

map.insert(1, "a");
map.insert(2, "b");
map.insert(3, "c");
map.insert(4, "d");

for (key, value) in map.range(2..=3) {
    println!("{} {}", key, value);
}
```

这里会遍历 key 为 `2` 和 `3` 的元素。

常见范围写法：

```rust
map.range(2..);    // key >= 2
map.range(..=3);   // key <= 3
map.range(2..=5);  // 2 <= key <= 5
```

## entry

`BTreeMap` 也有 `entry`，用法和 `HashMap` 类似：

```rust
use std::collections::BTreeMap;

let mut map = BTreeMap::new();

*map.entry("apple").or_insert(0) += 1;
*map.entry("apple").or_insert(0) += 1;

assert_eq!(map.get("apple"), Some(&2));
```

# BTreeSet

`BTreeSet<T>` 可以看作有序的 `HashSet`，常用于需要自动排序、去重、范围查询的场景。

## 基本使用

```rust
use std::collections::BTreeSet;

let mut set = BTreeSet::new();

set.insert(3);
set.insert(1);
set.insert(2);

assert!(set.contains(&2));
```

遍历时会从小到大：

```rust
for x in &set {
    println!("{}", x);
}
```

## 首尾元素和范围查询

```rust
use std::collections::BTreeSet;

let set: BTreeSet<_> = [1, 2, 3, 4, 5].into_iter().collect();

assert_eq!(set.first(), Some(&1));
assert_eq!(set.last(), Some(&5));

let mid: Vec<_> = set.range(2..=4).copied().collect();

assert_eq!(mid, vec![2, 3, 4]);
```

## 和 HashMap / HashSet 的选择

如果只需要快速查询，通常使用 `HashMap` / `HashSet`。

如果需要有序遍历、范围查询、取最小最大值，使用 `BTreeMap` / `BTreeSet`。

## 常用速查

| 类型 | 方法 | 作用 |
| --- | --- | --- |
| `BTreeMap` | `insert` | 插入键值对 |
| `BTreeMap` | `get` / `get_mut` | 查询或修改 |
| `BTreeMap` | `range` | 范围查询 |
| `BTreeMap` | `first_key_value` | 查看最小 key |
| `BTreeMap` | `last_key_value` | 查看最大 key |
| `BTreeMap` | `pop_first` | 弹出最小 key |
| `BTreeMap` | `pop_last` | 弹出最大 key |
| `BTreeSet` | `insert` | 插入元素 |
| `BTreeSet` | `contains` | 判断是否存在 |
| `BTreeSet` | `range` | 范围查询 |
| `BTreeSet` | `first` / `last` | 查看最小或最大元素 |
