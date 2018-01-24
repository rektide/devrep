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
	result( obj){
		obj= obj|| this._obj
		if( obj=== false|| obj=== true){
			return {
				type: "boolean",
				value: obj
			}
		}else if( obj=== undefined){
			return {
				type: "undefined"
			}
		}else if( obj=== null){
			return {
				subtype: "null",
				type: "object",
				value: null
			}
		}

		var objType= typeof( obj)
		if( objType=== "string"){
			return {
				type: "string",
				value: obj
			}
		}else if( objType=== "number"{
			return {
				description: obj.toString(),
				type: "number",
				value: obj
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
		}else if( obj instanceof Object){
			var
			  className= obj[Symbol.toStringTag]|| obj.constructor.name,
			  overflow= false,
			  properties= new Array(),
			  subtype= obj.then? "promise": "object"
			return {
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
		//var stringTag= obj[ Symbol.toStringTag]
		//if( stringTag){
		//}
	}
	
}
export default RemoteObject
