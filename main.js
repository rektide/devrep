import {Server} from "ws"
import Target from "./target.js"
import Connection from "./connection.js"

export let defaults= {
	prefix: "DEVREP"
}

/**
 This is a VERY basic server, more a skeleton than a real server. Please add your own real serving, or front this with something secure.
*/
export function main({ prefix}= defaults){
	prefix= prefix? prefix+ "_": ""
	var
	  port= process.env[ prefix+ "PORT"]|| process.env[ "PORT"]|| 9222,
	  wss = new Server({ port}),
	  repl= new Target()
	repl.addWss( wss)
}
export default main
