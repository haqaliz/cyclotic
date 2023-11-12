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

const createInsight = async (context) => {
  const ref = doc(collection(firebase.db, 'insights'));
  await setDoc(ref, context);
  return ref;
};

const getInsights = async () => {
  const q = query(
    collection(
      firebase.db,
      'insights',
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

const updateInsight = async (context) => {
  const ref = doc(firebase.db, 'insights', context.insight_id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return;
  await setDoc(ref, {
    ...snapshot.data(),
    ...context,
  });
  return ref;
};

const deleteInsight = async (context) => {
  const ref = doc(firebase.db, 'insights', context.insight_id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return;
  await deleteDoc(ref);
  return ref;
};

module.exports = {
  createInsight,
  getInsights,
  updateInsight,
  deleteInsight,
};
