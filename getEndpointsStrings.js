// HOLY SHIT I HATE THIS
import { parse } from "espree";
import { find as deepSearch } from "object-deep-search";
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
            if (property.value.type === "Literal") {
              allStrings[property.key.name] = property.value.value;
              continue;
            }
            if (property.value?.alternate?.type === "Literal") {
              allStrings[property.key.name] = property.value.alternate.value;
              continue;
            }

            for (const functionBodyEntry of property.value.body.body) {
              if (functionBodyEntry.type !== "ReturnStatement") continue;
              if (functionBodyEntry.argument?.type === "Literal") {
                allStrings[property.key.name] =
                  functionBodyEntry.argument.value;
                continue;
              }
              if (functionBodyEntry.argument?.alternate?.type === "Literal") {
                allStrings[property.key.name] =
                  functionBodyEntry.argument.alternate.value;
                continue;
              }

              const literalNodes = deepSearch(functionBodyEntry, {
                type: "Literal",
              });

              if (literalNodes.length > 0) {
                const params = property.value.params;
                let value = "";

                for (let i = 0; i < literalNodes.length; i++) {
                  const literal = literalNodes[i];
                  const param = params[i];

                  // TODO: fix this bcs we need everthing - there are some "null" values
                  value += literal.value?.endsWith?.("/")
                    ? literal.value.slice(0, -1)
                    : literal.value;

                  if (param?.type === "Identifier") value += `/{param}`;
                }

                value = value.replace(/[^A-Za-z0-9/\-\_\{\}]/g, "");

                allStrings[property.key.name] = value;
                continue;
              }
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
