# bisect

`bisect` 模块在有序列表上做二分查找，查找是 O(log n)。

## 速览

| 函数 | 作用 |
| --- | --- |
| `bisect_left(a, x)` | 第一个 `>= x` 的位置，即 lower_bound |
| `bisect_right(a, x)` | 第一个 `> x` 的位置，即 upper_bound |
| `insort_left(a, x)` | 插入 x 并保持有序，插在相等元素的左边 |
| `insort_right(a, x)` | 插入 x 并保持有序，插在相等元素的右边 |

`bisect` 是 `bisect_right` 的别名。

## 查找位置

```python
import bisect

nums = [1, 3, 3, 5, 7]

bisect.bisect_left(nums, 3)     # 1，第一个 3 的下标
bisect.bisect_right(nums, 3)    # 3，最后一个 3 的下一个位置
bisect.bisect_left(nums, 4)     # 3，4 可以插入的位置
```

用 `bisect_right - bisect_left` 可以统计某个值出现的次数：

```python
count = bisect.bisect_right(nums, 3) - bisect.bisect_left(nums, 3)   # 2
```

## 插入

```python
import bisect

nums = [1, 3, 5]
bisect.insort(nums, 4)

print(nums)     # [1, 3, 4, 5]
```

查找是 O(log n)，但插入本身要移动元素，是 O(n)。

## 手写二分

需要更复杂的判断时还是要手写二分，下面是两个通用模板：

```python
def lower_bound(nums, x):
    # 第一个 >= x 的位置，找不到返回 len(nums)
    lo, hi = 0, len(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < x:
            lo = mid + 1
        else:
            hi = mid
    return lo


def upper_bound(nums, x):
    # 第一个 > x 的位置
    lo, hi = 0, len(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] <= x:
            lo = mid + 1
        else:
            hi = mid
    return lo
```

## 模板：统计区间内元素个数

```python
import bisect

# 有序数组 nums 中，值落在 [lo, hi] 范围内的元素个数
cnt = bisect.bisect_right(nums, hi) - bisect.bisect_left(nums, lo)
```

## 注意

`bisect` 要求列表有序，它不会检查，也不会自动排序。

如果数据需要频繁插入删除且始终有序，`bisect` 的插入是 O(n)，这时可以考虑第三方库 `sortedcontainers`（提供 `SortedList` 等）。
