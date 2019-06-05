# Eyeblue Cloud Disk API

## 一、entity

Before introducing the interfaces in each controller in detail, it is necessary to introduce the entities in the Eyeblue Cloud Disk. All entity Base classes are 'Base'

#### Base

`Base` is defined as follows. All entities that will be persisted in the database will inherit `Base`. When 'Controller' returns entities to the front end, it will serialize fields and values into json strings, where the key is consistent with the `json` tag after each entity field

```
type Base struct {
    //A unique identifier
	Uuid       string    `gorm:"primary_key" json:"uuid"`
	//A field, usually a timestamp, used for sorting
	Sort       int64     `json:"sort"`
	//UpdateTime
	UpdateTime time.Time `json:"updateTime"`
	//CreateTime
	CreateTime time.Time `json:"createTime"`
}
```

#### Pager

When the front end requests a list, it usually returns a `Pager`, `Pager` is the list of various entities installed

```
type Pager struct {
    //Current page, 0 base
	Page       int         `json:"page"`
	//The size of each page
	PageSize   int         `json:"pageSize"`
	//Total number of entries
	TotalItems int         `json:"totalItems"`
	//The total number of pages
	TotalPages int         `json:"totalPages"`
	//Array of entities
	Data       interface{} `json:"data"`
}
```


#### Matter

`Matter` represents a file (a folder is a special file). In order to avoid duplication of `file` with the system, `Matter` is used here. This entity is the most important and basic entity of blue-eye cloud disk:

```
type Matter struct {
    //Inheritance Base, that is the Base of Uuid, Sort, ModifyTime, CreateTime here also
	Base
	//The uuid of the folder in which it is located, if in the root directory, this field is root
	Puuid    string  `json:"puuid"`
	//The user uuid that created this file
	UserUuid string  `json:"userUuid"`
	//The user name to create this file
    Username string  `json:"username"`
	//Whether the file is a folder
	Dir      bool    `json:"dir"`
	//File name with suffix. For example：avatar.jpg
	Name     string  `json:"name"`
    //Md5 value of the file, which is not currently implemented, as a reserved field
	Md5      string  `json:"md5"`
	//File size, unit byte. For example, if a file is 1M in size, then this will be： 1048576
	Size     int64   `json:"size"`
	//If true, the file can only be downloaded by the author or super administrator. If false, everyone can download the file through the download link
	Privacy  bool    `json:"privacy"`
	//The path of the file on disk. The front end does not need to care about this field. But this field is critical when the backend is looking for files
	Path     string  `json:"path"`
	//Download times
    Times    int64   `json:"times"`
	//The parent of the file, matter, will not be persisted to the data set. This field is a temporary assembly of matter details
	Parent   *Matter `gorm:"-" json:"parent"`
	//The file's sublevel matter array, which will not be persisted to the data set, is a temporary assembly of matter details
    Children *Matter `gorm:"-" json:"-"`
}
```
#### User

`User` represents the User：

```
type User struct {
    //Inherit Base, same as above
	Base
	//Roles, with the following enumerated values：GUEST(It is not persisted to the database),USER,ADMINISTRATOR
	Role      string    `json:"role"`
	//Username, useful in the Matter path field
	Username  string    `json:"username"`
	//Passwords are not returned to the front end by default
	Password  string    `json:"-"`
	//Image Url
	AvatarUrl string    `json:"avatarUrl"`
	//IP at last login
	LastIp    string    `json:"lastIp"`
	//Last login time
	LastTime  time.Time `json:"lastTime"`
	//This user allows the maximum size of a single file to be uploaded
	SizeLimit int64     `json:"sizeLimit"`
	//The maximum size of files that this user allows to upload
    TotalSizeLimit int64     `json:"totalSizeLimit"`
    //Total size of files uploaded by this user
    TotalSize int64     `json:"totalSize"`
	//State with the following enumerated values：OK,DISABLED
	Status    string    `json:"status"`
}
```


#### Preference

`Preference` is the Preference setting of the whole website. This entity is responsible for the name, logo, favicon, copyright, record number and other information of the website. The definition is as follows:

