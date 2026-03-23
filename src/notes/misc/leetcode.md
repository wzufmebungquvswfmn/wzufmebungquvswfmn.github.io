# 刷题常用
本节记录刷题中经常会遇到的一些数据结构以及技巧的使用

## 哈希表 std::collections::HashMap
1.entry() + or_insert()  
用法：  
**entry(key).or_insert(new_val) -> &(orign_val|new_val)**：  

试图插入(key, new_val)，并返回插入值的引用；但如果key已存在，则返回原有值的引用,例如：

```*map.entry("banana").or_insert(0) += 1; // 插入 "banana” 并计数```


