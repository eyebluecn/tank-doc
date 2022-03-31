# 自定义预览引擎

蓝眼云盘`3.1.x`版本支持用户自定义预览引擎，你可以在网站偏好设置处，设置文件后缀所使用的预览引擎。

对于office文件，如果没有设置，那么会默认使用微软预览接口。 我们同样推荐使用kkfileview来预览。

## url占位符
- {originUrl} 文件原始的url地址。eg: https://tank.eyeblue.cn/api/alien/download/2a0ceee1-744c-4c82-4215-69c382597a50/abstract-free-photo-2210x1473.jpg
- {url} 对于公有文件publicUrl=originUrl，对于私有文件publicUrl是originUrl带上downloadToken。 eg: https://tank.eyeblue.cn/api/alien/download/2a0ceee1-744c-4c82-4215-69c382597a50/abstract-free-photo-2210x1473.jpg?downloadTokenUuid=6bdba52f-af6b-49ae-5a5d-fd80bfb01d3b
- {b64Url} 文件经过base64以及urlencode编码，即 b64Url = encodeURIComponent(Base64.encode(originUrl))




## 微软预览接口
蓝眼云盘中Office文件预览默认是使用微软提供的[预览接口](https://view.officeapps.live.com/op/embed.aspx)，因此预览有这几个限制。
- 1. 你部署的蓝眼云盘必须是公网ip或者外网可以访问的域名。(也就是或127.0.0.1或者localhost都不行)  
- 2. 文件不能太大，超过10M微软的预览接口便不支持了。


## kkfileview
https://kkfileview.keking.cn/zh-cn/index.html
支持多种预览格式。需要注意的是，如果你在docker中部署的kkfileview,需要保证docker中能够访问到你的蓝眼云盘(也就是说localhost可能访问不了)

### kkfileview 3.x.x 版本
引擎格式填写方式： http://your-kkfileview-domain/onlinePreview?url={b64Url}

### kkfileview 2.x.x 及以下版本
引擎格式填写方式： http://your-kkfileview-domain/onlinePreview?url={url}

## only Office.
配置方法：http://your-onlyoffice-domain/onlyOffice/edit?url={url}

感谢由@温文英承 提供配置方法。


