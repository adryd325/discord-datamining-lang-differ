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
					allStrings[property.key.value ?? property.key.name] = property.value.raw;
				}
			}
		}
	})

	return allStrings;
}