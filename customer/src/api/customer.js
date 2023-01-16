const CustomerService = require('../services/customer-service');
const { SubscribeMessage } = require('../utils/index');
const  UserAuth = require('./middlewares/auth');

module.exports = (app, channel) => {
    
    const service = new CustomerService();

    SubscribeMessage(channel, service)

    app.post('/signup', async (req,res,next) => {
        try {
            const { email, password, phone } = req.body;
            const { data } = await service.SignUp({ email, password, phone}); 
           return res.json(data);
            
        } catch (err) {
            next(err)
        }

    });

    app.post('/login',  async (req,res,next) => {
        
        try {
            
            const { email, password } = req.body;
    
            const  data  = await service.SignIn({ email, password});
    
            return res.json(data);

        } catch (err) {
            next(err)
        }

    });

    app.post('/address', UserAuth, async (req,res,next) => {
        
        try {
            
            const { _id } = req.user;
    
            const { street, postalCode, city,country } = req.body;
    
            const  data  = await service.AddNewAddress( _id ,{ street, postalCode, city,country});
    
            return res.json(data);

        } catch (err) {
            next(err)
        }


    });
     
    app.get('/profile', UserAuth ,async (req,res,next) => {

        try {
            const { _id } = req.user;
            const data  = await service.GetProfile({ _id });
            return res.json(data);
            
        } catch (err) {
            next(err)
        }
    });
     
    app.get('/shoping-details', UserAuth, async (req,res,next) => {
        
        try {
            const { _id } = req.user;
           const  data  = await service.GetShopingDetails(_id);
    
           return res.json(data);
            
        } catch (err) {
            next(err)
        }
    });

    // app.post('/checkout', UserAuth, async (req, res, next) => {

    //     const { _id } = req.user;
    //     const { txnNumber, orderId, paymentType } = req.body;
        

    //     try {


    //     } catch (err) {
    //         next(err)
    //     }

    // });
}