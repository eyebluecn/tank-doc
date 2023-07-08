# 命令行工具

蓝眼云盘提供了很多实用的命令行工具，`tank`(或者`tank.exe`)文件本质上就是一个可执行文件，可以接受参数，当我们输入一定的参数时，就可以把它当成命令行工具使用。

## 准备条件
在使用命令行工具时，请首先启动蓝眼云盘。因为命令行工具本质上去调用蓝眼云盘的`http`接口

## 查看版本

查看当前蓝眼云盘版本

```shell
./tank -mode=version
```

## 映射本地文件映射

将本地文件映射到蓝眼云盘中

```shell
./tank -mode=mirror -username=YourUsername -password=YourPassword -src=SourcePath -dest=DestPath [-host=EyeblueTankHost]
```

::: tip 提示
YourUsername => 超级管理员的用户名

YourPassword => 超级管理员的密码

SourcePath => 想要映射的本地文件夹，例如：`/data/temp`

DestPath => 蓝眼云盘的文件夹，例如 `/morning`

-host => 可以指定蓝眼云盘地址，默认使用 http://127.0.0.1:6010
:::

## 拉取远程文件

将一个远程文件拉取到蓝眼云盘中

```shell
./tank -mode=crawl -username=YourUsername -password=YourPassword -src=SourcePath -dest=DestPath
```

::: tip 提示
YourUsername => 超级管理员的用户名

YourPassword => 超级管理员的密码

SourcePath => 远程的资源文件，一般是`http://`或者`https://`开头

DestPath => 蓝眼云盘的文件夹，例如 `/morning`
:::

## 版本迁移

版本迁移请查看[这里](../upgrade/migrate.md)



