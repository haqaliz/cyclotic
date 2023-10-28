require('dotenv').config();

const globals = require('./globals');
const resources = require('./resources');
const jobs = require('./jobs');
const routes = require('./routes');

(async () => {
    // jobs.init();
    routes.init();

    globals.products = await resources.stripe.getProducts();
})()