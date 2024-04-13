#!/bin/bash -eufx

./node_modules/.bin/rollup -c rollup.config.mjs

node injectRuntimeCode.mjs

cp src/generateRuntimeInterfaceGlueCode.mjs dist/generateRuntimeInterfaceGlueCode.mjs
