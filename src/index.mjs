// Code is based off of https://rollupjs.org/plugin-development/#a-simple-example
async function loadVirtualModule(context, runtime_data) {
	let virtual_module = ``

	virtual_module  = `const runtime_data = ` + JSON.stringify(runtime_data, null, 4) + ";\n"
	virtual_module += `import {initializeRuntimeFromData} from "@vipen-internal/js-and-web-runtime"\n`
	virtual_module += `const runtime = initializeRuntimeFromData(runtime_data);\n`

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

		virtual_module += `export function ${method}(...args) { return runtime.${method}(...args); }\n`

		exported_methods.push(method)
	}

	if (context === "main") {
		virtual_module += `loadResource.asURL = function loadResourceAsURL(...args) { return runtime.loadResource.asURL(...args); }\n`
	} else {
		virtual_module += `loadStaticResource.asURL = function loadStaticResourceAsURL(...args) { return runtime.loadStaticResource.asURL(...args); }\n`
	}

	virtual_module += `export default {\n`

	for (const method of exported_methods) {
		virtual_module += `    ${method},\n`
	}

	virtual_module += `}\n`

	return virtual_module
}

export default function(context, runtime_data) {
	return function VipenJsRuntimePlugin() {
		return {
			name: "vipen-js-runtime-plugin",

			resolveId(source) {
				if (source === "@vipen/target-js") {
					// this signals that Rollup should not ask other plugins or check
					// the file system to find this id
					return source
				} else if (source === "@vipen-internal/js-and-web-runtime") {
					return source
				}

				return null // other ids should be handled as usually
			},

			async load(id) {
				if (id === "@vipen/target-js") {
					return await loadVirtualModule(context, runtime_data)
				} else if (id === "@vipen-internal/js-and-web-runtime") {
					return "%%%VIPEN_RUNTIME_CODE%%%"
				}

				return null // other ids should be handled as usually
			}
		}
	}
}