```
type Preference struct {
    //inherit Base, function is the same as above
	Base
	//website name
	Name        string `json:"name"`
	//url of the website logo
	LogoUrl     string `json:"logoUrl"`
	//copyright information
	Copyright   string `json:"copyright"`
	Record      string `json:"record"`
    //size limit
    DownloadDirMaxSize    int64 `json:"downloadDirMaxSize"`
    //number of files
    DownloadDirMaxNum     int64 `json:"downloadDirMaxNum"` 
    //user default total size limit
    DefaultTotalSizeLimit int64 `json:"defaultTotalSizeLimit"`
    //whether automatic registration is allowed
    AllowRegister bool `json:"allowRegister"`  
	//currently running version of the blue eye blog, this field is not modifiable and hardcoded every time it is published
	Version     string `json:"version"`
}
```

#### UploadToken 

Token for uploading to strangers

```
type UploadToken struct {
    // inherit Base, function is the same as above
	Base
	// the user who issues the token, any user in the system can issue the token
	UserUuid   string    `json:"userUuid"`
	// to upload a file with this token, you must upload it under this folder
	FolderUuid string    `json:"folderUuid"`
	// the stranger uploads the uuid of the finished file
	MatterUuid string    `json:"matterUuid"`
	// expiration time
	ExpireTime time.Time `json:"expireTime"`
	// this must be the name of the file you upload with this token
	Filename   string    `json:"filename"`
	// upload files with this token must be private or private
	Privacy    bool      `json:"privacy"`
    // this size is required to upload a file with this token
	Size       int64     `json:"size"`
	// use this token to upload the IP of the stranger
	Ip         string    `json:"ip"`
}
```


#### DownloadToken 

A token used for downloading to strangers. If Privacy=true, it means that only you or the super administrator can download it. If certain users who you trust can also download it, then a `DownloadToken` needs to be generated for these users to download
```
type DownloadToken struct {
    // inherit Base, function is the same as above
	Base
    // the user who issues this token
	UserUuid   string    `json:"userUuid"`
    // this token can only be used to download this file
	MatterUuid string    `json:"matterUuid"`
    // expiration date
	ExpireTime time.Time `json:"expireTime"`
    // the IP of the downloader
	Ip         string    `json:"ip"`
}

```

#### Dashboard

Eyeblue Cloud Disk control panel, showing cloud disk statistics: PV/UV, 'active' files, active IP 

```
type Dashboard struct {
    // inherit Base, function is the same as above
	Base
	// link relative ratio，The ratio of change in quantity over two consecutive unit periods, such as two consecutive weeks
    InvokeNum      int64  `json:"invokeNum"`
    // total link relative ratio
    TotalInvokeNum int64  `json:"totalInvokeNum"`
    // the UV
    Uv             int64  `json:"uv"`  
    // total UV           
    TotalUv        int64  `json:"totalUv"`    
    // total number of documents on that day
    MatterNum      int64  `json:"matterNum"`    
    // total number of documents
    TotalMatterNum int64  `json:"totalMatterNum"`
    // total file size of the day
    FileSize       int64  `json:"fileSize"`    
    // total file size
    TotalFileSize  int64  `json:"totalFileSize"` 
    // the average time taken reflects the overall response speed of the server
    AvgCost        int64  `json:"avgCost"`
    // date
    Dt 	           string `json:"dt"`
}

```

#### Share

File sharing record

```
type Share struct {
    // inherit Base, function is the same as above
	Base
    // share the name of the record
	Name           string    `json:"name"`
    // Shared type, file/folder/mixed type
	ShareType      string    `json:"shareType"`
    // users who share the record
	Username       string    `json:"username"`
    // share the user id of the record
	UserUuid       string    `json:"userUuid"`
    // download times
	DownloadTimes  int64     `json:"downloadTimes"`
    // extraction code
	Code           string    `json:"code"`
    // whether it expires or not
	ExpireInfinity bool      `json:"expireInfinity"`
    // expiration time
	ExpireTime     time.Time `json:"expireTime"`
    // folder file
	DirMatter      *Matter   `json:"dirMatter"`
    // file collection
	Matters        []*Matter `json:"matters"`
}

```

