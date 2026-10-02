# set

`set` 是 Python 的哈希集合，元素唯一且必须可哈希。它常用于去重、判重和集合运算。

## 速览

| 方法 / 运算 | 作用 | 快速跳转 |
| --- | --- | --- |
| `add` | 添加元素 | [增删](#增删) |
| `remove` | 删除元素，不存在会报错 |
| `discard` | 删除元素，不存在不报错 |
| `pop` | 随机弹出元素 |
| `in` | 判断元素是否存在 | [查找](#查找) |
| `\|` / `union` | 并集 | [集合运算](#集合运算) |
| `&` / `intersection` | 交集 |
| `-` / `difference` | 差集 |
| `^` / `symmetric_difference` | 对称差集 |
| `<=` / `issubset` | 子集判断 |
| `>=` / `issuperset` | 超集判断 |

## 创建

```python
s = {1, 2, 3}
empty = set()          # 注意 {} 创建的是空字典

# 从任意可迭代对象创建，会自动去重
nums = set([1, 2, 2, 3, 3, 3])    # {1, 2, 3}
chars = set("hello")              # {'h', 'e', 'l', 'o'}
```

`{}` 是空字典，空集合必须写成 `set()`。

## 增删

```python
s = {1, 2, 3}

s.add(4)          # {1, 2, 3, 4}
s.remove(4)       # 删除，不存在会 KeyError
s.discard(4)      # 删除，不存在不报错
x = s.pop()       # 随机弹出并返回一个元素
s.clear()         # 清空
```

`remove` 和 `discard` 的区别只在元素不存在时：前者报错，后者静默。

## 查找

`in` 判断元素是否存在，平均复杂度 O(1)：

```python
s = {1, 2, 3}

2 in s       # True
5 in s       # False
```

## 集合运算

```python
a = {1, 2, 3}
b = {3, 4, 5}

a | b        # {1, 2, 3, 4, 5}，并集
a & b        # {3}，交集
a - b        # {1, 2}，差集
a ^ b        # {1, 2, 4, 5}，对称差集
```

对应的函数形式和原地更新形式：

```python
a.union(b)               # 并集，返回新集合
a.intersection(b)        # 交集
a.difference(b)          # 差集

a |= b                   # 原地并集，等价 a.update(b)
a &= b                   # 原地交集
a -= b                   # 原地差集
```

子集和超集判断：

```python
a = {1, 2}
b = {1, 2, 3}

a <= b              # True，a 是 b 的子集
a.issubset(b)       # True
b >= a              # True，b 是 a 的超集
a.isdisjoint({4})   # True，没有交集
```

## frozenset

`frozenset` 是不可变的集合，可以作为 `dict` 的键或放进另一个 `set`：

```python
fs = frozenset([1, 2, 3])
d = {fs: "ok"}          # 可以，普通 set 不行
```

## 常用模板

### 去重

```python
nums = [1, 2, 2, 3]
unique = list(set(nums))
```

`set` 是无序的，如果需要保持原有顺序，可以用 `dict.fromkeys`：

```python
nums = [3, 1, 3, 2, 1]
unique = list(dict.fromkeys(nums))    # [3, 1, 2]
```

### 判断重复

```python
nums = [1, 2, 3, 2]
seen = set()

for x in nums:
    if x in seen:
        print("重复元素:", x)
    seen.add(x)
```

更简洁的写法是直接比较长度：

```python
has_duplicate = len(nums) != len(set(nums))
```

### 集合运算求交并

```python
a = {1, 2, 3}
b = {3, 4, 5}

print(sorted(a & b))    # [3]
print(sorted(a | b))    # [1, 2, 3, 4, 5]
```

由于 `set` 无序，需要有序输出时记得 `sorted()`。
