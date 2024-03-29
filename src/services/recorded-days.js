const firestore = require('firebase/firestore');
const dateFns = require('date-fns');
const { firebase } = require('../config');
const _ = require('lodash');

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
const { startOfDay, endOfDay, differenceInDays, addDays, subDays } = dateFns;

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
      'menstrual_cycles',
    ),
    where('user_id', '==', userId),
    orderBy('created_at', 'desc'),
    limit(1),
  );
  const mcSnapshot = await getDocs(q);
  if (!mcSnapshot.docs.length) return;
  const menstrualCycle = mcSnapshot.docs[0].data();
  const ref = doc(firebase.db, 'recorded_days', menstrualCycle?.recorded_day_id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return;
  const recordedDay = snapshot.data();
  return {
    id: snapshot.id, 
    ...recordedDay,
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
    || differenceInDays(context?.created_at, new Date(startOfMC?.created_at?.seconds * 1000)) > MMD;
  const ref = doc(collection(firebase.db, 'recorded_days'));
  await setDoc(ref, {
    ...context,
    ...MCStarted && {
      is_start: true,
    },
    updated_at: context.created_at,
  });
  if (MCStarted) {
    const mcRef = doc(collection(firebase.db, 'menstrual_cycles'));
    await setDoc(mcRef, {
      user_id: context?.user_id,
      recorded_day_id: ref.id,
      created_at: context?.created_at,
    });
  }
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

const getMenstrualCyclesForUser = async (context) => {
  const q = query(
    collection(
      firebase.db,
      'menstrual_cycles',
    ),
    and(
      where('user_id', '==', context?.user_id),
      where('created_at', '>=', context?.from),
      where('created_at', '<=', context?.to),
    ),
    orderBy('created_at', 'asc'),
  );
  const snapshot = await getDocs(q);
  let res = [];
  snapshot.forEach((i) => res.push(i.data()));
  let MCs = [];
  res.forEach((i, k) => {
    if (!k) return;
    const prev = res[k - 1];
    const startOfMC = addDays(new Date(prev?.created_at?.seconds * 1000), 7);
    const endOfMC = new Date(i?.created_at?.seconds * 1000);
    MCs.push({
      from: startOfMC.getTime() / 1000,
      to: endOfMC.getTime() / 1000,
      diff: differenceInDays(endOfMC, startOfMC),
    });
  });
  return MCs;
};

const getStartOfLastMenstrualCycleForAllUsers = async () => {
  const q = query(
    collection(
      firebase.db,
      'menstrual_cycles',
    ),
    where('created_at', '>=', subDays(new Date(), 30)),
    orderBy('created_at', 'desc'),
  );
  // we need to add limit to this query
  const snapshot = await getDocs(q);
  let res = [];
  snapshot.forEach((i) => res.push({
    id: i.id,
    ...i.data(),
  }));
  return res;
};

const getBloodAmountForAllUsers = async (startDate, endDate) => {
  const q = query(
    collection(
      firebase.db,
      'recorded_days',
    ),
    and(
      where('created_at', '>=', startDate),
      where('created_at', '<=', endDate),
      where('bleeding_amount', 'in', _.range(1, 10)),
    ),
    orderBy('created_at', 'asc'),
  );
  // we need to add limit to this query
  const snapshot = await getDocs(q);
  let res = [];
  snapshot.forEach((i) => res.push({
    id: i.id,
    ...i.data(),
  }));
  return res.reduce((a, i) => {
    if (!(i.user_id in a)) a[i.user_id] = [];
    a[i.user_id].push({
      bleeding_amount: i?.bleeding_amount,
      bleeding_type: i?.bleeding_type,
      blood_color: i?.blood_color,
      created_at: i.created_at,
    });
    return a;
  }, {});
};

module.exports = {
  getRecordedDaysForUser,
  addRecordedDayForUser,
  updateRecordedDayForUser,
  deleteRecordedDayForUser,
  getStartOfLastMenstrualCycleForUser,
  getMenstrualCyclesForUser,
  getStartOfLastMenstrualCycleForAllUsers,
  getBloodAmountForAllUsers,
};
