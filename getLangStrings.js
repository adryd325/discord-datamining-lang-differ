import * as acorn from "acorn";
import * as walk from "acorn-walk"

export default function getLangStrings(file) {
	const allStrings = {};

	const ast = acorn.parse(file, {ecmaVersion: "2022"});
	walk.simple(ast, {
		ObjectExpression(node) {
			if(node.properties.find(x => x.key?.type === "Identifier" && (x.key.name === "DISCORD_NAME" || x.key.name === "DISCORD_DESC_SHORT"))) {
				for(const property of node.properties) {
					allStrings[property.key.name] = property.value.raw;
				}
			}
		}
	})

	return allStrings;
}