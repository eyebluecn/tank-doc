# Webdav

## 访问地址
https://tanker.eyeblue.cn/api/dav

(以官方蓝眼云盘为例)

## 使用单独的域名作为WebDAV地址
如果你想去掉 `/api/dav` 的后缀，并且使用其他域名作为`WebDAV`的访问地址，你可以参考以下的nginx配置：

```shell
#https://tank-dav.eyeblue.cn
server{
        listen 443 ssl;
        server_name tank-dav.eyeblue.cn;

        ssl on;
        ssl_certificate /data/security/letsencrypt/eyebluecn/full_chain.pem;
        #private key
        ssl_certificate_key /data/security/letsencrypt/eyebluecn/private.key;

        location / {
                rewrite /(.*) /api/dav/$1 break;
                proxy_pass http://127.0.0.1:6010;
                proxy_set_header host $host;
                proxy_set_header X-Forwarded-For $remote_addr;
                proxy_pass_request_headers      on;
                client_max_body_size  2048m;
        }
}

#http://tank-dav.eyeblue.cn
server {
        listen      80;
        server_name    tank-dav.eyeblue.cn;
        rewrite ^(.*)$ https://tank-dav.eyeblue.cn$1 permanent;
}

```

通过以上的配置，WebDAV的访问地址就变成了：`https://tank-dav.eyeblue.cn`


## 支持WebDAV的常用客户端

### Windows平台

#### WinSCP
这是windows平台的一个免费软件，下载地址: https://winscp.net/eng/download.php

#### Potplayer
这是一个windows平台的免费播放器，可以通过WebDAV直接观看网盘中的视频，下载地址：http://potplayer.daum.net

#### NetDrive 3
NetDrive 3是一个收费软件，不过可以支持7天试用，而且跨平台，下载地址：http://www.netdrive.net/

### MacOS平台

#### NetDrive 3

### Android平台

#### ES文件浏览器
在各大应用商店搜索即可下载。添加的方式 网络 -> ftp -> WebDAV

### iOS平台

#### FE文件管理器
AppStore中搜索“FE文件管理器”即可下载，按照引导添加即可。

## 欢迎网友留言添加更多好用的WebDAV客户端。


## windows下映射webdav技巧

从Windows Vista起，微软就禁用了http形式的基本WebDAV验证形式（KB841215），必须使用https连接，但是架设在AppFog上的免费账户对SSL证书无权限。所以在Windows Vista/7/8中，要方便地映射ownCloud文件为系统上的“网络位置”，就必须改注册表……

HKEY_LOCAL_MACHINE>>SYSTEM>>CurrentControlSet>>Services>>WebClient>>Parameters>>BasicAuthLevel

把这个值从1改为2，然后进控制面板，服务，把WebClient服务重启（没有启动的就启动它）。

然后打开命令提示符，输入以下指令。

net use * http://YOUR_ownCloud_SERVER_PATH/api/dav /user:yourusername *

这个时候会提示输入密码

提示成功的话，打开计算机看看是不是在网络位置里出现一个盘了？

可以直接在cmd中 X: 进入这个挂载的地址。（X:是自动分配的盘符）

加上参数/persistent:YES 还可以使得这个映射在重启计算机后依然存在。

安全提醒：不要在公共网络环境（如公共WiFi热点）下以http连接的WebDAV访问，以免泄露隐私数据。



