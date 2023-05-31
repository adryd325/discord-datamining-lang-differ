const getLangEndpoints = require("../getLangEndpoints.js");
const fs = require("fs");
console.log(getLangEndpoints(fs.readFileSync(process.argv[2])));
