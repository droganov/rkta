var graphql = require('graphql');
var Util 		= require("./util");

module.exports = exports = Schema;

// общая форма для всех типов
var DocumentShape_m = new graphql.GraphQLObjectType({
	name: "DocumentShape_m",
	fields: {
		ctime: { type: graphql.GraphQLFloat },
		mtime: { type: graphql.GraphQLFloat }
	}
});

var  DocumentShape = {
	_id: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
	_type: { type: graphql.GraphQLString },
	_v: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
	_m: { type: DocumentShape_m },
	_o: { type: graphql.GraphQLString }
}

var DocumentShapeInput = Util.shallowClone(DocumentShape);
delete DocumentShapeInput._m;

DocumentShapeInput._m = new graphql.GraphQLInputObjectType({
	name: "DocumentShape_mInput",
	fields: {
		ctime: { type: graphql.GraphQLFloat },
		mtime: { type: graphql.GraphQLFloat }
	}
});

function Schema () {
  if (!(this instanceof Schema)) {
    return new Schema();
  }
	// зарегистрированные типы (расширенные драйвером)
	this.types = {};
	// поверхностные структуры типов
	this.surfaceStructureOfTypes = {};
	// шаблоны запросов на snapshot
	this.snapshotQueryTemplates = {};
	// списки полей в формате AST, для редактирования запросов
	this.ASTFields = {};
	// ключи запросов
	this.snapshotQueryKey = {};
	// зарегистрированные входные типы (расширенные драйвером)
	this.inputTypes = {};
	// зарегистрированные запросы
	this.queries = {};
	// мутации
	this.mutations = {};
	// готовая схема
	this.schema = false;
}

// методы для реализаии (аля виртуальные)
Schema.prototype.itemFn = function  (typeName, id) {
	console.log("Функция Schema.itemFn - не реализована");
	return null;
};
Schema.prototype.writeItemFn = function  (typeName, id) {
	console.log("Функция Schema.writeItemFn - не реализована");
	return false;
};
Schema.prototype.request = function(queryString, variables) {
	return graphql.graphql(this.graphQLschema, queryString, null, variables);
}

// регистрация данных
Schema.prototype.implementType = function (typeShape, typeShapeInput) {
	if(this.graphQLschema) throw("Schema.implementType - схема уже реализована.");

	// расширение выходного типа служебными полями (если их нет)
	for(var fieldName in DocumentShape) {
		if(typeof typeShape.fields[fieldName] == "undefined")
			typeShape.fields[fieldName] = DocumentShape[fieldName];
	}
	// создание выходного типа для выборки документов из базы
	var type = new graphql.GraphQLObjectType(typeShape);
	// сохранение выходных типов поименно
	this.types[type.name] = type;
	// поверхностная стурктура
	this.surfaceStructureOfTypes[type.name] = structureOfType(type);
	// шаблоны запросов на snapshot
	this.snapshotQueryTemplates[type.name] = templateQueryOfType(type);

	// создание входного типа для приема данных
	if(typeShapeInput) { // на основе пользовательской формы
		// расширение входного типа служебными полями (если их нет)
		for(var fieldName in DocumentShapeInput) {
			if(typeof typeShapeInput.fields[fieldName] == "undefined")
				typeShapeInput.fields[fieldName] = DocumentShapeInput[fieldName];
		}
		// имя входного типа перезаписываем на основе выходного типа
		typeShapeInput.name = Util.getInputTypeName(type.name);
		var typeInput = new graphql.GraphQLInputObjectType(typeShapeInput);
	} else { // создание формы входных данных автоматически
		var typeInput = Util.createInputObject(type);
	}
	// сохранение входных типов поименно
	this.inputTypes[typeInput.name] = typeInput;

	return type;
};
Schema.prototype.getCombinedQueryName = function(collectionName, queryName) {
	return collectionName + queryName;
}
Schema.prototype.registerQuery = function(collectionName, queryName, queryShape) {
	if(this.graphQLschema) throw("Schema.registerQuery - схема уже реализована.");
	if(typeof queryName !== "string") {
		for(var qn in queryName) {
			this.registerQuery(collectionName, qn, queryName[qn]);
		}
		return;
	}
	this.queries[this.getCombinedQueryName(collectionName, queryName)] = queryShape;
};

