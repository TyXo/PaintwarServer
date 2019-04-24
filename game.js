const availableColors = ["red", "green", "blue", "purple", "brown", "yellow"];

function onClientConnect(id, reply, broadcast) {
  if (availableColors.length === 0) {
    return;
  }
  reply({
    type: "connected",
    id,
    color: availableColors.pop()
  });
}

function onClientDisconnect(id, broadcast) {
  broadcast({ type: "disconnected", id });
}

function onClientMessage(id, data, reply, broadcast) {
  broadcast({
    type: "synchronize",
    data
  });
}

module.exports = {
  onClientConnect,
  onClientDisconnect,
  onClientMessage
};
