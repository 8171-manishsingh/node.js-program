





const fs = require("fs")

fs.writeFileSync("index.html","<html><head><title>FS Module</title><body><h1>Hello Node JS.......!</h1></body></head></html>")

const data=fs.readFileSync("index.html","utf8")
console.log(data)

fs.appendFileSync("index.html","<h2>Hello Backend Developer</h2>")



