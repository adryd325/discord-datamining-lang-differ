import differ from "../differ";
import { readFileSync } from "fs";
console.log(
  differ(
    readFileSync("./test-files/4d6a5f34f7a850977e9a.js", "utf-8"),
    readFileSync("./test-files/4d6a5f34f7a850977e9a-2.js", "utf-8"),
    "codeblock"
  )
);
