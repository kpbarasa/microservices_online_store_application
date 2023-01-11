const dotEnv  = require("dotenv");

// if (process.env.NODE_ENV !== 'prod') {
//     const configFile =  `./.env.${process.env.NODE_ENV}`;
//     dotEnv.config({ path:  configFile });
// } else {
//     dotEnv.config({ path: '.env' });
// }

dotEnv.config({ path: '.env' });

module.exports = {
    PORT: process.env.PORT,
    PORT_URL: process.env.PORT_URL,
    DB_URL: process.env.MONGODB_URI,
    APP_SECRET: process.env.APP_SECRET,
    COOKIE_SECRETE:process.env.COOKIE_SECRETE,

    // MESSAGE BROKER 
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
    CLOUDAMQP_URL: process.env.MESSAGE_BROKER_URL,
    EXCHANGE_NAME: 'ONLINE_SHOPPING',
    SHOPPING_BINDING_KEY: 'SHOPPING_SERVICE',
    CUSTOMER_BINDIG_KEY: 'CUSTOMER_SERVICE',

    // PAYPAL
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,

    // STRIPE
    STRIPE_PRIVATE_KEY: process.env.STRIPE_PRIVATE_KEY,

    //SAFARICOM
    SAFARICOM_CLIENT_URL:process.env.SAFARICOM_CLIENT_URL,  
    SAFARICOM_ACCESS_TOKEN: process.env.SAFARICOM_ACCESS_TOKEN,
    BUISINESS_SHORT_CODE: process.env.BUISINESS_SHORT_CODE,
    SAFARICOM_CALLBACK_URL:process.env.SAFARICOM_CALLBACK_URL,  
    MPESA_PASSWORD: process.env.MPESA_PASSWORD,
    PAYBIL_NO: process.env.PAYBIL_NO,
}
 