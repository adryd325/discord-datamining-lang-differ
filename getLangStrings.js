import * as acorn from "acorn";
import * as walk from "acorn-walk"

function copyASTObject(node, target) {
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
		target[stringKey] = stringVal
	}
}


export default function getLangStrings(file) {
	const allStrings = {};

	const ast = acorn.parse(file, {ecmaVersion: "2022"});
	walk.simple(ast, {
		ObjectExpression(node, state) {
			// There are two objects with strings.
			// One of them has DISCORD_NAME,
			// the other one has DISCORD_DESC_SHORT.
			if(state.step === 0 && node.properties.find(x => x.key?.type === "Identifier" && x.key.name === "DISCORD_DESC_SHORT")) {
				copyASTObject(node, allStrings)
				state.step = 1
			} else if(state.step === 1 && node.properties.find(x => x.key?.type === "Identifier" && x.key.name === "DISCORD_NAME")) {
				copyASTObject(node, allStrings)
				state.step = 2
			}
		},
		CallExpression(node, state) {
			// Handles the `n(t, "KEY", "val")` calls
			if(state.step === 1 && node.arguments.length === 3) {
				const stringKey = node.arguments[1].value
				const stringVal = node.arguments[2].value

				allStrings[stringKey] = JSON.stringify(stringVal)
			}
		}
	}, undefined, {step: 0})

	return allStrings;
}