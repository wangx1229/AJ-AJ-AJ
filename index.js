const Request = require('request');
const _ = require('lodash');
const Mailer = require('nodemailer');
const config = require('./config');

// 请求的地址
const url = 'https://api.nike.com/product_feed/threads/v2/?anchor=0&count=10&filter=marketplace%28CN%29&filter=language%28zh-Hans%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29&fields=active&fields=id&fields=lastFetchTime&fields=productInfo&fields=publishedContent.nodes&fields=publishedContent.properties.coverCard&fields=publishedContent.properties.productCard&fields=publishedContent.properties.products&fields=publishedContent.properties.publish.collections&fields=publishedContent.properties.relatedThreads&fields=publishedContent.properties.seo&fields=publishedContent.properties.threadType&fields=publishedContent.properties.custom';

const {CheckInterval, EmailConf, EmailFrom, EmailTo} = config;

let lastData = {}

async function main() {
    while (true) {
        try {
            await check()
        } catch (e) {
            console.log("error:", e);
        }
        await sleep(CheckInterval);
    }
}

async function check() {
    let r = await get()
    let shoes = r.objects
    shoes.forEach(item => {
        const timeStr = _.get(item, 'productInfo[0].launchView.startEntryDate', '')
        if ((lastData[item.id] && lastData[item.id] !== timeStr) || lastData[item.id] === undefined) {
            lastData[item.id] = timeStr
            sendMail(item)
        }
    })
}

function get() {
    return new Promise((resolve, reject) => {
        Request.get({
            url,
            json: true
        }, function (error, response, body) {
            if (error) {
                return reject(error);
            }
            return resolve(body);
        });
    });
}
const transport = Mailer.createTransport(EmailConf);

function sendMail(info) {
    return new Promise((resolve, reject) => {
        const title = _.get(info, 'publishedContent.properties.seo.title', '缺少字段信息')
        const href = _.get(info, 'publishedContent.properties.seo.slug', 'javascript:;')
        const src = _.get(info, 'publishedContent.properties.coverCard.properties.portraitURL', '缺少字段信息')
        const time = _.get(info, 'productInfo[0].launchView.startEntryDate', null)
        let formateTime = '发售时间未知'
        let firstType = _.get(info, 'productInfo[0].launchView.method', '缺少字段信息')
        let lastType = '未知'
        if (time) {
            const myDate = new Date(time)
            formateTime = `${myDate.getMonth() + 1}月${myDate.getDate()}日，${myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours()}:${myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes()}`
        }
        switch (firstType) {
            case '缺少字段信息':
                lastType = '未知发售方式，进入SNKRS查看'
                break
            case 'FLOW':
                lastType = '先到先得'
                break
            case 'LEO':
                lastType = '先到先得'
                break
            case 'DAN':
                lastType = '30分钟抽签发售'
                break
            case 'NIKE PASS':
                lastType = '上海耐克001发售'
                break
            case 'AR':
                lastType = '游戏发售，可能要拍摄制定的图片解锁购买权'
                break
            default:
                lastType = '未知发售方式，有可能是刮刮乐'
        } 
        transport.sendMail({
                from: EmailFrom,
                to: EmailTo,
                subject: `${title.split(';')[0]}`,
                html: `
                <html>
                    <body>
                        <h3>${firstType}:${lastType}|发售时间：${formateTime}。<a href="https://www.nike.com/cn/launch/t/${href}" target="_blank">${href !== 'javascript:;' ? '前往发售页面查看发售详情' : '没有找到发售连接'}</a></h3>
                        <img style="width:100%" src="${src}" alt="${title}"/>
                    </body>
                </html>
                `
            },
            function (err) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            }
        );
    });
};

async function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    })
}

main();
