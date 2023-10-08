const CronJob = require('cron').CronJob;
const globals = require('../globals');

const init = () => {
    globals.jobs.subscription = new CronJob('*/10 * * * * *', require('./subscription'), null, true);
    globals.jobs.notifications = new CronJob('*/60 * * * * *', require('./notifications'), null, true);
};

module.exports = {
  init,
};
