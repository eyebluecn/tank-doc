# Q & A

## Why can't you upload Chinese files?
Please check the encoding of the database first, use utf-8 encoding to upload Chinese files.

Common database instructions are provided below，The following database is named `tank` and the table is` tank30_user `

```sql
# View database encoding
USE tank;
SHOW VARIABLES LIKE 'character_set_database';

# Modify database encoding
ALTER SCHEMA `tank`  DEFAULT CHARACTER SET utf8 ;

# check the table and field encoding
show create table tank.tank30_user;

# Modify table encoding
ALTER TABLE `tank`.`tank30_user` 
CHARACTER SET = utf8 ;

# Modify field encoding
ALTER TABLE `tank`.`tank30_user` 
CHANGE COLUMN `username` `username` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL ;
```


## How to configure nginx reverse proxy?
Normally we don't want to expose port 6010 to the public network. In this case, nginx will need to reverse proxy, allowing users to access Eyeblue Cloud Disk using the domain name and port 80 (or port 443). Here is the nginx configuration of `tank.eyeblue.cn`
```shell
#https://tank.eyeblue.cn
server{
        listen 443 ssl;
        server_name tank.eyeblue.cn;

        ssl on;
        ssl_certificate /letsencrypt/full_chain.pem;
        #private key
        ssl_certificate_key /letsencrypt/private.key;

        gzip on; #open or close gzip on off
        gzip_disable "msie6"; #not use gzip IE6
        gzip_min_length 100k; #gzip compress the minimum file size，beyond compression (self-adjusting）
        gzip_buffers 4 16k; #buffer don't need to modify
        gzip_comp_level 3; #Compression level: 1-10, the bigger the number, the better the compression and the longer the time.
        gzip_types application/javascript text/css text/javascript; #  type of compressed file 
        gzip_vary off;  #related to caching services such as Squid,If it's on, it adds an "Vary: Accept-Encoding" to the Header.

        location / {
                proxy_pass http://127.0.0.1:6010;
                proxy_set_header host $host;
                proxy_set_header X-Forwarded-For $remote_addr;
                proxy_pass_request_headers      on;
                client_max_body_size  2048m;
        }

}

#http://tank.eyeblue.cn forward all 80 requests to 443
server {
        listen      80;
        server_name    tank.eyeblue.cn;
        rewrite ^(.*)$ https://tank.eyeblue.cn$1 permanent;
}
```

::: tips
As the front-end resource file `chunk-vendors.js` is about 2M, using gzip compression for nginx configuration can significantly increase access speed.
:::

## Why can't you upload files that are too big?
It may be that the reverse proxy software limits the post size, such as `client_max_body_size 2048m;` as configured above by `nginx`. makes it possible to upload files of` 2G `at most
