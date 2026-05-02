# HashMap与HashSet

`HashMap` 和 `HashSet` 都来自 `std::collections`。它们的底层都是哈希表，特点是查询、插入、删除的平均时间复杂度都是 `O(1)`。

刷题时，`HashMap` 常用于计数、记录位置、建立映射；`HashSet` 常用于判重、去重、判断元素是否出现过。

使用前需要引入：

```rust
use std::collections::{HashMap, HashSet};
```

如果是为了查阅相关方法，可以直接跳转：
- [常用方法速查](#常用速查)

# HashMap

`HashMap<K, V>` 用于存储键值对，通过 key 查找 value。

## 创建和插入

```rust
use std::collections::HashMap;

let mut map = HashMap::new();

map.insert("apple", 3);
map.insert("banana", 2);
```

如果插入已经存在的 key，新值会覆盖旧值，并返回旧值：

```rust
let mut map = HashMap::new();

assert_eq!(map.insert("apple", 3), None);
assert_eq!(map.insert("apple", 5), Some(3));
assert_eq!(map.get("apple"), Some(&5));
```

## 查询和删除

`get` 返回 `Option<&V>`：

```rust
let mut map = HashMap::new();
map.insert("apple", 3);

if let Some(count) = map.get("apple") {
    println!("{}", count);
}
```

如果需要修改 value，使用 `get_mut`：

```rust
let mut map = HashMap::new();
map.insert("apple", 3);

if let Some(count) = map.get_mut("apple") {
    *count += 1;
}

assert_eq!(map.get("apple"), Some(&4));
```

判断 key 是否存在：

```rust
assert!(map.contains_key("apple"));
```

删除 key：

```rust
let old = map.remove("apple");

assert_eq!(old, Some(4));
```

## entry 和 or_insert

`entry` 是刷题里非常常用的方法，尤其适合计数。

```rust
let mut map = HashMap::new();

*map.entry("banana").or_insert(0) += 1;
*map.entry("banana").or_insert(0) += 1;

assert_eq!(map.get("banana"), Some(&2));
```

可以这样理解：

```rust
map.entry(key).or_insert(default_value)
```

如果 key 存在，返回原来 value 的可变引用；如果 key 不存在，先插入默认值，再返回这个新值的可变引用。

如果默认值的构造比较重，可以使用 `or_insert_with`，它只会在 key 不存在时执行闭包：

```rust
let mut map: HashMap<&str, Vec<i32>> = HashMap::new();

map.entry("odd").or_insert_with(Vec::new).push(1);
map.entry("odd").or_insert_with(Vec::new).push(3);

assert_eq!(map.get("odd"), Some(&vec![1, 3]));
```

## 遍历

遍历键值对：

```rust
for (key, value) in &map {
    println!("{} {}", key, value);
}
```

只遍历 key：

```rust
for key in map.keys() {
    println!("{}", key);
}
```

只遍历 value：

```rust
for value in map.values() {
    println!("{}", value);
}
```

如果要拿走所有 value，可以使用 `into_values`：

```rust
let values: Vec<_> = map.into_values().collect();
```

需要注意，`HashMap` 的遍历顺序是不固定的，不能依赖它的输出顺序。

## 常用模板

统计元素出现次数：

```rust
use std::collections::HashMap;

let nums = vec![1, 2, 1, 3, 2, 1];
let mut count = HashMap::new();

for x in nums {
    *count.entry(x).or_insert(0) += 1;
}

assert_eq!(count.get(&1), Some(&3));
```

记录元素下标：

```rust
use std::collections::HashMap;

let nums = vec![2, 7, 11, 15];
let mut pos = HashMap::new();

for (i, x) in nums.iter().enumerate() {
    pos.insert(*x, i);
}

assert_eq!(pos.get(&7), Some(&1));
```

# HashSet

`HashSet<T>` 用于存储不重复的元素。它可以理解成只有 key、没有 value 的 `HashMap`。

## 基本使用

```rust
use std::collections::HashSet;

let mut set = HashSet::new();

set.insert(1);
set.insert(2);
set.insert(2);

assert_eq!(set.len(), 2);
assert!(set.contains(&1));
```

`insert` 会返回一个 bool，表示这个元素之前是否不存在：

```rust
let mut set = HashSet::new();

assert_eq!(set.insert(1), true);
assert_eq!(set.insert(1), false);
```

删除元素：

```rust
set.remove(&1);
```

## 从迭代器生成 HashSet

常用于去重或判重：

```rust
use std::collections::HashSet;

let nums = vec![1, 2, 2, 3];
let set: HashSet<_> = nums.into_iter().collect();

assert_eq!(set.len(), 3);
```

判断是否有重复元素：

```rust
use std::collections::HashSet;

let nums = vec![1, 2, 3, 2];
let mut seen = HashSet::new();

for x in nums {
    if !seen.insert(x) {
        println!("重复元素: {}", x);
    }
}
```

## 集合运算

```rust
use std::collections::HashSet;

let a: HashSet<_> = [1, 2, 3].into_iter().collect();
let b: HashSet<_> = [3, 4, 5].into_iter().collect();

let inter: Vec<_> = a.intersection(&b).copied().collect();
let union: Vec<_> = a.union(&b).copied().collect();
let diff: Vec<_> = a.difference(&b).copied().collect();

assert_eq!(inter, vec![3]);
assert!(union.contains(&1) && union.contains(&5));
assert!(diff.contains(&1) && diff.contains(&2));
```

由于 `HashSet` 本身无序，所以如果题目要求有序输出，需要再排序。

## 常用速查

| 类型 | 方法 | 作用 |
| --- | --- | --- |
| `HashMap` | `insert` | 插入或覆盖键值对 |
| `HashMap` | `get` / `get_mut` | 查询或可变查询 |
| `HashMap` | `remove` | 删除 key |
| `HashMap` | `contains_key` | 判断 key 是否存在 |
| `HashMap` | `entry().or_insert()` | 不存在则插入，常用于计数 |
| `HashMap` | `keys` / `values` / `iter` | 遍历 |
| `HashSet` | `insert` | 插入并返回是否为新元素 |
| `HashSet` | `contains` | 判断是否存在 |
| `HashSet` | `remove` | 删除元素 |
| `HashSet` | `intersection` | 交集 |
| `HashSet` | `union` | 并集 |
| `HashSet` | `difference` | 差集 |
