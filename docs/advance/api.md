# Eyeblue Cloud Disk API

## Ⅰ、entity

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
## ⅠⅠ、Return specification

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
    
## ⅠⅠⅠ、interface

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

**access level** : `tourist`,`user`, `administrator`

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

#### /api/matter/crawl（command line tool）

**function**：Get the file through the url

**The level of access**：`registered user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
url | `string` | optional | File url path
destPath | `string` | optional | path of objective
filename | `string` | required | file name


**return**: just uploaded the `Matter` entity of this file


----------

#### /api/matter/delete

**function**：Delete files or folders

**The level of access**：`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
uuid | `string` | required | Uuid of the file or folder to delete


**return**: Successful information "deletion successful"

----------


#### /api/matter/delete/batch

**function**：Batch delete files or folders

**The level of access**：`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
uuids | `string` | required | Uuids for files or folders to be deleted, separated by commas (,)

**return**: Successful information "deletion successful"

----------

#### /api/matter/rename

**function**：Rename files or folders

**The level of access**：`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
uuid | `string` | required | uuid of the file 
name | `string` | required | The new name cannot contain the following special symbols：`< > \| * ? / \`

**return**: Just renamed the `Matter` entity of this file

----------
#### /api/matter/change/privacy

**function**：Change the public and private properties of the file

**The level of access**：`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
uuid | `string` | required | uuid of the file
privacy | `bool` | optional | Private file, default `false`

**return**: Success information "setup successful"

----------

#### /api/matter/move

**function**：Move a folder or file to another folder

**The level of access**：`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
srcUuids | `string` | required | Uuids for files or folders to be moved, separated by commas (,)
destUuid | `string` | required | Target folder, root directory with `root`

**return**: Success information "setup successful"

----------


#### /api/matter/detail

**function**：View file details

**The level of access**：`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
uuid | `string` | required | The uuid of the file

**return**: The `Matter` entity of this file

----------

#### /api/matter/page

**function**：Get a list of files and subfolders under a folder by pagination

**The level of access**：`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
puuid | `string` | optional | Folder uuid, if the root directory with `root`
page | `int` | optional | Current page, 0 base, default 0
pageSize | `int` | optional | Number of entries per page, default 200
userUuid | `string` | optional | Filter the file owner to use the currently logged user uuid for normal users.
name | `string` | optional | Fuzzy filter file name
dir | `bool` | optional | Filter whether it is a folder
orderDir | `DESC`or`ASC` | optional | Sort by folder, `DESC` descending, `ASC` ascending
orderCreateTime | `DESC`or`ASC` | optional | Sort by creation time, `DESC` descending, `ASC` ascending
orderUpdateTime | `DESC`or`ASC` | optional | Sort by last modified time, `DESC` descending, `ASC` ascending
orderSort | `DESC`or`ASC` | optional | Default sort, `DESC` descending, `ASC` ascending
orderTimes | `DESC`or`ASC` | optional | Sort by download times, `DESC` descending, `ASC` ascending
orderSize | `DESC`or`ASC` | optional | Sort by file size, `DESC` descending, `ASC` ascending
orderName | `DESC`or`ASC` | optional | Sort by name, `DESC` in descending order, `ASC` in ascending order
extensions | `string` | optional | Filter by file suffix name, comma (,) separated. Example:`jpg,png,pdf`
shareUuid | `string` | optional | Shared uuid, if empty, puuid is required
shareCode | `string` | optional | Extract the code
shareRootUuid | `string` | optional | Share the root uuid

**return**: Pager entity with Matter entities

----------

#### /api/matter/mirror

**function**：Map local files to the Eyeblue Cloud Disk (command line tool)

**The level of access**：`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
srcPath | `string` | required | Original file path
destPath | `string` | optional | The target path
overwrite | `bool` | optional | Override, default false

----------

#### /api/matter/zip

**function**：Bulk up the files and download them

**The level of access**：`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
uuids | `string` | required | Uuids for files or folders to be downloaded, separated by commas (,)

----------

### UserController

This Controller is responsible for creating folders, uploading files, deleting files, modifying permissions, etc., mainly operating `Matter` entities

----------

#### /api/user/login

**function**：login

**The level of access**：`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
username | `string` | required | user name
password | `string` | required | password

