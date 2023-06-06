import langDiffer from "./differ.js";
import { readFile } from "fs/promises";

async function run() {
  if (!process.argv[3] || process.argv[4]) {
    console.log("Usage: node cli.js <oldFile> <newFile>");
    process.exit(1);
  }

  let files;
  try {
    files = await Promise.all([
      readFile(process.argv[2]),
      readFile(process.argv[3]),
    ]);
  } catch (e) {
    console.log(e);
  }

  console.log(langDiffer(files[0], files[1], "inline"));
}

run();
