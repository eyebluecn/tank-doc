# Office预览


## 微软预览接口
蓝眼云盘中Office文件预览默认是使用微软提供的[预览接口](https://view.officeapps.live.com/op/embed.aspx)，因此预览有这几个限制。
- 1. 你部署的蓝眼云盘必须是公网ip或者外网可以访问的域名。(也就是或127.0.0.1或者localhost都不行)  
- 2. 文件不能太大，超过10M微软的预览接口便不支持了。



## onlyoffice

onlyoffice 支持部署在自己的服务器上，因此预览就没有限制了。官网地址：https://www.onlyoffice.com


## Docker安装

### 1.拉取镜像

```shell
docker pull onlyoffice/documentserver
```

### 2.运行
我们使用8085端口启动
```shell
docker run -i -t -d -p 8085:80 --restart=always \
    -v /app/onlyoffice/DocumentServer/logs:/var/log/onlyoffice  \
    -v /app/onlyoffice/DocumentServer/data:/var/www/onlyoffice/Data  \
    -v /app/onlyoffice/DocumentServer/lib:/var/lib/onlyoffice \
    -v /app/onlyoffice/DocumentServer/db:/var/lib/postgresql  onlyoffice/documentserver
```


docker run -i -t -d -p 81:80 onlyoffice/communityserver




