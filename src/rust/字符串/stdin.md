# rust 中的标准输入
在 rust 中，标准输入可以通过 `std::io` 模块中的 `stdin` 函数来获取。这个函数返回一个 `Stdin` 结构体的实例，可以用来读取用户输入的数据。
## rust 的输入哲学
rust 倾向于一次性读取所有输入，而不是逐行读取，这样可以更高效地处理输入数据。下面是一些标准示例，展示如何使用 `stdin` 来读取用户输入：

- 一次性读入：
```rust
use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    let stdin = io::stdin();
    stdin.read_to_string(&mut input).unwrap();
    // 按分隔符（包括空格、制表符、换行符等）划分输入：
    let mut tokens = input.split_whitespace();
}
```
对于上面得到的tokens，可以使用 `next()` 方法来逐个获取输入的值，并进行类型转换：
```rust
// 读取为字符串：
let s: String = tokens.next().unwrap().to_string();
// 读取为数字类型：
let n: i32 = tokens.next().unwrap().parse().unwrap();
// 读取为数组(第一项为数组大小n，后续项为数组元素)：
let n: usize = tokens.next().unwrap().parse().unwrap();
let arr: Vec<i32> = tokens.take(n).filter_map(|s| s.parse().ok()).collect(); // 或者写成 let arr: Vec<i32> = (0..n).map(|_| tokens.next().unwrap().parse().unwrap()).collect(); 也具有一样的效果
```
若是觉得.next().unwrap().parse().unwrap()太麻烦，可以写成宏：
```rust
use std::io::{self, Read};
macro_rules! read {
    ($expr:expr, $t:ty) => {
        $expr.next().unwrap().parse::<$t>().unwrap()
    };
    ($expr:expr) => {
        $expr.next().unwrap().to_string()
};  
}
```
```rust
// 使用宏读取输入：
let s: String = read!(tokens);
let n: i32 = read!(tokens, i32);
let n: usize = read!(tokens, usize);
let arr: Vec<i32> = (0..n).map(|_| read!(tokens, i32)).collect();
```

- 上面为一般方法，除此之外也可以逐行读入:
```rust
use std::io::{self, BufRead};

fn main() {
    let stdin = io::stdin();
    for line in stdin.lock().lines() {
        let line = line.unwrap();
        // 处理每行输入
    }
    // 或者 let mut lines = stdin.lock().lines();
    // while let Some(Ok(line)) = lines.next() {
    //     // 处理每行输入
    //}
    
}
```

## Read 和 BufRead
在 Rust 中，`Read` 和 `BufRead` 是两个重要的 trait，用于处理输入输出操作。以下是二者的区别：
- `Read` trait：提供了基本的读取方法，适用于一次性读取大量数据。在实际使用中，`stdin` 返回的 `Stdin` 结构体实现了 `Read` trait，因此你可以直接使用 `read_to_string`（读取到一个字符串）、`read`（读取到字节数组）方法来一次性读取所有输入。
- `BufRead` trait：提供了缓冲读取的方法，适用于逐行读取输入，可以提高效率并减少系统调用的次数。如 `stdin.lock()` 获取一个实现了 `BufRead` trait 的锁定版本，从而使用 `lines`（读取所有行）、`read_line`（读取单行）方法来逐行读取输入。
