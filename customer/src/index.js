const express = require('express');
const { PORT } = require('./config');
const { databaseConnection } = require('./database');
const expressApp = require('./express-app');
const { CreateChannel } = require('./utils');
const errorHandler = require("./utils/errors");

const StartServer = async() => {

    const app = express();
    
    // DB Connection 
    await databaseConnection();

    // Create RPC Channel 
    const channel = await CreateChannel()
    

    // Create Expresse JS Server
    await expressApp(app, channel);
    
    // Handles all errors 
    errorHandler(app)

    app.listen(PORT, () => { // Startr sereve
        console.log(`Customer-Services: listening to port ${PORT}`);
    })
    .on('error', (err) => {
        console.log(err);
        process.exit();
    })
}

StartServer();