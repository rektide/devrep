/*

{"id":42,"result":{
	"result":{
		"type":"object",
		"subtype":"array",
		"className":"Array",
		"description":"Array(2)",
		"objectId":
			"{\"injectedScriptId\":7,\"id\":6}",
		"preview": {
			"type":"object",
			"subtype":"array",
			"description":"Array(2)",
			"overflow":false,
			"properties":[{
				"name":"0",
				"type":"number",
				"value":"4"
			},{
				"name":"1",
				"type":"object",
				"value":"Object"}]
			}}}}
*/

var counter= 1

export var defaults= {
} 

/**
  In DevTools Protocol, the server (us) sends "RemoteObject"s to the client.
  This class helps serialize normal objects into RemoteObjects.
*/
export class RemoteObject{
	static get subtype( o){
		if( o instanceof Array){
			return "array"
		}
		if( o=== null){
			return "null"
		}
		if( o instanceof RegExp){
			return "regexp"
		}
		if( o instanceof Date){
			return "date"
		}
		if( o instanceof Map){
			return "map"
		}
		if( o instanceof Set){
			return "set"
		}
		if( o instanceof WeakMap){
			return "weakmap"
		}
		if( o instanceof WeakSet){
			return "weakset"
		}
		if( o.next){ // this test is garbage
			return "iterator"
		}
		if( o instanceof Error){
			return "error"
		}
		if( o instanceof Proxy){
			return "proxy"
		}
		if( o instanceof Promise){
			return "promise"
		}
		if( o instanceof TypedArray){
			return "typedarray"
		}
		if( typeof Node!== "undefined"&& o instanceof Node){
			return "node"
		}
	}
	constructor( obj, opts= defaults){
		this._obj= obj
		this._injectedScriptId= opts.injectedScriptId|| 1 // does this need to be per connection? is it genuinely used anywhere?
		this._overflowThreshold= 99
	}
	// see: https://github.com/ChromeDevTools/devtools-protocol/blob/38926f7f2cf1d2c4fb763b9729862434dd8004ea/json/js_protocol.json#L1794
	result(){
		obj= obj|| this._obj
		if( obj=== false|| obj=== true){
			return {
				result: {
					type: "boolean",
					value: obj
				}
			}
		}else if( obj=== undefined){
			return {
				result: {
					type: "undefined"
				}
			}
		}else if( obj=== null){
			return {
				result: {
					subtype: "null",
					type: "object",
					value: null
				}
			}
		}else if( obj instanceof Array){
			var
			  description= `Array(${obj.length})`,
			  overflow= obj.length> this._overflowThreshold,
			  properties= new Array( overflow? this._overflow: obj.length)
			for( var i= 0; i< preview.length; ++i){
				properties[ i]= this.preview( obj[ i])
			}
			return {
				result: {
					className: "Array",
					description,
					objectId: conn.objectId( obj),
					subtype: "array",
					type: "object",
					preview: {
						description,
						overflow,
						properties,
						subtype: "array",
						type: "object"
					}
				}
			}
		}else if( obj instanceof Object){
			var
			  className= obj[Symbol.toStringTag]|| obj.constructor.name,
			  overflow= false,
			  properties= new Array(),
			  subtype= RemoteObject.subtype( obj)
			return {
				result: {
					className,
					description: className,
					objectId: conn.objectId( obj)
					preview: {
						description,
						overflow,
						properties,
						subtype,
						type: "object"
					},
					subtype,
					type
				}
			}
		}else if( obj instanceof Function){
			return {
				result: {
					className: "Function",
					description: obj.toString(),
					objectId: conn.objectId( obj),
					type: "function"
				}
			}
		}

		var objType= typeof( obj)
		if( objType=== "string"){
			return {
				result: {
					type: "string",
					value: obj
				}
			}
		}else if( objType=== "number"{
			return {
				result: {
					description: obj.toString(),
					type: "number",
					value: obj
				}
			}
		}else if( objType=== "symbol"{
			return {
				result: {
					description: obj.toString(),
					objectId: conn.objectId( obj)
					type: "symbol"
				}
			}
		}
	}
	preview(){
	}
	properties(){
	}
}
export default RemoteObject