#### WebResult

`WebResult` is not an entity that will be persisted to the database. `WebResult` is a layer of packaging when `controller` returns data to the front end. With `WebResult`, the data returned by each interface will be more uniform, facilitating the unified processing of the front end
```
type WebResult struct {
    //Status code, the specific meaning of each code reference below
	Code int       `json:"code"`
	//A one-sentence description of the result of the request will usually indicate the cause of the error, or modify permissions and other small operations prompted by `operation success`
	Msg  string      `json:"msg"`
	//The content may be an entity, or it may be a Pager.
	Data interface{} `json:"data"`
}

```
The corresponding relationship of the status code is as follows:

```
const (
	//normal
	RESULT_CODE_OK = 200
	//Not logged in
	RESULT_CODE_LOGIN = -400
	//Not logged in
	RESULT_CODE_UNAUTHORIZED = -401
	//Request error
	RESULT_CODE_BAD_REQUEST = -402
	//Could not find
	RESULT_CODE_NOT_FOUND = -404
	//Login date
	RESULT_CODE_LOGIN_EXPIRED = -405
	//This login user is not a valid user
	RESULT_CODE_LOGIN_INVALID = -406
	//The submitted form was not validated
	RESULT_CODE_FORM_INVALID = -410
	//Too many requests
	RESULT_CODE_FREQUENCY = -420
	//Server error
	RESULT_CODE_SERVER_ERROR = -500
	//Remote service unavailable
	RESULT_CODE_NOT_AVAILABLE = -501
	//Concurrent abnormal
	RESULT_CODE_CONCURRENCY = -511
	//The remote micro service was not found
	RESULT_CODE_SERVICE_NOT_FOUND = -600
	//Remote micro service connection timeout
	RESULT_CODE_SERVICE_TIME_OUT = -610
	//Universal exception
	RESULT_CODE_UTIL_EXCEPTION = -700
)
```
## 二、Return specification

Eyeblue Cloud Disk adopts the mode of front and back end separation. When the front end calls the back end interface, urls start with `/ API` and return json strings

- The key of the returned json string is the lowercase Camel-Case, specifically referring to the `json` tag in the entity class

- The time format returned is` yyyy-mm-dd HH: MM :ss `(for example: 2018-01-06 17:57:00).

The returned contents are all packaged by `WebResult`, so they have a high degree of uniformity. Here we agree on some statements, which will not be repeated when `Controller` is introduced later

1. Returns an `XX` entity

    Refers to `Code=200` of `WebResult`, `Data= an XX entity object'`
    
    For example: if a `User` is returned, the front end will receive the following json string:
    ```
    {
      "code": 200,
      "msg": "",
      "data": {
        "uuid": "eed2c66d-1de6-47ff-645e-b67beaa10365",
        "sort": 1514803034507,
        "modifyTime": "2018-01-06 18:00:58",
        "createTime": "2018-01-01 18:37:15",
        "role": "USER",
        "username": "demo",
        "avatarUrl": "/api/alien/download/ea490cb6-368e-436d-71c0-fcfb08854c80/1180472.png",
        "lastIp": "124.78.220.82",
        "lastTime": "2018-01-06 18:00:58",
        "sizeLimit": 1048576,
        "totalSizeLimit": 104857600,
        "totalSize": 10485760,
        "status": "OK"
      }
    }
    ```
