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
  limit,
} = firestore;

const createMiscellaneous = async (context) => {
  const ref = doc(collection(firebase.db, 'miscellaneous'));
  await setDoc(ref, context);
  return ref;
};

const getMiscellaneousList = async (context) => {
  const criteria = [];
  const l = context?.limit > 100 ? 100 : context.limit;
  if (context?.key) {
    criteria.push(
      where('key', '==', context.key),
    );
  }
  const q = query(
    collection(
      firebase.db,
      'miscellaneous',
    ),
    and(
      ...criteria,
    ),
    limit(l),
  );
  const snapshot = await getDocs(q);
  let res = [];
  snapshot.forEach((i) => res.push({
    id: i.id,
    ...i.data(),
  }));
  return res;
};

const updateMiscellaneous = async (context) => {
  const ref = doc(firebase.db, 'miscellaneous', context.miscellaneous_id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return;
  await setDoc(ref, {
    ...snapshot.data(),
    ...context,
  });
  return ref;
};

const deleteMiscellaneous = async (context) => {
  const ref = doc(firebase.db, 'miscellaneous', context.miscellaneous_id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return;
  await deleteDoc(ref);
  return ref;
};

module.exports = {
  createMiscellaneous,
  updateMiscellaneous,
  deleteMiscellaneous,
  getMiscellaneousList,
};
