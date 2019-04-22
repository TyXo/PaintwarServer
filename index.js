const WebSocket = require("ws");
const game = require("./game");
const nanoid = require("nanoid");

function noop() { }

function log(action, ...params) {
  console.log(new Date(), action, ...params);
}

function healthMonitor() {
  for (let client of server.clients) {
    if (client.keepAlive === false) {
      client.terminate();
      clients.splice(i, 1);
    } else {
      client.keepAlive = false;
      client.ping(noop);
    }
  }
}

const server = new WebSocket.Server({
  port: process.env.PORT || 5000,
  clientTracking: true
});

server.on("connection", (client, request) => {
  const id = nanoid();

  client.remoteAddress =
    "x-forwarded-for" in request.headers
      ? request.headers["x-forwarded-for"].split(/\s*,\s*/)[0]
      : request.connection.remoteAddress;

  log("client connected", id, client.remoteAddress);

  const broadcast = payload => {
    const message = JSON.stringify(payload);
    for (let peer of server.clients) {
      if (peer !== client && peer.readyState === WebSocket.OPEN) {
        peer.send(message);
      }
    }
  };

  const reply = payload => {
    const message = JSON.stringify(payload);
    client.send(message);
  };

  game.onClientConnect(id, reply, broadcast);

  client.on("pong", () => {
    client.keepAlive = true;
  });

  client.on("close", (code, reason) => {
    log("client disconnected", id, client.remoteAddress, code, reason);
    game.onClientDisconnect(id, broadcast);
  });

  client.on("message", message => {
    const payload = JSON.parse(message);
    log(
      "message received",
      id,
      client.remoteAddress,
      `${message.length} bytes`
    );
    game.onClientMessage(id, payload, reply, broadcast);
  });
});
