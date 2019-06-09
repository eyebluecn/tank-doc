# Image Handle

### /api/alien/download/{uuid}/{filename}

### /api/alien/preview/{uuid}/{filename}

**function**：Download the file in browser

These two interfaces can download both public and private files. At the same time for the picture file can also do crop zoom operations.

The difference is that the `download` interface adds `Content-Disposition` to` http ` `header`, and the browser automatically treats it as a download.

The difference is that the `preview` interface does not add `content-disposition` to `http` `header`, so the browser opens directly in preview mode.

**access level**：`user`, `administrator`

**Request parameters**：

name | type | required | description
--------- | ---- | ---- | -----------
uuid | `string` | required | The uuid of the file, which is placed in the path of the url
filename | `string` | required | The name of the file, which is placed in the path of the url
downloadTokenUuid | `string` | optional | The uuid of download is required if it is a private file. Public files are not required

**return**: Binary file

The interface can also preprocess image scaling
> Image zooming is supported in the following formats:".jpg", ".jpeg", ".png", ".tif", ".tiff", ".bmp", ".gif"

##### Additional parameters

Format is ir=mode_width_height

| parameter | type | describes | Value range|
| ------------ | ---- | ------------ | ------------ |
| mode | `string` | Specify a strategy for image scaling,There are three strategies，`fit` means to fix one side and scale the other side；`fill`means to extend the picture out of the specified W and H rectangle, and then center and crop it；`fixed`Indicates that the image is scaled directly to the specified W and H, which may cause the image to distort  | [`fit`,`fill`,`fixed`] |
|  width | `int`  |  width specified, 0 indicates automatic adaptation |  1 ~ 4096  |
|  height | `int`  |  height specified, 0 indicates automatic adaptation |  1 ~ 4096  |

##### example

The original image：

![Specify a width of 200,equally scaled height](http://tank.eyeblue.cn/api/alien/preview/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg)

1. Specify a width of 200,equally scaled height

![Specify a width of 200,equally scaled height](http://tank.eyeblue.cn/api/alien/preview/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fit_200_0)

[http://tank.eyeblue.cn/api/alien/preview/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fit_200_0](http://tank.eyeblue.cn/api/alien/preview/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fit_200_0)

2. Specify a height of 200,the width is equally scaled

![Specify a height of 200,the width is equally scaled](http://tank.eyeblue.cn/api/alien/preview/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fit_0_200)

[http://tank.eyeblue.cn/api/alien/preview/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fit_0_200](http://tank.eyeblue.cn/api/alien/preview/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fit_0_200)

3. The image is automatically filled in a size of 200 by 200 (this is the case most often)

![The image is automatically filled in a size of 200 by 200 (this is the case most often)](http://tank.eyeblue.cn/api/alien/preview/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fill_200_200)

[http://tank.eyeblue.cn/api/alien/preview/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fill_200_200](http://tank.eyeblue.cn/api/alien/preview/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fill_200_200)

4. Image fixed size 200*200 (usually leads to distortion)

![Image fixed size 200*200 (usually leads to distortion)](http://tank.eyeblue.cn/api/alien/preview/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fixed_200_200)

[http://tank.eyeblue.cn/api/alien/preview/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fixed_200_200](http://tank.eyeblue.cn/api/alien/preview/3f4b3090-e688-4d63-7705-93a120690505/horse.jpg?ir=fixed_200_200)


