const services = require('../services');
const dateFns = require('date-fns');
const { differenceInDays } = dateFns;

module.exports = async () => {
    const challenges = await services.user.getUsersActiveChallenges();
    for (const challenge of challenges) {
        const diff = differenceInDays(new Date(), new Date(challenge.created_at.seconds * 1000));
        if (diff <= 6) continue;
        await services.user.completeChallenge(challenge);
    }
};