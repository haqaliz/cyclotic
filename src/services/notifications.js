const firestore = require('firebase/firestore');
const dateFns = require('date-fns');
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
const { startOfDay, endOfDay } = dateFns;

const addNotification = async (context) => {
  const q = query(
    collection(
      firebase.db,
      'notifications',
    ),
    and(
      where('user_id', '==', context?.user_id),
      where('type', '==', context?.type),
      where('created_at', '>=', startOfDay(new Date())),
      where('created_at', '<=', endOfDay(new Date())),
    ),
  );
  const snapshot = await getCountFromServer(q);
  const snapshotLength = snapshot.data()?.count;
  if (snapshotLength) {
    // duplicate notification per type and user for specific day
    return false;
  }
  const ref = doc(collection(firebase.db, 'notifications'));
  await setDoc(ref, {
    ...context,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return ref;
};

module.exports = {
  addNotification,
};
