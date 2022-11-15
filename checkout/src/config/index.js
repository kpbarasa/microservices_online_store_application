const dotEnv = require("dotenv");

// if (process.env.NODE_ENV !== 'prod') {
//     const configFile =  `./.env.${process.env.NODE_ENV}`;
//     dotEnv.config({ path:  configFile });
// } else {
//     dotEnv.config({ path: '.env' });
// }

dotEnv.config({ path: '.env' });

module.exports = {

    PORT: process.env.PORT,
    DB_URL: process.env.MONGODB_URI,
    APP_SECRET: process.env.APP_SECRET,
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
    CLOUDAMQP_URL: process.env.CLOUDAMQP_URL,

    STRIPE_PRIVATE_KEY: process.env.STRIPE_PRIVATE_KEY,
    CLIENT_URL: process.env.CLIENT_URL,

    SAFARICOM_ACCESS_TOKEN: process.env.SAFARICOM_ACCESS_TOKEN,
    SAFARICOM_CLIENT_URL: process.env.SAFARICOM_CLIENT_URL,

    EXCHANGE_NAME: 'ONLINE_CHECKOUT',
    CHECKOUT_BINDIG_KEY: 'CHECKOUT_SERVICE',
    CUSTOMER_BINDIG_KEY: 'CUSTOMER_SERVICE',
    QUEUE_NAME: "CHECKOUT_QUEUE"

}
