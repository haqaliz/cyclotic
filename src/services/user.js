const auth = require('firebase/auth');
const firestore = require('firebase/firestore');
const { firebase } = require('../config');

const {
  getAuth,
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
  firebase.auth = getAuth(firebase.app);
  return firebase.auth.currentUser;
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
    return ref;
  }
  const ref = doc(firebase.db, 'users_metadata', metadata?.id);
  content = {
    user_id: metadata?.user_id,
    email: context?.email,
    prefs: {
      ...metadata?.prefs,
      ...context?.prefs,
    },
    created_at: metadata?.created_at,
    updated_at: new Date(),
  };
  await setDoc(ref, content);
  return content;
};

module.exports = {
  updateUserEmail,
  getUserMetadata,
  upsertUserMetadata,
};
