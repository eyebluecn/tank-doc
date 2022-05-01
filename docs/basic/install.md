# 安装

## Linux

#### 基本步骤
1. 安装MySQL，并创建一个数据库(使用UTF-8编码，否则不能存储中文)
2. 下载最新版本的蓝眼云盘，[去下载](./download.md)
3. 解压，运行根目录下`tank`
```shell
./tank
```
4. 打开 `http://127.0.0.1:6010` 看到安装引导页面即表示软件安装成功。接着按照UI引导安装蓝眼云盘即可。

#### 更多的运行方法

1. 文件`tank`是可执行文件，可以直接运行，如步骤3所示。

2. **[推荐]** 如果你希望开机启动蓝眼云盘，或者可以使用系统的`systemctl`或`service`来控制蓝眼云盘。
- 1) 在`/etc/systemd/system/`下创建`tank.service`文件
```shell
vim /etc/systemd/system/tank.service
```
- 2) `tank.service`的内容如下所示，其中`ExecStart`根据实际情况指定`tank`可执行文件
```shell
[Unit]
Description=EyeblueTank
Documentation=https://tank-doc.eyeblue.cn
Wants=network.target
After=network.target

[Service]
Type=simple
DynamicUser=yes
ExecStart=/data/program/tank/tank
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

::: tip 提示
上文中给出的`tank.service`是用的root账号配置的。如果是要使用普通账号，应该加入如下字段：

```shell
User=XXX
WorkingDirectory=/data/program/tank/tank
Type=simple
```

:::


- 3) 装载`tank`服务，并启动（停止）蓝眼云盘
```shell
# 装载tank服务
systemctl daemon-reload
# 设置tank开机启动
systemctl enable tank.service
# 查看tank状态
systemctl status tank.service
# 启动tank
systemctl start tank.service
# 重启tank
systemctl restart tank.service
# 停止tank
systemctl stop tank.service
```
3. 如果你只是简单地希望蓝眼云盘常驻后台运行，请使用根目录`service`文件夹下的脚本文件。
```shell
# 启动蓝眼云盘
./startup.sh
# 停止蓝眼云盘
./shutdown.sh
```
## Windows
1. 安装MySQL，并创建一个数据库(使用UTF-8编码，否则不能存储中文)
2. 下载最新版本的蓝眼云盘，[去下载](./download.md)
3. 解压，双击根目录下的`tank.exe`运行
4. 打开 `http://127.0.0.1:6010` 看到安装引导页面即表示软件安装成功。接着按照UI引导安装蓝眼云盘即可。


## macOS
#### 基本步骤
1. 安装MySQL(使用UTF-8编码)
2. 下载最新版本的蓝眼云盘，[去下载](./download.md)
3. 解压，运行根目录下`tank`
```shell
./tank
```
4. 打开 `http://127.0.0.1:6010` 看到安装引导页面即表示软件安装成功。接着按照UI引导安装蓝眼云盘即可。


#### 更多的运行方法

1. 文件`tank`是可执行文件，可以直接运行，如步骤3所示。

2. 如果你只是简单地希望蓝眼云盘常驻后台运行，请使用根目录`service`文件夹下的脚本文件。
```shell
# 启动蓝眼云盘
./startup.sh
# 停止蓝眼云盘
./shutdown.sh
```

## Docker

1. Docker中启动mysql

```shell
docker run --name dockermysql -p 13306:3306 -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=tank -e TZ=Asia/Shanghai -d mysql:5.7 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci --default-time_zone=+8:00
```

::: tip 提示
1.容器名称为`dockermysql`，占用宿主13306端口，root密码123456，创建了一个`tank`数据库，用户名`tank`，密码`tank123` ，将文件挂载于宿主的`~/data/dockermysql`文件夹。

2.指定时区为Asia/Shanghai，编码为utf8mb4
:::



2. Docker中启动蓝眼云盘，`x.x.x`使用最新版本，[参考这里](./download.md)
```shell
docker run --name tank -p 6010:6010 --link dockermysql:mysql -v ~/data/dockermatter:/data/build/matter -d eyeblue/tank:x.x.x
```
::: tip 提示
1. 容器名称为`tank`，占用宿主6010端口，链接数据库为`mysql`，即通过`mysql`可以访问到步骤1中mysql的地址，将文件挂载于宿主的`~/data/dockermatter`文件夹。
2. 默认Asia/Shanghai时区，如果需要修改，请使用 -e TZ=xxx/yyy
:::

3. 打开 `http://127.0.0.1:6010` 看到安装引导页面即表示软件安装成功。

::: tip 提示
MySQL Host => `mysql`

MySQL 端口 => `3306` 

MySQL 库名 => `tank` 

MySQL 用户名 => `tank` 

MySQL 密码 => `tank123` 
:::
