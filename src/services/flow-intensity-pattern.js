const firestore = require('firebase/firestore');
const dateFns = require('date-fns');
const { firebase } = require('../config');
const _ = require('lodash');

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
const { startOfMonth, endOfMonth } = dateFns;

const addFlowIntensityForUser = async (context) => {
  const q = query(
    collection(
      firebase.db,
      'flow_intensity_pattern',
    ),
    and(
      where('user_id', '==', context?.user_id),
      where('created_at', '>=', startOfMonth(new Date())),
      where('created_at', '<=', endOfMonth(new Date())),
    ),
  );
  const snapshot = await getCountFromServer(q);
  const snapshotLength = snapshot.data()?.count;
  if (snapshotLength) {
    // duplicate FIP per month
    return false;
  }
  const ref = doc(collection(firebase.db, 'flow_intensity_pattern'));
  await setDoc(ref, {
    ...context,
    created_at: new Date(),
  });
  return ref;
};

const getFlowIntensityForUser = async (context) => {
  const q = query(
    collection(
      firebase.db,
      'flow_intensity_pattern',
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

module.exports = {
  addFlowIntensityForUser,
  getFlowIntensityForUser,
};
