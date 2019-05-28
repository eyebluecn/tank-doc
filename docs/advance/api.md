# Api

## 文件接口

```
/api/matter/page
```


# 蓝眼云盘api接口

## 一、实体

在详细介绍各controller中的接口前，有必要先介绍蓝眼云盘中的各实体，所有的实体基类均为`Base`

#### Base
`Base`定义如下，所有会在数据库中持久化的实体均会继承`Base`，`Controller`在返回实体给前端时，会将字段和值序列化成json字符串，其中键就和每个实体字段后面的`json`标签一致，下文也会有详细例子介绍

```
type Base struct {
    //唯一标识
	Uuid       string    `gorm:"primary_key" json:"uuid"`
	//排序用的字段，一般是时间戳来表示序号先后
	Sort       int64     `json:"sort"`
	//修改时间
	UpdateTime time.Time `json:"updateTime"`
	//创建时间
	CreateTime time.Time `json:"createTime"`
}
```

### Pager

在前端请求一个列表时，通常返回的都是一个`Pager`，`Pager`中就是装的各个实体的列表。

```
type Pager struct {
    //当前页数，0基
	Page       int         `json:"page"`
	//每页的大小
	PageSize   int         `json:"pageSize"`
	//总的条目数
	TotalItems int         `json:"totalItems"`
	//总的页数
	TotalPages int         `json:"totalPages"`
	//实体的数组
	Data       interface{} `json:"data"`
}
```


#### Matter

`Matter`是代表文件（文件夹是一种特殊的文件），为了避免和系统的`file`重复，这里使用`matter`，这个实体是蓝眼云盘最重要也是最基本的实体：

```
type Matter struct {
    //继承Base，也就是说Base中的Uuid,Sort,ModifyTime,CreateTime这里也会有
	Base
	//所在的文件夹的uuid，如果在根目录下，这个字段为 root
	Puuid    string  `json:"puuid"`
	//创建这个文件的用户uuid
	UserUuid string  `json:"userUuid"`
	//创建这个文件的用户名
    Username string  `json:"username"`
	//该文件是否是文件夹
	Dir      bool    `json:"dir"`
	//文件名，带后缀名。例如：avatar.jpg
	Name     string  `json:"name"`
    //文件的md5值，目前该功能尚未实现，作为保留字段
	Md5      string  `json:"md5"`
	//文件大小，单位 byte。比如某个文件1M大，那么这里就为： 1048576
	Size     int64   `json:"size"`
	//文件是否为私有，如果true则该文件只能作者或超级管理员可以下载，如果false所有人均可以通过下载链接下载。
	Privacy  bool    `json:"privacy"`
	//文件在磁盘中的路径，前端无需关心这个字段。但是后端在寻找文件时这个字段非常关键。
	Path     string  `json:"path"`
	//文件下载次数。
    Times    int64   `json:"times"`
	//该文件的父级matter，该字段不会持久化到数据集，属于获取matter详情时临时组装出来的。
	Parent   *Matter `gorm:"-" json:"parent"`
	//该文件的子级matter数组，该字段不会持久化到数据集，属于获取matter详情时临时组装出来的。
    Children *Matter `gorm:"-" json:"-"`
}
```
#### User

`User`是代表用户：

```
type User struct {
    //继承Base，功能同上
	Base
	//角色，有以下枚举值：GUEST(游客，不会持久化到数据库),USER(普通用户),ADMINISTRATOR(超级管理员)
	Role      string    `json:"role"`
	//用户名，在Matter的path字段中很有用。
	Username  string    `json:"username"`
	//密码，默认不会返回给前端
	Password  string    `json:"-"`
	//头像Url
	AvatarUrl string    `json:"avatarUrl"`
	//上次登录时的ip
	LastIp    string    `json:"lastIp"`
	//上次登录的时间
	LastTime  time.Time `json:"lastTime"`
	//该用户允许上传的单文件最大大小
	SizeLimit int64     `json:"sizeLimit"`
	//该用户允许上传的文件总量最大大小
    TotalSizeLimit int64     `json:"totalSizeLimit"`
    //该用户已上传的文件总量大小
    TotalSize int64     `json:"totalSize"`
	//状态，有以下枚举值：OK(正常),DISABLED(被禁用)
	Status    string    `json:"status"`
}
```


#### Preference

