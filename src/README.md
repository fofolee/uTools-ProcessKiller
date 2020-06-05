# ProcessKiller V0.1.4

## 简介

- 列出当前进程,按内存占用从高到低排序
- 支持关闭,重启,复制进程路径,在文件夹内显示等功能
- 全平台支持
- 有些进程是否能结束、路径是否能获取，取决于uTools是否以管理员权限运行

## 更新日志

**v0.1.4**

- 支持 linux

**v0.1.3**

- 添加更多错误提示
- 上架插件中心

**v0.1.1**

- 当某些进程路径未能获取时，显示相应提示

**v0.1.0**

- 增加两个功能:复制进程路径和在文件管理器中显示
- 在输入框内增加快捷键提示
- 支持使用 Command/Alt + 数字键快速操作
- 重写了获取进程图标的方法
- 重写了 window下获取进程的方法,大幅提升进入插件的速度
- 重写多出代码,大幅压缩插件体积

![JygVKI.png](https://s1.ax1x.com/2020/04/25/JygVKI.png)

**v0.0.6**

- 更新`windos`下显示`内存`百分比及`用户`的功能,以及默认按照内存占用率进行排序
- 微调获取进程的相关命令语句

**v0.0.5**

- 更新了对`macOS`的支持,`macOS`相比`window`多了显示`CPU`,`内存`百分比及`用户`的功能,以及默认按照内存占用率进行排序
- 增加插件更新检测的功能
- 修复了`windows`下可能导致无法显示进程列表的`bug`,强烈建议`windows`用户也进行升级
- `windows`下一些`UI`微调
- 优化重写了部分程序逻辑和代码

**v0.0.4**

- 进入插件后列出所有进程
- 通过方向键进行列表选择，`enter`关闭进程，`shift+enter`重启进程
- 更改插件描述
- 重新进行`upx`打包

**v0.0.3**

- 增加右键重启进程的功能

**v0.0.2**

- 对界面重新排版，和`uTools`统一风格，增加进程图标，同时根据进程条目调整下拉框长度
- 获取进程命令由tasklist更换为powershell的get-process，可以获取到进程的绝对地址和描述（含中文，相对直接显示进程名更加友好），通过搜索进程名称和描述皆可以搜索到相应进程

## 预览

![JXshoq.gif](https://s1.ax1x.com/2020/05/01/JXshoq.gif)



## 下载

[百度网盘](https://pan.baidu.com/s/1Q4I6LTRgrHgWm67F_xqv0A) 提取码: `nw4p`

[项目地址](https://github.com/fofolee/uTools-ProcessKiller/)

[插件发布页](https://yuanliao.info/d/296)

## 安装方法

将`upx`文件拖入`uTools`输入框中安装即可

## 关键字

`kill` `关闭进程`

## 类似插件

[窗口管理 WindowManager](https://yuanliao.info/d/1461)

[软件卸载 AppUninstaller]( https://yuanliao.info/d/317 )