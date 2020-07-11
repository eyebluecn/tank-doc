# 第三方存储

### AlienController

- 蓝眼云盘提供了[编程接口](https://github.com/eyebluecn/tank/blob/master/build/doc/alien_zh.md)，实现了云存储（如：[七牛云](https://www.qiniu.com)，[阿里云OSS](https://www.aliyun.com/product/oss)）的核心功能，可以使用编程接口上传文件，作为其他网站、系统、app的资源存储器。可以在下载图片时对图片做缩放裁剪处理，可以有效地节省客户端流量

- 蓝眼系列开源软件之二的[《蓝眼博客》](https://github.com/eyebluecn/blog)正是使用蓝眼博客作为第三方资源存储器。蓝眼博客中的所有图片，附件均是存储在蓝眼云盘中


### 上传时序图
![上传时序图](/upload-time-line.png)

### 下载时序图

![下载时序图](/download-time-line.png)

----------

### 接口鉴权

鉴权方式有两种：
1. 调用`/api/user/login` (username,password 为入参)后，会得到cookie，后面每次请求时都带上该cookie。
2. 每次请求接口时，都额外传 `_username`,`_password` 两个参数，用户名密码匹配则可通过鉴权。

### 接口详情

#### /api/alien/fetch/upload/token

**功能**：一个蓝眼云盘受信任的用户请求一个`UploadToken`，用于给另一个用户向蓝眼云盘上传文件

一般的使用场景是`应用服务器`向`蓝眼云盘`请求`UploadToken`，然后将此`UploadToken`交由`浏览器`去向`蓝眼云盘`上传文件

**访问级别**：`注册用户`,`管理员`

**请求参数**

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
filename | `string` | 必填 | 文件名
expireTime | `string` | 必填 | UploadToken过期时间
privacy | `bool` | 选填 | 文件的共有性。`true`表示文件私有，下载时必须要DownloadToken. `false`表示文件公有，任何人可以通过下载链接直接下载，默认值为false
size | `int` |  必填 | 文件的大小。单位：byte
dirPath | `string` | 必填 |文件存放的路径。不能为空，必须以`/`开头，不能出现连续的`//`,不能包含以下特殊符号：`< > \| * ? \`。举例：`/app/blog/20180101121212001`

----------

#### /api/alien/fetch/download/token

**功能**：一个蓝眼云盘受信任的用户请求一个`DownloadToken`，用于给另一个用户下载蓝眼云盘上的私有文件

一般的使用场景是`应用服务器`向`蓝眼云盘`请求`DownloadToken`，然后将此`DownloadToken`交由`浏览器`去向`蓝眼云盘`下载文件

**访问级别**：`注册用户`,`管理员`

**请求参数**

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
matterUuid | `string` |  必填 | 文件uuid，要想下载的文件`uuid`
expireTime | `string` |  必填 | UploadToken过期时间，单位：s。默认 86400s 即24h

----------

#### /api/alien/confirm

**功能**：`应用服务器`向蓝眼云盘确认某个文件是否确实已经上传好了

**访问级别**：`注册用户`,`管理员`

**请求参数**

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
matterUuid | `string` | 必填 | 浏览器上传完毕后，蓝眼云盘返回给浏览器的`uuid`

----------

#### /api/alien/upload

**功能**：浏览器拿着`UploadToken`通过FormData向蓝眼云盘上传文件

一般的使用场景是`应用服务器`向`蓝眼云盘`请求`UploadToken`，然后将此`UploadToken`交由`浏览器`去向`蓝眼云盘`上传文件。由于在请求`UploadToken`的时候已经传入了文件元信息，因此这里的文件信息必须要和`/api/alien/fetch/upload/token`传入的参数信息一致

**访问级别**：`游客`,`注册用户`,`管理员`

**请求参数**

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
uploadTokenUuid | `string` | 必填 | uploadToken标识，`/api/alien/fetch/upload/token`请求返回对象中的`uuid`
file | `file` | 必填 | 文件，在浏览器中是通过`<input type="file" name="file"/>`来选择的

----------

#### /api/alien/crawl/token

**功能**：获取一个token，提供给第三方去调用的一个接口

**访问级别**：`游客`,`注册用户`,`管理员`

**请求参数**

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
uploadTokenUuid | `string` | 必填 | uploadToken标识，`/api/alien/fetch/upload/token`请求返回对象中的`uuid`
url | `string` | 选填 | 获取文件的链接

----------

#### /api/alien/crawl/direct

**功能**：让蓝眼云盘去拉取一个url资源

**访问级别**：`注册用户`,`管理员`

**请求参数**

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
filename | `string` | 必填 | 文件名
privacy | `bool` | 选填 | 文件的共有性。`true`表示文件私有，下载时必须要DownloadToken. `false`表示文件公有，任何人可以通过下载链接直接下载，默认值为false
dirPath | `string` | 选填 | 文件存放路径
url | `string` | 选填 | 获取文件的链接

----------

#### /api/alien/preview/{uuid}/{filename}

**功能**：这个接口实现预览功能

**访问级别**：`游客`,`注册用户`,`管理员`

**请求参数**： 均是放置在url中

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
uuid | `string` | 必填 | 文件的uuid，该参数放在url的路径中
filename | `string` | 必填 | 文件的名称，该参数放在url的路径中
downloadTokenUuid | `string` | 选填 |download的uuid，如果是私有文件该参数必须，公有文件无需填写

**返回**: 二进制的文件

----------

#### /api/alien/download/{uuid}/{filename}

**功能**：在浏览器中下载文件

这个接口既可以下载公有文件，又可以下载私有文件。同时对于图片文件还可以做裁剪缩放等操作

**访问级别**：`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
uuid | `string` | 必填 | 文件的uuid，该参数放在url的路径中
filename | `string` | 必填 | 文件的名称，该参数放在url的路径中
downloadTokenUuid | `string` | 选填 |download的uuid，如果是私有文件该参数必须，公有文件无需填写

**返回**: 二进制的文件

该接口同时还可以对图片进行缩放预处理，请[参考这里](./image.md)

