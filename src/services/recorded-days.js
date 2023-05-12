const firestore = require('firebase/firestore');
const dateFns = require('date-fns');
const { firebase } = require('../config');

const {
  collection,
  query,
  where,
  and,
  getDocs,
  getDoc,
  getCountFromServer,
  doc,
  setDoc,
  deleteDoc,
} = firestore;
const { startOfToday, endOfToday } = dateFns;

const getRecordedDaysForUser = async (userId) => {
    const q = query(
      collection(
        firebase.db,
        'recorded_days',
      ),
      where('user_id', '==', userId),
    );
    const snapshot = await getDocs(q);
    let res = [];
    snapshot.forEach((i) => res.push(i.data()));
    return res;
};

const addRecordedDayForUser = async (context) => {
  const q = query(
    collection(
      firebase.db,
      'recorded_days',
    ),
    and(
      where('user_id', '==', context?.user_id),
      where('created_at', '>=', startOfToday()),
      where('created_at', '<=', endOfToday()),
    ),
  );
  const snapshot = await getCountFromServer(q);
  const snapshotLength = snapshot.data()?.count;
  if (snapshotLength) {
    // duplicate recorded per day
    return false;
  }
  const ref = doc(collection(firebase.db, 'recorded_days'));
  await setDoc(ref, {
    ...context,
    created_at: startOfToday(),
    updated_at: startOfToday(),
  });
  return ref;
};

const updateRecordedDayForUser = async (recordedDayId, context) => {
  const ref = doc(firebase.db, 'recorded_days', recordedDayId);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return;
  const recordedDay = snapshot.data();
  await setDoc(ref, {
    ...context,
    created_at: startOfToday(),
    updated_at: startOfToday(),
  });
  return ref;
};

const deleteRecordedDayForUser = async (context) => {
  const ref = doc(firebase.db, 'recorded_days', context.recorded_day_id);
  await deleteDoc(ref);
  return ref;
};

module.exports = {
  getRecordedDaysForUser,
  addRecordedDayForUser,
  updateRecordedDayForUser,
  deleteRecordedDayForUser,
};
