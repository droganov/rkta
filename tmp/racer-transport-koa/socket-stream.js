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

  this.on('error', function(error) {
    console.warn('BrowserChannel client message stream error', error);
    self._stopClient();
  });

  // The server ended the writable stream. Triggered by calling stream.end()
  // in agent.close()
  this.on("finish", function() {
    self._stopClient();
  });
}
util.inherits(ClientStream, Duplex);

ClientStream.prototype._read = function() {};

ClientStream.prototype._write = function(chunk, encoding, callback) {
  if(typeof this.client.readyState !== "undefined") {

    if ( this.client.readyState !== WebSocket.OPEN ) return callback();
    this.client.send(JSON.stringify(chunk), function(err){
      if (err) console.error("racer transport send:", err);
    });

  } else {
    
    if (this.client.state === 'closed') return callback();
    this.client.send(chunk);
    
  }
  callback();
};

ClientStream.prototype._stopClient = function() {
  var client = this.client;
  client.stop(function() {
    client.close();
  });
};
