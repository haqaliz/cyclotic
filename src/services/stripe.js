const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const globals = require('../globals');

const createPaymentMethod = async (card, customerId) => {
  const PM = await stripe.paymentMethods.create({
    type: 'card',
    card,
  });
  await stripe.paymentMethods.attach(
    PM.id,
    { customer: customerId }
  );
  return PM;
};

const getProducts = async () => {
  let r;
  r = await stripe.products.search({
    query: 'active:\'true\'',
  });
  if (!r.data.length) return;
  // Make sure we have a default price for the product
  const products = r.data.filter((i) => i.default_price);
  const prices = await Promise.all(products.map(
    (i) => stripe.prices.retrieve(i.default_price),
  ));
  // Map the price to the right product
  return products.map((i, k) => ({
    ...i,
    default_price: prices[k],
  }));
};

const getProduct = async (context) => {
  if (!globals.products) globals.products = await getProducts();
  if (context.product_id && context.price_id) {
    return globals.products.find(
      (i) => i.id === context.product_id && i.default_price.id === context.price_id
    );
  } else if (context.product_id && !context.price_id) {
    return globals.products.find(
      (i) => i.id === context.product_id
    );
  } else if (!context.product_id && context.price_id) {
    return globals.products.find(
      (i) => i.default_price.id === context.price_id
    );
  }
};

const subscribeForPlan = async (context) => {
  if (!getProduct(context)) return;
  let r;
  r = await stripe.customers.search({
    query: `email: \'${context.email}\'`,
  });
  let customer;
  // Check existence of customer
  if (!r.data.length) {
    customer = await stripe.customers.create({
      email: context.email,
    });
  } else {
    customer = r.data[0];
  }
  r = await stripe.paymentMethods.list({
    customer: customer.id,
    type: 'card',
  });
  let paymentMethod;
  // Check existence of customer payment method
  if (!r.data.length) {
    paymentMethod = await createPaymentMethod(context.card, customer.id);
  } else {
    const targetCardLast4 = context.card.number.match(/\d{4}$/)[0];
    const card = r.data.find((i) => (
      i.card.last4 === targetCardLast4
      && i.card.exp_month === context.card.exp_month
      && i.card.exp_year === context.card.exp_year
    ));
    // Check existence of payment method
    if (!card) {
      paymentMethod = await createPaymentMethod(context.card, customer.id);
    } else {
      paymentMethod = card;
    }
  }
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [
      { price: context.price_id },
    ],
  });
  return subscription;
};

module.exports = {
  createPaymentMethod,
  getProducts,
  getProduct,
  subscribeForPlan,
};
