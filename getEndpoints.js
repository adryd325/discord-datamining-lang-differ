import * as acorn from "acorn";
import * as walk from "acorn-walk"

export default function getEndpoints(file) {
	const endpoints = {}

	const ast = acorn.parse(file, {ecmaVersion: "latest"})
	walk.simple(ast, {
		ObjectExpression(node, state) {
			if(state.step === 0 && node.properties.find(x => x.key?.name === "USER_RELATIONSHIP")) {
				state.step = 1

				for(const property of node.properties) {
					const key = property.key.name
					let path

					if(property.value.type === "Literal") {
						path = property.value.value
					} else if(["FunctionExpression", "ArrowFunctionExpression"].includes(property.value.type)) {
						path = ""

						if(property.value.type === "ArrowFunctionExpression" && property.value.body.type === "Literal") {
							path = property.value.body.value
						} else {
							walk.simple(property.value, {
								CallExpression(node) {
									if(node.callee.type === "MemberExpression" && node.callee.object.type === "Literal") {
										path += node.callee.object.value
									}
									for(const argument of node.arguments) {
										if(argument.type === "Identifier") {
											path += ":param"
										} else if(argument.type === "Literal") {
											path += argument.value
										}
									}
								}
							})
						}
					} else {
						throw new Error(`Unexpected node type: ${property.value.type}`)
					}

					endpoints[key] = path
				}
			}
		}
	}, undefined, {step: 0})

	return endpoints
}