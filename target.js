import * as Vm from "vm"
import EventEmitter from "events"
import Connection from "./connection"

var executionContext= 1

/**
* Each target is a single vm, or in CDP parlance, a executionContext
*/
export class Target{
	constructor( opts){
		Object.assign( this, opts)
		this._console= new EventEmitter()
		function log( type, args){
			// like connection's Runtime.evaluate, a lot of marshalling to go
			return {
				"method": "Runtime.consoleAPICalled",
				"params": {
					"type": "log",
					"args": [{
						"type": "string",
						"value": "ok"
					}, {
						"type": "number",
						"value": 4,
						"description": "4"
					}],
					"executionContextId": this._executionContext,
					"timestamp": Date.now(),
					"stackTrace":{
						"callFrames":[{
							"functionName": "",
							"scriptId": "728",
							"url": "", "lineNumber":0, "columnNumber":8}]
			}}}
		}
		this._vm= Vm.createContext({
			console: {
				// there is quite a lot more console.* to go but here's a start
				log: (...args)=> this._console.emit( "log", log( "log", args)),
				info: (...args)=> this._console.emit( "log", log( "info", args)),
				error: (...args)=> this._console.emit( "log", log( "error", args))
			}
		})
		this._ws = new Map() // maps websockets to Connections
		this._executionContext= (opts&& !isNaN(opts.executionContext)&& ++opts.executionContext)|| ++executionContext
		delete this.executionContext
		this.removeConnection= this.removeConnection.bind( this)
	}

	/**
	* Attach any incoming websocket connections to the vm
	*/
	addWss( wss){
		wss.on( "connection", conn=> this.addConnection( conn))
		// unsub
		return ()=> wss.clients.forEach( this.removeConnection)
	}
	/**
	* Begin a new session 
	*/
	addConnection( conn){
		var existing= this._ws.get( ws)
		if( !existing){
			var c= new Connection( conn, this)
			// bind it
			conn.on( "message", c.onmessage)
			this._console.on( "log", c.onconsole)
			// store session
			this._ws.set( conn, c)
		}
		// return unsub
		return ()=> this.removeConnection( conn)

	}
	removeConnection( conn){
		var c= this._ws.delete( conn)
		if( !c){
			return current
		}
		// unbind
		conn.removeListener( "message", c.onmessage)
		this._console.removeListener( "log", c.onconsole)
		return current
	}
}
export default Target
