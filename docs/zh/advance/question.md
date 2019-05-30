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


# 如何配置nginx反向代理？
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

# 为什么太大的文件就不能上传了？
可能是反向代理的软件对post大小限制了，比如上方`nginx`配置的`client_max_body_size  2048m;`就使得最大只能上传`2G`的文件

