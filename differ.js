// For simplicity in integrating this into other packages, let's make a goal of this
// to be a function that takes the two JS files and returns a string formatted for
// GitHub's comments

// Alright, let's get started



// this file is really cursed, though it's wayyy safer than regex and eval
// or parsing from a regex
const getLangStrings = require("./getLangStrings");

// For example we grab these two files which have had lang changes between the two
// const fs = require('fs');
// const file1 = fs.readFileSync(__dirname + '/old.js', 'utf-8') 
// const file2 = fs.readFileSync(__dirname + '/main.js', 'utf-8')
// console.log(doWork(file1, file2));

// Here's the main work function
function doWork(file1, file2) {
  const langFiles = [getLangStrings(file1), getLangStrings(file2)];
  const { addedStrings, updatedStrings, removedStrings } = diff(langFiles);
  const builtString = buildString(addedStrings, updatedStrings, removedStrings);
  return builtString;
}

function diff(strings) {
  const removedStrings = [];
  const updatedStrings = [];
  const addedStrings = []
  for (i of Object.keys(strings[0])) {
    if (strings[1][i]) {
      if (strings[0][i] !== strings[1][i]) {
        updatedStrings.push([i, strings[0][i], strings[1][i]]);
      }
    } else {
      removedStrings.push([i, strings[0][i]])
    }
  }
  for (i of Object.keys(strings[1])) {
    if (!strings[0][i]) {
      addedStrings.push([i, strings[1][i]])
    }
  }
  return {
    addedStrings,
    updatedStrings,
    removedStrings
  }
}

function buildString(addedStrings, updatedStrings, removedStrings) {
  let builtString = "";
  // if any of the following have data, we build a string
  if (addedStrings[0] || updatedStrings[0] || removedStrings[0]) {
    builtString += "## Strings\n";
    // check if there's an entry in the strings array
    if (addedStrings[0]) {
      builtString += "### Added\n";
      // done this cause it's repeated code and people would get mad at me
      builtString += buildDiffString(addedStrings);
    }
    // the following two are basically the same as above
    if (updatedStrings[0]) {
      builtString += "### Updated\n";
      builtString += buildDiffString(updatedStrings);
    }
    if (removedStrings[0]) {
      builtString += "### Removed\n";
      builtString += buildDiffString(removedStrings);
    }
  }
  return builtString;
}

function buildDiffString(diffedStrings) {
  // i've sort of gotten lost with variable names
  let builtDiff = "";
  diffedStrings.forEach((diffedString) => {
    // this should only happen for updated strings
    if (diffedString[2]) {
      builtDiff += ` - \`${diffedString[0]}\`: \`${diffedString[1]}\` -> \`${diffedString[2]}\`\n`;
    } else {
      builtDiff += ` - \`${diffedString[0]}\`: \`${diffedString[1]}\`\n`;
    }
  });
  return builtDiff;
}

module.exports = doWork;