`Preference`是整个网站的偏好设置，网站的名称，logo，favicon，版权，备案号等信息均由这个实体负责。定义如下：

```
type Preference struct {
    //继承Base，功能同上
	Base
	//网站名称
	Name        string `json:"name"`
	//网站的logo url
	LogoUrl     string `json:"logoUrl"`
	//版权信息
	Copyright   string `json:"copyright"`
	Record      string `json:"record"`
    //大小限制
    DownloadDirMaxSize    int64 `json:"downloadDirMaxSize"`
    //文件数量
    DownloadDirMaxNum     int64 `json:"downloadDirMaxNum"` 
    //用户默认总大小限制
    DefaultTotalSizeLimit int64 `json:"defaultTotalSizeLimit"`
    //是否允许自主注册
    AllowRegister bool `json:"allowRegister"`  
	//当前运行的蓝眼博客版本，这个字段不可修改，每次发版时硬编码
	Version     string `json:"version"`
}
```

### UploadToken 

用于给陌生人上传的token

```
type UploadToken struct {
    //继承Base，功能同上
	Base
	//颁发该token的用户，系统中任何用户都能颁发token
	UserUuid   string    `json:"userUuid"`
	//使用这个token上传文件就必须上传在这个文件夹下
	FolderUuid string    `json:"folderUuid"`
	//陌生人上传好了的文件uuid
	MatterUuid string    `json:"matterUuid"`
	//过期时间
	ExpireTime time.Time `json:"expireTime"`
	//使用这个token上传文件就必须是这个文件名
	Filename   string    `json:"filename"`
	//使用这个token上传文件就必须是这个公私有性
	Privacy    bool      `json:"privacy"`
	//使用这个token上传文件就必须这个大小
	Size       int64     `json:"size"`
	//使用这个token上传文件陌生人的ip
	Ip         string    `json:"ip"`
}
```


### DownloadToken 

用于给陌生人下载的token，一个matter如果Privacy=true，那么就意味着只有自己或者超级管理员可以下载，如果让某些自己信任的用户也能下载，那么就需要生成`DownloadToken`给这些用户来下载。

```
type DownloadToken struct {
    //继承Base，功能同上
	Base
	//颁发该token的用户
	UserUuid   string    `json:"userUuid"`
	//该token只能下载这个文件
	MatterUuid string    `json:"matterUuid"`
	//有效期截止
	ExpireTime time.Time `json:"expireTime"`
	//下载者的ip
	Ip         string    `json:"ip"`
}

```

### WebResult

`WebResult`并不是会持久化到数据库中实体，`WebResult`是在`controller`返回数据给前端时包装的一层，有了`WebResult`后每个接口返回的数据会更加统一，方便了前端的统一处理。

```
type WebResult struct {
    //状态码，具体每个码的意义参考下文
	Code int       `json:"code"`
	//一句话描述请求结果，通常会是出错时指明出错原因，或者修改权限等小操作时提示的`操作成功`
	Msg  string      `json:"msg"`
	//内容可能是一个实体，也可能是一个 Pager.
	Data interface{} `json:"data"`
}

```
状态码对应关系如下：

```
const (
	//正常
	RESULT_CODE_OK = 200
	//未登录
	RESULT_CODE_LOGIN = -400
	//没有权限
	RESULT_CODE_UNAUTHORIZED = -401
	//请求错误
	RESULT_CODE_BAD_REQUEST = -402
	//没有找到
	RESULT_CODE_NOT_FOUND = -404
	//登录过期
	RESULT_CODE_LOGIN_EXPIRED = -405
	//该登录用户不是有效用户
	RESULT_CODE_LOGIN_INVALID = -406
	//提交的表单验证不通过
	RESULT_CODE_FORM_INVALID = -410
	//请求太频繁
	RESULT_CODE_FREQUENCY = -420
	//服务器出错。
	RESULT_CODE_SERVER_ERROR = -500
	//远程服务不可用
	RESULT_CODE_NOT_AVAILABLE = -501
	//并发异常
	RESULT_CODE_CONCURRENCY = -511
	//远程微服务没有找到
	RESULT_CODE_SERVICE_NOT_FOUND = -600
	//远程微服务连接超时
	RESULT_CODE_SERVICE_TIME_OUT = -610
	//通用的异常
	RESULT_CODE_UTIL_EXCEPTION = -700
)
```
## 二、返回规范
