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
	objectId: function(){
		return ++counter
	}
} 

export class RemoteObject{
	constructor( obj, opts= defaults){
		this._obj= obj
		this._objectId= opts.objectId()
		this._injectedScriptId= opts.injectedScriptId|| 1
		this._overflow= 99
	}
	preview( obj){
	}
	static get subtype( o){
		
	}
	// see: https://github.com/ChromeDevTools/devtools-protocol/blob/38926f7f2cf1d2c4fb763b9729862434dd8004ea/json/js_protocol.json#L1794
	result( obj){
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
			  overflow= obj.length> this._overflow,
			  properties= new Array( overflow? this._overflow: obj.length)
			for( var i= 0; i< preview.length; ++i){
				properties[ i]= this.preview( obj[ i])
			}
			return {
				result: {
					className: "Array",
					description,
					objectId: this._objectId,
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
			  subtype= obj.then? "promise": "object"
			return {
				result: {
					className,
					descriptioni: className,
					objectId: this._objectId,
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
				internalProperties: [],
				result: {
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
					objectId: this._objectId,
					type: "symbol"
				}
			}
		}
	}
	
}
export default RemoteObject
