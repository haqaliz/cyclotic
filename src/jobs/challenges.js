const services = require('../services');
const resources = require('../resources');
const templates = require('../templates');
const utils = require('../utils');
const globals = require('../globals');
const dateFns = require('date-fns');
const { differenceInDays } = dateFns;

module.exports = async () => {
    if (!globals.challenges) globals.challenges = await services.challenges.getActiveChallenges();
    const challenges = await services.user.getUsersActiveChallenges();
    for (const challenge of challenges) {
        const diff = differenceInDays(new Date(), new Date(challenge.created_at.seconds * 1000)) + 1;
        if (diff <= 6) continue;
        await services.user.completeChallenge(challenge);
        const chlng = globals.challenges.find((i) => i.id === challenge.challenge_id);
        const user = await services.user.getUserMetadata({
            user_id: challenge.user_id,
        });
        const to = user?.email;
        const subject = 'Cyclo Challenge Completion';
        const templateOptions = {
            title: subject,
            name: user?.first_name || to,
            challenge: chlng,
        };
        try {
            const r = await services.notifications.addNotification({
                type: 'challenge',
                user_id: challenge.user_id,
                email: to,
                reference_id: challenge?.id,
            });
            if (r) {
                await resources.mailer.send(
                    to,
                    subject,
                    templates.challenges(templateOptions),
                );
            }
        } catch (error) {
            console.log(error);
        }
    }
};