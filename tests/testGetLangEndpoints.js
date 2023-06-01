import getLangEndpoints from "../getLangEndpoints.js";
import { readFileSync } from "fs";
console.log(getLangEndpoints(readFileSync(process.argv[2])));
