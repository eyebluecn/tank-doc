# Migrating

todo...

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
