# 基础使用

这里是云盘的一些基础使用功能，在界面上直接就可以操作感受。

## [安装](./install.md)


### 开机启动

在文件`/etc/systemd/system/tank.service`中粘贴以下内容，其中`ExecStart=`根据实际情况而定。
```
[Unit]
Description=EyeblueTank
Documentation=https://tank-doc.eyeblue.cn
Wants=network.target
After=network.target

[Service]
Type=simple
DynamicUser=yes
ExecStart=/data/program/tank-3.0.0/tank
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

执行以下命令，让service生效
```shell
systemctl daemon-reload
systemctl enable tank.service
systemctl status tank.service
```

出现以下提示表示创建成功
```
Created symlink from /etc/systemd/system/multi-user.target.wants/tank.service to /etc/systemd/system/tank.service.

tank.service - EyeblueTank
Loaded: loaded (/etc/systemd/system/tank.service; enabled; vendor preset: disabled)
Active: inactive (dead)
 Docs: https://tank-doc.eyeblue.cn
```

## 上传

## 下载

## 分享



## 从2.0迁移到3.0

准备条件：

1. 停止tank2.0
2. 安装好tank3.0
3. 2.0和3.0使用同一个数据库

迁移命令：
```
cd tank 3.0安装目录
./tank -mode=migrate20to30 -username=YourUsername -password=YourPassword -src=Tank2.0MatterPath
```


如果要想查看迁移过程日志：
```
cd tank 3.0安装目录
tail -f ./log/tank.log
```

迁移完毕后，所有2.0的用户后会加上`_20`.




