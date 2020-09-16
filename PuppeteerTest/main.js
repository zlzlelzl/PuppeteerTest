const puppeteer = require("puppeteer");

(async () => {
  // set some options, set headless to false so we can see the browser in action
  let launchOptions = {
    headless: true,
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

  await page.click(".ol-submit", { waitUntil: "networkidle0" });

  await page.goto(
    "https://ddiring.co.kr/bbs/board.php?bo_table=comm_free&wr_id=" +
      process.argv[2],
    {
      waitUntil: "networkidle0",
      delay: "4000",
    }
  );
  await page.click(".good_button");

  await browser.close();
})();