**return**: The `User` entity of the current login

----------

#### /api/user/authentication/login

**function**：Authorize change login

**The level of access**：`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
authentication | `string` | required | Authorization verification information

**return**: The `User` entity of the current login

----------

#### /api/user/register

**function**：Self-help registration

**The level of access**：`tourist`, `user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
username | `string` | required | user name
password | `string` | required | password

**return**: The `User` entity of the current login

----------

#### /api/user/edit

**function**：Edit the user

**The level of access**：`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
uuid | `string` | required | User uuid to edit
avatarUrl | `string` | required | Head portrait
sizeLimit | `int` | required | User upload single file limit, unit byte. If negative number means unlimited
totalSizeLimit | `string` | required | This user is allowed to upload the maximum total file size, unit byte
role | `string` | optional | role

**return**: Edit `User` entity

----------

#### /api/user/detail

**function**：View user details

**The level of access**：`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
uuid | `string` | required | User uuid to be viewed

**return**: `User` entities

----------

#### /api/user/logout

**function**：Log out

**The level of access**：`tourist`,`user`, `administrator`

**Request parameters**：None

**return**: Successful message "exit successful!"

----------


#### /api/user/page

**function**：View user list

**The level of access**：`administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
page | `int` | optional | Current page, 0 base, default 0
pageSize | `int` | optional | Number of entries per page, default 200
username | `string` | optional | Fuzzy filtering of user names
status | `string` | optional | User status, enumerated types
orderSort | `DESC`or`ASC` | optional | Default sort, `DESC` descending, `ASC` ascending
orderLastTime | `DESC`or`ASC` | optional | Sort by last login time, `DESC` descending, `ASC` ascending
orderCreateTime | `DESC`or`ASC` | optional | Sort by creation time, `DESC` descending, `ASC` ascending
orderUpdateTime | `DESC`or`ASC` | optional | Sort by update time, `DESC` descending, `ASC` ascending

**return**: `User` entity's `Pager`

----------

#### /api/user/change/password

**function**：Eyeblue Cloud Disk user changes user password

**the level of access**：`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
oldPassword | `string` | required | old password
newPassword | `string` | required | new password

**return**: `User` entity used to change the password

----------

#### /api/user/reset/password

**function**：The administrator resets the user password

**the level of access**：`administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
userUuid | `string` | required | User uuid to reset password
password | `string` | required | new password

**return**: The `User` entity used to change the password

----------

#### /api/user/toggle/status

**function**：The administrator modifies user status

**the level of access**：`administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
uuid | `string` | required | User to be operated on

**return**: The 'User' entity used to modify the state

----------

#### /api/user/transfiguration

**function**：Administrator turned