2. Returns` XX `of` Pager `

    Refers to the `Code=200` of `WebResult`, `Data= Pager` of XX
    
    For example: `User` returns` Pager `, and the front end receives the following json string:
    ```
    {
      "code": 200,
      "msg": "",
      "data": {
        "page": 0,
        "pageSize": 10,
        "totalItems": 2,
        "totalPages": 1,
        "data": [
          {
            "uuid": "6a661938-8289-4957-4096-5a1b584bf371",
            "sort": 1515057859613,
            "modifyTime": "2018-01-04 17:26:01",
            "createTime": "2018-01-04 17:24:20",
            "role": "ADMINISTRATOR",
            "username": "simba",
            "avatarUrl": "/api/alien/download/d1e453cb-3170-4bdb-73f2-fa0372ee017b/1180480.png",
            "lastIp": "180.173.103.207",
            "lastTime": "2018-01-04 17:26:01",
            "sizeLimit": -1,
            "totalSizeLimit": 104857600,
            "totalSize": 10485760,
            "status": "OK"
          },
          {
            "uuid": "e59be6a3-f806-463e-553a-4c5892eedf78",
            "sort": 1514881002975,
            "modifyTime": "2018-01-02 16:16:43",
            "createTime": "2018-01-02 16:16:43",
            "role": "USER",
            "username": "blog_dev",
            "avatarUrl": "/api/alien/download/fdca6eee-d009-4eb3-5ad4-15ba3701cb2e/jump.jpg",
            "lastIp": "",
            "lastTime": "2018-01-02 16:16:43",
            "sizeLimit": 1048576,
            "totalSizeLimit": 104857600,
            "totalSize": 10485760,
            "status": "OK"
          }
        ]
      }
    }
    ```
    
3. Error message: yyy

    Refers to `Code=-400` of `WebResult`, `Msg=yyy` (the specific values of Code here refer to the Code table above)
    
    For example: return error message: "new folder already exists, please use another name." , the front end will receive the following json string:
    ```
    {
      "code": -700,
      "msg": "new folder already exists, please use another name.",
      "data": null
    }
    ```
    
4. Success message: zzz

    Refers to `Code=200` of `WebResult`, `Msg= ZZZ` (refer to the Code table above for specific values here)
    
    For example: return success message: "deleted successfully." , the front end will receive the following json string:
    ```
    {
      "code": 200,
      "msg": "deleted successfully",
      "data": null
    }
    ```
    
## 三、interface

All interfaces of Eyeblue Cloud Disk are defined in `controller`, and the following `controller` is defined in total:

name | code file | description
--------- | ---- | -----------
PreferenceController | `preference_controller.go` | Website title, logo, copyright description and other information added, deleted and checked
MatterController | `matter_controller.go` | Create folders, upload files, delete files, modify permissions, etc
UserController | `user_controller.go` | Log in and manage users in the operation station
AlienController | `alien_controller.go` | Third party authorized upload, download, preprocessing
DashboardController | `dashboard_controller.go` | Cloud disk control panel, view the overall data, PU/PV access
ShareController | `share_controller.go` | Share, operate, get and download Shared files/folders

Each interface has different access levels. Three access levels are defined in the system, which are:

`tourist` < `user` < `administrator`

### PreferenceController

This Controller is responsible for preferences in the website, and it mainly operates on `Preference` entities

----------


#### /api/preference/fetch

**function** : read website preferences, website name, logo, copyright, record information, zip download size limit, zip download number limit, user default total size limit, whether to allow automatic registration is read from this interface

**access level** : `tourist`,` 'registered user'`, `administrator`

**request parameter** : none

**returns**: an `Preference` entity

----------
#### /api/preference/edit

**function** : edit website preferences, modify website name, logo, copyright, record information, zip download size limit, zip download number limit, user default total size limit, whether to allow independent registration

**access level** : `administrator`

**request parameters**:

Name | type | required | description
--------- | ---- | ---- | -----------
name | `string` | required | site name
logoUrl | `string` | optional | website logoUrl, if not, use Eyeblue Cloud Disk logo by default
faviconUrl | `string` | optional | Website faviconUrl, if not filled in default USES Eyeblue Cloud Disk favicon.ico
copyright | `string` | optional | Website copyright
record | `string` | optional | Website record
downloadDirMaxSizeStr | `int` | optional | Zip download size limit
downloadDirMaxNumStr | `int` | optional | Limited number of zip downloads
defaultTotalSizeLimitStr | `int` | optional | User default total size limit
allowRegisterStr | `bool` | optional | Whether automatic registration is allowed or not

