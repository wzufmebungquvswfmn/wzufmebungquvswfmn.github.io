# tuple

`tuple` 和 `list` 很像，都是有序序列，区别是 `tuple` 一旦创建就不可变，因此可以作为 `dict` 的键和 `set` 的元素。

## 速览

| 操作 | 说明 | 快速跳转 |
| --- | --- | --- |
| `(1, 2)` | 创建元组 | [创建](#创建) |
| `(1,)` | 单元素元组，逗号不能省 | [创建](#创建) |
| `a, b = b, a` | 解包、交换 | [解包](#解包) |
| `t[i]` | 按下标访问 | [不可变](#不可变) |
| `t.count(x)` / `t.index(x)` | 统计 / 查找下标 | |
| `t + t2` | 拼接 | |
| `t * 3` | 重复 | |
| `namedtuple` | 带字段名的元组 | [命名元组](#命名元组) |

## 创建

```python
point = (1, 2)
empty = ()
single = (1,)        # 单元素元组必须带逗号
nums = tuple([1, 2, 3])
```

`(1)` 只是加了括号的整数，不是元组：

```python
type((1))    # <class 'int'>
type((1,))   # <class 'tuple'>
```

## 不可变

元组创建后不能修改元素：

```python
t = (1, 2, 3)
t[0] = 10    # TypeError: 'tuple' object does not support item assignment
```

但如果元组里存的是可变对象（比如列表），那个对象本身仍可以被修改：

```python
t = ([1], 2)
t[0].append(3)
print(t)     # ([1, 3], 2)
```

## 解包

元组最常见的用途之一是和函数返回值配合：

```python
def min_max(nums):
    return min(nums), max(nums)

lo, hi = min_max([3, 1, 2])    # lo == 1，hi == 3
```

用 `*` 可以收集剩余元素：

```python
first, *rest = (1, 2, 3, 4)    # first == 1，rest == [2, 3, 4]
a, *mid, b = (1, 2, 3, 4)      # a == 1，mid == [2, 3]，b == 4
```

交换两个变量本质上是元组打包再解包：

```python
a, b = 1, 2
a, b = b, a     # a == 2，b == 1
```

## 作为键

只要元组里所有元素都可哈希，元组本身就可哈希，可以作为 `dict` 的键或放进 `set`：

```python
pos = {}
pos[(0, 1)] = "start"

seen = set()
seen.add((1, 2))
```

这在网格、坐标、记录复合状态时非常常用。

## 比较和排序

元组按元素依次比较，所以常用来做多关键字排序：

```python
sorted([(2, 1), (1, 3), (1, 2)])   # [(1, 2), (1, 3), (2, 1)]
```

如果想让第二项降序，仍然需要显式指定 `key`（见 [list 的排序](list.md#排序)）。

## 命名元组

`collections.namedtuple` 可以给字段起名字，兼顾可读性和不可变性：

```python
from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(1, 2)

print(p.x, p.y)     # 1 2
print(p[0])         # 1，仍然支持下标访问
```

## 与 list 的选择

| | list | tuple |
| --- | --- | --- |
| 可变 | 是 | 否 |
| 可哈希，能作 dict 键 | 否 | 是 |
| 常用场景 | 动态数组、栈、队列 | 坐标、记录、函数返回值 |
