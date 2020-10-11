const cheerio = require("cheerio")
const puppeteer = require("puppeteer")
const underscore = require("underscore")
const request = require("request")
const https = require("https")
var fs = require("fs")
const { url } = require("inspector")

var outString =
    "[" +
    new Date().getHours().toString().padStart(2, "0") +
    ":" +
    new Date().getMinutes().toString().padStart(2, "0") +
    "]"

;(async () => {
    // set some options, set headless to false so we can see the browser in action
    let launchOptions = {
        // headless: false,
        // devtools: true,
        // args: ["--start-maximized"],
    }

    // launch the browser with above options
    const browser = await puppeteer.launch(launchOptions)

    var page = await browser.newPage()

    await page.goto("http://rgo4.com/index.php?mid=free&page=1", {
        waitUntil: "networkidle2",
        delay: "1000",
    })

    // set viewport and user agent (just in case for nice viewing)
    await page.setViewport({ width: 1920, height: 1080 })
    await page.setUserAgent(
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    )

    var url_list = await page.$$eval("td[class='author']", (el) => {
        try {
            return el
                .map((e) => {
                    let val1 = e.firstElementChild.firstElementChild.attributes[1].value
                        .match(/\d/g)
                        .join("")
                    if (val1 <= 100 && val1 >= 30)
                        // 100 초과는 운영자, 30레벨이상인 유저 검색
                        return e.parentNode
                            .querySelector(".title")
                            .firstElementChild.attributes.getNamedItem("href")
                            .value
                })
                .filter((e) => {
                    return e != null
                })
        } catch (error) {
            console.log("error")
        }
    })
    // try {
    //     var url1 = await page.$eval("a[class='member_28151083']", (el) => {
    //         console.log(
    //             el.innerHTML
    //             // .parentNode.parentNode
    //             //     .querySelector(".title")
    //             //     .firstElementChild.attributes.getNamedItem("href").value
    //         )
    //         return el.parentNode.parentNode
    //             .querySelector(".title")
    //             .firstElementChild.attributes.getNamedItem("href").value
    //     })
    //     var url2 = await page.$eval("a[class='member_6811890']", (el) => {
    //         return el.parentNode.parentNode
    //             .querySelector(".title")
    //             .firstElementChild.attributes.getNamedItem("href").value
    //     })
    //     var url = url1 != undefined ? url1 : url2
    // } catch (error) {
    //     await browser.close()
    //     console.log(outString + "해당유저 없음")
    //     return
    // }
    while (url_list.length > 1) {
        await page.goto(underscore.unescape(url_list[0]), {
            waitUntil: "networkidle0",
            delay: "1000",
        })

        var subject = await page.$eval(
            "header[class^='article_header']",
            (el) => {
                return el.querySelector("h1").textContent
            }
        )

        subject = subject.replace(/[\\\/:?*<>|\"]+/i, "")

        var Images = await page.$eval("div[class^='document']", (el) => {
            var arr = {}
            let img_html = el.querySelectorAll("img")

            for (let i = 0; i < img_html.length; i++) {
                arr[
                    img_html[i].attributes.getNamedItem("alt").value
                ] = img_html[i].attributes.getNamedItem("src").value
            }

            return arr
        })

        var content = await page.$eval("div[class^='document']", (el) => {
            return el.textContent
        })

        var hasFile = fs.existsSync(
            "../algosa store/" + subject + ".txt",
            (data) => {
                return data
            }
        )

        if (hasFile) {
            outString += "파일 이미 있음,"
        } else {
            fs.writeFile(
                "../algosa store/" + subject + ".txt",
                content,
                "utf-8",
                (error) => {
                    if (error != null) {
                        console.log(outString, "파일 입력 에러 : " + error)
                    }
                }
            )
            outString += "파일 생성,"
        }

        for (i in Images) {
            let ImagePath = "../algosa store/" + subject + " " + i

            let hasImageFile = fs.existsSync(ImagePath, (data) => {
                return data
            })

            if (hasImageFile) {
                outString += "o"
            } else {
                request.get(Images[i]).pipe(fs.createWriteStream(ImagePath))
                outString += "x"
            }
        }
        url_list.shift()
    }
    await browser.close()
    console.log(outString, "정상 종료")
})()
