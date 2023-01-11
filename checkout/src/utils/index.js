const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const amqplib = require('amqplib');

const { APP_SECRET, EXCHANGE_NAME, CLOUDAMQP_URL, RPC_QUEUE_NAME } = require('../config');



let amqplibConnection = null;

//Utility functions
(module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
}),
  (module.exports.GeneratePassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
  });

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

(module.exports.GenerateSignature = async (payload) => {
  return await jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
}),
(module.exports.ValidateSignature = async (req) => {
    const signature = req.get("Authorization");

    if (signature) {
      const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
      req.user = payload;
      return true;
    }

    return false;
});

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};


module.exports.FormatReciept = (data) => {
  if (data) {

          const sales_data = {
                  message: "Sale successfull",
                  store: { storeName, address },
                  checkout: "auto",
                  date: "",
                  orderId: "",
                  user: [
                          { id: "" },
                          { name: "" }
                  ],
                  itemsNo: 00,
                  items: [],
                  shipping: [
                          {
                                  area: "",
                                  location: "",
                                  cost: ""
                          }
                  ],
                  coupon: {},
                  tax: [
                          { VAT: "" },
                          { CTL: "" },
                          { BEV_SC: "" }
                  ],
                  total: {}

          };
          return { data };
  } else {
          throw new Error("Data Not found!");
  }
};

//Message Broker
const getChannel = async () => {
  if (amqplibConnection === null) {
    amqplibConnection = await amqplib.connect(CLOUDAMQP_URL);
  }
  return await amqplibConnection.createChannel();
};

module.exports.CreateChannel = async () => {
  try {
    const channel = await getChannel();
    await channel.assertQueue(EXCHANGE_NAME, "direct", { durable: true });
    return channel;
  } catch (err) {
    throw err;
  }
};

module.exports.PublishMessage = (channel, service, msg) => {
  channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
  console.log("Sent: ", msg);
};

module.exports.RPCObserver = async (RPC_QUEUE_NAME, service) => {
  const channel = await getChannel();
  await channel.assertQueue(RPC_QUEUE_NAME, {
    durable: false,
  });
  channel.prefetch(1);
  channel.consume(
    RPC_QUEUE_NAME,
    async (msg) => {
      if (msg.content) {
        // DB Operation
        const payload = JSON.parse(msg.content.toString());
        const response = await service.serveRPCRequest(payload);
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(response)),
          {
            correlationId: msg.properties.correlationId,
          }
        );
        channel.ack(msg);
      }
    },
    {
      noAck: false,
    }
  );
};