const cheerio = require("cheerio")
const request = require("request")
const fs = require("fs")

var options = {
    url:
        "https://cafe.naver.com/joonggonara?iframe_url=/MyCafeIntro.nhn%3Fclubid=10050146",
    METHOD: "GET",
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded",
    },
}

request(options, "unicode", (err, req, res) => {
    var $ = cheerio.load(req.body)
    console.log($.html())

    fs.writeFileSync("./test.html", $.html())
})
