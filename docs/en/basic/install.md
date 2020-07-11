# Install

## Linux

#### Steps
1. Install Mysql
2. Download EyeblueTank，[Go to download](download.md)
3. unzip and run `tank`
```shell
./tank
```
4. open `http://127.0.0.1:6010` , the install guide page means installing succeed.
You may finish the initialing work by the guid.

#### More Run Methods

1. `tank` is an executable file, as step 3.

2. **[Recommended]** If you want to start when server bootstrap. Use system's `systemctl` or `service`
- 1) `/etc/systemd/system/` create `tank.service`
```shell
vim /etc/systemd/system/tank.service
```
- 2) `tank.service` 
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

- 3) load `tank` service
```shell
# load tank
systemctl daemon-reload
# make tank start when bootstrap
systemctl enable tank.service
# show status
systemctl status tank.service
# start tank
systemctl start tank.service
# restart tank
systemctl restart tank.service
# stop tank
systemctl stop tank.service
```
3. You can also use the following ways, open folder `service`
```shell
# start
./startup.sh
# stop
./shutdown.sh
```
## Windows
1. Install MySQL
2. Download EyeblueTank，[Go to download](download.md)
3. Unzip and double click `tank.exe`
4. Open `http://127.0.0.1:6010` do as the guide shows.


## macOS
#### Steps
1. Install MySQL
2. Download EyeblueTank，[Go to download](download.md)
3. Unzip and run`tank`
```shell
./tank
```
4. open `http://127.0.0.1:6010`  do as the guide shows.


## Docker

1. start mysql in Docker
```shell
docker run --name dockermysql -p 13306:3306 -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=tank -e MYSQL_USER=tank -e MYSQL_PASSWORD=tank123 -v ~/data/dockermysql:/var/lib/mysql -d mysql:5.7
```
::: tip Hint
container is `dockermysql`,use port 13306，root's password 123456，crate a `tank` database，username`tank`，password`tank123` ，mounted to `~/data/dockermysql`
:::


2. start EyeblueTank in docker，`x.x.x`is the latest version，[See Here](download.md)
```shell
docker run --name tank -p 6010:6010 --link dockermysql:mysql -v ~/data/dockermatter:/data/build/matter -d eyeblue/tank:x.x.x
```
::: tip Hint
容container is `tank`，Use port 6010，database is `mysql`，use `mysql` can visit step 1 mysql.Mounted to `~/data/dockermatter`
:::

3. Open `http://127.0.0.1:6010`  do as the guide shows.

::: tip Hints
MySQL Host => `mysql`

MySQL Port => `3306` 

MySQL Database => `tank` 

MySQL Username => `tank` 

MySQL Password => `tank123` 
:::
