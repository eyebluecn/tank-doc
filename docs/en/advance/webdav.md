# Webdav

## Link
https://tanker.eyeblue.cn/api/dav

(Based on Eyeblue Cloud Disk)

## Use a separate domain name as the WebDAV address
If you want to remove the `/api/dav` suffix and use another domain name as the access address for `WebDAV` , you can refer to the following nginx configuration:

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

With the above configuration, the access address of `WebDAV` becomes: `https://tank-dav.eyeblue.cn`


## Common clients that support WebDAV

### Windows

#### WinSCP
This is a free software for Windows platform. download url: https://winscp.net/eng/download.php

#### Potplayer
This is a Windows platform free player, you can directly watch the network disk video through WebDAV. download url: http://potplayer.daum.net

#### NetDrive 3
NetDrive 3is a free app, but it supports 7 days of testing and is able to cross platform. download url: http://www.netdrive.net/

### MacOS

#### NetDrive 3

### Android

#### ES file browser
Search the AppStore to download. Way to add `network -> ftp -> WebDAV`

### iOS

#### FE file manager
Search in AppStore to download, follow the guide to add.

## Welcome to add more useful WebDAV client.
