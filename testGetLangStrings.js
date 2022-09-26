const getLangStrings = require("./getLangStrings.js")
const fs = require("fs");
console.log(getLangStrings(fs.readFileSync(process.argv[2])))