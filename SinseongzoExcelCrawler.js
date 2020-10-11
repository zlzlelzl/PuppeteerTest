const request = require("request")
const puppeteer = require("puppeteer")
const fs = require("fs")

var outString = ""
for (let i = 0; i < 131; i++) {
    ;(async () => {
        var url = "http://cafe.daum.net/sinsungzo/oA2f/" + i
        // set some options, set headless to false so we can see the browser in action
        let launchOptions = {
            headless: true,
            // devtools: true,
            // , args: ['--start-maximized']
        }

        // launch the browser with above options
        const browser = await puppeteer.launch(launchOptions)

        var page = await browser.newPage()

        await page.goto(url)

        const frame = page.frames().find((frame) => frame.name() === "down")

        var file = await frame.$eval("div .figure-file", (e) => {
            return [e.attributes[3].textContent, e.attributes[2].textContent]
        })

        let filePath = "../SinseongzoFile/" + file[0]
        var hasFile = fs.existsSync(filePath, (data) => {
            return data
        })

        if (hasFile) {
            outString += "파일 이미 있음"
        } else {
            request.get(file[1]).pipe(fs.createWriteStream(filePath))
            outString += "파일 생성"
        }

        console.log(outString)

        await browser.close()
    })()
}
