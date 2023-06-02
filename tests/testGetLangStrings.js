import getLangStrings from "../getLangStrings.js";
import { readFileSync, writeFileSync } from "fs";
const c = getLangStrings(readFileSync(process.argv[2]));

writeFileSync(
  "./test-files/test-lang-strings.json",
  JSON.stringify(c, null, 2)
);
