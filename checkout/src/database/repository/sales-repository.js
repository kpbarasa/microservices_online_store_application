const { SalesModel } = require('../models');
// const { APIError, BadRequestError, STATUS_CODES } = require('../../utils/app-errors');

class SalesRepository {

  async saveSaleTransaction(customer_id, order_id, transActionData) {

    const {transactionId, paymentMethod, paymentTPlatform, status, subTotal, amountTotal} = transActionData;

    try {

      const payLoad = {
        customer_id,
        order_id,
        provider:paymentTPlatform,
        transaction_id:transactionId,
        payment_type:paymentMethod[0],
        total_amount:subTotal,
        amount: [amountTotal],
        Sale_status: status
      }
      console.log(payLoad);

      const data = await SalesModel.create(payLoad);

      console.log(data);

      return data

    } catch (error) {

    }

  }

  async cancleSaleTransaction(customer_id, order_id, transaction_id, provider, amount, payment_type, Payment_info, items) {

    try {

      const CancledSaletransaction = {
        customer_id,
        order_id,
        transaction_id,
        provider,
        amount,
        payment_type,
        Payment_info,
        Sale_status: "cancled",
        items //array
      }

      await SalesModel.create(CancledSaletransaction)

      return { message: CancledSaletransaction }

    } catch (error) {

    }

  }

}

module.exports = SalesRepository;