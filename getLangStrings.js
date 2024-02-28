import * as acorn from "acorn";
import * as walk from "acorn-walk"

export default function getLangStrings(file) {
	const allStrings = {};

	const ast = acorn.parse(file, {ecmaVersion: "2022"});
	walk.simple(ast, {
		ObjectExpression(node) {
			// There are two objects with strings.
			// One of them has DISCORD_NAME,
			// the other one has DISCORD_DESC_SHORT.
			if(node.properties.find(x => x.key?.type === "Identifier" && (x.key.name === "DISCORD_NAME" || x.key.name === "DISCORD_DESC_SHORT"))) {
				for(const property of node.properties) {
					// String literals as keys, ex. {"a": "b"} will have `value`
					// Normal keys, ex. {a: "b"} will have `name`
					const stringKey = property.key.value ?? property.key.name

					let stringVal
					if(property.value.type === "Literal") {
						stringVal = property.value.raw
					} else if(property.value.type === "TemplateLiteral") {
						const fullString = property.value.quasis.map(x => x.value.cooked).join("") // This assumes there will be no ${} expressions
						const rawString = JSON.stringify(fullString)

						stringVal = rawString
					}

					allStrings[stringKey] = stringVal
				}
			}
		}
	})

	return allStrings;
}