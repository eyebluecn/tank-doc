module.exports = {
    base: '/',
    // 注入到当前页面的 HTML <head> 中的标签
    head: [
        ['link', {rel: 'icon', href: '/favicon.ico'}], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    locales: {
        // 键名是该语言所属的子路径
        // 作为特例，默认语言可以使用 '/' 作为其路径。
        '/': {
            lang: 'en-US', // 将会被设置为 <html> 的 lang 属性
            title: 'EyeblueTank',
            description: 'This is an elegant cloud storage.'
        },
        '/zh/': {
            lang: 'zh-CN',
            title: '蓝眼云盘',
            description: '这是一个优雅的开源云盘'
        }
    },
    themeConfig: {
        locales: {
            '/': {
                selectText: '简体中文',
                label: 'English',
                editLinkText: 'Edit this page on GitHub',
                lastUpdated: 'Last Updated', // 文档更新时间：每个文件git最后提交的时间
                sidebarDepth: 2, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
                nav: [
                    {text: 'Home', link: '/'}, // 内部链接 以docs为根目录
                    {text: 'Demo Online', link: 'https://tank.eyeblue.cn'}, // 外部链接
                ],
                sidebar: [
                    {
                        title: 'Basic Usage',
                        collapsable: false,
                        children: [
                            '/basic/',
                            '/basic/install',
                        ]
                    },
                    {
                        title: 'Advance Feature',
                        children: [
                            '/advance/webdav',
                            '/advance/api'
                        ]
                    }
                ]
            },
            '/zh/': {
                selectText: 'English',
                label: '简体中文',
                editLinkText: '在GitHub中编辑此页面',
                lastUpdated: '上次更新', // 文档更新时间：每个文件git最后提交的时间
                sidebarDepth: 2, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
                nav: [
                    {text: '主页', link: '/zh/'}, // 内部链接 以docs为根目录
                    {text: '在线体验', link: 'https://tank.eyeblue.cn'}, // 外部链接
                ],
                sidebar: [
                    {
                        title: '基本使用',
                        collapsable: false,
                        children: [
                            '/zh/basic/',
                            '/zh/basic/install',
                        ]
                    },
                    {
                        title: '高级特性',
                        children: [
                            '/zh/advance/webdav',
                            '/zh/advance/api'
                        ]
                    }
                ]
            }
        }

    }
};
