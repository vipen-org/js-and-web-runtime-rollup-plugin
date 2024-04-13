// Code is based off of https://rollupjs.org/plugin-development/#a-simple-example
import generateRuntimeInterfaceGlueCode from "./generateRuntimeInterfaceGlueCode.mjs"

async function loadVirtualModule(has_static_context, runtime_data) {
	let virtual_module = ``

	virtual_module += `const runtime_data = ` + JSON.stringify(runtime_data, null, 4) + ";\n"
	virtual_module += generateRuntimeInterfaceGlueCode(has_static_context)

	return virtual_module
}

export default function(has_static_context, runtime_data) {
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
					return await loadVirtualModule(has_static_context, runtime_data)
				} else if (id === "@vipen-internal/js-and-web-runtime") {
					return "%%%VIPEN_RUNTIME_CODE%%%"
				}

				return null // other ids should be handled as usually
			}
		}
	}
}
