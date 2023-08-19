const services = require('../services');
const globals = require('../globals');
const stripeService = services.stripe;

const getProductsList = async (req, res) => {
  if (!globals.products) globals.products = await stripeService.getProducts();
  const r = globals.products.reduce((a, i) => {
    const [name, type] = i.name.split('_');
    if (!a[type]) a[type] = [];
    a[type].push({
      name,
      product_id: i?.id,
      price_id: i?.default_price?.id,
      price: i?.default_price?.unit_amount / 100,
      currency: i?.default_price?.currency,
      color: i?.metadata?.color,
      features: i?.metadata?.features.split(','),
    });
    return a;
  }, {});
  return res.send(r);
};

module.exports = {
  getProductsList,
};
