### Online shopping store
Online Shopoping Store Nodejs Microservices RPC CI CD
* Storage: Amazon S3 Bucket
* Deployment: Docker, Amazon Elastic  BeanstalkMEssaging Rabbit MQ
* Error Handdling: Sentry 

### Servicies:
 #### 1. CUSTOMER
*   -Register user
*   -Logg in 
*   -User Authentication
*   -View profile
*   -View Orders
*   -Shoping-Details
*   -Get Wishlist
*   -Get Shopping Cart

 #### 2. PRODUCTS
*   -Create product
*   -Update product
*   -Update product
*   -Get products
*   -Get products by id
*   -Get products by Category

 #### 3. SHOPPING
*   -User Authentication
*   -View profile
*   -View Orders
*   -Shoping-Details
*   -Wishlist
*   -Cart

 4. CHECKOUT
---
### **Dependencies:**
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


### **Git Ignore:**
*   /server/node_modules
*   .env./checkout/node_modules
*   ./checkout/.env
*   ./customer/node_modules
*   ./customer/.env
*   ./products/node_modules
*   ./products/.env
*   ./shopping/node_modules
*   ./shopping/.env

### .env(Environment file)
```

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
