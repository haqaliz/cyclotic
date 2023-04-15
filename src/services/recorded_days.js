import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { firebase } from '../config.js';

export const getRecordedDaysForUser = async (userId) => {
    const q = query(
      collection(
        firebase.db,
        'recorded_days',
      ),
      where('user_id', '==', userId),
    );
    const snapshot = await getDocs(q);
    let res = [];
    snapshot.forEach((i) => res.push(i.data()));
    return res;
};

export const addRecordedDayForUser = async (context) => {
  // use context to store it in firestore
  return true;
};

export default {
  getRecordedDaysForUser,
  addRecordedDayForUser,
};
