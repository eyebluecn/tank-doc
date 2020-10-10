# 自行编译

## 前端项目打包
1. clone  ![](/github.png "github.png") [eyebluecn/tank-front](https://github.com/eyebluecn/tank-front)

2. 安装依赖项
```
npm install
```
3. 执行打包命令
```
npm run build
```
4. 通过前面三步可以在`dist`文件夹下得到打包后的静态文件，将`dist`目录下的所有文件拷贝到后端项目的`build/html`文件夹下。

## 后端项目打包

1. clone ![](/github.png "github.png") [eyebluecn/tank](https://github.com/eyebluecn/tank)

2. 安装Golang，配置环境变量`GOPATH` （因为使用go module，所以对`GOPATH`路径没有要求）

3. 打包

- windows平台双击运行 `tank/build/pack/build.bat`，成功之后可在`tank/dist`下看到`tank-x.x.x`文件夹，该文件夹即为最终安装包。

- linux平台运行如下命令：
```
# Go 1.13 及以上（推荐）启用go module功能，默认是关闭的
go env -w GO111MODULE=on

cd tank/build/pack/
./build.sh
```
成功之后可在`tank/dist`下看到`tank-x.x.x.linux-xxx.tar.gz`

利用得到的安装包即可参考[安装](install.md)一节进行安装。

::: tip 提示
如果你在安装依赖时，发现速度太慢，那么可以尝试修改脚本中的GOPROXY，常用的GOPROXY值有：

https://athens.azurefd.net

https://goproxy.io

https://goproxy.cn
:::
