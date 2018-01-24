import * as Vm from "vm"

/**
* A websocket 
*/
export class Connection{
	constructor( conn, target){
		this._target= target
		this._conn= conn
		this._enable= {} // start with no features enabled
		this.onmessage= this.onmessage.bind( this)
		this.onconsole= this.onconsole.bind( this)
	}
	send( o){
		this._conn.send( JSON.stringify( o))
	}
	onconsole(){
	}
	onmessage( msg){
		msg= JSON.parse( msg)
		var
		  id= msg.id,
		  params= msg.params|| {},
		  parsedMethod= msg.method&& /(\w+)\.(\w+)/.exec( msg.method),
		  domain= parsedMethod[ 1],
		  call= parsedMethod[ 2],
		  result= {},
		  reply= {id, result}

		messageSwitch: if( domain=== "Log"){
			if( call=== "clear"){
			}
		}else if( domain=== "Page"){
			if( call=== "getResourceTree"){
				result.frameTree= {
					frame: {
						id: 1,
						loaderId: "42.0",
						mimeType: "text/javascript",
						securityOrigin: "http://repl-devtools.invalid",
						url: "http://repl-devtools.invalid/"
					},
					resources: [{
						contentSize: 0,
						mimeType: "text/javascript",
						type: "Sciprt",
						url: "http://repl-devtools.invalid/"
					}]
				}
			}
		}else if( domain=== "Runtime"){
			if( call=== "enable"&& !this._enable.Runtime){
				this.send({
					method: "Runtime.executionContextCreated",
					params: {
						context: {
							auxData: {
								frameId: 1,
								isDefault: true
							},
							id: this._target._executionContext,
							name: "",
							origin: "http://repl-devtools.invalid"
						}
					}
				})
			}else if( call=== "evaluate"){
				if( params.contextId!== this._target._executionContext){
					break messageSwitch;
				}

				// For now run the code but don't really return the result correctly:
				// 1. we need to save the result by an id we can lookup again- the initial view is just a "preview"
				// 2. theres a sizable complexity to how types seem to be marshalled- strings, objects, numbers, Promises, &c
				var
				  r1= Vm.runInContext( params.expression, this._target._vm),
				  namer= name=> ({ name, type: "Object", value: "Object"}),
				  r2 = Object.keys( r1).map( namer) // "it's complicated", much todo
				result.result= {
					className: "Object",
					description: "Object",
					objectId: `{"injectedScriptId": 1, "id": 1}`,
					preview: {
						description: "Object",
						overflow: false,
						properties: r2,
						type: "object"
					},
					type: "object"
				}
			}else if( call=== "getProperties"){
				// need to dive further into an existing result
			}else if( call=== "discardConsoleEntries"){
				// forget all
			}
		}else if( domain=== "Target"){
			if( call=== "setDiscoverTargets"&& params.discover=== true){
				this.send({
					method: "Target.targetCreated",
					params: {
						targetInfo: {
							targetId: this._target._executionContext, // not the best dummy data?
							title: this._target.title|| "repl-devtools",
							type: "page",
							attached: true,
							url: this._target.url|| "http://repl-devtools.invalid/"
						}
					}
				})
			}
		}

		// before we go mark that we've enabled or disabled appropriate bits
		if( call=== "enable"|| call=== "disable"){
			this._enable[ domain]= call=== "enable"
		}

		//console.log({ reply})
		this.send( reply)
	}
}
export default Connection
