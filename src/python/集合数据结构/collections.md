# collections

`collections` 模块提供了几种标准容器之外的专用容器，刷题里最常用的是 `deque`、`defaultdict` 和 `Counter`。

## 速览

| 类型 | 作用 | 快速跳转 |
| --- | --- | --- |
| `deque` | 双端队列，两端增删 O(1) | [deque](#deque) |
| `defaultdict` | 带默认值的 dict | [defaultdict](#defaultdict) |
| `Counter` | 计数器 | [Counter](#counter) |
| `OrderedDict` | 有序字典，可移动 / 两端弹出 | [OrderedDict](#ordereddict) |
| `namedtuple` | 带字段名的元组 | [namedtuple](#namedtuple) |
| `ChainMap` | 多个 dict 合并成一个视图 | [ChainMap](#chainmap) |
| `UserDict` / `UserList` | 方便继承的包装类 | [UserDict 和 UserList](#userdict-和-userlist) |

## deque

双端队列，两端插入删除都是 O(1)，是 BFS、滑动窗口、单调队列的基础。

```python
from collections import deque

q = deque([1, 2, 3])

q.append(4)        # 右端加入
q.appendleft(0)    # 左端加入
q.pop()            # 右端弹出
q.popleft()        # 左端弹出
```

按下标访问 `q[i]` 是 O(n)，不要当 list 用；两端操作才是 O(1)。

其他常用方法：

```python
q = deque([1, 2, 3, 4, 5])

q.rotate(1)           # 整体右移一位：[5, 1, 2, 3, 4]
q.rotate(-1)          # 整体左移一位
q.extend([6, 7])      # 右端批量加入
q.extendleft([0, -1]) # 左端逐个 appendleft，顺序会反过来
```

`maxlen` 可以限制长度，超出后自动从另一端挤出，很适合维护固定大小的窗口：

```python
q = deque(maxlen=3)
for i in range(5):
    q.append(i)

print(q)    # deque([2, 3, 4], maxlen=3)
```

### BFS 模板

```python
from collections import deque

def bfs(start, graph):
    dist = {start: 0}
    q = deque([start])

    while q:
        node = q.popleft()
        for nxt in graph[node]:
            if nxt not in dist:
                dist[nxt] = dist[node] + 1
                q.append(nxt)

    return dist
```

### 单调队列模板

求每个长度为 k 的窗口的最大值，用一个单调递减的 deque 存下标：

```python
from collections import deque

def max_sliding_window(nums, k):
    q = deque()      # 存下标，对应的值单调递减
    ans = []

    for i, x in enumerate(nums):
        while q and nums[q[-1]] <= x:
            q.pop()
        q.append(i)

        if q[0] <= i - k:      # 队头滑出窗口
            q.popleft()

        if i >= k - 1:
            ans.append(nums[q[0]])

    return ans
```

## defaultdict

`defaultdict` 在访问不存在的键时会自动创建一个默认值，省去 `if key not in d` 的判断。

```python
from collections import defaultdict

# 参数是"默认值的工厂函数"
count = defaultdict(int)      # 默认 0
groups = defaultdict(list)    # 默认 []
seen = defaultdict(set)       # 默认 set()
```

常见默认值写法：

| 默认值 | 工厂函数 |
| --- | --- |
| `0` | `int` |
| `0.0` | `float` |
| `[]` | `list` |
| `{}` | `dict` |
| `set()` | `set` |
| 自定义 | `lambda: ...` |

### 计数

```python
count = defaultdict(int)
for x in nums:
    count[x] += 1
```

### 分组

```python
groups = defaultdict(list)
for w in words:
    groups[len(w)].append(w)
```

### 建图

这是刷题里最常用的场景之一：

```python
graph = defaultdict(list)
for u, v in edges:
    graph[u].append(v)
    graph[v].append(u)     # 无向图
```

## Counter

`Counter` 是专门用来计数的字典，键是元素，值是出现次数。

```python
from collections import Counter

c = Counter("hello")
print(c)          # Counter({'l': 2, 'h': 1, 'e': 1, 'o': 1})

c["l"]            # 2
c["z"]            # 0，不存在的键返回 0，不会报错
```

常用方法：

```python
c = Counter([1, 1, 2, 3, 3, 3])

c.most_common(2)      # [(3, 3), (1, 2)]，出现最多的前 2 个
c.elements()          # 展开成元素迭代器（按计数重复）
c.total()             # 所有计数之和，等价 sum(c.values())，Python 3.10+
```

统计和更新：

```python
c = Counter()
c.update([1, 1, 2])   # 累加计数
c.subtract([1])       # 相减，计数可能变成 0 或负数
del c[2]              # 删除某个键
```

`Counter` 还支持集合式的算术运算，结果只保留计数大于 0 的部分：

```python
a = Counter("aab")
b = Counter("abc")

a + b     # 相加
a - b     # 相减，负数结果会被丢弃
a & b     # 取较小计数（交集）
a | b     # 取较大计数（并集）
```

### 模板：出现次数最多的 k 个元素

```python
from collections import Counter

nums = [1, 1, 1, 2, 2, 3]
top2 = Counter(nums).most_common(2)
print(top2)     # [(1, 3), (2, 2)]
```

## OrderedDict

从 Python 3.7 起，普通 `dict` 已经保证插入顺序，所以 `OrderedDict` 现在主要用于两个场景：需要改变某个键的位置，或需要从两端弹出。

```python
from collections import OrderedDict

od = OrderedDict()
od["a"] = 1
od["b"] = 2
od["c"] = 3

od.move_to_end("a")              # 移到末尾
od.move_to_end("a", last=False)  # 移到开头

od.popitem()                     # 弹出最后一个
od.popitem(last=False)           # 弹出第一个
```

后两个操作是实现 LRU 缓存（最近最少使用）的关键。

## namedtuple

`namedtuple` 是带字段名的元组，可以按名字访问，仍然不可变、可哈希。详细用法见 [tuple](tuple.md#命名元组)。

```python
from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(1, 2)

print(p.x, p.y)    # 1 2
print(p[0])        # 1
```

## ChainMap

`ChainMap` 把多个字典串成一个逻辑上的字典，查找时按顺序在多个字典里找，写操作只作用于第一个。

```python
from collections import ChainMap

defaults = {"color": "red", "size": "m"}
user = {"color": "blue"}

c = ChainMap(user, defaults)
print(c["color"])    # blue，user 优先
print(c["size"])     # m，回退到 defaults
```

常用于合并配置（局部覆盖全局），刷题里用得不多。

## UserDict 和 UserList

`dict` 和 `list` 也能直接继承，但 `UserDict`、`UserList` 用组合实现，行为更干净，适合需要自定义容器时使用。

```python
from collections import UserDict

class MyDict(UserDict):
    def __missing__(self, key):
        return 0
```

## 小结：常见场景怎么选

| 场景 | 选择 |
| --- | --- |
| 两端增删、BFS、滑动窗口 | `deque` |
| 计数 | `Counter` 或 `defaultdict(int)` |
| 分组、建图 | `defaultdict(list)` |
| 记录下标 | 普通 `dict` |
| 移动键、LRU | `OrderedDict` |
