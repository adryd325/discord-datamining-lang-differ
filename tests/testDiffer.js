const differ = require("../differ");
const fs = require("fs");
console.log(
  differ(
    fs.readFileSync("./test-files/4d6a5f34f7a850977e9a.js", "utf-8"),
    fs.readFileSync("./test-files/4d6a5f34f7a850977e9a-2.js", "utf-8"),
    "codeblock"
  )
);
