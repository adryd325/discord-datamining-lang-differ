// For simplicity in integrating this into other packages, let's make a goal of this
// to be a function that takes the two JS files and returns a string formatted for
// GitHub's comments

// Alright, let's get started

// this file is really cursed, though it's wayyy safer than regex and eval
// or parsing from a regex
import getLangStrings from "./getLangStrings";
import getRoutesStrings from "./getRoutesStrings";

// For example we grab these two files which have had lang changes between the two
// const fs = require('fs');
// const file1 = fs.readFileSync(__dirname + '/old.js', 'utf-8')
// const file2 = fs.readFileSync(__dirname + '/main.js', 'utf-8')
// console.log(doWork(file1, file2));

const formats = {
  codeblock: {
    startString: {
      strings: "## Strings\n```diff",
      routes: "## Routes\n```diff",
    },
    endString: "```",
    addedHeader: "\n# Added\n",
    updatedHeader: "\n# Updated\n",
    removedHeader: "\n# Removed\n",
    added: (diffedString) => `+ ${diffedString[0]}: ${diffedString[1]}\n`,
    updated: (diffedString) =>
      `- ${diffedString[0]}: ${diffedString[1]}\n+ ${diffedString[0]}: ${diffedString[2]}\n`,
    removed: (diffedString) => `- ${diffedString[0]}: ${diffedString[1]}\n`,
  },
  inline: {
    startString: {
      strings: "## Strings\n```diff",
      endpoints: "## Routes\n```diff",
    },
    endString: "",
    addedHeader: "### Added\n",
    updatedHeader: "### Updated\n",
    removedHeader: "### Removed\n",
    added: (diffedString) =>
      ` - \`${diffedString[0]}\`: \`${diffedString[1]}\`\n`,
    updated: (diffedString) =>
      ` - \`${diffedString[0]}\`: \`${diffedString[1]}\` -> \`${diffedString[2]}\`\n`,
    removed: (diffedString) =>
      ` - \`${diffedString[0]}\`: \`${diffedString[1]}\`\n`,
  },
};

let FORMAT;

/**
 * The main work function
 * @param {string} file1 - Contents of first file
 * @param {string} file2 - Contents of second file
 * @param {('codeblock'|'inline')} format - Which format to use when building the strings
 */
function doWork(file1, file2, format) {
  const filesLangStrings = [getLangStrings(file1), getLangStrings(file2)];
  const filesRoutesStrings = [getRoutesStrings(file1), getRoutesStrings(file2)];

  const { addedStrings, updatedStrings, removedStrings } =
    diff(filesLangStrings);
  const {
    addedStrings: addedEndpoints,
    updatedStrings: updatedEndpoints,
    removedStrings: removedEndpoints,
  } = diff(filesRoutesStrings);

  FORMAT = format;

  const builtString = buildString(
    "strings",
    addedStrings,
    updatedStrings,
    removedStrings
  );
  const builtEndpoint = buildString(
    "endpoints",
    addedEndpoints,
    updatedEndpoints,
    removedEndpoints
  );

  let result = "";

  if (builtString) {
    result += builtString;
  }

  if (builtEndpoint) {
    result += builtString ? "\n" + builtEndpoint : builtEndpoint;
  }

  return result;
}

function diff(strings) {
  const removedStrings = [];
  const updatedStrings = [];
  const addedStrings = [];
  for (const i of Object.keys(strings[0])) {
    if (strings[1][i]) {
      if (strings[0][i] !== strings[1][i]) {
        updatedStrings.push([i, strings[0][i], strings[1][i]]);
      }
    } else {
      removedStrings.push([i, strings[0][i]]);
    }
  }
  for (const i of Object.keys(strings[1])) {
    if (!strings[0][i]) {
      addedStrings.push([i, strings[1][i]]);
    }
  }
  return {
    addedStrings,
    updatedStrings,
    removedStrings,
  };
}

export function buildString(
  type,
  addedStrings,
  updatedStrings,
  removedStrings
) {
  let builtString = "";
  // if any of the following have data, we build a string
  if (addedStrings[0] || updatedStrings[0] || removedStrings[0]) {
    builtString += formats[FORMAT].startString[type];
    // check if there's an entry in the strings array
    if (addedStrings[0]) {
      builtString += formats[FORMAT].addedHeader;
      // done this cause it's repeated code and people would get mad at me
      builtString += buildDiffString(addedStrings, "added");
    }
    // the following two are basically the same as above
    if (updatedStrings[0]) {
      builtString += formats[FORMAT].updatedHeader;
      builtString += buildDiffString(updatedStrings, "updated");
    }
    if (removedStrings[0]) {
      builtString += formats[FORMAT].removedHeader;
      builtString += buildDiffString(removedStrings, "removed");
    }
    builtString += formats[FORMAT].endString;
  }
  return builtString;
}

function buildDiffString(diffedStrings, type) {
  // i've sort of gotten lost with variable names
  let builtDiff = "";
  diffedStrings.forEach((diffedString) => {
    builtDiff += formats[FORMAT][type](diffedString);
  });
  return builtDiff;
}

export default doWork;
