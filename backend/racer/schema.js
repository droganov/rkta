module.exports = {
  // Schemas use JSON-Schema format
  schemas: {
    todos: {
      properties: {
        todo: {
          type: "string",
          minLength: 1,
          maxLength: 10
        },
        isComplete: {
          type: "boolean"
        },
        isTest: {
          type: "boolean"
        },
      },
      required: [ "todo, isComplete", "isTest" ]
    },
  },
  // JSON-Schema formats can be added here. They should be sync
  formats: {},
  // Custom validators
  validators: {}
}
