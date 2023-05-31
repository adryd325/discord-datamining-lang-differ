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

  function parseStrings(webpackModule) {
    const expression = webpackModule?.value?.body?.body?.[2]?.expression;
    if (!expression) {
      return;
    }

    if (
      expression.right?.callee?.object?.name === "Object" &&
      expression.right?.callee?.property?.name === "freeze" &&
      expression.right?.arguments?.[0].expressions?.[0]?.arguments?.[0]
    ) {
      // parse frozen object
      const properties =
        expression.right.arguments[0].expressions[0].arguments[0].right
          .properties;
      if (
        properties.some((suspectedLangModule) => {
          if (suspectedLangModule.key.name === "DISCORD_DESC_SHORT") {
            return true;
          }
        })
      ) {
        properties.forEach((langEntry) => {
          allStrings[langEntry.key.name] = langEntry.value.raw;
        });
      }

      // parse function call arguments
      expression.right.arguments[0].expressions.forEach((callExpr) => {
        if (callExpr.arguments?.[1] && callExpr.arguments?.[2])
          allStrings[callExpr.arguments[1].value] = callExpr.arguments[2].raw;
      });
    }
  }

  function parseUntranslatedStrings(webpackModule) {
    const expression = webpackModule?.value?.body?.body?.[0]?.expression;
    if (!expression) {
      return;
    }

    if (
      expression.right?.callee?.object?.name === "Object" &&
      expression.right?.callee?.property?.name === "freeze" &&
      expression.right?.arguments[0]?.properties
    ) {
      const properties = expression.right.arguments[0].properties;
      if (
        properties.some((suspectedLangModule) => {
          if (suspectedLangModule.key.name === "DISCORD_NAME") {
            return true;
          }
        })
      ) {
        properties.forEach((langEntry) => {
          allStrings[langEntry.key.name] = langEntry.value.raw;
        });
      }
    }
  }

  webpackModules.forEach((webpackModule) => {
    parseStrings(webpackModule);
    parseUntranslatedStrings(webpackModule);
  });

  return allStrings;
}
