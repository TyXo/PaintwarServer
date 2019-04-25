const availableColors = ["red", "green", "blue", "purple", "brown", "yellow"];
nConnections = 0;
function onClientConnect(id, reply, broadcast) {}

function onClientDisconnect(id, broadcast) {
  broadcast({ type: "disconnected", id });
  nConnections -= 1;
}

function onClientMessage(id, message, reply, broadcast) {
  if (message.type === "connect") {
    if (availableColors.length === 0) {
      return;
    }
    nConnections++;
    reply({
      type: "connected",
      id,
      color: availableColors.pop(),
      nConnections
    });
  } else if (message.type === "broadcast") {
    broadcast({
      type: "synchronize",
      game: message.game
    });
  }
}

module.exports = {
  onClientConnect,
  onClientDisconnect,
  onClientMessage
};