**returns**: an `Preference` entity

----------
#### /api/preference/system/cleanup

**function** : reset the system, operate carefully

**access level** : `administrator`

**request parameters**

Name | type | required | description
--------- | ---- | ---- | -----------
password | `string` | required | administrator user password is required

**return**: success message "reset successful"

----------
### MatterController

This Controller is responsible for creating folders, uploading files, modifying file paths, deleting files, modifying file access permissions, etc., mainly operating `Matter` entities

----------

#### /api/matter/create/directory

**function** : create folders

**access level** : `registered user`, `administrator`

**request parameters**:

Name | type | required | description
--------- | ---- | ---- | -----------
userUuid | `string` | required | Unique identifier of the user, the file is stored under that user name
puuid | `string` | required | The directory in which the directory is to be created, if created in the root directory, pass `root`
name | `string` | required | Folder name, cannot contain the following special symbol: `< > \| * ? / \`

**return**: the `Matter` entity of the newly created folder

----------


#### /api/matter/upload

**function** : upload files

**The level of access**：`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
userUuid | `string` | required | Unique identifier of the user, the file is stored under that user name
puuid | `bool` | optional | Which directory to upload the file to
file | `file` | required | Binary file, in the browser is selected by `<input type="file" name="file"/>`
alien | `bool` | optional | Whether it is a third-party file, the default is `false `
privacy | `bool` | optional | Private file, default `true`

**return**: just uploaded the `Matter` entity of this file

----------
//TODO

#### /api/matter/crawl（命令行工具）

**功能**：通过url获取文件

**访问级别**：`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
url | `string` | 选填 | 文件url路径
destPath | `string` | 选填 | 目的路径
filename | `string` | 必填 | 文件名称


**返回**: 刚上传的这个文件的`Matter`实体


----------

#### /api/matter/delete

**功能**：删除文件或者文件夹

**访问级别**：`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
uuid | `string` | 必填 | 待删除的文件或文件夹的uuid


**返回**: 成功信息“删除成功”

----------


#### /api/matter/delete/batch

**功能**：批量删除文件或文件夹

**访问级别**：`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
uuids | `string` | 必填 | 待删除的文件或文件夹的uuids,用逗号(,)分隔

**返回**: 成功信息“删除成功”

----------

#### /api/matter/rename

**功能**：重命名文件或文件夹

**访问级别**：`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
uuid | `string` | 必填 | 文件的uuid
name | `string` | 必填 | 新名字，不能包含以下特殊符号：`< > \| * ? / \`

**返回**: 刚重命名的这个文件的`Matter`实体

----------
#### /api/matter/change/privacy

**功能**：改变文件的公私有属性

**访问级别**：`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
uuid | `string` | 必填 | 文件的uuid
privacy | `bool` | 选填 | 文件的私有性，默认`false`

**返回**: 成功信息“设置成功”

----------

#### /api/matter/move

**功能**：将一个文件夹或者文件移入到另一个文件夹下

**访问级别**：`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
srcUuids | `string` | 必填 | 待移动的文件或文件夹的uuids,用逗号(,)分隔
destUuid | `string` | 必填 | 目标文件夹，根目录用`root`

**返回**: 成功信息“设置成功”

----------


#### /api/matter/detail

**功能**：产看文件详情

**访问级别**：`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
uuid | `string` | 必填 | 该文件的uuid

**返回**: 这个文件的`Matter`实体

----------

#### /api/matter/page

**功能**：按照分页的方式获取某个文件夹下文件和子文件夹的列表

