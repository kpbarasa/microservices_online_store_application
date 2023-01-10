const { CustomerRepository } = require("../database");
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require('../utils');
const { NotFoundError, ValidationError } = require("../utils/errors/app-errors");


// All Business logic will be here
class CustomerService {
  constructor() {
    this.repository = new CustomerRepository();
  }

  async SignIn(userInputs) {
    const { email, password } = userInputs;

    const existingCustomer = await this.repository.FindCustomer({ email });

    if (!existingCustomer) throw new NotFoundError("user not found with provided email id!");

    if (existingCustomer) {
      const validPassword = await ValidatePassword(
        password,
        existingCustomer.password,
        existingCustomer.salt
      );
      if (!validPassword) throw new ValidationError("password does not match!");
  
      const token = await GenerateSignature({
        email: existingCustomer.email,
        _id: existingCustomer._id,
      });
  
      return { id: existingCustomer._id, token };
    }

    return FormateData(null);
  }

  async SignUp(userInputs) {
    const { email, password, phone } = userInputs;

    // create salt
    let salt = await GenerateSalt();

    let userPassword = await GeneratePassword(password, salt);

    const checkExistingCustomer = await this.repository.FindCustomer({ email });

    if (checkExistingCustomer) throw new NotFoundError("User Email address already exixsts !");

    const existingCustomer = await this.repository.CreateCustomer({
      email,
      password: userPassword,
      phone,
      salt,
    });

    const token = await GenerateSignature({
      email: email,
      _id: existingCustomer._id,
    });
    return FormateData({ id: existingCustomer._id, token });
  }

  async AddNewAddress(_id, userInputs) {

    const { street, postalCode, city, country } = userInputs;

    const addressResult = await this.repository.CreateAddress({
      _id,
      street,
      postalCode,
      city,
      country,
    });

    return addressResult;
  }

  async GetProfile(id) {
    
    return this.repository.FindCustomerById({ id });
    
  }

  async DeleteProfile(userId) {
    const data = await this.repository.DeleteCustomerById(userId);
    const payload = {
      event: "DELETE_PROFILE",
      data: { userId },
    };
    return { data, payload };
  }

}

module.exports = CustomerService;