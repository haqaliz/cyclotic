const firestore = require('firebase/firestore');
const { firebase } = require('../config');

const {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  and,
  orderBy,
  doc,
  setDoc,
  deleteDoc,
} = firestore;

const createActivity = async (context) => {
  const ref = doc(collection(firebase.db, 'activities'));
  await setDoc(ref, context);
  return ref;
};

const getActivities = async (context) => {
  const criteria = [];
  if (context?.type) {
    criteria.push(
      where('type', '==', context.type),
    );
  }
  const q = query(
    collection(
      firebase.db,
      'activities',
    ),
    and(
      ...criteria,
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

const updateActivity = async (context) => {
  const ref = doc(firebase.db, 'activities', context.activity_id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return;
  await setDoc(ref, {
    ...snapshot.data(),
    ...context,
  });
  return ref;
};

const deleteActivity = async (context) => {
  const ref = doc(firebase.db, 'activities', context.activity_id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return;
  await deleteDoc(ref);
  return ref;
};

module.exports = {
  createActivity,
  updateActivity,
  deleteActivity,
  getActivities,
};