**访问级别**：`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
puuid | `string` | 选填 | 文件夹uuid，如果根目录填`root`
page | `int` | 选填 | 当前页数，0基，默认0
pageSize | `int` | 选填 | 每页条目数，默认200
userUuid | `string` | 选填 | 筛选文件拥有者，对于普通用户使用当前登录的用户uuid.
name | `string` | 选填 | 模糊筛选文件名 
dir | `bool` | 选填 | 筛选是否为文件夹
orderDir | `DESC`或`ASC` | 选填 | 按文件夹排序，`DESC`降序排，`ASC`升序排
orderCreateTime | `DESC`或`ASC` | 选填 | 按创建时间排序，`DESC`降序排，`ASC`升序排
orderUpdateTime | `DESC`或`ASC` | 选填 | 按最近修改时间排序，`DESC`降序排，`ASC`升序排
orderSort | `DESC`或`ASC` | 选填 | 默认排序，`DESC`降序排，`ASC`升序排
orderTimes | `DESC`或`ASC` | 选填 | 按下载次数排序，`DESC`降序排，`ASC`升序排
orderSize | `DESC`或`ASC` | 选填 | 按文件大小排序，`DESC`降序排，`ASC`升序排
orderName | `DESC`或`ASC` | 选填 | 按名称排序，`DESC`降序排，`ASC`升序排
extensions | `string` | 选填 | 按文件后缀名筛选，逗号(,)分隔。例：`jpg,png,pdf`
shareUuid | `string` | 选填 | 分享的uuid，如果为空的话则puuid则为必填项
shareCode | `string` | 选填 | 提取码
shareRootUuid | `string` | 选填 | 分享根目录uuid


**返回**: `Matter`的`Pager`

----------

#### /api/matter/mirror

**功能**：把本地文件映射到蓝眼云盘中（命令行工具）

**访问级别**：`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
srcPath | `string` | 必填 | 原文件路径
destPath | `string` | 选填 | 目标路径
overwrite | `bool` | 选填 | 是否覆盖，默认false

----------

#### /api/matter/zip

**功能**：把文件批量打包下载

**访问级别**：`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
uuids | `string` | 必填 | 待下载的文件或文件夹的uuids,用逗号(,)分隔

----------

### UserController

该Controller负责站内创建文件夹，上传文件，删除文件，修改权限等，主要操作`Matter`实体

----------

#### /api/user/login

**功能**：登录

**访问级别**：`游客`,`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
username | `string` | 必填 | 用户名
password | `string` | 必填 | 密码

**返回**: 当前登录的`User`实体

----------

#### /api/user/authentication/login

**功能**：授权变身登录

**访问级别**：`游客`,`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
authentication | `string` | 必填 | 授权验证信息

**返回**: 当前登录的`User`实体

----------

#### /api/user/register

**功能**：自助注册

**访问级别**：`游客`,`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
username | `string` | 必填 | 用户名
password | `string` | 必填 | 密码

**返回**: 当前登录的`User`实体

----------

#### /api/user/edit

**功能**：编辑用户

**访问级别**：`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
uuid | `string` | 必填 | 待编辑的用户uuid
avatarUrl | `string` | 选填 | 头像
sizeLimit | `int` | 必填 | 用户上传单文件限制，单位byte. 如果负数表示无限制
totalSizeLimit | `string` | 必填 | 该用户允许上传的总文件最大大小，单位byte
role | `string` | 选填 | 角色

**返回**: 编辑的`User`实体

----------

#### /api/user/detail

**功能**：查看用户详情

**访问级别**：`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
uuid | `string` | 必填 | 待查看的用户uuid

**返回**: `User`实体

----------

#### /api/user/logout

**功能**：退出登录

**访问级别**：`游客`,`注册用户`,`管理员`

**请求参数**：无

**返回**: 成功信息"退出成功！"

----------


#### /api/user/page

**功能**：查看用户列表

**访问级别**：`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
page | `int` | 选填 | 当前页数，0基，默认0
pageSize | `int` | 选填 | 每页条目数，默认200
username | `string` | 选填 | 模糊筛选用户名
status | `string` | 选填 | 用户状态，枚举类型
orderSort | `DESC`或`ASC` | 选填 | 默认排序，`DESC`降序排，`ASC`升序排
orderLastTime | `DESC`或`ASC` | 选填 | 按上次登录时间排序，`DESC`降序排，`ASC`升序排
orderCreateTime | `DESC`或`ASC` | 选填 | 按创建时间排序，`DESC`降序排，`ASC`升序排
orderUpdateTime | `DESC`或`ASC` | 选填 | 按创建时间排序，`DESC`降序排，`ASC`升序排

**返回**: `User`实体的`Pager`

----------

#### /api/user/change/password

**功能**：蓝眼云盘用户修改用户密码

**访问级别**：`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
oldPassword | `string` | 必填 | 旧密码
newPassword | `string` | 必填 | 新密码

