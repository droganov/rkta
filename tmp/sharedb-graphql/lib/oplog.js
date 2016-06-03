var graphql = require('graphql'),
		Schema  = require("./schema")
		Util    = require("./util");

module.exports = exports = OpLog;

function OpLog() {

  if (!(this instanceof OpLog)) {
    return new OpLog();
  }

  // форма выходных данных
	this.type = new graphql.GraphQLObjectType({
		name: this.typeName,
		fields: {
			_id: { type: graphql.GraphQLString },
			src: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
			seq: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
			v: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
			m: {
				type: new graphql.GraphQLNonNull(new graphql.GraphQLObjectType({
					name: "OperationType_m",
					fields: {
						ts: { type: graphql.GraphQLFloat },
						data: { type: graphql.GraphQLString },
						uId: { type: graphql.GraphQLString }
					}
				}))
			},
			d: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
			o: { type: graphql.GraphQLString },

			// операции create и op сохраняем как json строку, прямое описание слишком сложное
			create: { type: graphql.GraphQLString },
			op: { type: graphql.GraphQLString },

			del: { type: graphql.GraphQLBoolean }
		}
	});

	// форма входных данных
	this.inputType = Util.createInputObject(this.type);

	return this;
};

OpLog.prototype.typeName = "OperationType";

// реализация запроса на список записей в оплоге по параметрам typeName, id(_id snapshot)
// и необязательным from (с какой версии v тащить данные), сортировка {v:1}
OpLog.prototype.list = function (params, args, info) {
	console.log("Метод list класса OpLog не реализован!");
	return [];
};

// реализация запроса на запись в оплоге по параметрам typeName, src и seq,
// с максимальной версией v
OpLog.prototype.item = function (params, args, info) {
	console.log("Метод item класса OpLog не реализован!");
	return null;
};

// реализация записи в базу данных оплога (возвращает _id новой записи, строка)
OpLog.prototype.write = function () {
	console.log("Метод write класса OpLog не реализован!");
	return;
};

// реализация удаления записи оплога из базы (применяется для отката в случае когда запись snpashot прошла неудачно)
OpLog.prototype.remove = function () {
	console.log("Метод remove класса OpLog не реализован!");
	return;
};

OpLog.prototype.graphQLqueryList = function () {
	return {
		type: new graphql.GraphQLList(this.type),
		args: {
			typeName: {
				type: new graphql.GraphQLNonNull(graphql.GraphQLString)
			},
			id : {
				type: new graphql.GraphQLNonNull(graphql.GraphQLString)
			},
			from: {
				type: graphql.GraphQLInt
			}
		},
		resolve: this.list
	}
};

OpLog.prototype.graphQLqueryItem = function () {
	return {
		type: this.type,
		args: {
			typeName: {
				type: new graphql.GraphQLNonNull(graphql.GraphQLString)
			},
			src: {
				type: new graphql.GraphQLNonNull(graphql.GraphQLString)
			},
			seq : {
				type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
			}
		},
		resolve: this.item
	}
};

OpLog.prototype.graphQLWriteMutation = function () {
	return {
		type: new graphql.GraphQLNonNull(graphql.GraphQLString),
		args: {
			typeName: {
				type: new graphql.GraphQLNonNull(graphql.GraphQLString)
			},
			id: {
				type: new graphql.GraphQLNonNull(graphql.GraphQLString)
			},
			op: {
				type: new graphql.GraphQLNonNull(this.inputType)
			},
		},
		resolve: this.write
	}
}

OpLog.prototype.graphQLDeleteMutation = function () {
	return {
		type: graphql.GraphQLBoolean,
		args: {
			typeName: {
				type: new graphql.GraphQLNonNull(graphql.GraphQLString)
			},
			id: {
				type: new graphql.GraphQLNonNull(graphql.GraphQLString)
			}
		},
		resolve: this.remove
	}
}

OpLog.prototype.connectTo = function (schema) {
	if(!(schema instanceof Schema)) {
		throw("Неверный вызов метода connectTo класса OpLog - не указан экземпляр класса Schema");
	}

	// ключ для запроса на список (если не был определен пользовательский)
	if(!this.listQueryKey) {
		this.listQueryKey = "OpLogOperationQueryList_" + Util.randomTail();
	}
	// ключ для запроса на одну запись (если не был определен пользовательский)
	if(!this.itemQueryKey) {
		this.itemQueryKey = "OpLogOperationQueryItem_" + Util.randomTail();
	}

	// регистрация запросов (если не были определены пользовательские)
	if(!schema.queries[this.listQueryKey])
		schema.queries[this.listQueryKey] = this.graphQLqueryList();
	if(!schema.queries[this.itemQueryKey])
		schema.queries[this.itemQueryKey] = this.graphQLqueryItem();

	// ключ для мутации записи в базу (если не был определен пользовательский)
	if(!this.writeMutationKey) {
		this.writeMutationKey = "OpLogOperationMutationWrite_" + Util.randomTail();
	}
	// ключ для мутации удаления из базы (если не был определен пользовательский)
	if(!this.deleteMutationKey) {
		this.deleteMutationKey = "OpLogOperationMutationDelete_" + Util.randomTail();
	}

	// регистрация мутаций (если не были определены пользовательские)
	if(!schema.mutations[this.writeMutationKey])
		schema.mutations[this.writeMutationKey] = this.graphQLWriteMutation();
	if(!schema.mutations[this.deleteMutationKey])
		schema.mutations[this.deleteMutationKey] = this.graphQLDeleteMutation();

	// ссылка для использования
	schema.OpLog = this;
};