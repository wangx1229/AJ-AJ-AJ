module.exports = {
    // 扫描间隔
    CheckInterval: 2000,
    // 邮箱服务器设置
    EmailConf: {
        host: 'smtp.qq.com',
        secureConnection: true,
        auth: {
            user: '1570680400@qq.com',
            pass: '这里是授权码'
        }
    },
    // 发件人
    EmailFrom: '1570680400@qq.com',
    // 收件箱
    EmailTo: [
        '1172830949@qq.com',
        '1570680400@qq.com'
    ]
}