# HashMap与HashSet

`HashMap` 常用于计数、记录位置、建立映射；`HashSet` 常用于判重、去重、判断元素是否出现过。

使用前需要引入：

```rust
use std::collections::{HashMap, HashSet};
```

## 速查
| HashMap 方法 | 作用 | 快速跳转 |
| --- | --- | --- |
| `insert` | 插入或覆盖键值对 | [插入](#创建和插入) |
| `get` / `get_mut` | 根据 &key 获取 &value | [访问](#访问查询和删除) |
| `remove` | 根据 &key 删除元素 | [删除](#访问查询和删除) |
| `contains_key` | 根据 &key 判断元素是否存在 | [查询](#访问查询和删除) |
| `entry().or_insert()` | 根据 &key 获取 &value，没有则插入 | [插入访问](#插入访问) |
| `keys` / `values` / `iter` | 迭代遍历 | [遍历](#遍历) | 
| | | [常用模板](#常用模板) |
###
| HashSet 方法 | 作用 | 快速跳转 |
| --- | --- | --- |
| `insert` | 插入并返回是否为新元素 | [插入](#基本使用) |
| `contains` | 判断是否存在 | [查询](#基本使用) |
| `remove` | 删除元素 | [删除](#基本使用) |
| `intersection` | 交集 | [集合运算](#集合运算) |
| `union` | 并集 |
| `difference` | 差集 |
| | | [常用模板](#hashset-的使用) |

# HashMap

`HashMap<K, V>` 用于存储键值对 (key，value）

## 创建和插入
### 创建 HashMap
- `HashMap::new()` 创建一个空的 HashMap
- `HashMap::with_capacity(capacity)` 创建一个预分配空间的 HashMap
### 插入键值对
`insert(key, value)` 插入或覆盖一个键值对
```rust
use std::collections::HashMap;

let mut map = HashMap::new();

map.insert("apple", 3);
```

如果插入已经存在的 key，新值会覆盖旧值，并返回旧值：

```rust
let mut map = HashMap::new();

assert_eq!(map.insert("apple", 3), None);
assert_eq!(map.insert("apple", 5), Some(3));
```

## 访问、查询和删除

### 访问
- `get` 通过 key 获取 value:

```rust
map.insert("apple", 3);

if let Some(&count) = map.get("apple") {
    println!("{}", count);
}
```

- 如果需要修改 value，使用 `get_mut`：

```rust
if let Some(count) = map.get_mut("apple") {
    *count += 1;
}
```

### 查询
- `contains_key` 判断 key 是否存在,返回 true 或 false：
```rust
assert!(map.contains_key("apple"));
```

### 删除
- `remove` 通过 key 删除元素,并获取旧值：

```rust
map.insert("apple", 3);
let old = map.remove("apple");
assert_eq!(old, Some(3));
```

## 插入访问

`entry` + `or_insert` 可以通过 key 访问元素，没有就插入后再访问，`or_insert` 的即为默认值：

```rust
let mut map = HashMap::new();

*map.entry("banana").or_insert(0) += 1;
*map.entry("banana").or_insert(0) += 1;

assert_eq!(map.get("banana"), Some(&2));
```

如果默认值的构造比较重，可以使用 `or_insert_with` 传入闭包而不是值

## 遍历

### 遍历键值对
直接使用 for 循环的 in 迭代，并且可以控制对 HashMap 的不可变引用、可变引用或所有权：
```rust
for (key, value) in &map {
    println!("{} {}", key, value);
}
for (key, value) in &mut map {
    *value += 1;
}
for (key, value) in map {
} 
// map 已失效
```

### 遍历 key
- `keys` 返回对 key 的不可变引用迭代器
- `into_keys` 返回对 key 的所有权迭代器，同时拿走 HashMap 的所有权

### 遍历 value：
- `values` 返回对 value 的不可变引用迭代器
- `values_mut` 返回对 value 的可变引用迭代器
- `into_values` 获取 value 的所有权迭代器，同时拿走 HashMap 的所有权

需要注意，`HashMap` 的遍历顺序是不固定的，不能依赖它的输出顺序。

## 常用模板

### 统计元素出现次数：

```rust
use std::collections::HashMap;

let nums = vec![1, 2, 1, 3, 2, 1];
let mut count = HashMap::new();

for x in nums {
    *count.entry(x).or_insert(0) += 1;
}

assert_eq!(count.get(&1), Some(&3));
```

### 记录元素下标：

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

- `insert` 插入元素，如果元素之前不存在则返回 true，否则返回 false：
```rust
let mut set = HashSet::new();

set.insert(1);

assert_eq!(set.insert(1), false);

```
- `contains` 判断元素是否存在：
```rust
let mut set = HashSet::new();

assert!(set.contains(&1));
```

- `remove` 删除元素：

```rust
set.remove(&1);
```

## 集合运算

集合运算得到的是一个引用迭代器，使用 `copied` 来获得新集合：
```rust
use std::collections::HashSet;

let a: HashSet<_> = [1, 2, 3].into_iter().collect();
let b: HashSet<_> = [3, 4, 5].into_iter().collect();

let inter: Vec<_> = a.intersection(&b).copied().collect();
let union: Vec<_> = a.union(&b).copied().collect();
let diff: Vec<_> = a.difference(&b).copied().collect();
```

由于 `HashSet` 本身无序，所以如果题目要求有序输出，需要再排序。

## HashSet 的使用

常用于去除重复元素：

```rust
use std::collections::HashSet;

let nums = vec![1, 2, 2, 3];
let set: HashSet<_> = nums.into_iter().collect();
let nums: Vec<_> = set.into_iter().collect();

assert_eq!(nums.len(), 3);
```

或判断是否有重复元素：

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
