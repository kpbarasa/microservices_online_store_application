const { CkeckoutRepository, PaymentRepository } = require("../database");
const { FormateData } = require("../utils");

// All Business logic will be here
class checkoutService {

    constructor() {
        this.repository = new CkeckoutRepository();
        this.repositoryPayment = new PaymentRepository();
    }

    async CheckOut(customerId, orderId, paymentType) {

        const data = await this.repository.Checkout(customerId, orderId);

        // // Process Payment 
        // if(paymentType === "CARD_PAYMENT"){ // Stripe
        //     const processPayment = await this.repositoryPayment.Stripe(customerId, totalCost)
        // }

        // else if(paymentType === "LIPA_NA_MPESA_PAYMENT"){ // Mpesa
        //     const processPayment = await this.repositoryPayment.LipaNaMpesa(customerId, totalCost)
        // }


        return FormateData(data);
    }

    async CancleCheckOut(customerId, orderId) {

        const data = await this.repository.CancleCheckout(customerId, orderId);

        return FormateData(data);
    }

    async ReCheckOut(customerId, orderId) {

        const data = await this.repository.ReCheckout(customerId, orderId);

        return FormateData(data);
    }

    async SuspendCheckout(customerId, orderId) {

        const data = await this.repository.SuspendCheckout(customerId, orderId);

        return FormateData(data);
    }

    async SuccessCheckout(){
        
        // if(!test){
        //     const data = await this.repositoryPayment.StripeSuccess();
        //     return FormateData(data);
        // }
        
        // // else if(){
        // //     const data = await this.repositoryPayment.mpesaCallBack();
        // //     return FormateData(data);
        // // }

    }
    
    async SubscribeEvents(payload) {

        payload = JSON.parse(payload);

        const item = payload.data.data.product
        const { data } = payload;

        switch (data.event) {
            case 'CHECKOUT':
                this.CheckOut(customerId, orderId, paymentType);
                break;
            default:
                break;
        }

    }




}

module.exports = checkoutService;