const axios = require('axios');
const request = require('request');
const { fullDate } = require('../../utils/utility-functions');
const { SAFARICOM_CALLBACK_URL, SAFARICOM_ACCESS_TOKEN, PAYBIL_NO, TRANSACTION_TYPE, BUISINESS_SHORT_CODE, MPESA_PASSWORD, SAFARICOM_CLIENT_URL, PROD_PORT_URL, NODE_ENV } = require('../../config');

class MpesapaymentRepo {

  async mpesaAccessTokenRepo() {
    // access token
    let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    let auth = new Buffer.from("1Gkcej67f9MAeJu8HsKv70YNYtASe9UX:uDKXCjnAaR6utoC7").toString('base64');

    const AccessToken = request(
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
          console.log(JSON.parse(body).access_token);
          return JSON.parse(body).access_token
        }
      }
    )

    console.log(AccessToken.body);
    return AccessToken;

  }


  // Lipa na m-pesa
  async MpesaPaymentRepo(customerId, oredr_data, phoneNo, access_token) {

    // Get order cart items 
    const order = JSON.parse(oredr_data)

    const amount = order.items.map(item => {
      return item.product.price * item.unit
    })

    const password = new Buffer.from('174379' + 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919' + fullDate()).toString('base64');
    const callBackURL = `https://5579-41-90-186-130.ngrok.io/mpesa/callback/${customerId}/${oredr_data._id}`;
    console.log(PAYBIL_NO);

    const dataPayload = {
      json: {
        "BusinessShortCode": PAYBIL_NO,
        "Password": password,
        "Timestamp": fullDate(),
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount[0].toString(),
        "PartyA": phoneNo.toString(),
        "PartyB": PAYBIL_NO.toString(),
        "PhoneNumber": phoneNo.toString(),
        "CallBackURL": callBackURL,
        "AccountReference": "EcommerceCheckout",
        "TransactionDesc": "Ecommerce Checkout API Test Lipa Na M-Pesa"
      }
    };

    const headers = {
      'Authorization': 'Bearer' + access_token
    };

    const callRes = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', dataPayload, { headers })
      .then(res => res.data)
      .catch(error => error)

    const { requestId, errorCode, errorMessage } = callRes.response.data;

    // Check for error
    if(errorMessage) return callRes.response.data;


    // Check if response is okay
    if (ResponseDescription === "Success. Request accepted for processing" && CustomerMessage === "Success. Request accepted for processing") {

      const checkCallback = setTimeout(processCallback, 10000)

      const processCallback = async() => {

        const mpesaCallbackData = await axios.get(callBackURL);

        // Check M-Pesa Callback response
        if (ResultDesc === "The service request is processed successfully.") {

          clearTimeout(myInterval)

          // Return m-pesa callback data 
          return mpesaCallbackData.body.stkCallback;

        }

      }

      return {message:"TIME OUT: Sorry we are unable to process Mpesa checkout  try again"}

    }

    else return callRes.response.data;

    

  }

  async mpesaCallback(req) {

    try {

      const mpesaResults = await req.body.Body.stkCallback

      if (mpesaResults.ResultDesc === "The service request is processed successfully.") {

        return mpesaResults.ResultDesc

      }
      else {

        return mpesaResults

      }
    }
    catch (error) {
      return { message: 'Error: unable to  get call back url' + error }
    }

  }

  async mpesaSession() {
    try {

      let auth = "Bearer " + req.access_token
      const BusinessShortCode = "174379"
      const password = new Buffer.from('174379' + 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919' + fullDate()).toString('base64');
      const timestamp = fullDate()
      const CheckoutRequestID = mpesaResults

      const dataPayload = {
        json: {
          "BusinessShortCode": BUISINESS_SHORT_CODE,
          "Password": MPESA_PASSWORD,
          "Timestamp": fullDate(),
          "CheckoutRequestID": CheckoutRequestID
        }
      };

      const headers = {
        'Authorization': 'Bearer' + SAFARICOM_ACCESS_TOKEN
      };

      const callRes = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query', dataPayload, { headers })
        .then(res => res)
        .catch(error => error)

      return callRes

    } catch (error) {

    }
  }

  async generateMpesQr(amount) {

    try {

      const dataPayload = { title: 'Axios POST Request Example' };
      const headers = { 'Authorization': 'Bearer' + req.access_token };

      const callRes = await axios.post('https://api.safaricom.co.ke/mpesa/qrcode/v1/generate', dataPayload, { headers })
        .then(res => res)
        .catch(res => res)

      return callRes


    } catch (error) {

    }
  }

}
module.exports = MpesapaymentRepo;