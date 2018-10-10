const Request = require('request');
const _ = require('lodash');
const Mailer = require('nodemailer');
const config = require('./config');

// 请求的地址
const URL = 'https://api.nike.com/product_feed/threads/v2/?anchor=0&count=5&filter=marketplace%28CN%29&filter=language%28zh-Hans%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29&fields=active&fields=id&fields=lastFetchTime&fields=productInfo&fields=publishedContent.nodes&fields=publishedContent.properties.coverCard&fields=publishedContent.properties.productCard&fields=publishedContent.properties.products&fields=publishedContent.properties.publish.collections&fields=publishedContent.properties.relatedThreads&fields=publishedContent.properties.seo&fields=publishedContent.properties.threadType&fields=publishedContent.properties.custom';

const {CheckInterval, EmailConf, EmailFrom, EmailTo} = config;

let lastData = [];

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
    let r = await get(URL)
    let shoes = r.objects
    let newIds = shoes.map(v => v.id)
    if (!lastData || !lastData.length) {
        lastData = newIds;
        return;
    }
    let diff = _.difference(newIds, lastData)
    lastData = newIds
    if (diff && diff.length) {
        let infos = diff.map( v => {
            let info = shoes.find(vv => vv.id === v)
            sendMail(info)
        })
    }
}

function get(rurl) {
    return new Promise((resolve, reject) => {
        Request.get({
            url: rurl,
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
        transport.sendMail({
                from: EmailFrom,
                to: EmailTo,
                subject: "new product",
                html: `
                <html>
                    <body>
                        <h1>${info.productInfo[0].productContent.fullTitle}</h1>
                        <div><img src="${info.publishedContent.properties.coverCard.properties.portraitURL}"  alt="${info.productInfo[0].productContent.fullTitle}"/></div>
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
