const CronJob = require('cron').CronJob;
const globals = require('../globals');

const init = () => {
    globals.jobs.subscription = new CronJob('*/60 * * * * *', require('./subscription'), null, true);
    globals.jobs.notifications = new CronJob('*/60 * * * * *', require('./notifications'), null, true);
    globals.jobs.flow_intensity_pattern = new CronJob('*/60 * * * * *', require('./flow-intensity-pattern'), null, true);
    globals.jobs.challenges = new CronJob('*/10 * * * * *', require('./challenges'), null, true);
};

module.exports = {
  init,
};
