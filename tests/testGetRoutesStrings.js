import getRoutesStrings from "../getRoutesStrings.js";
import { readFileSync, writeFileSync } from "fs";
const c = getRoutesStrings(readFileSync(process.argv[2]));

writeFileSync("./test-files/routes.json", JSON.stringify(c, null, 2));