**返回**: 修改密码的`User`实体

----------

#### /api/user/reset/password

**功能**：管理员重置用户密码

**访问级别**：`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
userUuid | `string` | 必填 | 待重置密码的用户uuid
password | `string` | 必填 | 新密码

**返回**: 修改密码的`User`实体

----------

#### /api/user/toggle/status

**功能**：管理员修改用户状态

**访问级别**：`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
uuid | `string` | 必填 | 待操作的用户

**返回**: 修改状态的`User`实体

----------

#### /api/user/transfiguration

**功能**：管理员变身

**访问级别**：`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
uuid | `string` | 必填 | 用户id

**返回**: 变身用户的uuid

----------

### AlienController

- 蓝眼云盘提供了[编程接口](https://github.com/eyebluecn/tank/blob/master/build/doc/alien_zh.md)，实现了云存储（如：[七牛云](https://www.qiniu.com)，[阿里云OSS](https://www.aliyun.com/product/oss)）的核心功能，可以使用编程接口上传文件，作为其他网站、系统、app的资源存储器。可以在下载图片时对图片做缩放裁剪处理，可以有效地节省客户端流量

- 蓝眼系列开源软件之二的[《蓝眼博客》](https://github.com/eyebluecn/blog)正是使用蓝眼博客作为第三方资源存储器。蓝眼博客中的所有图片，附件均是存储在蓝眼云盘中


### 上传时序图

![上传时序图](https://raw.githubusercontent.com/eyebluecn/tank/master/build/doc/img/upload-time-line.png)

### 下载时序图

![下载时序图](https://raw.githubusercontent.com/eyebluecn/tank/master/build/doc/img/download-time-line.png)

----------

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

#### /api/alien/Preview/{uuid}/{filename}

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

该接口同时还可以对图片进行缩放预处理
> 图片缩放支持的格式有：".jpg", ".jpeg", ".png", ".tif", ".tiff", ".bmp", ".gif"

##### 额外参数

| 参数 | 类型   |  描述  | 取值范围  |
| ------------ | ---- | ------------ | ------------ |
| imageProcess | `string`  | 指定图片处理的方式，对于图片缩放固定为`resize`  |  固定为`resize` |
| imageResizeM | `string` | 指定图片缩放的策略，有三种策略，`fit` 表示固定一边，另一边按比例缩放；`fill`表示先将图片延伸出指定W与H的矩形框外，然后进行居中裁剪；`fixed`表示直接按照指定的W和H缩放图片，这种方式可能导致图片变形  | [`fit`,`fill`,`fixed`] 不填默认`fit`   |
|  imageResizeW | `int`  |  指定的宽度，对于`fit`可以不指定 |  1 ~ 4096  |
|  imageResizeH | `int`  |  指定的高度，对于`fit`可以不指定 |  1 ~ 4096  |

##### 示例

原图：

![将宽度指定为200，高度等比例缩放](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg)

1. 将宽度指定为200，高度等比例缩放

![将宽度指定为200，高度等比例缩放](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fit&imageResizeW=200)

[http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fit&imageResizeW=200](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fit&imageResizeW=200)

2. 将高度指定为200，宽度等比例缩放

![将高度指定为200，宽度等比例缩放](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fit&imageResizeH=200)

[http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fit&imageResizeH=200](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fit&imageResizeH=200)

3. 图片自动填充在200*200的大小中 （这种情况用得最多）

![图片自动填充在200*200的大小中](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fill&imageResizeW=200&imageResizeH=200)

[http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fill&imageResizeW=200&imageResizeH=200](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fill&imageResizeW=200&imageResizeH=200)

4. 图片固定大小200*200 (一般会导致变形)

![图片自动填充在200*200的大小中](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fixed&imageResizeW=200&imageResizeH=200)

[http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fixed&imageResizeW=200&imageResizeH=200](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fixed&imageResizeW=200&imageResizeH=200)


----------

### DashboardController

该Controller为蓝眼云盘的控制面板，帮助了解云盘的统计数据：PV/UV、'活跃'文件、活跃IP

----------

#### /api/dashboard/page

**功能**：获取近一段时间统计数据

**访问级别**：`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
page | `int` | 选填 | 当前页数，0基，默认0
pageSize | `int` | 选填 | 每页条目数，默认200
orderSort | `DESC`或`ASC` | 选填 | 默认排序，`DESC`降序排，`ASC`升序排
orderDt | `DESC`或`ASC` | 选填 | 按日期排序，`DESC`降序排，`ASC`升序排
orderCreateTime | `DESC`或`ASC` | 选填 | 按创建时间排序，`DESC`降序排，`ASC`升序排
orderUpdateTime | `DESC`或`ASC` | 选填 | 按创建时间排序，`DESC`降序排，`ASC`升序排

