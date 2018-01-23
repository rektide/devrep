#!/usr/bin/env node
"use strict"

// hi welcome to the boring cjs loader for this awesome esm project have a nice day

var stdEsm= require( "@std/esm")( module)
exports.connection= stdEsm( "./connection.js").default
exports.main= stdEsm( "./main.js").default
exports.target= stdEsm( "./target.js").default

if( require.main=== module){
	module.exports.main()
}

