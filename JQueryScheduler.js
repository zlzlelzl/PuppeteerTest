const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { error } = require("console");

var $;

(async () => {
  // set some options, set headless to false so we can see the browser in action
  let launchOptions = {
    headless: true,
    // devtools: true,
    // , args: ['--start-maximized']
  };

  // launch the browser with above options
  const browser = await puppeteer.launch(launchOptions);

  var page = await browser.newPage();
  await page.goto("https://ddiring.co.kr/");

  // set viewport and user agent (just in case for nice viewing)
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );

  await page.evaluate(
    (id, pw) => {
      document.querySelector("#ol-id").value = id;
      document.querySelector("#ol-pw").value = pw;
    },
    "zlzlelzl",
    ""
  );

  await page.click(".ol-submit");

  await page.goto(
    "https://ddiring.co.kr/bbs/write.php?bo_table=comm_attendance",
    {
      waitUntil: "networkidle0",
      delay: "4000",
    }
  );

  await page.evaluate(
    (sub, con) => {
      document.querySelector("#wr_subject").value = sub;
      document.querySelector("#wr_content").value = con;
    },
    "ㅊㅊ",
    "ㅊㅊ"
  );

  await page.waitForSelector("#btn_submit");
  await page.click("#btn_submit");

  await page.goto("https://ddiring.co.kr/mypage/board_info.php", {
    waitUntil: "networkidle0",
    delay: "1000",
  });

  await page.waitForSelector(".td-number");

  if ((await page.$eval(".td-number", (el) => el.innerText)) < 5) {
  } else {
    await page.waitForSelector(".td-tit");
    await page.click(".td-tit");

    await page.waitForSelector(".btn-edit-option");
    $ = await cheerio.load(await page.content());

    const delpage = await $(".btn-edit-option")
      .children()
      .last()
      .children()
      .first()
      .attr("href");

    await page.goto(delpage);
  }

  await browser.close();
  console.log(1);
})();
