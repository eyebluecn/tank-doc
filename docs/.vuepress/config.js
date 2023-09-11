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
      lang: 'zh-CN',
      title: '蓝眼云盘',
      description: '这是一个优雅的开源云盘'
    },
    '/en/': {
      lang: 'en-US', // 将会被设置为 <html> 的 lang 属性
      title: 'EyeblueTank',
      description: 'This is an elegant cloud storage.'
    }
  },
  themeConfig: {
    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    repo: 'https://github.com/eyebluecn/tank',
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    repoLabel: 'GitHub',
    // 以下为可选的编辑链接选项

    // 假如你的文档仓库和项目本身不在一个仓库：
    docsRepo: 'https://github.com/eyebluecn/tank-doc',
    // 假如文档不是放在仓库的根目录下：
    docsDir: 'docs',
    // 假如文档放在一个特定的分支下：
    docsBranch: 'master',
    // 默认是 false, 设置为 true 来启用
    editLinks: true,
    // 默认为 "Edit this page"
    editLinkText: 'Edit this page on Github！',

    locales: {

      '/': {
        selectText: 'English',
        label: '简体中文',

        // 以下为可选的编辑链接选项

        // 假如你的文档仓库和项目本身不在一个仓库：
        docsRepo: 'https://github.com/eyebluecn/tank-doc',
        // 假如文档不是放在仓库的根目录下：
        docsDir: 'docs',
        // 假如文档放在一个特定的分支下：
        docsBranch: 'master',
        // 默认是 false, 设置为 true 来启用
        editLinks: true,
        // 默认为 "Edit this page"
        editLinkText: '在Github中修改此页！',

        lastUpdated: '上次更新', // 文档更新时间：每个文件git最后提交的时间
        sidebarDepth: 2, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
        nav: [
          {text: '主页', link: '/'}, // 内部链接 以docs为根目录
          {text: '在线体验', link: 'https://tanker.eyeblue.cn'}, // 外部链接
        ],
        sidebar: [
          {
            title: '基本使用',
            collapsable: false,
            children: [
              '/basic/',
              '/basic/install',
              '/basic/compile',
              '/basic/download',
            ]
          },
          {
            title: '高级特性',
            collapsable: false,
            children: [
              '/advance/cli',
              '/advance/preview',
              '/advance/scan',
              '/advance/webdav',
              '/advance/image',
              '/advance/alien',
              '/advance/question',
            ]
          },
          {
            title: '版本升级',
            collapsable: false,
            children: [
              '/upgrade/migrate-3.1.x-to-4.0.x',
              '/upgrade/migrate',
            ]
          },
          {
            title: '数据库设计',
            collapsable: false,
            children: [
              '/api/schema-3.1.x',
              '/api/schema-4.0.x',
            ]
          }
        ]
      },
      '/en/': {
        selectText: '简体中文',
        label: 'English',


        lastUpdated: 'Last Updated', // 文档更新时间：每个文件git最后提交的时间
        sidebarDepth: 2, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
        nav: [
          {text: 'Home', link: '/en/'}, // 内部链接 以docs为根目录
          {text: 'Demo Online', link: 'https://tanker.eyeblue.cn'}, // 外部链接
        ],
        sidebar: [
          {
            title: 'Basic Usage',
            collapsable: false,
            children: [
              '/en/basic/',
              '/en/basic/install',
              '/en/basic/download',
            ]
          },
          {
            title: 'Advance Feature',
            collapsable: false,
            children: [
              '/en/advance/cli',
              '/en/advance/webdav',
              '/en/advance/image',
              '/en/advance/alien',
              '/en/advance/question',
              '/en/advance/migrate',
            ]
          }
        ]
      }
    }

  }
};
