import getRoutesStrings from "../getRoutesStrings.js";
import { readFileSync, writeFileSync } from "fs";
const c = getRoutesStrings(readFileSync(process.argv[2]));

writeFileSync(process.argv[3], JSON.stringify(c, null, 2));
