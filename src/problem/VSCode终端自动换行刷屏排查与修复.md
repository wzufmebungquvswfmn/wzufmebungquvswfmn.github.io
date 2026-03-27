# VS Code 终端一打开就自动换行刷屏：一次完整排查与修复

## 问题现象
我在 Windows 上使用 VS Code 时，终端一打开就出现“自动换行 + 刷屏”，几乎无法正常输入命令。

典型表现：
- 新开终端后不断自动换行刷屏

## 关键报错（开发者工具）
开发者工具里出现了这类错误：

```text
Uncaught TypeError: Cannot read properties of undefined (reading 'dimensions')
... at get dimensions (xterm.js)
... _refreshCanvasDimensions
... _refreshDecorations
```

以及 VS Code 日志中的同类报错：

```text
ERR Cannot read properties of undefined (reading 'dimensions')
... node_modules/@xterm/xterm/lib/xterm.js
```

## 根因判断
这类错误基本可归因于：

- VS Code 内置终端（xterm.js）在“终端尺寸计算/重绘”链路发生异常
- `dimensions` 对象在某些时机是 `undefined`，触发连续重绘
- 在部分环境下，GPU 渲染、Shell Integration、终端持久会话等功能叠加后更容易触发

重点：这通常不是你的 PowerShell 命令本身死循环，而是终端渲染层异常。

## 我的修复方案（稳定优先）
我采用了“先止血，再优化”的思路：先让终端恢复可用。

在 VS Code 用户设置 `settings.json` 中加入/修改：

```json
{
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "terminal.integrated.gpuAcceleration": "off",
  "terminal.integrated.shellIntegration.enabled": false,
  "terminal.integrated.smoothScrolling": false,
  "terminal.integrated.enablePersistentSessions": false
}
```

## 为什么这组配置有效
- 关闭 GPU 渲染：绕开部分显卡/驱动/渲染路径导致的尺寸计算异常
- 关闭 Shell Integration：减少终端注入与渲染状态耦合
- 关闭平滑滚动：避免频繁动画重绘
- 关闭持久会话：避免恢复历史终端状态时触发异常状态
- 固定默认终端为 PowerShell：减少 profile/终端类型切换变量

## 验证步骤
1. 执行 `Developer: Reload Window`
2. 关闭所有终端标签后重新打开
3. 连续开关终端 3~5 次，观察是否仍刷屏

如果 10~30 秒内不再出现自动换行刷屏，说明修复生效。

## 进一步优化（按需逐项恢复）
如果你想要更高性能或更多功能，可以按顺序“逐项恢复”，每次只改一项并观察：

1. 先恢复 `terminal.integrated.shellIntegration.enabled` 为 `true`
2. 再恢复 `terminal.integrated.enablePersistentSessions` 为 `true`
3. 最后尝试 `terminal.integrated.gpuAcceleration`（若复发，立即改回 `off`）

这样可以精确定位触发项，避免一次性改动太多。

## 经验总结
- 看到 `xterm.js` + `dimensions` 报错时，优先怀疑终端渲染链路，而不是 shell 脚本
- 终端问题排查优先级建议：
  1) 先稳定可用（降级配置）
  2) 再逐项恢复（找根触发点）
  3) 最后考虑扩展冲突与 VS Code 版本升级

---

如果你也遇到“终端一开就刷屏”，可以直接先用上面的稳定配置，通常能很快恢复工作流。