// сборка схемы
Schema.prototype.init = function() {
	if(this.graphQLschema) throw("Schema.init - схема уже реализована.");
	if(typeof this.itemFn !== "function") throw("Schema.init - не задана функция получения данных Schema.itemFn");
	if(!this.OpLog) throw("Schema.init - не подключен оплог, воспользуйтесь методом OpLog.connectTo");

	var self = this;

	// дополнительный тип пустого (удаленного документа)
	this.implementType({
		name: this.getEmptySnapshotTypeName(),
		fields: DocumentShape
	});

	// типы списком
	self.typesList = [];
	for(var typeName in self.types)
		self.typesList.push(self.types[typeName]);

	// определение запросов
	makeQueries(self);

	// определение мутаций
	makeMutations(self);

	// создаем форму схемы с зарегистрированными запросами
	var schemaShape = {
		query: new graphql.GraphQLObjectType({
			name: "Query",
			fields: this.queries
		})
	};

	// добавляем в форму схемы мутации, если были зарегистрированы
	if(Object.keys(this.mutations).length)
		schemaShape.mutation = new graphql.GraphQLObjectType({
			name: "Mutation",
			fields: this.mutations
		});

	// собственно схема
	this.graphQLschema = new graphql.GraphQLSchema(schemaShape);

	return this;
};

// предоставляемые данные
Schema.prototype.getEmptySnapshotTypeName = function() {
	return "emptySnapshot";
}
Schema.prototype.emptySnapshotFragment = function() {
	var emptySnapshotQuery = this.snapshotQueryTemplates[this.getEmptySnapshotTypeName()];
	return '... on ' + this.getEmptySnapshotTypeName() + emptySnapshotQuery;
}
Schema.prototype.getASTFields = function(typeName) {
	if(this.ASTFields[typeName]) return this.ASTFields[typeName];
	var typeSnapshotQuery = this.snapshotQueryTemplates[typeName];
	if(!typeSnapshotQuery) throw("Schema.prototype.getASTFields - неизвестный тип - "+ typeName);

	var typeQueryAST = graphql.parse('{item'+typeSnapshotQuery+'}');

	this.ASTFields[typeName] = typeQueryAST.definitions[0].selectionSet.selections[0].selectionSet.selections;

	return this.ASTFields[typeName];
}

