const puppeteer = require("puppeteer")

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

    for (let j = 1; j <= 1189; j++) {
        let target_url = `https://search.shopping.naver.com/search/all?frm=NVSHATC&origQuery=%E3%84%B1%EC%9E%90%20%EC%BC%80%EC%9D%B4%EB%B8%94&pagingIndex=${j}&pagingSize=40&productSet=total&query=%E3%84%B1%EC%9E%90%20%EC%BC%80%EC%9D%B4%EB%B8%94&sort=rel&timestamp=&viewType=list#`
        await page.goto(target_url, {
            waitUntil: "networkidle2",
            delay: "1000",
        })

        // set viewport and user agent (just in case for nice viewing)
        await page.setViewport({ width: 1920, height: 1080 })
        await page.setUserAgent(
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
        )

        var url = await page.$$eval(
            "a[class='basicList_link__1MaTN']",
            (arr) => {
                var arr2 = ""
                for (let i in arr) {
                    arr2 += arr[i].textContent
                }
                return arr2
            }
        )

        if (url.search("칼국수") != -1 || j % 50 == 0)
            console.log(j, url.search("칼국수"))
    }
    browser.close()
})()
