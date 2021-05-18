let counter = 0;

// auto increment the counter for a new message id
function generateId() {
  return counter++;
}

export function makeMessage(type, data) {
  return {
    "message-id": generateId(),
    "request-type": type,
    ...data
  }
}

class OBSConnection {
  address = "";
  password = "";
  connection = undefined;

  constructor(address, password) {
    this.address = address;
    this.password = password;
  }

  async connect() {
    this.connection = new WebSocket(`ws://${this.address}`);
  }

  async disconnect() {
    this.connection.close(1000, "Disconnected");
  }

  async send(requestType, args = {}) {
    return new Promise((resolve, reject) => {

    });
  }
}