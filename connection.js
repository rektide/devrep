import * as Vm from "vm"
import RemoteObject from "./remote-object.js"

/**
* A websocket 
*/
export class Connection{
	constructor( conn, target){
		this._target= target
		this._conn= conn

		this._enable= {} // a connection is supposed to "enable" features it wants. save which here.

		// object storage - a connection carries state about RemoteObjects it has sent
		var _id= 0
		this._genObjectId= function(){
			return ++_id
		}
		this._obj2Id= new WeakMap() // map from object to their id
		this._id2Obj= {} // map from id to object -- warning, not weak! yikes.

		this.onmessage= this.onmessage.bind( this)
		this.onconsole= this.onconsole.bind( this)
	}
	/**
	  Send this object to the debugger
	*/
	send( o){
		this._conn.send( JSON.stringify( o))
	}
	/**
	  Retrieve an id for an object
	  If you do not have an id, one will be created for you & you will be tracked by it
	*/
	objectId( obj){
		var existing= this._obj2Id.get( obj)
		if( existing){
			return existing
		}

		var newId= this.genObjectId()
		this._obj2Id.set( obj, newId)
		this._id2Obj[ newId]= obj
		return newId
	}
	/**
	  Lookup an object from an id
	*/
	getObject( id){
		return this._id2Obj[ id]
	}
	onconsole(...args){
		console.log("onconsole", args) // placeholder impl
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
				  // TODO: try -> error -> wasThrown
				  val= Vm.runInContext( params.expression, this._target._vm),
				  remoteObject= new RemoteObject( val)
				result.result= remoteObject.result( this)
			}else if( call=== "getProperties"){
				var
				  objId= params.objectId,
				  obj= this._id2Obj[ objId]
				result= obj.properties( params, this)
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
