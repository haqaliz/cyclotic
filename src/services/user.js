const auth = require('firebase/auth');
const firestore = require('firebase/firestore');
const { firebase } = require('../config');

const {
  updateEmail,
  updatePassword,
} = auth;

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

const updateUserEmail = async (context) => {
  await updateEmail(firebase.auth.currentUser, context.email);
};

const getUserMetadata = async (context) => {
  const q = query(
    collection(
      firebase.db,
      'users_metadata',
    ),
    where('user_id', '==', context?.user_id),
    limit(1),
  );
  const snapshot = await getDocs(q);
  const metadata = snapshot.docs[0]
      && {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0]?.data(),
      };
  return metadata;
};

const upsertUserMetadata = async (context) => {
  let metadata = await getUserMetadata(context);
  let content;
  if (!metadata) {
    const ref = doc(collection(firebase.db, 'users_metadata'));
    content = {
      user_id: context?.user_id,
      email: context?.email,
      prefs: context?.prefs, 
      created_at: new Date(),
      updated_at: new Date(),
    };
    await setDoc(ref, content);
    return content;
  }
  const ref = doc(firebase.db, 'users_metadata', metadata?.id);
  content = {
    user_id: metadata?.user_id,
    email: context?.email ? context?.email : metadata?.email,
    prefs: {
      ...metadata?.prefs,
      ...context?.prefs,
    },
    created_at: metadata?.created_at,
    updated_at: new Date(),
  };
  await setDoc(ref, content);
  const uphRef = doc(firebase.db, 'users_preferences_history', metadata?.id);
  content = {
    user_id: metadata?.user_id,
    ...metadata?.prefs,
    ...context?.prefs,
    created_at: metadata?.created_at,
  };
  await setDoc(uphRef, content);
  return content;
};

const createPostForUser = async (context) => {
  const ref = doc(collection(firebase.db, 'posts'));
  await setDoc(ref, {
    ...context,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return ref;
};

const getPostsForUser = async (context) => {
  const criteria = [];
  if (context.user_id) {
    criteria.push(
      where('user_id', '==', context?.user_id),
    );
  }
  if (context.from && context.to) {
    criteria.push(
      where('created_at', '>=', context.from),
      where('created_at', '<=', context.to),
    );
  }
  if (context.query) {
    criteria.push(
      where('hashtags', 'array-contains', context.query),
    );
  }
  const q = query(
    collection(
      firebase.db,
      'posts',
    ),
    and(...criteria),
    limit(context.limit),
    orderBy('created_at', 'desc'),
  );
  const snapshot = await getDocs(q);
  let res = [];
  snapshot.forEach((i) => res.push({
    id: i.id,
    ...i.data(),
  }));
  return res;
};

const getTrendsForUser = async (context) => {
  const res = await getPostsForUser(context);
  const groupedRes = res.reduce((a, i) => {
    i.hashtags.forEach((hashtag) => {
      if (!(hashtag in a)) {
        a[hashtag] = 1;
        return;
      }
      a[hashtag] += 1;
    });
    return a;
  }, {});
  return Object.keys(groupedRes).map((i) => ({
    type: 'hashtag',
    value: i,
    count: groupedRes[i],
  }));
};

const deletePostForUser = async (context) => {
  const ref = doc(firebase.db, 'posts', context.post_id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return;
  const post = snapshot.data();
  if (post?.user_id !== context.user_id) return;
  await deleteDoc(ref);
  return ref;
};

module.exports = {
  updateUserEmail,
  getUserMetadata,
  upsertUserMetadata,
  createPostForUser,
  getPostsForUser,
  getTrendsForUser,
  deletePostForUser,
};
