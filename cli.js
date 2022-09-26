const langDiffer = require("./differ.js");
const fs = require("fs");

async function run() {
  if (!process.argv[3] || process.argv[4]) {
    console.log("Usage: node cli.js <oldFile> <newFile>")
    process.exit(1)
  }

  let files
  try {
    files = await Promise.all([
      fs.promises.readFile(process.argv[2]),
      fs.promises.readFile(process.argv[3])
    ])
  } catch (e) {
    console.log(e)
  }

  console.log(langDiffer(files[0], files[1], "inline"))
}

run()