module.exports = {
    // 扫描间隔
    CheckInterval: 2000,
    // 邮箱服务器设置
    EmailConf: {
        host: 'smtp.qq.com',
        secureConnection: true,
        auth: {
            user: 'xx@qq.com',
            pass: 'xx'
        }
    },
    // 发件人
    EmailFrom: 'xx@qq.com',
    // 收件箱
    EmailTo: [
        'xx@qq.com',
        'xx@qq.com'
    ]
}