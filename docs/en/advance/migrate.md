# Migrating

## 2.0.x migration to version 3.0.x

Since the structure of `2.0.x` file directory is organized according to timestamp order, `3.0.0` is organized according to the same physical directory as the Eyeblue Cloud Disk, so the structure of file storage is inconsistent. In order to make you transition to `3.0.x` version more elegantly , the author specially wrote a migration tool, follow the following steps for migration.

### Preparations：

1. stop`tank2.0.x`
2. install`tank3.0.x`，At least one super administrator already exists
3. `2.0.x`and`3.0.x`Using the same database
4. Execute the following migration command,Where `YourUsername` and `YourPassword` are the super administrator account passwords for Eyeblue Cloud Disk `3.0.x`.`Tank2.0MatterPath`is mean the MatterPath of version `2.0.x`,This can be found in the `tank.conf` file，，If this field is empty,For example, the installation directory for `2.0.x` is` /data/tank2.0 `,So use`/data/tank2.0/matter`.
```
cd tank 3.0.x installation directory
./tank -mode=migrate20to30 -username=YourUsername -password=YourPassword -src=Tank2.0MatterPath
```

The migration time will depend on how many files you have. Please be patient. if you want to check the migration process log:
```
cd tank 3.0 installation directory
tail -f ./log/tank.log
```

5. After the migration, `_20` is added to all user names of `2.0.x`.
