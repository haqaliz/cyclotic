const services = require('../services');
const dateFns = require('date-fns');
const { subDays, isLastDayOfMonth } = dateFns;

module.exports = async () => {
    const to = new Date();
    const from = subDays(to, 30);
    if (!isLastDayOfMonth(to)) return;
    const bloodAmounts = await services.recordedDays.getBloodAmountForAllUsers(from, to);
    for (const userId in bloodAmounts) {
        const userMonthlyFlowIntensity = bloodAmounts[userId].reduce((a, i) => {
            const bleedingTypeCoeff = i.bleeding_type === 'watery flow'
                ? 4.357
                : 1;
            const bloodColorCoeff = i.blood_color === 'bright red'
                ? 8.632
                : 1;
            a += (i.bleeding_amount * bleedingTypeCoeff * bloodColorCoeff);
            return a;
        }, 0) / bloodAmounts[userId]?.length;
        await services.flowIntensityPattern.addFlowIntensityForUser({
            user_id: userId,
            flow_intensity: userMonthlyFlowIntensity,
        });
    }
};