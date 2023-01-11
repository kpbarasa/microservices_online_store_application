const request = require('request');

module.exports = async (req,res,next) => {
    // access token
    let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    let auth = new Buffer.from("21s5JSYqmhxGKOE2ynMgr3eH3Nvnx3CB:78Pdya9dDGV5G7MN").toString('base64');

    request(
        {
            url: url,
            headers: {
                "Authorization": "Basic " + auth
            }
        },
        (error, response, body) => {
            if (error) {
                console.log(error)
            }
            else {
                // let resp = 
                req.access_token = JSON.parse(body).access_token
                next()
            }
        }
    )
}