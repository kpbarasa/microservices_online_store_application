### online_shopping_store
Online Shopoping Store Nodejs Microservices RPC CI CD
* Storage: Amazon S3 Bucket
* Deployment: Docker, Amazon Elastic  BeanstalkMEssaging Rabbit MQ
* Error Handdling: Sentry 

##### Servicies
 1. CUSTOMER
*   -Register user
*   -Logg in 
*   -User Authentication
*   -View profile
*   -View Orders
*   -Shoping-Details
*   -Get Wishlist
*   -Get Shopping Cart

 2. PRODUCTS
*   -Create product
*   -Update product
*   -Update product
*   -Get products
*   -Get products by id
*   -Get products by Category

 3. SHOPPING
*   -User Authentication
*   -View profile
*   -View Orders
*   -Shoping-Details
*   -Wishlist
*   -Cart

 4. CHECKOUT

##### Packages
2. server (Node JS Server)
---
##### **Dependencies:**
   * express
   * nodemon (dev dependency)
   * amqplib
   * axios
   * bcrypt
   * cookie-parser
   * cors
   * dotenv
   * jsonwebtoken
   * mongoose
   * stripe
   * winston


##### **Git Ignore:**
###### 1.  /server/node_modules
###### 2.  .env./checkout/node_modules
###### 3.  ./checkout/.env
###### 4.  ./customer/node_modules
###### 5.  ./customer/.env
###### 6.  ./products/node_modules
###### 7.  ./products/.env
###### 8.  ./shopping/node_modules
###### 9.  ./shopping/.env
```

# Node env
NODE_ENV="DEVELOPMENT"
APP_SECRET =''

# Mongo DB
MONGODB_URI=''

# Port
PORT=''

# Message broker 
### Virtualhost
MESSAGE_BROKER_URL=''
CLOUDAMQP_URL=''

# Stripe
STRIPE_PRIVATE_KEY=''
CLIENT_URL=''

# Safaricom 
SAFARICOM_ACCESS_TOKEN='' 
SAFARICOM_CLIENT_URL=''
```
