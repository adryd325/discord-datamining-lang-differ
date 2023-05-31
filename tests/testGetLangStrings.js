const getLangStrings = require("../getLangStrings.js");
const fs = require("fs");
const c = getLangStrings(fs.readFileSync(process.argv[2]));
//console.log(c);

fs.writeFileSync(
  "./test-files/test-lang-strings.json",
  JSON.stringify(c, null, 2)
);
