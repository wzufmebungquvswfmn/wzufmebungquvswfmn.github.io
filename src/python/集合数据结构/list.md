# list

`list` 是 Python 最常用的容器，本质上是一个动态数组。它有序、可变、允许重复元素，按下标访问是 O(1)。

## 速览

| 方法 | 作用 | 快速跳转 |
| --- | --- | --- |
| `append` | 尾部追加单个元素 | [增删](#增删) |
| `extend` | 尾部追加多个元素 |
| `insert` | 指定位置插入 |
| `pop` | 弹出元素，默认尾部 |
| `remove` | 删除第一个匹配的值 |
| `del` | 按下标删除 |
| `clear` | 清空 |
| `index` | 查找下标 | [查找](#查找) |
| `count` | 统计出现次数 |
| `sort` | 原地排序 | [排序](#排序) |
| `reverse` | 原地翻转 |
| `copy` | 浅拷贝 | [拷贝](#拷贝) |
| | | [常用模板](#常用模板) |

## 创建

```python
nums = [1, 2, 3]
empty = []
from_range = list(range(5))        # [0, 1, 2, 3, 4]
same = [0] * 3                     # [0, 0, 0]

# 二维数组要这样创建
grid = [[0] * n for _ in range(m)]
```

不要用 `[[0] * n] * m` 创建二维数组，它的每一行其实是同一个列表对象：

```python
grid = [[0] * 3] * 2
grid[0][0] = 1
print(grid)   # [[1, 0, 0], [1, 0, 0]]，第二行也被改了
```

## 增删

`append` 在尾部追加单个元素，`extend` 在尾部追加可迭代对象里的所有元素：

```python
nums = [1, 2]
nums.append(3)          # [1, 2, 3]
nums.extend([4, 5])     # [1, 2, 3, 4, 5]
```

也可以直接用 `+=`，效果等同于 `extend`：

```python
nums += [6, 7]          # [1, 2, 3, 4, 5, 6, 7]
```

`insert` 在指定位置插入，`remove` 删除第一个匹配的值：

```python
nums = [1, 3]
nums.insert(1, 2)       # [1, 2, 3]
nums.remove(2)          # [1, 3]
```

`pop` 默认弹出并返回尾部元素，也可以给下标；`del` 按下标删除；`clear` 清空：

```python
nums = [1, 2, 3]
x = nums.pop()          # x == 3，nums == [1, 2]
y = nums.pop(0)         # y == 1，nums == [2]
```

`insert`、`remove`、`pop(0)` 都要移动后面的元素，复杂度是 O(n)。如果需要在头部频繁增删，用 `collections.deque`。

## 访问与切片

下标从 0 开始，负数表示从末尾数：

```python
nums = [10, 20, 30, 40, 50]

nums[0]      # 10
nums[-1]     # 50
```

切片 `nums[start:stop:step]` 返回一个新的列表（浅拷贝），`stop` 不包含：

```python
nums[1:3]    # [20, 30]
nums[:2]     # [10, 20]
nums[2:]     # [30, 40, 50]
nums[::2]    # [10, 30, 50]
nums[::-1]   # [50, 40, 30, 20, 10]，翻转
```

切片赋值可以一次性替换一段：

```python
nums = [1, 2, 3, 4]
nums[1:3] = [20, 30, 40]   # [1, 20, 30, 40, 4]
```

## 排序

`sort()` 原地排序，`sorted()` 返回新列表：

```python
nums = [3, 1, 2]
nums.sort()                    # [1, 2, 3]

words = ["aaa", "b", "cc"]
new = sorted(words, key=len)   # ['b', 'cc', 'aaa']
```

降序用 `reverse=True`：

```python
nums = [3, 1, 2]
nums.sort(reverse=True)     # [3, 2, 1]
```

多关键字排序时，`key` 返回元组，按元组顺序比较。要求第一关键字升序、第二关键字降序，可以对第二项取负：

```python
items = [("a", 2), ("b", 1), ("a", 1)]
items.sort(key=lambda x: (x[0], -x[1]))
# [('a', 2), ('a', 1), ('b', 1)]
```

Python 的排序是稳定的，相等元素会保持原有顺序。

如果列表里是元组或列表，也可以直接比较，按元素依次比较：

```python
sorted([[1, 2], [1, 1]])   # [[1, 1], [1, 2]]
```

## 查找

- `in` 判断元素是否存在，`index` 返回第一个匹配的下标，`count` 统计次数：

```python
nums = [1, 2, 2, 3]

2 in nums          # True
nums.index(2)      # 1
nums.count(2)      # 2
```

- 如果列表已经有序，可以用 `bisect` 做二分查找：

```python
import bisect

nums = [1, 3, 5, 7]

i = bisect.bisect_left(nums, 5)    # 2，第一个 >= 5 的位置
j = bisect.bisect_right(nums, 5)   # 3，第一个 > 5 的位置
bisect.insort(nums, 4)             # 插入并保持有序：[1, 3, 4, 5, 7]
```

`bisect_left` 和 `bisect_right` 也常用来找插入位置或统计区间内元素个数。

## 拷贝

`b = a` 只是让两个名字指向同一个列表，修改其中一个另一个也会变。浅拷贝用 `a.copy()`、`a[:]` 或 `list(a)`：

```python
a = [1, 2]
b = a.copy()
b.append(3)

print(a)   # [1, 2]
print(b)   # [1, 2, 3]
```

需要注意浅拷贝只复制一层，嵌套的列表仍然是共享的。深拷贝用 `copy.deepcopy`。

## 推导式

列表推导式可以简洁地生成新列表：

```python
squares = [x * x for x in range(5)]        # [0, 1, 4, 9, 16]
evens = [x for x in range(10) if x % 2 == 0]

# 嵌套推导，展平二维列表
grid = [[1, 2], [3, 4]]
flat = [x for row in grid for x in row]    # [1, 2, 3, 4]
```

## 常用模板

### 栈

`list` 直接当栈用：

```python
stack = []
stack.append(1)
stack.append(2)
top = stack.pop()     # 2
```

### 双端队列

需要从两端增删时用 `collections.deque`，它的头尾操作都是 O(1)（更多用法见 [collections](collections.md#deque)）：

```python
from collections import deque

q = deque([1, 2, 3])
q.append(4)        # 右端加入
q.appendleft(0)    # 左端加入
q.pop()            # 右端弹出
q.popleft()        # 左端弹出
```

### 二维数组遍历

```python
dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]

for i in range(m):
    for j in range(n):
        for di, dj in dirs:
            ni, nj = i + di, j + dj
            if 0 <= ni < m and 0 <= nj < n:
                print(grid[ni][nj])
```

Python 里可以直接用 `0 <= ni < m` 这样的链式比较判断边界。
