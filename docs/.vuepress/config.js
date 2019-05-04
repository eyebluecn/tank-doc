module.exports = {
    base: '/',
    title: '蓝眼云盘文档',
    description: '文档正在撰写中...',
    // 注入到当前页面的 HTML <head> 中的标签
    head: [
        ['link', {rel: 'icon', href: '/favicon.ico'}], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    themeConfig: {
        sidebarDepth: 2, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
        lastUpdated: 'Last Updated', // 文档更新时间：每个文件git最后提交的时间
        nav: [
            {text: '蓝眼云盘', link: '/'}, // 内部链接 以docs为根目录
            {text: '在线体验', link: 'https://tank.eyeblue.cn'}, // 外部链接
            // 下拉列表
            {
                text: '语言',
                items: [
                    {text: '中文', link: '/'},
                    {
                        text: 'English',
                        link: '/'
                    }
                ]
            }
        ],
        sidebar: [
            {
                title: '基本使用',
                collapsable: false,
                children: [
                    '/basic/',
                    '/basic/install',
                ]
            },
            {
                title: '进阶技巧',
                children: [
                    '/advance/webdav',
                    '/advance/api'
                ]
            }
        ]
    }
};
