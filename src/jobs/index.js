const CronJob = require('cron').CronJob;
const globals = require('../globals');

const init = () => {
    globals.jobs.subscription = new CronJob('*/10 * * * * *', require('./subscription'), null, true);
};

module.exports = {
  init,
};