// обработка запросов
Schema.prototype.getSnapshotQueryTemplate = function(typeName, fields) {
	try {
		var queryString =  this.snapshotQueryTemplates[typeName];
		if(!fields) return queryString;

		var parsedQuery = graphql.parse('{ item ' + queryString + '}');
		var selectionSet = parsedQuery.definitions[0].selectionSet.selections[0].selectionSet;

		var newselections = [];
		for(var i=0;i< selectionSet.selections.length;i++) {
			var field = selectionSet.selections[i];
			if(fields[field.name.value]) newselections.push(field);
		}
		selectionSet.selections = newselections;
		return graphql.print(selectionSet);
	} catch(e) {
		console.log("Schema.getSnapshotQueryTemplate ", e, typeName, fields);
	}
}
Schema.prototype.updateQueryString = function(typeName, queryString, fields) {
	try{
		var parsedQuery = parseQuery(queryString);
		var selection = parsedQuery.selection;

		// обновление имени запроса
		selection.name.value = this.getCombinedQueryName(typeName, selection.name.value);

		// детект основной запрос (список типа typeName) или экстра данные
		var isMain = false;
		var registeredQuery = this.queries[selection.name.value];
		if (registeredQuery && registeredQuery.type) {

			var nullableType = graphql.getNullableType(registeredQuery.type);
			var namedType = graphql.getNamedType(registeredQuery.type);

			isMain =
				nullableType &&
				namedType &&
			 	nullableType instanceof graphql.GraphQLList &&
				namedType.name === typeName;
		}

		// расширение пользовательского запроса служебными полями
		if(isMain) fillSelection(this, selection);
		filterSelection(this, selection, fields);

		// если указан альяс то данные из результата забираются по нему
		var nameAlias = selection.alias && selection.alias.value;

		return {
			isExtra: !isMain,
			name: nameAlias || selection.name.value,
			string: graphql.print(parsedQuery.query)
		};
	}catch(e) {
		console.log("Schema.updateQueryString ", e, typeName, queryString, fields);
		return false;
	}
}
Schema.prototype.updateQuerySelection = function(selectionString, fields) {
	try{
		var queryString = '{item'+selectionString+'}';
		var parsedQuery = parseQuery(queryString);

		fillSelection(this, parsedQuery.selection);
		filterSelection(this, parsedQuery.selection, fields);

		return graphql.print(parsedQuery.selection.selectionSet);

	}catch(e) {
		console.log("Schema.updateQuerySelection ", e, selectionString, fields);
		return false;
	}
}
function parseQuery (queryString) {
	var parsedQuery = graphql.parse(queryString);
	// выявляем определения запросов (query), все остальное отбрасываем
	var queries = parsedQuery.definitions.filter(function (d) { return d.operation == "query" });
	if(!queries.length) throw("Определение запроса не найдено.");
	// обрабатываем только первое определение
	var queryDef = queries[0];
	// вытаскиваем поля запросов и берем только первое (множественные запросы не поддерживаем)
	var selections = queryDef.selectionSet.selections.filter(function (s) {return s.kind == "Field"});
	if(!selections.length) throw("Поле запроса не найдено.");

	return {
		query: parsedQuery,
		selection: selections[0]
	}
}
function fillSelection (self, selection) {
	if(!selection.selectionSet) throw("Поля данных не найдены." );

	// приделываем служебные поля в пользоватльский запрос
	var emptySnapshotASTFields = self.getASTFields(self.getEmptySnapshotTypeName());
	for(var i=0;i<emptySnapshotASTFields.length;i++) {
		selection.selectionSet.selections.push(emptySnapshotASTFields[i]);
	}
}
function filterSelection (self, selection, fields) {
	if(!selection.selectionSet) throw("Поля данных не найдены." );

	// фильтруем поля
	if(fields) {
		var newselections = [];
		var attachedFields = {}; // учет уже вписаных полей
		for(var i=0;i<selection.selectionSet.selections.length;i++) {
			var field = selection.selectionSet.selections[i];
			if(fields[field.name.value]  && !attachedFields[field.name.value]) {
				newselections.push(field);
				attachedFields[field.name.value] = true;
			}
		}
		selection.selectionSet.selections = newselections;
	}
}

// служебные функции
function makeQueries (self) {
	for(var typeName in self.types) makeQueryItem(self, typeName);
}

function makeQueryItem(self, typeName) {
	if(typeName == self.getEmptySnapshotTypeName()) return;

	var queryKey = self.snapshotQueryKey[typeName] || "SnapshotItemQuery_"+typeName+"_"+Util.randomTail();

	self.snapshotQueryKey[typeName] = queryKey;

	if(!self.queries[queryKey]) {
		var type = self.types[typeName];
		var emptyType = self.types[self.getEmptySnapshotTypeName()];
		// сам запрос на snapshot
		self.queries[queryKey] = {
			type: new graphql.GraphQLUnionType({
				name: queryKey + "_union",
				types: [ type, emptyType ],
				resolveType: function (obj, info) {
					// опредление типа: удаленный документ или еще целый
					if(obj._type) return type;
					return emptyType;
				}
			}),
			args: {
				id: {
					type: new graphql.GraphQLNonNull(graphql.GraphQLID)
				}
			},
			resolve: function (params, args, info) {
				return self.itemFn(typeName, args.id);
			}
		}
	}
};

