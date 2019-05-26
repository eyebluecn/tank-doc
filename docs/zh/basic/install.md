# 安装


## Windows
1. 安装MySQL(使用UTF-8编码)
2. 下载最新版本的蓝眼云盘，[去下载](./download.md)
3. 解压，双击根目录下的`tank.exe`运行
4. 打开 `http://127.0.0.1:6010` 看到安装引导页面即表示软件安装成功。接着按照UI引导安装蓝眼云盘即可。


## Linux
1. 安装MySQL(使用UTF-8编码)
2. 下载最新版本的蓝眼云盘，[去下载](./download.md)
3. 解压，运行根目录下`tank`
```shell
./tank
```
4. 打开 `http://127.0.0.1:6010` 看到安装引导页面即表示软件安装成功。接着按照UI引导安装蓝眼云盘即可。

## macOS
1. 安装MySQL(使用UTF-8编码)
2. 下载最新版本的蓝眼云盘，[去下载](./download.md)
3. 解压，运行根目录下`tank`
```shell
./tank
```
4. 打开 `http://127.0.0.1:6010` 看到安装引导页面即表示软件安装成功。接着按照UI引导安装蓝眼云盘即可。

## docker


1. Docker中启动mysql
```shell
docker run --name dockermysql -p 13306:3306 -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=tank -e MYSQL_USER=tank -e MYSQL_PASSWORD=tank123 -v ~/data/dockermysql:/var/lib/mysql -d mysql:5.7
```
::: tip 提示
容器名称为`dockermysql`，占用宿主13306端口，root密码123456，创建了一个`tank`数据库，用户名`tank`，密码`tank123` ，将文件挂载于宿主的`~/data/dockermysql`文件夹。
:::

2. Docker中启动蓝眼云盘
```shell
docker run --name tank -p 6010:6010 --link dockermysql:mysql -v ~/data/dockermatter:/data/build/matter -d eyeblue/tank:3.0.2
```
::: tip 提示
容器名称为`tank`，占用宿主6010端口，链接数据库为`mysql`，即通过`mysql`可以访问到步骤1中mysql的地址，将文件挂载于宿主的`~/data/dockermatter`文件夹。
:::

3. 打开 `http://127.0.0.1:6010` 看到安装引导页面即表示软件安装成功。

::: tip 提示
MySQL Host => `mysql`

MySQL 端口 => `3306` 

MySQL 库名 => `tank` 

MySQL 用户名 => `tank` 

MySQL 密码 => `tank123` 
:::
