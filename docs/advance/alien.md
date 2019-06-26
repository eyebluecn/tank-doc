# Third part storage


### AlienController

- Eyeblue Cloud Disk provides[Programming interface (API)](https://github.com/eyebluecn/tank/blob/master/build/doc/alien_zh.md)，cloud storage is implemented（如：[Seven NiuYun](https://www.qiniu.com)，[Ali cloud OSS](https://www.aliyun.com/product/oss)）core function，You can use the programming interface to upload files, which can be used as resource storage for other websites, systems and apps. The image can be scaled and cropped when the image is downloaded, which can effectively save client traffic

- the second in the Eyeblue series of open source software[《Eyeblue blog》](https://github.com/eyebluecn/blog)use the blue eye blog as a third-party resource store. All the pictures in blue eye blog are stored in blue eye cloud disk


### Upload sequence diagram

![Upload sequence diagram](https://raw.githubusercontent.com/eyebluecn/tank/master/build/doc/img/upload-time-line.png)

### Download sequence diagram

![Download sequence diagram](https://raw.githubusercontent.com/eyebluecn/tank/master/build/doc/img/download-time-line.png)

----------

### Interface details

#### /api/alien/fetch/upload/token

**function**：A Eyeblue Cloud Disk trusted user requests a `UploadToken` to upload a file to blue eye cloud disk to another user

A common usage scenario is that `application server` requests` UploadToken `to` Eyeblue cloud disk `, and then passes this` UploadToken `to` Eyeblue cloud disk `in the browser

**the level of access**：`user`, `administrator`

**Request parameters**

Name | type | required | description
--------- | ---- | ---- | -----------
filename | `string` | required | filename
expireTime | `string` | required | UploadToken expiration time
privacy | `bool` | optional | Document co-existence. `true` means file private，DownloadToken is required for download. `false`means file public，Anyone can download it directly from the download link, which defaults to false
size | `int` |  required | File size. Unit: byte
dirPath | `string` | required |The path for file storage.Cannot be empty, must begin with `/`, can not appear continuous` // `.Cannot contain the following special symbols:`< > \| * ? \`.For example,：`/app/blog/20180101121212001`

----------

#### /api/alien/fetch/download/token

**function**：A trusted user of Eyeblue Cloud Disk requests a `DownloadToken` to download private files on Eyeblue Cloud Disk for another user


A common usage scenario is when `application server` requests` DownloadToken `to` Eyeblue cloud disk `and then sends this` DownloadToken` to `Eyeblue cloud disk` with a `browser` to download a file

**the level of access**：`user`, `administrator`

**Request parameters**

Name | type | required | description
--------- | ---- | ---- | -----------
matterUuid | `string` |  required | File uuid, the file `uuid` that you want to download
expireTime | `string` |  required | UploadToken expiration time,Unit: s.By default 86400s is 24h

----------

#### /api/alien/confirm

**function**：`application server` confirms to Eyeblue Cloud Disk that a file is actually uploaded

**the level of access**：`user`, `administrator`

**Request parameters**

Name | type | required | description
--------- | ---- | ---- | -----------
matterUuid | `string` | required | After the browser is uploaded, Eyeblue Cloud Disk returns` uuid `to the browser

----------

#### /api/alien/upload

**function**：The browser uploads the file to blue eye cloud disk using `UploadToken` through FormData

A common usage scenario is that `application server` requests` UploadToken `to` Eyeblue Cloud Disk `, and then passes this `UploadToken` to` Eyeblue Cloud Disk `in the browser. Because the request ` UploadToken ` meta information was introduced to the file, so must the file information and ` / API/alien/fetch/upload/token ` incoming parameter information

**access level** : `tourist`,`user`, `administrator`

**Request parameters**

Name | type | required | description
--------- | ---- | ---- | -----------
uploadTokenUuid | `string` | required | uploadToken identification，`/api/alien/fetch/upload/token` request ' uuid 'in the returns object
file | `file` | required | file，In the browser it is selected by `<input type="file" name="file"/>`

----------

#### /api/alien/crawl/token

**function**：Get a token,an interface provided to a third party to invoke

**access level** : `tourist`,`user`, `administrator`

**Request parameters**

Name | type | required | description
--------- | ---- | ---- | -----------
uploadTokenUuid | `string` | required | UploadToken identification, ` / API/alien/fetch/upload/token ` request returns objects ` uuid `
url | `string` | optional | Get the link to the file

----------

#### /api/alien/crawl/direct

**function**：Eyeblue Cloud Disk to pull a url resource

**access level**：`user`, `administrator`

**Request parameters**

Name | type | required | description
--------- | ---- | ---- | -----------
filename | `string` | required | filename
privacy | `bool` | optional | Document co-existence.`true` indicates that the file is private and must be downloaded with a DownloadToken.`false` means that the file is public, and anyone can download it directly through the download link. The default value is false
dirPath | `string` | optional | File storage path
url | `string` | optional | Get the link to the file

----------

#### /api/alien/Preview/{uuid}/{filename}

**function**：This interface implements preview functionality

**access level**：`tourist`,`user`, `administrator`

**Request parameters**： Both are placed in urls

Name | type | required | description
--------- | ---- | ---- | -----------
uuid | `string` | required | The uuid of the file, which is placed in the path of the url
filename | `string` | required | The name of the file, which is placed in the path of the url
downloadTokenUuid | `string` | optional |The uuid of download is required if it is a private file. Public files are not required

**return**: Binary file

----------

#### /api/alien/download/{uuid}/{filename}

**function**：Download the file in your browser

This interface can download both public and private files. At the same time for the picture file can also do crop zoom operations

**access level**：`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
uuid | `string` | required | The uuid of the file, which is placed in the path of the url
filename | `string` | required | The name of the file, which is placed in the path of the url
downloadTokenUuid | `string` | optional |The uuid of download is required if it is a private file. Public files are not required

**return**: Binary file

The interface can also preprocess image scaling, [see here](./image.md)


