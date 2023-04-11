import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";

export const getRef = async (ref) => {
  const doc = await getDoc(ref);
  if (!doc?.data()) return;
  return doc.data();
};

export const getRefs = (refs) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(refs)) {
      reject(new Error('refs parameter must be an array.'));
    }
    let r = [];
    refs.forEach(async (ref, k) => {
      const doc = await getDoc(ref);
      r[k] = doc?.data() ?? null;
      if (refs.length - 1 === k) {
        resolve(r);
      }
    });
  });
};

export default {
  getRef,
  getRefs,
};
