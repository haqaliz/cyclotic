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
  startAfter,
  limit,
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

const getPostsForChallenge = async (context) => {
  const criteria = [];
  if (context.from && context.to) {
    criteria.push(
      where('created_at', '>=', context.from),
      where('created_at', '<=', context.to),
    );
  }
  if (context.parent_id) {
    criteria.push(
      where('parent_id', '==', context.parent_id),
      where('parent_type', '==', 'challenge'),
    );
  }
  const queryChain = [
    collection(
      firebase.db,
      'posts',
    ),
    and(...criteria),
    orderBy('created_at', 'desc'),
  ];
  if (context.start_after) {
    const sstartAfterSnapshot = await getDoc(doc(firebase.db, 'posts', context.start_after));
    queryChain.push(startAfter(sstartAfterSnapshot));
  }
  queryChain.push(limit(context.limit));
  const q = query(...queryChain);
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
  getPostsForChallenge,
};
