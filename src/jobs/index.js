const CronJob = require('cron').CronJob;
const globals = require('../globals');

const init = () => {
    globals.jobs.subscription = new CronJob('*/10 * * * * *', require('./subscription'), null, true);
    globals.jobs.notifications = new CronJob('*/60 * * * * *', require('./notifications'), null, true);
    globals.jobs.flow_intensity_pattern = new CronJob('*/10 * * * * *', require('./flow-intensity-pattern'), null, true);
};

module.exports = {
  init,
};
