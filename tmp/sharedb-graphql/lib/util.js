var crypto 			= require("crypto"),
		mapValues 	= require("lodash/mapValues"),
		graphql 		= require("graphql");


module.exports = exports = {
	randomTail: function () {
		return crypto.randomBytes(4).toString("hex")
	},
	createInputObject: function (type, tailed) {
		return new graphql.GraphQLInputObjectType({
			name: exports.getInputTypeName(type.name)+(tailed?"__"+exports.randomTail():""),
			fields: mapValues( type.getFields(), exports.convertInputObjectField )
		});
	},
	convertInputObjectField: function (field) {
		var fieldType = field.type;
		var wrappers = [];

		while (fieldType.ofType) {
			wrappers.unshift(fieldType.constructor);
			fieldType = fieldType.ofType;
		}

		if (!(fieldType instanceof graphql.GraphQLInputObjectType ||
				fieldType instanceof graphql.GraphQLScalarType ||
				fieldType instanceof graphql.GraphQLEnumType)
		) {
			fieldType = exports.createInputObject(fieldType, true);
		}

		fieldType = wrappers.reduce(function(type, Wrapper)  {
			return new Wrapper(type);
		}, fieldType);

		return { type: fieldType };
	},
	getInputTypeName: function (typeName) {
		return typeName + "Input";
	},
	fieldsStructToQueryString: function (queryFields) {
		var queryString = "{";
		var delimeter = "";
		for(var fieldName in queryFields) {
			var field = queryFields[fieldName];
			if(typeof field == "object") {
				queryString += delimeter + fieldName +  exports.fieldsStructToQueryString(field);
				continue;
			}
			queryString += delimeter + fieldName;
			delimeter = ",";
		}
		queryString += "}";
		return queryString;
	},
	shallowClone: function (object) {
		var out = {};
		for (var key in object) {
			out[key] = object[key];
		}
		return out;
	},
	deepClone: function (obj) {
		var out = {};
		for (var key in obj) {
			out[key] = exports.isObject(obj[key])? exports.deepClone(obj[key]) : obj[key]
		}
		return out;
	},
	isObject: function (value) {
		return value !== null && typeof value === 'object' && !Array.isArray(value);
	}
}
