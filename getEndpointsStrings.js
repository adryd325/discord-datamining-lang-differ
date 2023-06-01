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

        const properties = declaration.init.arguments[0].properties;
        if (!properties?.some((p) => p.key.name === "USER_RELATIONSHIPS"))
          continue;

        for (const property of properties) {
          if (property.value.type === "Literal") {
            allStrings[property.key.name] = property.value.value;
            continue;
          }

          for (const functionBodyEntry of property.value.body.body) {
            if (functionBodyEntry.type !== "ReturnStatement") continue;
            if (functionBodyEntry.argument?.type === "Literal") {
              allStrings[property.key.name] = functionBodyEntry.argument.value;
              continue;
            }
            if (functionBodyEntry.argument?.alternate?.type === "Literal") {
              allStrings[property.key.name] =
                functionBodyEntry.argument.alternate.value;
              continue;
            }

            const returnStatementArguments =
              functionBodyEntry.argument.arguments;

            for (const returnStatementArgument of returnStatementArguments) {
              if (returnStatementArgument.type !== "Literal") continue;

              allStrings[property.key.name] = returnStatementArgument.value;
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
