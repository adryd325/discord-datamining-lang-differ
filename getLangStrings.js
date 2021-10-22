// HOLY SHIT I HATE THIS

const esprima = require("esprima");
module.exports = getLangStrings

// I really really hate this, but this is much safer than regex+eval
function getLangStrings(file) {
  const webpackModules = esprima.parse(file).body[0].expression.arguments[0].elements;

  const allStrings = {};

  webpackModules.forEach((webpackChunk) => {
    webpackChunk?.properties?.forEach((webpackModule) => {
      if (
        webpackModule?.value?.body?.body?.[1]?.expression?.right?.callee?.object?.name === "Object" &&
        webpackModule?.value?.body?.body?.[1]?.expression?.right?.callee?.property?.name === "freeze" &&
        webpackModule?.value?.body?.body?.[1]?.expression?.right?.arguments[0]
      ) {
        if (
          webpackModule.value.body.body[1].expression.right.arguments[0].properties.some(
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
          webpackModule.value.body.body[1].expression.right.arguments[0].properties.forEach(
            (langEntry) => {
              allStrings[langEntry.key.name] = langEntry.value.raw;
            }
          );
        }
      }
    });
  });
  return allStrings
}
