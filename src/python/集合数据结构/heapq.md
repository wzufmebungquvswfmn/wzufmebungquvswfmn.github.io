# heapq

`heapq` 模块在普通 `list` 上实现二叉堆，可以当优先队列使用。它**只有小顶堆**，也就是每次弹出的是最小元素。

## 速览

| 函数 | 作用 |
| --- | --- |
| `heapify` | 把 list 原地变成堆，O(n) |
| `heappush` | 插入元素 |
| `heappop` | 弹出并返回最小元素 |
| `heappushpop` | 先 push 再 pop，比分开快 |
| `heapreplace` | 先 pop 再 push，比分开快 |
| `nlargest` / `nsmallest` | 求最大 / 最小的 k 个元素 |

## 基本使用

```python
import heapq

nums = [5, 2, 8, 1]
heapq.heapify(nums)     # 原地建堆

heapq.heappush(nums, 3)
smallest = heapq.heappop(nums)    # 1

print(nums[0])    # 堆顶，即当前最小值
```

堆只保证堆顶是最小值，整体并不有序；要得到有序结果需要不断 `heappop`。

## 大顶堆

`heapq` 没有大顶堆，常用的做法有两种。

把元素取负后入堆，弹出的再取回来：

```python
import heapq

nums = [5, 2, 8, 1]
heap = [-x for x in nums]
heapq.heapify(heap)

largest = -heapq.heappop(heap)    # 8
```

或者用 `(优先级, 值)` 形式的元组，对优先级取负：

```python
heap = [(-x, x) for x in nums]
heapq.heapify(heap)

_, largest = heapq.heappop(heap)    # 8
```

## 自定义优先级

元组会按元素依次比较，所以可以把优先级放在第一位：

```python
import heapq

# (距离, 节点)
pq = [(3, "a"), (1, "b"), (2, "c")]
heapq.heapify(pq)

node = heapq.heappop(pq)[1]    # 'b'
```

优先级相同时，堆会继续比较第二个元素。当第二个元素不可比较时，可以加一个自增序号作为 tie-breaker：

```python
import heapq
from itertools import count

counter = count()
pq = []

heapq.heappush(pq, (1, next(counter), {"data": "x"}))
heapq.heappush(pq, (1, next(counter), {"data": "y"}))
```

## Top K

求最大或最小的 k 个元素，直接用 `nlargest` / `nsmallest` 最简单：

```python
import heapq

nums = [3, 1, 5, 2, 4]

heapq.nlargest(2, nums)     # [5, 4]
heapq.nsmallest(2, nums)    # [1, 2]

# 可以配合 key
words = ["aaa", "b", "cc"]
heapq.nlargest(2, words, key=len)    # ['aaa', 'cc']
```

如果是不断到来的数据流，不想全部保留，可以用大小为 k 的小顶堆维护最大的 k 个：

```python
import heapq

def top_k(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)    # 弹出最小的，堆里只剩最大的 k 个
    return heap
```

反过来要维护最小的 k 个，就用大顶堆（取负）。

## 常见模板

### Dijkstra 最短路

```python
import heapq
from collections import defaultdict

def dijkstra(graph, start):
    dist = {start: 0}
    pq = [(0, start)]      # (距离, 节点)

    while pq:
        d, u = heapq.heappop(pq)
        if d > dist.get(u, float("inf")):
            continue        # 过期状态，跳过

        for v, w in graph[u]:
            nd = d + w
            if nd < dist.get(v, float("inf")):
                dist[v] = nd
                heapq.heappush(pq, (nd, v))

    return dist
```

### 数据流中位数（对顶堆）

一个小顶堆存较大的一半，一个大顶堆存较小的一半：

```python
import heapq

class MedianFinder:
    def __init__(self):
        self.small = []   # 大顶堆（存负值），较小的一半
        self.large = []   # 小顶堆，较大的一半

    def add(self, x):
        heapq.heappush(self.small, -x)
        # 保证 small 的最大值 <= large 的最小值
        heapq.heappush(self.large, -heapq.heappop(self.small))

        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def median(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2
```

## 和 queue.PriorityQueue 的区别

`queue.PriorityQueue` 线程安全，但更慢，而且没有 `heapify`、`nlargest` 这些函数。刷题里一般直接用 `heapq`。
