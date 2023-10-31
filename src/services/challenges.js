const firestore = require('firebase/firestore');
const { firebase } = require('../config');

const {
  collection,
  query,
  where,
  getDocs,
} = firestore;

const getActiveChallenges = async () => {
  const q = query(
    collection(
      firebase.db,
      'challenges',
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
  getActiveChallenges,
};
