# 3.1.x升级到4.0.x版本

::: tip 提示

4.0.0.beta版本为不稳定版本，请等到4.0.0正式版发布后再升级。

:::

3.1.x到4.0.x是大型升级，因此数据库表有变动。

升级步骤：

### 1. 停止蓝眼云盘3.1.x

首先停止蓝眼云盘

### 2. 备份数据和文件
此次升级会有破坏原来的数据库结构，因此升级前一定要备份原来的数据库。
根目录下的`matter`文件夹是存放的文件，这个结构不会破坏，可以选择性地备份。


### 3. 调整数据库schema
只需要执行以下sql语句，当然你也可以根据以下sql语句的语义在自己sql客户端用可视化操作。

- 新增表

4.0版本新增了两张表，创建他们：
```sql
CREATE TABLE `tank40_space` (
  `uuid` char(36) NOT NULL DEFAULT '',
  `sort` bigint(20) NOT NULL,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `create_time` timestamp NOT NULL DEFAULT '2018-01-01 00:00:00',
  `user_uuid` char(36) DEFAULT NULL,
  `size_limit` bigint(20) DEFAULT NULL,
  `total_size_limit` bigint(20) DEFAULT NULL,
  `total_size` bigint(20) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`uuid`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `idx_user_uuid` (`user_uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tank40_space_member` (
  `uuid` char(36) NOT NULL DEFAULT '',
  `sort` bigint(20) NOT NULL,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `create_time` timestamp NOT NULL DEFAULT '2018-01-01 00:00:00',
  `space_uuid` char(36) DEFAULT NULL,
  `user_uuid` char(36) DEFAULT NULL,
  `space_role` varchar(45) DEFAULT NULL,
  `role` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`uuid`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

- 修改表名

接着是需要将表名前缀从 `tank31_` 修改成 `tank40_`。
```sql

ALTER TABLE `tank31_bridge` RENAME TO  `tank40_bridge` ;
ALTER TABLE `tank31_dashboard` RENAME TO  `tank40_dashboard` ;
ALTER TABLE `tank31_download_token` RENAME TO  `tank40_download_token` ;
ALTER TABLE `tank31_footprint` RENAME TO  `tank40_footprint` ;
ALTER TABLE `tank31_image_cache` RENAME TO  `tank40_image_cache` ;
ALTER TABLE `tank31_matter` RENAME TO  `tank40_matter` ;
ALTER TABLE `tank31_preference` RENAME TO  `tank40_preference` ;
ALTER TABLE `tank31_session` RENAME TO  `tank40_session` ;
ALTER TABLE `tank31_share` RENAME TO  `tank40_share` ;
ALTER TABLE `tank31_upload_token` RENAME TO  `tank40_upload_token` ;
ALTER TABLE `tank31_user` RENAME TO  `tank40_user` ;


```

- 调整字段

然后是 `tank40_matter` 表中新增了`space_uuid`字段，字段`username`替换成`space_name`; `tank40_share`表中新增了`space_uuid`字段;`tank40_user`表中新增了`space_uuid`字段;
```sql
ALTER TABLE `tank40_matter` ADD COLUMN `space_uuid` CHAR(36) NULL;
ALTER TABLE `tank40_matter` CHANGE username space_name VARCHAR(45) NULL;
ALTER TABLE `tank40_share` ADD COLUMN `space_uuid` CHAR(36) NULL;
ALTER TABLE `tank40_user` ADD COLUMN `space_uuid` CHAR(36) NULL;
```

- 调整数据

4.0版本新增了空间的概念，以前的用户所有文件就变成了个人空间。
```sql
-- 为每个用户创建一个私人空间。
INSERT INTO `tank40_space`
SELECT
UUID() AS uuid,
sort AS sort,
update_time AS update_time,
create_time AS create_time,
uuid AS user_uuid,
size_limit AS size_limit,
total_size_limit AS total_size_limit,
total_size AS total_size,
username AS name,
'PRIVATE' AS type
FROM `tank40_user`;

-- 设置user表中的space_uuid
UPDATE `tank40_user` t1 INNER JOIN `tank40_space` t2 ON t1.uuid = t2.user_uuid
SET t1.space_uuid = t2.uuid
WHERE t1.uuid > '';

-- 设置matter表中的space_uuid
UPDATE `tank40_matter` t1 INNER JOIN `tank40_user` t2 ON t1.user_uuid = t2.uuid
SET t1.space_uuid = t2.space_uuid
WHERE t1.uuid > '';

-- 设置share表中的space_uuid
UPDATE `tank40_share` t1 INNER JOIN `tank40_user` t2 ON t1.user_uuid = t2.uuid
SET t1.space_uuid = t2.space_uuid
WHERE t1.uuid > '';
```

### 4. 替换文件

仅仅保留蓝眼云盘的`matter`文件夹，其余文件(夹)`conf`,`html`,`tank`用`4.0.x`安装包中的替换。
因为数据库中记录了文件元信息，matter文件中保留了物理文件，因此只要保证这两处的数据即可。


### 5. 启动蓝眼

启动蓝眼，应该会进入到安装引导界面了，安装完成了之后，3.1.x的文件依旧会保留。
