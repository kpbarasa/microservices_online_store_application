const { MpesapaymenRepo, StripePaymentRepo, SalesRepository } = require("../database/")
const { FormateData } = require("../utils");

// All Business logic will be here
class CheckoutService {

    constructor() {
        this.stripeRepository = new StripePaymentRepo();
        this.mpesaRepository = new MpesapaymenRepo();
        this.SalesRepository = new SalesRepository();
    }

    async mpesaAccessToken() {

        const token = await this.mpesaRepository.mpesaAccessTokenRepo()
        return token;

    }

    async paymentMpesa(user_id, items, amount, phoneNo) {

        const mpesaRepoData = await this.mpesaRepository.MpesaPaymentRepo(user_id, items, amount, phoneNo);
        return mpesaRepoData;

    }

    async paymentMpesaCallback(customer_id, order_id, req) {

        const mpesaRepoData = this.mpesaRepository.mpesaCallback(req);

        if (mpesaRepoData) {

            const { MerchantRequestID, CheckoutRequestID, CallbackMetadata } = Body.stkCallback;
            const { Item } = CallbackMetadata;

            const mpesaData = {
                paymentTPlatform: "M-PESA",
                transactionId: CheckoutRequestID,//transaction_id 
                paymentMethod: ["M-PESA"], //payment_type
                subTotal: Item[0].Value, // total_amount
                amount: [Item],//amount
                Sale_status: "PAID" //Sale_status
            }

            // Save sales here 
            const sale_data = await this.SalesRepository.saveSaleTransaction(customer_id, order_id, mpesaData); //SAVE SALES TRANSACTION

            // return sale_data;

            return mpesaRepoData;

        }

    }

    async paymentMpesaSession() {

        const mpesaRepoData = await this.mpesaRepository.mpesaSession();
        return mpesaRepoData;

    }

    async paymentGenerateQR(amount) {

        const mpesaRepoData = await this.mpesaRepository.generateMpesQr(amount);
        return mpesaRepoData;

    }

    // // STRIPE PAYMENT SERVICES
    async paymentStripe(user_id, order_data, shippingArea, shippingLocation, shippingCost) {

        const stripeRepoData = this.stripeRepository.StripeService(user_id, order_data, shippingArea, shippingLocation, shippingCost);
        return stripeRepoData;

    }

    async paymentStripeSuccess(customer_id, order_id) {

        const stripeData = await this.stripeRepository.StripeService_success();

        if (stripeData) {

            // Save sales here 
            const sale_data = await this.SalesRepository.saveSaleTransaction(customer_id, order_id, stripeData); //SAVE SALES TRANSACTION

            return sale_data;

        }

    }

    async paymentStripeCancle() {

        const stripeRepoData = this.stripeRepository.StripeService_cancle();

        if (stripeRepoData) {

            // Save sales here 
            if (mpesaRepoData) this.SalesTransactionrepository.saveSaleTransaction(customer_id, order_id, transaction_id, provider, amount, payment_type, Payment_info, items); //SAVE SALES TRANSACTION
            return stripeRepoData;

        }

    }

    // // RPC Response
    async serveRPCRequest(payload) {

        const { type, data } = payload;

        const { customerId, oredr_data, phoneNo, token } = data;

        switch (type) {
            case "CHECKOUT_STRIPE_RPC":
                return this.stripeRepository.StripeService(customerId, oredr_data);
            case "CHECKOUT_MPESA_RPC":
                return this.mpesaRepository.MpesaPaymentRepo(customerId, oredr_data, phoneNo, token);
            case "CHECKOUT_PAYPAL_RPC":
                return this.repository.PayPal(data);
            case "SALE_SAVE_RPC":
                return this.SalesRepository.saveSaleTransaction(data);
            case "SALE_CANCLE_RPC":
                return this.SalesRepository.cancleSaleTransaction(data);
            default:
                break;
        }
    }

}

module.exports = CheckoutService;