import resolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"

export default {
	input: "./src/index.mjs",

	output: {
		file: "./dist/plugin.mjs",
		format: "es"
	},

	plugins: [resolve(), terser()]
}
