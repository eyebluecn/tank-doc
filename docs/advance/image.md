# Image Handle

#### /api/alien/download/{uuid}/{filename}

#### /api/alien/preview/{uuid}/{filename}

**function**：Download the file in browser

These two interfaces can download both public and private files. At the same time for the picture file can also do crop zoom operations.

The difference is that the `download` interface adds `Content-Disposition` to` http ` `header`, and the browser automatically treats it as a download.

The difference is that the `preview` interface does not add `content-disposition` to `http` `header`, so the browser opens directly in preview mode.

**access level**：`user`, `administrator`
