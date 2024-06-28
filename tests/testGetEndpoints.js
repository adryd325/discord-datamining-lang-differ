import getEndpoints from "../getEndpoints.js";
import { readFileSync, writeFileSync } from "fs";
const c = getEndpoints(readFileSync(process.argv[2]));

writeFileSync(process.argv[3], JSON.stringify(c, null, 2));
