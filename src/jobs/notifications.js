const services = require('../services');
const resources = require('../resources');
const templates = require('../templates');
const utils = require('../utils');
const dateFns = require('date-fns');

const { format, addDays, differenceInDays } = dateFns;

const menstrualCycleLength = 7;
const gapBetweenMCandFW = 4; // gap between end of menstrual cycle and start of fertile window
const FertileWindowLength = 6;

module.exports = async () => {
    const MCs = await services.recordedDays.getStartOfLastMenstrualCycleForAllUser();
    const usersMetadata = await Promise.all(
        MCs.map((i) => services.user.getUserMetadata(i)),
    );
    for (const i in MCs) {
        const startRangeOfMC = new Date(MCs[i]?.created_at?.seconds * 1000);
        const startFertileWindow = addDays(startRangeOfMC, menstrualCycleLength + gapBetweenMCandFW);
        const diffSRMC = differenceInDays(new Date(), startRangeOfMC);
        const diffSFW = differenceInDays(new Date(), startFertileWindow);

        const notifs = usersMetadata[i]?.prefs?.notifications;

        // Fertile Window Notification
        if (
            notifs?.fertility_window
            && diffSFW <= FertileWindowLength
        ) {
            const to = usersMetadata[i]?.email;
            const subject = `${utils.ordinalSuffixOf(diffSFW)} day of your Fertility Window Has Begun!`;
            const templateOptions = {
                title: subject,
                name: to,
                day: diffSFW,
                ordinalDay: utils.ordinalSuffixOf(diffSFW),
                date: format(startFertileWindow, 'do MMM, yyyy'),
            };
            const r = await services.notifications.addNotification({
                type: 'fertility_window',
                user_id: MCs[i]?.user_id,
                email: to,
                reference_id: MCs[i]?.id,
                start_of_fertility_window: startFertileWindow,
                day: diffSFW,
            });
            if (r) {
                await resources.mailer.send(
                    to,
                    subject,
                    templates.fertilityWindow(templateOptions),
                );
            }
        }

        // PMS Symptoms
        if (
            notifs?.pms_symptoms
            && diffSRMC <= menstrualCycleLength
        ) {
            const to = usersMetadata[i]?.email;
            const subject = `${utils.ordinalSuffixOf(diffSRMC)} day of your menstrual cycle!`;
            const templateOptions = {
                title: subject,
                name: to,
                day: diffSRMC,
                ordinalDay: utils.ordinalSuffixOf(diffSRMC),
                date: format(startRangeOfMC, 'do MMM, yyyy'),
            };
            const r = await services.notifications.addNotification({
                type: 'pms_symptoms',
                user_id: MCs[i]?.user_id,
                email: to,
                reference_id: MCs[i]?.id,
                start_of_menstrual_cycle: startRangeOfMC,
                day: diffSRMC,
            });
            if (r) {
                await resources.mailer.send(
                    to,
                    subject,
                    templates.pmsSymptoms(templateOptions),
                );
            }
        }
    }
};