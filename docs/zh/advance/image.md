# 图片处理

#### /api/alien/download/{uuid}/{filename}

#### /api/alien/preview/{uuid}/{filename}

**功能**：在浏览器中下载文件

这个两个接口既可以下载公有文件，又可以下载私有文件。同时对于图片文件还可以做裁剪缩放等操作。

区别是`download`接口会在`http` `header`中加上`Content-Disposition`，浏览器会自动当成下载处理。

区别是`preview`接口不会在`http` `header`中加上`Content-Disposition`，因此浏览器会直接以预览模式打开。

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

格式为 ir=mode_width_height

| 参数 | 类型   |  描述  | 取值范围  |
| ------------ | ---- | ------------ | ------------ |
| ir | `string`  | 指定图片处理的方式，对于图片缩放固定为`resize`  |  固定为`resize` |
| mode | `string` | 指定图片缩放的策略，有三种策略，`fit` 表示固定一边，另一边按比例缩放；`fill`表示先将图片延伸出指定W与H的矩形框外，然后进行居中裁剪；`fixed`表示直接按照指定的W和H缩放图片，这种方式可能导致图片变形  | [`fit`,`fill`,`fixed`] 不填默认`fit`   |
|  width | `int`  |  指定的宽度，对于`fit`可以不指定 |  1 ~ 4096  |
|  height | `int`  |  指定的高度，对于`fit`可以不指定 |  1 ~ 4096  |

##### 示例

原图：

![将宽度指定为200，高度等比例缩放](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg)

1. 将宽度指定为200，高度等比例缩放

![将宽度指定为200，高度等比例缩放](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fit_200_0)

[http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fit_200_0](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fit_200_0)

2. 将高度指定为200，宽度等比例缩放

![将高度指定为200，宽度等比例缩放](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fit_0_200)

[http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fit_0_200](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fit_0_200)

3. 图片自动填充在200*200的大小中 （这种情况用得最多）

![图片自动填充在200*200的大小中](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fill_200_200)

[http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fill_200_200](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fill_200_200)

4. 图片固定大小200*200 (一般会导致变形)

![图片自动填充在200*200的大小中](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fixed_200_200)

[http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fixed_200_200](http://tank.eyeblue.cn/api/alien/download/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fixed_200_200)


