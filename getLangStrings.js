// HOLY SHIT I HATE THIS

const espree = require("espree");
module.exports = getLangStrings;

// I really really hate this, but this is much safer than regex+eval
function getLangStrings(file) {
  const tree = espree.parse(file, {
    ecmaVersion: 2022,
  });

  const webpackModules =
    tree.body[0].expression.arguments[0].elements[1].properties;

  const allStrings = {};

  webpackModules.forEach((webpackModule) => {
    let expression = webpackModule?.value?.body?.body?.[0]?.expression;
    if (!expression) {
      return;
    }
    if (
     expression.right?.callee?.object
        ?.name === "Object" &&
     expression?.right?.callee?.property
        ?.name === "freeze" &&
     expression?.right?.arguments[0]
    ) {
      if (
        expression.right.arguments[0].properties.some(
          (suspectedLangModule) => {
            if (
              suspectedLangModule.key.name === "DISCORD_NAME" ||
              suspectedLangModule.key.name === "TEAL"
            ) {
              return true;
            }
          }
        )
      ) {
        expression.right.arguments[0].properties.forEach(
          (langEntry) => {
            allStrings[langEntry.key.name] = langEntry.value.raw;
          }
        );
      }
    }
  });

  return allStrings;
}
