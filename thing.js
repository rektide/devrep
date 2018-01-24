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

export class Thing{
	constructor( thing, opts= defaults){
		this._thing= thing
		this._objectId= opts.objectId()
		this._injectedScriptId= opts.injectedScriptId|| 1
		this._overflow= 99
	}
	preview( thing){
	}
	result( thing){
		thing= thing|| this._thing
		if( thing=== false|| thing=== true){
			return {
				type: "boolean",
				value: thing
			}
		}else if( thing=== undefined){
			return {
				type: "undefined"
			}
		}else if( thing=== null){
			return {
				subtype: "null",
				type: "object",
				value: null
			}
		}

		var thingType= typeof( thing)
		if( thingType=== "string"){
			return {
				type: "string",
				value: thing
			}
		}else if( thingType=== "number"{
			return {
				description: thing.toString(),
				type: "number",
				value: thing
			}
		}else if( thing instanceof Array){
			var
			  description= `Array(${thing.length})`,
			  overflow= thing.length> this._overflow,
			  properties= new Array( overflow? this._overflow: thing.length)
			for( var i= 0; i< preview.length; ++i){
				properties[ i]= this.preview( thing[ i])
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
		}
		var stringTag= thing[ Symbol.toStringTag]
		if( stringTag){
			return {
			}
		}
	}
	
}
export default Thing
