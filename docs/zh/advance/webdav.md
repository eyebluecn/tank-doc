# Webdav

## 访问地址
https://tank.eyeblue.cn/api/dav

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
