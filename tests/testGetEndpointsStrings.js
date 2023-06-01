import getEndpointsStrings from "../getEndpointsStrings.js";
import { readFileSync, writeFileSync } from "fs";
const c = getEndpointsStrings(readFileSync(process.argv[2]));

writeFileSync("./test-files/endpoints.json", JSON.stringify(c, null, 2));
