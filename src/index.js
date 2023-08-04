require('dotenv').config();

const globals = require('./globals');
const services = require('./services');
const routes = require('./routes');

(async () => {
    routes.init();

    globals.products = await services.stripe.getProducts();
})()