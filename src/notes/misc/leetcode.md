# 刷题常用
本节记录刷题中经常会遇到的一些数据结构以及技巧的使用

## 哈希表 std::collections::HashMap
1. entry() + or_insert()  
用法：  
**entry(key).or_insert(new_val) -> &(orign_val|new_val)**：  

试图插入(key, new_val)，并返回插入值的引用；但如果key已存在，则返回原有值的引用,例如：

```*map.entry("banana").or_insert(0) += 1; // 插入 "banana” 并计数```

2. values()/into_values():
返回仅有“值”的迭代器，其它与iter()/into_iter()类似


## 二维数组边界的优雅处理 checked_add_signed(dir)
grid[m][n]是一个二维矩阵，如果对于一个格子，需要检查它相邻的四个格子，可使用以下标准方法
```rust
let dir = [-1, 0, 1, 0, -1];
for i in 0..m {
    for j in 0..n {
        for d in dir.windows(2) {
            if let (Some(r), Some(c)) = (i.checked_add_signed(d[0]), j.checked_add_signed(d[1])) {
                if r < m && c < n {print!("合法格子:{}",grid[r][c]);}
            }
        }
    }
}
```
但是由于usize类型小于0时会发生下溢，故即使不使用checked_add_signed可行”
```rust
for i in 0..m {
    for j in 0..n {
        for (r, c) in [(i - 1, j), (i, j - 1), (i + 1, j), (i, j + 1)] {
            if r < m && c < n {print!("合法格子:{}",grid[r][c]);}
        }
    }
}
```
但是[(i - 1, j), (i, j - 1), (i + 1, j), (i, j + 1)]写起来真的很烦人