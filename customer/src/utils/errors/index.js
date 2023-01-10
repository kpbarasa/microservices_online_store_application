const Sentry = require("@sentry/node");
// or use es6 import statements.
// import * as Sentry from '@sentry/node';

const _ = require("@sentry/tracing");
const { NotFoundError, ValidationError, AuthorizeError } = require("./app-errors");
// Or use es6 import statements.
// import * as Tracing from '@sentry/tracing';

Sentry.init({
  dsn: "https://5abfbb44db7d47b38aab4d7fbc7f8a49@o4504478932598784.ingest.sentry.io/4504478936203264",

  // Set tracesSampleRate to 1.0 to capture 100%.
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

module.exports= (app) =>{
    
    // Catch all errors format and report to error logger.
    app.use((error, req, res, next) => {

        let reportError = true;
        console.log({error});

        // Skip common known errors.
        [NotFoundError, ValidationError, AuthorizeError].forEach(typeOfError => {

          if(error instanceof typeOfError) { // Check if error are service errors.

            reportError = false;

          }
          
        });

        if(reportError){
          Sentry.captureException(error)
        }

        const statusCode = error.statusCode || 500;
        const data = error.data || error.message;

        return res.status(statusCode).json(data);

    });

}