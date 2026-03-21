# 位运算

## 内存对齐
给定一个地址 addr 和一个对齐 align  
任务是把 addr 向上或者向下与 align 对齐，例如：  
```
addr = 3， align = 8, then:  
align_up_addr = 8, align_down_addr  
```
向下对齐即末尾置0， 即 `align_down_addr = addr & !(align - 1)`  
向上对齐需检查是否需要进位，然后在末尾置0，即 `align_up_addr = (addr + align - 1) & !(align - 1)`  
