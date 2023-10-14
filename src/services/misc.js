const firestore = require('firebase/firestore');
const { firebase } = require('../config');

const {
  collection,
  doc,
  setDoc,
} = firestore;

const contact = async (context) => {
  const ref = doc(collection(firebase.db, 'support'));
  await setDoc(ref, {
    ...context,
    created_at: new Date(),
  });
  return ref;
};

module.exports = {
  contact,
};
