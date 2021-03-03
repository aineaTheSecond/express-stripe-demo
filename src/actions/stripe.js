const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/* async function createSession() {
  const session = await stripe.checkout.sessions.create({
    payment_methods: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Sample Product",
            images: ["https://i.imgur.com/EHyR2nP.png"],
          },
          unit_amount: 2000,
          mode: "payment",
          success_url: `${process.env.API_URL}?success=true`,
        },
      },
    ],
  });

  return session;
} */

/* async const checkout = (product) =>{

} */

// create a new customer
async function createCustomer(email) {
  const customer = await stripe.customers.create({
    email,
  });
  console.log(customer);

  return customer;
}

// charge a customer
async function createCharge(charge) {
  const { amount, card, email } = charge;
  const {
    cardNumber,
    cardExpMonth,
    cardExpYear,
    cardCVC,
    country,
    postalCode,
  } = card;

  try {
    const cardToken = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: cardExpMonth,
        exp_year: cardExpYear,
        cvc: cardCVC,
        address_state: country,
        address_zip: postalCode,
      },
    });

    const charge = await stripe.charges.create({
      amount,
      currency: "usd",
      source: cardToken.id,
      receipt_email: email,
      description: `Stripe charge of amount ${amount} charged`,
    });

    if (charge.status === "succeeded") {
      return charge;
    } else {
      throw new Error();
    }
  } catch (error) {
    throw error;
  }
}

// add payment method to customer
async function addPayment(data) {
  try {
    const paymentMethod = await stripe.paymentMethods.attach(
      data.paymentMethodId,
      {
        customer: data.customerId,
      }
    );

    return paymentMethod;
  } catch (error) {
    throw error;
  }
}

// update the customer's payment method
async function updateCustomerPayment(data) {
  try {
    const updatedCustomer = await stripe.customers.update(data.customerId, {
      invoice_settings: {
        default_payment_method: data.paymentMethodId,
      },
    });

    return updatedCustomer;
  } catch (error) {
    throw error;
  }
}

// subscribe
async function createSubscription(data) {
  try {
    addPayment(data);
    updateCustomerPayment(data);

    const subscription = await stripe.subscriptions.create({
      customer: data.customerId,
    });

    return subscription;
  } catch (error) {}
}

// unsubscribe
async function unsubscribeUser(data) {
  try {
    const unsubscribed = await stripe.subscriptions.del(data.subscriptionId);

    return unsubscribed;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createCustomer,
  createCharge,
  createSubscription,
  unsubscribeUser,
};
