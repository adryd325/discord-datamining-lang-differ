import getLangStrings from "../getLangStrings.js";
import { readFileSync, writeFileSync } from "fs";
const c = getLangStrings(readFileSync(process.argv[2]));

writeFileSync(
  process.argv[3],
  JSON.stringify(c, null, 2)
);