function makeMutations(self) {
	if(!self.writeSnapshotItemMutationKey) {
		self.writeSnapshotItemMutationKey = "SnapshotWriteItemMutation_" + Util.randomTail();
	}

	if(!self.mutations[self.writeSnapshotItemMutationKey]) {
		// мутация на запись snapshot-а
		var writeMutationShape = {
			type: graphql.GraphQLBoolean,
			args: {
				collectionName: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) }
			},
			resolve: function (params, args, info) {
				var names = Object.keys(args);
				// на входе должно быть только два аргумента, название коллекции и сам объект под ключем его входного типа
				if(names.length !== 2) throw("Wrong arguments.");
				var typeName = names.filter(function (name) { return name !== "collectionName" })[0];
				return self.writeItemFn(args.collectionName, args[typeName]);
			}
		}

		for(var typeName in self.inputTypes) {
			var inputType = self.inputTypes[typeName];
			writeMutationShape.args[typeName] = { type: inputType };
		}

		self.mutations[self.writeSnapshotItemMutationKey] = writeMutationShape;

	}
};

function structureOfType (type) {
	// список полей
	var fields = type.getFields();
	var result = {};

	for(var fieldName in fields) {
		result[fieldName] = true
	}

	return result;
}

function templateQueryOfType(type) {
	// сдираем обертки GraphQLNonNull и GraphQLList
	var namedType = graphql.getNamedType(type);

	// если тип конечный (скаляр) - то результат пустая строка
	if(graphql.isLeafType(type)) { return ""; }

	// вписываем поля
	var fields = namedType.getFields();
	var delimeter = "";
	var result = '{';

	for(var fieldName in fields) {
		// пропускаем поля джоинов
		if(typeof fields[fieldName].joinData !== "undefined") continue;
		result += delimeter + templateQueryField(fields[fieldName]);
		delimeter = ',';
	}

	result += '}';

	return result;
}

function templateQueryField(field) {
	var result = field.name;

	// вписываем аргументы
	if(field.args) {
		result += templateArgs(field.args);
	}

	result += templateQueryOfType(field.type);

	return result;
}

function templateArgs(args) {
	if(!args||!args.length) return "";

	// аргументы, которые не обязательные отбрасываем
	var nonNullableArgs = args.filter(function (arg) { return arg.type instanceof graphql.GraphQLNonNull })

	if(!nonNullableArgs.length) return "";

	var result = '(';
	var delimeter = "";

	for(var i=0;i<nonNullableArgs.length;i++) {
		var arg = nonNullableArgs[i];
		result += delimeter + arg.name + ":" + printArgTemplate( arg.defaultValue ? arg.defaultValue : templateObjectOfArg(arg) );
		delimeter = ",";
	}
	return result+')';
}

function printArgTemplate(value) {
	switch(typeof value) {
		case "undefined":
			return "undefined";
		case "string":
			return '"' + value.toString() + '"';
		case "object":
			if(value == null) return "null";

			if(Array.isArray(value)) return '['+printArgTemplate(value[0])+']';

			var result = "{";
			var delimeter = "";
			for(var fieldName in value) {
				result += delimeter + fieldName + ":" + printArgTemplate(value[fieldName]);
				delimeter = ",";
			}
			result += "}";
			return result;
	}
	return value.toString();
}

function templateObjectOfArg (arg) {

	var scalars = {
		String: "",
		Int: 0,
		Float: 0,
		Boolean: false,
		ID: ""
	};

	// убираем обертку GraphQLNonNull
	var nullableType = graphql.getNullableType(arg.type);

	// для скаляров сразу возвращаем значение
	if(typeof scalars[nullableType.name] !== "undefined") {
		return scalars[nullableType.name];
	}

	// обработка списка (массива)
	if(nullableType instanceof graphql.GraphQLList) {
		return [templateObjectOfArg({
			type:nullableType.ofType
		})]
	}

	// обработка перечислений
	if(nullableType instanceof graphql.GraphQLEnumType) {
		return nullableType._values[0].value;
	}

	// объект с полями
	var result = {};
	var fields = nullableType.getFields();

	for(var fieldName in fields) {
		result[fieldName] = templateObjectOfArg(fields[fieldName]);
	}

	return result;
}
