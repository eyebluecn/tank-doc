# 自定义预览引擎

蓝眼云盘`3.1.x`版本支持用户自定义预览引擎，你可以在网站偏好设置处，设置文件后缀所使用的预览引擎。

对于office文件，如果没有设置，那么会默认使用微软预览接口。 我们同样推荐使用kkfileview来预览。

## 微软预览接口
蓝眼云盘中Office文件预览默认是使用微软提供的[预览接口](https://view.officeapps.live.com/op/embed.aspx)，因此预览有这几个限制。
- 1. 你部署的蓝眼云盘必须是公网ip或者外网可以访问的域名。(也就是或127.0.0.1或者localhost都不行)  
- 2. 文件不能太大，超过10M微软的预览接口便不支持了。


## kkfileview
https://kkfileview.keking.cn/zh-cn/index.html
支持多种预览格式。



