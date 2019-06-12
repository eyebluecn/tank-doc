# Command Line Tool

Eyeblue Cloud Disk provides a number of useful command-line tools. `tank` (or `tank.exe`) files are essentially executable files that accept parameters.When we enter a certain parameter, we can use it as a command line tool.

## Preparation 

When using command-line tools, start Eyeblue Cloud Disk first.Because command-line tools essentially call the `HTTP` interface of Eyeblue Cloud Disk

## Check the version

Check out the current version of Eyeblue Cloud Disk

```shell
./tank -mode=version
```

## Map local file mappings

Map the local file to the Eyeblue Cloud Disk

```shell
./tank -mode=mirror -username=YourUsername -password=YourPassword -src=SourcePath -dest=DestPath
```

::: tip hint
YourUsername => The user name of the super administrator

YourPassword => The password for the super administrator

SourcePath => The local folder you want to map to，for example：`/data/temp`

DestPath => Eyeblue Cloud Disk Folder, for examlep `/morning`

-host => You can specify the Eyeblue Cloud Disk address，The default is  http://127.0.0.1:6010
:::

## Pull remote files

Drag a remote file to the Eyeblue Cloud Disk

```shell
./tank -mode=crawl -username=YourUsername -password=YourPassword -src=SourcePath -dest=DestPath
```

::: tip hint
YourUsername => The user name of the super administrator

YourPassword => The password for the super administrator

SourcePath => Remote resource file，It usually begins with `http://` or `https://`

DestPath => Eyeblue Cloud Disk Folder, for examlep `/morning`
:::

## Version of the migration

Version migration please see[here](./migrate.md)
