import getEndpointsStrings from "../getEndpointsStrings.js";
import { readFileSync } from "fs";
console.log(getEndpointsStrings(readFileSync(process.argv[2])));