**返回**: `Dashboard`实体的`Pager`

----------

#### /api/dashboard/active/ip/top10

**功能**：获取Top10活跃IP

**访问级别**：`管理员`

**请求参数**：无

**返回**: 由`ip`和`times`组成的List

----------

### ShareController

该Controller为蓝眼云盘的提供分享功能，可以用来分享一切你想要分享的东西（文件/文件夹）

----------

#### /api/share/create

**功能**：创建文件分享

**访问级别**：`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
matterUuids | `string` | 必填 | 文件uuid，要想分享的文件`uuid`，分享多个文件uuid用逗号隔开
expireInfinity | `bool` | 必填 | 分享是否过期失效，默认false
expireTime | `string` | 必填 | 过期日期，如果expireInfinity为true则默认为当天

**返回**: 被分享的`Share`实体

----------

#### /api/share/delete

**功能**：在我的分享里删除文件分享

**访问级别**：`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
uuid | `string` | 必填 | 文件uuid，要想删除分享的文件`uuid`

**返回**: 成功信息“操作成功”

----------

#### /api/share/delete/batch

**功能**：在我的分享里批量删除文件分享

**访问级别**：`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
uuids | `string` | 必填 | 文件uuid，要想删除分享的文件`uuid`，删除多个文件分享uuid用逗号隔开

**返回**: 成功信息“操作成功”

----------

#### /api/share/page

**功能**：获取我的文件分享列表

**访问级别**：`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
page | `int` | 选填 | 当前页数，0基，默认0
pageSize | `int` | 选填 | 每页条目数，默认200
orderCreateTime | `DESC`或`ASC` | 选填 | 按创建时间排序，`DESC`降序排，`ASC`升序排

**返回**: `Share`实体的`Pager`

----------
//TODO

#### /api/share/browse

**功能**：被分享者打开文件分享

**访问级别**：`游客`,`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
shareUuid | `string` | 必填 | 当前分享实体的uuid
code | `string` | 选填 | 提取码，如果不是自己的分享则为必填项
puuid | `string` | 选填 | 文件uuid
rootUuid | `string` | 选填 | 当前分享正在查看的根目录uuid，前端辅助字段

**返回**: 被分享的`Share`实体

----------

#### /api/share/zip

**功能**：被分享者下载文件分享

**访问级别**：`游客`,`注册用户`,`管理员`

**请求参数**：

名称 | 类型 | 必填性 | 描述
--------- | ---- | ---- | -----------
shareUuid | `string` | 必填 | 当前分享实体的uuid
code | `string` | 选填 | 提取码，如果不是自己的分享则为必填项
puuid | `string` | 选填 | 文件uuid
rootUuid | `string` | 选填 | 当前分享正在查看的根目录uuid，前端辅助字段

**返回**: 无

----------
