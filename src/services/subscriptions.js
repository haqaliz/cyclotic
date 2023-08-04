const firestore = require('firebase/firestore');
const { firebase } = require('../config');

const {
  collection,
  query,
  where,
  and,
  getCountFromServer,
  doc,
  setDoc,
} = firestore;

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

module.exports = {
  addSubscriptionForUser,
};
