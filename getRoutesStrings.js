// HOLY SHIT I HATE THIS
import { parse } from "espree";
export default getEndpoingsStrings;

// I really really hate this, but this is much safer than regex+eval
function getEndpoingsStrings(file) {
  const tree = parse(file, {
    ecmaVersion: 2022,
  });

  const webpackModules =
    tree.body[0].expression.arguments[0].elements[1].properties;

  const allStrings = {};

  function parseEndpoints(webpackModule) {
    const body = webpackModule?.value?.body?.body;

    for (const bodyEntry of body) {
      if (bodyEntry?.type !== "VariableDeclaration") continue;

      for (const declaration of bodyEntry.declarations) {
        if (
          declaration.init?.callee?.object?.name !== "Object" ||
          declaration.init?.callee?.property?.name !== "freeze"
        )
          continue;

        for (const initArgument of declaration.init.arguments) {
          const properties = initArgument.properties;
          if (
            !properties?.some(
              (p) =>
                p.key.name === "USER_RELATIONSHIPS" ||
                p.key.name === "USER_GUILD_NOTIFICATION_SETTINGS"
            )
          )
            continue;

          for (const property of properties) {
            // Skip INDEX bcs it's just `/`
            if (property.key.name === "INDEX") continue;

            // Faster, just for key: value
            if (property.value.type === "Literal") {
              allStrings[property.key.name] = property.value.value;
              continue;
            }
          }
        }
      }
    }
  }

  webpackModules.forEach((webpackModule) => {
    parseEndpoints(webpackModule);
  });

  return allStrings;
}
