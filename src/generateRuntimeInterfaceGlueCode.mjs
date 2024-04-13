export default function(context) {
	let glue_code = ``

	glue_code += `import {initializeRuntimeFromData} from "@vipen-internal/js-and-web-runtime"\n`
	glue_code += `const runtime = initializeRuntimeFromData(runtime_data);\n`

	const runtime_methods = [
		"getRuntimeVersion",
		"loadStaticResource",
		"loadResource",
		"loadProjectPackageJSON",
		"loadVipenConfiguration",
		"createDefaultContext"
	]

	let exported_methods = []

	for (const method of runtime_methods) {
		// do not export "loadStaticResource" in main project module files
		if (context === "main" && method === "loadStaticResource") continue
		// do not export "loadResource" in resources/ module files
		if (context !== "main" && method === "loadResource") continue

		glue_code += `export function ${method}(...args) { return runtime.${method}(...args); }\n`

		exported_methods.push(method)
	}

	if (context === "main") {
		glue_code += `loadResource.asURL = function loadResourceAsURL(...args) { return runtime.loadResource.asURL(...args); }\n`
	} else {
		glue_code += `loadStaticResource.asURL = function loadStaticResourceAsURL(...args) { return runtime.loadStaticResource.asURL(...args); }\n`
	}

	glue_code += `export default {\n`

	for (const method of exported_methods) {
		glue_code += `    ${method},\n`
	}

	glue_code += `}\n`

	return glue_code
}
