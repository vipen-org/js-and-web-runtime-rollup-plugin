import fs from "node:fs/promises"
import {fileURLToPath} from "node:url"
import path from "node:path"

const __dirname = path.dirname(
	fileURLToPath(import.meta.url)
)

let dist_runtime_path = path.join(__dirname, "dist", "plugin.mjs")
let dist_runtime = (await fs.readFile(dist_runtime_path)).toString()

const runtime_code = (await fs.readFile(path.join(__dirname, "node_modules", "@vipen", "js-and-web-runtime-implementation", "dist", "runtime.mjs"))).toString()

dist_runtime = dist_runtime.split(`"%%%VIPEN_RUNTIME_CODE%%%"`).join(JSON.stringify(runtime_code))

await fs.writeFile(`${dist_runtime_path}.tmp`, dist_runtime)
await fs.rename(`${dist_runtime_path}.tmp`, dist_runtime_path)

await fs.writeFile(path.join(__dirname, "dist", "runtime.mjs"), runtime_code)
