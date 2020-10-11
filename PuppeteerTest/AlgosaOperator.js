var exec = require("child_process").exec

var second = 60 * 10

var a = setInterval(() => {
    exec("node .\\AlgosaCrawler.js", function (error, stdout, stderr) {
        process.stdout.write(stdout)
        if (error !== null) {
            console.log("exec error: " + error)
        }
    })
}, second * 1000)
