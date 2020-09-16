var exec = require("child_process").exec

// for(i in range(7545,7632)){
// }

var i = 829

var a = setInterval(() => {
    console.log(i)
    exec("node .\\main.js " + i)
    i++
    if (i >= 1000) {
        clearInterval(a)
    }
}, 5000)

function range(start, end) {
    var arr = []

    var length = end - start

    for (var i = 0; i <= length; i++) {
        arr[i] = start
        start++
    }

    return arr
}
