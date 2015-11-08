supertest      = require "supertest"
app            = require "../lib/server"

agent          = supertest.agent app.listen()

# we don't aim to create a deep/comprehensive/expensive test
# checking response status against an url map is just fine
require("./test.http") agent
