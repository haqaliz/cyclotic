require('dotenv').config();

const globals = require('./globals');
const services = require('./services');
const jobs = require('./jobs');
const routes = require('./routes');

(async () => {
    jobs.init();
    routes.init();

    globals.products = await services.stripe.getProducts();
})()