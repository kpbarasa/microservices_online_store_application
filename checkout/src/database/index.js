// database related modules
module.exports = {
    databaseConnection: require('./connection'),
    SalesRepository: require('./repository/sales-repository'),
    MpesapaymenRepo: require('./repository/mpesa-payment-repository'),
    StripePaymentRepo: require('./repository/stripe-paynent-repository')
}