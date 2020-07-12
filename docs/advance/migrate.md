# 版本升级

## 3.0.x升级到3.1.x版本

3.0.x到3.1.x是中型升级，因此数据库表有变动。

升级分为三步进行

### 1. 停止蓝眼云盘3.0.x

首先停止蓝眼云盘

### 2. 调整数据库schema
只需要执行以下sql语句，当然你也可以根据以下sql语句的语义在自己sql客户端用可视化操作。

首先是需要将表名前缀从 `tank30_` 升级成了 `tank31_`，我的库名是tank，自己的库名视具体情况而定。
```sql

ALTER TABLE `tank`.`tank30_bridge` RENAME TO  `tank`.`tank31_bridge` ;
ALTER TABLE `tank`.`tank30_dashboard` RENAME TO  `tank`.`tank31_dashboard` ;
ALTER TABLE `tank`.`tank30_download_token` RENAME TO  `tank`.`tank31_download_token` ;
ALTER TABLE `tank`.`tank30_footprint` RENAME TO  `tank`.`tank31_footprint` ;
ALTER TABLE `tank`.`tank30_image_cache` RENAME TO  `tank`.`tank31_image_cache` ;
ALTER TABLE `tank`.`tank30_matter` RENAME TO  `tank`.`tank31_matter` ;
ALTER TABLE `tank`.`tank30_preference` RENAME TO  `tank`.`tank31_preference` ;
ALTER TABLE `tank`.`tank30_session` RENAME TO  `tank`.`tank31_session` ;
ALTER TABLE `tank`.`tank30_share` RENAME TO  `tank`.`tank31_share` ;
ALTER TABLE `tank`.`tank30_upload_token` RENAME TO  `tank`.`tank31_upload_token` ;
ALTER TABLE `tank`.`tank30_user` RENAME TO  `tank`.`tank31_user` ;


```

3.1.x数据库连接支持utf8mb4，可以存储emoji，如果有需要的，也要将表做对应的调整。
```sql
ALTER TABLE `tank`.`tank31_bridge`  CHARACTER SET = utf8mb4 ;
ALTER TABLE `tank`.`tank31_dashboard`  CHARACTER SET = utf8mb4 ;
ALTER TABLE `tank`.`tank31_download_token`  CHARACTER SET = utf8mb4 ;
ALTER TABLE `tank`.`tank31_footprint`  CHARACTER SET = utf8mb4 ;
ALTER TABLE `tank`.`tank31_image_cache`  CHARACTER SET = utf8mb4 ;
ALTER TABLE `tank`.`tank31_matter`  CHARACTER SET = utf8mb4 ;
ALTER TABLE `tank`.`tank31_preference`  CHARACTER SET = utf8mb4 ;
ALTER TABLE `tank`.`tank31_session`  CHARACTER SET = utf8mb4 ;
ALTER TABLE `tank`.`tank31_share`  CHARACTER SET = utf8mb4 ;
ALTER TABLE `tank`.`tank31_upload_token`  CHARACTER SET = utf8mb4 ;
ALTER TABLE `tank`.`tank31_user`  CHARACTER SET = utf8mb4 ;
```


其次是 `tank31_matter` 表中新增了`prop`,`visit_time`,`deleted`,`delete_time`字段， `tank31_preference` 表中新增了`preview_config`,`scan_config`,`deleted_keep_days`字段。
这一步操作可以不做，因为在安装引导界面会自动补齐缺失的字段。
```sql
ALTER TABLE `tank`.`tank31_matter` ADD COLUMN `prop` VARCHAR(1034) NULL DEFAULT '{}' AFTER `times`;
ALTER TABLE `tank`.`tank31_matter` ADD COLUMN `visit_time` TIMESTAMP NULL DEFAULT '2018-01-01 00:00:00' AFTER `prop`;
ALTER TABLE `tank`.`tank31_matter` ADD COLUMN `deleted` TINYINT(1) NULL DEFAULT 0 AFTER `visit_time`;
ALTER TABLE `tank`.`tank31_matter` ADD COLUMN `delete_time` TIMESTAMP NULL DEFAULT '2018-01-01 00:00:00' AFTER `deleted`;
ALTER TABLE `tank`.`tank31_preference` ADD COLUMN `preview_config` TEXT NULL AFTER `allow_register`;
ALTER TABLE `tank`.`tank31_preference` ADD COLUMN `scan_config` TEXT NULL AFTER `preview_config`;
ALTER TABLE `tank`.`tank31_preference` ADD COLUMN `deleted_keep_days` BIGINT(20) NULL DEFAULT 7 AFTER `scan_config`;

```

### 3. 替换文件

仅仅保留蓝眼云盘的`matter`文件夹，其余文件(夹)`conf`,`html`,`tank`用`3.1.x`安装包中的替换。
因为数据库中记录了文件元信息，matter文件中保留了物理文件，因此只要保证这两处的数据即可。


### 4. 启动蓝眼

启动蓝眼，应该会进入到安装引导界面了，安装完成了之后，3.0.x的文件依旧会保留。


## 2.0.x迁移到3.0.x版本

由于`2.0.x`文件目录的结构按照时间戳顺序进行组织，`3.0.0`按照和蓝眼云盘中一致的物理目录组织，因此导致文件存放的结构不一致。为了让`2.0.0`的用户更优雅的使用`3.0.x`版本，作者特意写了一个迁移工具，按照以下步骤进行迁移。

### 准备条件：

1. 停止`tank2.0.x`
2. 安装好`tank3.0.x`，即至少已经有一个超级管理员了。
3. `2.0.x`和`3.0.x`使用同一个数据库
4. 执行以下迁移命令，其中`YourUsername`和`YourPassword`是指蓝眼云盘`3.0.x`的超级管理员账号密码。`Tank2.0MatterPath`是指`2.0.x`版本的MatterPath，可以在`tank.conf`文件中找到，如果这个字段为空，例如`2.0.x`的安装目录为`/data/tank2.0`，那么就使用`/data/tank2.0/matter`。
```
cd tank 3.0.x安装目录
./tank -mode=migrate20to30 -username=YourUsername -password=YourPassword -src=Tank2.0MatterPath
```

迁移时间长短会和你的文件多少有关，请耐心等待，如果要想查看迁移过程日志：
```
cd tank 3.0安装目录
tail -f ./log/tank.log
```

5. 迁移完毕后，所有`2.0.x`的用户名后会加上`_20`.
