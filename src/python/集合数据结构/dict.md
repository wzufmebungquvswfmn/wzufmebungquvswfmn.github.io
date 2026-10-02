# dict

`dict` 是 Python 的哈希表，存储键值对。键必须可哈希，值可以是任意对象。从 Python 3.7 起，`dict` 会保持键的插入顺序。

## 速览

| 方法 | 作用 | 快速跳转 |
| --- | --- | --- |
| `d[key]` | 访问，键不存在会报错 | [增删改查](#增删改查) |
| `get` | 访问，键不存在返回默认值 |
| `setdefault` | 键不存在时设默认值并返回 |
| `d[key] = v` | 插入或覆盖 |
| `pop` | 按键删除并返回值 |
| `popitem` | 弹出最后一个键值对 |
| `del` | 按键删除 |
| `keys` / `values` / `items` | 遍历 | [遍历](#遍历) |
| `update` / `\|` | 合并 | [合并](#合并) |
| `in` | 判断键是否存在 | [查找](#查找) |

## 创建

```python
d = {"apple": 3, "banana": 5}
empty = {}
from_pairs = dict([("a", 1), ("b", 2)])
from_keys = dict.fromkeys(["a", "b"], 0)   # {'a': 0, 'b': 0}

# 从两个列表构造
keys = ["a", "b"]
vals = [1, 2]
d = dict(zip(keys, vals))                  # {'a': 1, 'b': 2}
```

## 增删改查

### 访问

用 `[]` 访问不存在的键会抛 `KeyError`，不确定时用 `get`：

```python
d = {"apple": 3}

d["apple"]            # 3
d.get("pear")         # None
d.get("pear", 0)      # 0
```

### 插入和修改

直接赋值即可，键已存在就是覆盖：

```python
d = {}
d["apple"] = 3
d["apple"] = 5        # 覆盖，d == {"apple": 5}
```

### 删除

```python
d = {"a": 1, "b": 2}

del d["a"]            # 按键删除
x = d.pop("b")        # 删除并返回，x == 2
d.pop("c", 0)         # 键不存在时返回默认值，不报错
last = d.popitem()    # 弹出最后一个键值对
d.clear()             # 清空
```

## 查找

`in` 判断键是否存在（不是值）：

```python
d = {"apple": 3}

"apple" in d          # True
3 in d                # False
```

## 遍历

遍历时拿到的是键，想同时拿到键值要用 `items()`：

```python
for key in d:
    print(key)

for key, value in d.items():
    print(key, value)

for value in d.values():
    print(value)
```

遍历顺序就是插入顺序。

遍历过程中不要增删键，否则会抛 `RuntimeError`。需要修改时可以先转成 `list(d.items())` 或用推导式生成新字典。

## 合并

`update` 原地合并，`|` 返回新字典（Python 3.9+）：

```python
a = {"x": 1}
b = {"x": 2, "y": 3}

a.update(b)          # a == {"x": 2, "y": 3}
c = {"x": 1} | b     # c == {"x": 2, "y": 3}
```

也可以在字面量里用 `**` 解包：

```python
c = {**a, **b}
```

后面的键会覆盖前面的同名键。

## 字典推导式

```python
squares = {x: x * x for x in range(4)}      # {0: 0, 1: 1, 2: 4, 3: 9}

key_to_index = {v: i for i, v in enumerate(["a", "b", "c"])}
# {'a': 0, 'b': 1, 'c': 2}
```

## 常用模板

### 计数

最直接的写法是用 `get`：

```python
nums = [1, 2, 1, 3, 2, 1]
count = {}

for x in nums:
    count[x] = count.get(x, 0) + 1

print(count[1])     # 3
```

也可以用 `collections.defaultdict`，省去默认值判断：

```python
from collections import defaultdict

count = defaultdict(int)
for x in nums:
    count[x] += 1
```

或者直接用 `collections.Counter`：

```python
from collections import Counter

count = Counter(nums)
count[1]                        # 3
count.most_common(1)            # [(1, 3)]，出现最多的元素
```

### 记录下标

```python
nums = [2, 7, 11, 15]
pos = {}

for i, x in enumerate(nums):
    pos[x] = i

print(pos[7])    # 1
```

### 分组

`defaultdict(list)` 常用于按某个键把元素分组：

```python
from collections import defaultdict

words = ["eat", "tea", "tan", "ate"]
groups = defaultdict(list)

for w in words:
    groups["".join(sorted(w))].append(w)

print(groups["aet"])    # ['eat', 'tea', 'ate']
```

### 存在性判断与默认值

`setdefault` 可以一次完成“有就用、没有就设”：

```python
d = {}
d.setdefault("a", []).append(1)
d.setdefault("a", []).append(2)

print(d["a"])    # [1, 2]
```
