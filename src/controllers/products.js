const resources = require('../resources');
const globals = require('../globals');

const getProductsList = async (req, res) => {
  if (!globals.products) globals.products = await resources.stripe.getProducts();
  const r = globals.products.reduce((a, i) => {
    const [name, type] = i.name.split('_');
    if (!a[type]) a[type] = [];
    a[type].push({
      name,
      product_id: i?.id,
      price_id: i?.default_price?.id,
      price: i?.default_price?.unit_amount / 100,
      currency: i?.default_price?.currency,
      features: i?.metadata?.features.split(','),
    });
    return a;
  }, {});
  return res.send(r);
};

module.exports = {
  getProductsList,
};