**the level of access**：`administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
uuid | `string` | required | user id

**return**: turned user's uuid

----------

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

The interface can also preprocess image scaling
> Image zooming is supported in the following formats:".jpg", ".jpeg", ".png", ".tif", ".tiff", ".bmp", ".gif"

##### Additional parameters

| parameter | type | describes | the value range of | 
| ------------ | ---- | ------------ | ------------ |
| imageProcess | `string`  | Specifies how the image will be processed, fixed to` 'resize'` for image scaling  |  Fixed for `resize` |
| imageResizeM | `string`  | Specify a strategy for image scaling,there are three strategies. `fit` means to fix one side and scale the other side to scale;`fill` means to extend the picture out of the specified rectangle box of W and H, and then center and crop it;`fixed` means to scale the picture directly according to the specified W and H, which may cause the image to be distorted | [`fit`,`fill`,`fixed`] If not, default`fit`   |
| imageResizeW | `int`  |  The specified width,`fit` may not be specified |  1 ~ 4096  |
| imageResizeH | `int`  |  The specified height,`fit` may not be specified |  1 ~ 4096  |

##### For example

master map：

![Specify a width of 200 and a scale of height](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg)

1. Specify a width of 200 and a scale of height

![Specify a width of 200 and a scale of height](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fit&imageResizeW=200)

[http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fit&imageResizeW=200](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fit&imageResizeW=200)

2. Specify a height of 200 and a scale of width

![Specify a height of 200 and a scale of width](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fit&imageResizeH=200)

[http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fit&imageResizeH=200](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fit&imageResizeH=200)

3. The image is automatically filled in a size of 200 by 200 (this is the case most often)

![The image is automatically filled in a size of 200 by 200](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fill&imageResizeW=200&imageResizeH=200)

[http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fill&imageResizeW=200&imageResizeH=200](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fill&imageResizeW=200&imageResizeH=200)

4. Image fixed size 200*200 (usually leads to distortion)

![The image is automatically filled in a size of 200 by 200](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fixed&imageResizeW=200&imageResizeH=200)

[http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fixed&imageResizeW=200&imageResizeH=200](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?imageProcess=resize&imageResizeM=fixed&imageResizeW=200&imageResizeH=200)


----------

### DashboardController

The Controller is the blue eye cloud disk control panel, which helps to understand cloud disk statistics: PV/UV, 'active' file, active IP

----------

#### /api/dashboard/page

**function**：Get statistics for a recent period of time

**access level**：`administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
page | `int` | optional | Current page, 0 base, default 0
pageSize | `int` | optional | Number of entries per page, default 200
orderSort | `DESC`or`ASC` | optional | Default sort, `DESC` descending, `ASC` ascending
orderDt | `DESC`or`ASC` | optional | Sort by date, `DESC` descending, `ASC` ascending
orderCreateTime | `DESC`or`ASC` | optional | Sort by creation time, `DESC` descending, `ASC` ascending
orderUpdateTime | `DESC`or`ASC` | optional | Sort by update time, `DESC` descending, `ASC` ascending

**return**: `Pager` of `Dashboard` entity

----------

#### /api/dashboard/active/ip/top10

**function**：Get the Top10 active IP

**access level**：`administrator`

**Request parameters**：None

**return**: List composed of `IP` and `times`

----------

### ShareController

This Controller provides sharing for Eyeblue Cloud Disk, which can be used to share anything you want (files/folders).

----------

#### /api/share/create

**function**：Create file share

**access level**：`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
matterUuids | `string` | required | File uuid,To share the file `uuid`, share multiple file uuids separated by commas
expireInfinity | `bool` | required | If the share expires, the default is false
expireTime | `string` | required | The expiration date, if expireInfinity is true, defaults to that date

**return**: The 'Share' entity that is Shared

----------

#### /api/share/delete

**function**：Delete file sharing in my share

**access level**：`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
uuid | `string` | required | File uuid,To delete the Shared file `uuid`

**return**: Success message "operation successful"

----------

#### /api/share/delete/batch

**function**：Batch delete file share in my share

**access level**：`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
uuids | `string` | required | File uuid，To delete the Shared file 'uuid', remove multiple file sharing uuids separated by commas

**return**: Success message "operation successful"

----------

#### /api/share/page

**function**：Get my file sharing list

**access level**：`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
page | `int` | optional | Current page, 0 base, default 0
pageSize | `int` | optional | Number of entries per page, default 200
orderCreateTime | `DESC`or`ASC` | optional | Sort by creation time, `DESC` descending, `ASC` ascending

**return**: 'Share' entity 'Pager'

----------
//TODO

#### /api/share/browse

**function**：The Shared open file sharing

**access level** : `tourist`,`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
shareUuid | `string` | required | The uuid of the currently Shared entity
code | `string` | optional | ExtrExtraction code, if not Shared by itself, is required
puuid | `string` | optional | File uuid
rootUuid | `string` | optional | Currently share the root directory uuid that you are viewing, the front-end secondary field

**return**: The 'Share' entity that is Shared

----------

#### /api/share/zip

**function**：The Shared person downloads the Shared file

**access level** : `tourist`,`user`, `administrator`

**Request parameters**：

Name | type | required | description
--------- | ---- | ---- | -----------
shareUuid | `string` | required | The uuid of the currently Shared entity


code | `string` | optional | Extract code, if not ownself share is required
puuid | `string` | optional | File uuid
rootUuid | `string` | optional | Currently share the root directory uuid that you are viewing, the front-end secondary field

**return**: None

----------
