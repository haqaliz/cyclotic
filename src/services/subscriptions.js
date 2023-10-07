const firestore = require('firebase/firestore');
const { firebase } = require('../config');
const resources = require('../resources');

const {
  collection,
  query,
  where,
  and,
  getCountFromServer,
  doc,
  setDoc,
  getDocs,
} = firestore;

const getActiveSubscriptionForUser = async (context) => {
  const q = query(
    collection(
      firebase.db,
      'subscriptions',
    ),
    and(
      where('user_id', '==', context?.user_id),
      where('expired_at', '==', null),
    ),
  );
  const snapshot = await getDocs(q);
  let res = [];
  snapshot.forEach((i) => res.push({
    id: i.id,
    ...i.data(),
  }));
  if (!res.length) return;
  const subscription = res[0];
  const product = await resources.stripe.getProduct(subscription);
  return {
    ...subscription,
    key: product.name,
  };
};

const addSubscriptionForUser = async (context) => {
  const q = query(
    collection(
      firebase.db,
      'subscriptions',
    ),
    and(
      where('user_id', '==', context?.user_id),
      where('expired_at', '==', null),
    ),
  );
  const snapshot = await getCountFromServer(q);
  const snapshotLength = snapshot.data()?.count;
  if (snapshotLength) {
    // users can have only one active subscription
    return false;
  }
  const ref = doc(collection(firebase.db, 'subscriptions'));
  await setDoc(ref, {
    ...context,
    expired_at: null,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return ref;
};

const getActiveSubscriptions = async () => {
  const q = query(
    collection(
      firebase.db,
      'subscriptions',
    ),
    where('expired_at', '==', null),
  );
  const snapshot = await getDocs(q);
  let res = [];
  snapshot.forEach((i) => res.push({
    id: i.id,
    ...i.data(),
  }));
  return res;
};

module.exports = {
  getActiveSubscriptionForUser,
  addSubscriptionForUser,
  getActiveSubscriptions,
};
