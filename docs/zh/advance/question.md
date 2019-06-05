# 常见问题

## 为什么不能上传中文文件？
请首先检查数据库的编码，采用utf-8编码就可以上传中文。

以下提供常用数据库指令，以下数据库名为`tank`，表为`tank30_user`

```sql
# 查看数据库编码
USE tank;
SHOW VARIABLES LIKE 'character_set_database';

# 修改数据库编码
ALTER SCHEMA `tank`  DEFAULT CHARACTER SET utf8 ;

# 查看表以及字段编码
show create table tank.tank30_user;

# 修改表编码
ALTER TABLE `tank`.`tank30_user` 
CHARACTER SET = utf8 ;

# 修改字段编码
ALTER TABLE `tank`.`tank30_user` 
CHANGE COLUMN `username` `username` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL ;
```


## 如何配置nginx反向代理？
通常我们不希望把6010端口暴露到公网，这时需要nginx进行反向代理，让用户使用域名及80端口（或443端口）就能访问蓝眼云盘。以下是`tank.eyeblue.cn`的nginx配置
```shell
#https://tank.eyeblue.cn
server{
        listen 443 ssl;
        server_name tank.eyeblue.cn;

        ssl on;
        ssl_certificate /letsencrypt/full_chain.pem;
        #private key
        ssl_certificate_key /letsencrypt/private.key;

        gzip on; #开启或关闭gzip on off
        gzip_disable "msie6"; #不使用gzip IE6
        gzip_min_length 100k; #gzip压缩最小文件大小，超出进行压缩（自行调节）
        gzip_buffers 4 16k; #buffer 不用修改
        gzip_comp_level 3; #压缩级别:1-10，数字越大压缩的越好，时间也越长
        gzip_types application/javascript text/css text/javascript; #  压缩文件类型
        gzip_vary off;  #跟Squid等缓存服务有关，on的话会在Header里增加 "Vary: Accept-Encoding"

        location / {
                proxy_pass http://127.0.0.1:6010;
                proxy_set_header host $host;
                proxy_set_header X-Forwarded-For $remote_addr;
                proxy_pass_request_headers      on;
                client_max_body_size  2048m;
        }

}

#http://tank.eyeblue.cn 转发所有80的请求到443
server {
        listen      80;
        server_name    tank.eyeblue.cn;
        rewrite ^(.*)$ https://tank.eyeblue.cn$1 permanent;
}
```

::: tip 提示
由于前端资源文件`chunk-vendors.js` 约2M，因此在nginx的配置中使用gzip压缩可以显著提升访问速度。
:::

## 为什么太大的文件就不能上传了？
可能是反向代理的软件对post大小限制了，比如上方`nginx`配置的`client_max_body_size  2048m;`就使得最大只能上传`2G`的文件

