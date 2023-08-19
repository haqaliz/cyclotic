const services = require('../services');
const dateFns = require('date-fns');
const firestore = require('firebase/firestore');
const { firebase } = require('../config');

const subscriptionsService = services.subscriptions;
const stripeService = services.stripe;
const { differenceInMonths, differenceInYears } = dateFns;
const {
  getDoc,
  doc,
  setDoc,
} = firestore;

module.exports = async () => {
    const activeSubscriptions = await subscriptionsService.getActiveSubscriptions();
    for (const i of activeSubscriptions) {
        const createdAt = new Date(i.created_at?.seconds * 1000);
        const product = await stripeService.getProduct({
            product_id: i.product_id,
            price_id: i.price_id,
        });
        let isExpired = false;
        switch (product.default_price?.recurring?.interval) {
            case 'year':
                if (differenceInYears(new Date(), createdAt) > 0) isExpired = true;
                break;

            case 'month':
                if (differenceInMonths(new Date(), createdAt) > 0) isExpired = true;
                break;
            
            default:
                isExpired = false;
                break;
        }
        if (isExpired) {
            const ref = doc(firebase.db, 'subscriptions', i.id);
            const snapshot = await getDoc(ref);
            if (!snapshot.exists()) return;
            const subscription = snapshot.data();
            await setDoc(ref, {
                ...subscription,
                expired_at: new Date(),
                updated_at: new Date(),
            });
        }
    }
};