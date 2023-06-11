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
  orderBy,
  limit,
} = firestore;
const { startOfDay, endOfDay, differenceInDays } = dateFns;

const getRecordedDaysForUser = async (context) => {
    const q = query(
      collection(
        firebase.db,
        'recorded_days',
      ),
      and(
        where('user_id', '==', context?.user_id),
        where('created_at', '>=', context?.from),
        where('created_at', '<=', context?.to),
      ),
    );
    const snapshot = await getDocs(q);
    let res = [];
    snapshot.forEach((i) => res.push({
      id: i.id,
      ...i.data(),
    }));
    return res;
};

const getStartOfLastMenstrualCycleForUser = async (userId) => {
  const q = query(
    collection(
      firebase.db,
      'recorded_days',
    ),
    and(
      where('user_id', '==', userId),
      where('is_start', '==', true),
    ),
    orderBy('created_at', 'desc'),
    limit(1),
  );
  const snapshot = await getDocs(q);
  if (!snapshot.docs.length) return;
  return {
    id: snapshot.docs[0].id, 
    ...snapshot.docs[0].data(),
  };
};

const addRecordedDayForUser = async (context) => {
  const q = query(
    collection(
      firebase.db,
      'recorded_days',
    ),
    and(
      where('user_id', '==', context?.user_id),
      where('created_at', '>=', startOfDay(context?.created_at)),
      where('created_at', '<=', endOfDay(context?.created_at)),
    ),
  );
  const snapshot = await getCountFromServer(q);
  const snapshotLength = snapshot.data()?.count;
  if (snapshotLength) {
    // duplicate recorded per day
    return false;
  }
  // MC stand for Menstrual Cycle
  const startOfMC = await getStartOfLastMenstrualCycleForUser(context?.user_id);
  // Minimum MC days
  const MMD = 20;
  const MCStarted = !startOfMC
    || differenceInDays(context?.created_at, startOfMC?.created_at) < MMD;
  const ref = doc(collection(firebase.db, 'recorded_days'));
  await setDoc(ref, {
    ...context,
    ...MCStarted && {
      is_start: true,
    },
    updated_at: context.created_at,
  });
  return ref;
};

const updateRecordedDayForUser = async (recordedDayId, context) => {
  const ref = doc(firebase.db, 'recorded_days', recordedDayId);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return;
  const recordedDay = snapshot.data();
  await setDoc(ref, {
    ...recordedDay,
    ...context,
    updated_at: new Date(),
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
  getStartOfLastMenstrualCycleForUser,
};
