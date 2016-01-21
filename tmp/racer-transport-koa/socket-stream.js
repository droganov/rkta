var Duplex = require("stream").Duplex;
var util = require("util");
var WebSocket = require("koa-websocket/node_modules/ws");

module.exports = createWebSocketStream;

function createWebSocketStream(client) {
  var stream = new ClientStream(client);

  client.on("message", function onMessage(data) {
    stream.push(data);
  });

  client.on("close", function() {
    stream.push(null);
  });
  return stream;
}

function ClientStream(client) {
  Duplex.call(this, {objectMode: true});

  this.client = client;

  var self = this;

  // The server ended the writable stream. Triggered by calling stream.end()
  // in agent.close()
  this.on("finish", function() {
    self._stopClient();
  });
}
util.inherits(ClientStream, Duplex);

ClientStream.prototype._read = function() {};

ClientStream.prototype._write = function(chunk, encoding, callback) {
  // Silently drop messages after the session is closed
  if ( this.client.readyState !== WebSocket.OPEN ) return callback();
  this.client.send(JSON.stringify(chunk), function(err){
    if (err) console.error("[racer-highway] send:", err);
  });
  callback();
};

ClientStream.prototype._stopClient = function() {
  var client = this.client;
  client.stop(function() {
    client.close();
  });
};
