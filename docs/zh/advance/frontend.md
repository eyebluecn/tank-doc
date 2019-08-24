# 蓝眼云盘前端

蓝眼云盘前端采用vue2.0 + vue-router + vue-resource + es6 +less的技术栈，项目中引入了model层，其层级与数据库存储层级相对应，为视图层提供模型，
进而视图层能够完全面向对象思想进行开发，这是本项目的精髓所在，components文件夹下放了一些通用的组件，欢迎大家使用并提出意见!

## 项目部分结构

```
├── doc                                            // vue-cli创建后配置文档
├── node_modules                                   // 依赖包存放目录
├── public                                         // 入口目录
├── src                                            // 源码目录
│   ├── assets                                     // 静态资源
│   ├── common                                     // 通用
│   │   ├── directive                              // 自定义指令
│   │   │   ├── directive.js                       // 验证规则指令
│   │   ├── filter                                 // 格式化
│   │   ├── fork                                   // 引用外部插件
│   │   ├── i18n                                   // 国际化通用
│   │   ├── util                                   // 工具包
│   ├── components                                 // 公用组件
│   │   ├── copy                                   // 复制工具
│   │   ├── filter                                 // 筛选工具
│   │   ├── photoswipe                             // 图片预览
│   │   ├── previewer                              // 预览通用
│   │   ├── CreateSaveButton.vue                   // 保存创建按钮组件
│   │   ├── LoadingFrame.vue                       // 框架加载组件
│   │   ├── NbBtnDropdown.vue                      // 按钮下拉组件
│   │   ├── NbCheckbox.vue                         // 复选框组件
│   │   ├── NbExpanding.vue                        // 收缩展开组件
│   │   ├── NbPager.vue                            // 分页组件
│   │   ├── NbRadio.vue                            // 单选框组件
│   │   ├── NbSlidePanel.vue                       // 动画组件
│   │   ├── NbSwitcher.vue                         // 开关按钮组件
│   ├── model                                      // 前端模型层
│   │   ├── base                                   // 基
│   │   │   ├── Base.js                            // 基类
│   │   │   ├── BaseEntity.js                      // 实体基类
│   │   │   ├── Filter.js                          // 过滤器类
│   │   │   ├── Pager.js                           // 分页类
│   │   ├── dashboard                              // 控制面板类
│   │   ├── download                               // 下载token类
│   │   ├── image                                  // 图片缓存类
│   │   ├── install                                // 配置类
│   │   ├── matter                                 // 文件类
│   │   ├── preference                             // 个性类
│   │   ├── share                                  // 分享
│   │   │   ├── Share.js                           // 分享类
│   │   │   ├── ShareExpireOption.js               // 分享时限类
│   │   │   ├── ShareType.js                       // 分享文件类型类
│   │   ├── user                                   // 用户
│   │   │   ├── User.js                            // 用户类
│   │   │   ├── UserRole.js                        // 用户角色类
│   │   │   ├── UserStatus.js                      // 用户状态类
│   ├── router                                     // 路由层
│   ├── views                                      // 视图层
│   │   ├── dashboard                              // 控制面板视图
│   │   │   ├── theme.json                         // echarts配置文件
│   │   ├── install                                // 云盘配置视图
│   │   ├── layout                                 // 布局视图  
│   │   │   ├── BottomNavigation.vue               // 尾部布局
│   │   │   ├── SideMenu.vue                       // 侧边栏菜单
│   │   │   ├── SideNavigation.vue                 // 侧边栏布局
│   │   │   ├── TopNavigation.vue                  // 头部布局
│   │   ├── matter                                 // 文件视图
│   │   │   ├── widget 
│   │   │   │   ├── imageCache                     // 图片缓存插件                                                     
│   │   │   │   ├── Director.js                    // 单个文件的导演类      
│   │   │   │   ├── FolderTree.vue                 // 文件夹递归树组件      
│   │   │   │   ├── MatterImage.vue                // 图片类型文件上传组件      
│   │   │   │   ├── MatterPanel.vue                // 单文件或文件夹个体     
│   │   │   │   ├── MoveBatchPanel.vue             // 批量文件移动组件      
│   │   │   │   ├── UploadMatterPanel.vue          // 文件上传组件 
│   │   ├── preference                             // 个性化视图
│   │   ├── share                                  // 分享视图
│   │   ├── user                                   // 用户视图
│   │   │   ├── feature                            // 权限枚举
│   │   ├── Frame.vue                              // 大架子
│   ├── vuex                                       // store
├── vue.config.js                                  // vue配置
```