import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { firebase } from '../config.js';
import { firebase as firebaseUtils } from '../utils/index.js';
const { getRef, getRefs } = firebaseUtils;

export const getRecordedDaysForUser = async (userId) => {
    const user = doc(firebase.db, 'users', userId);
    const q = query(
      collection(
        firebase.db,
        'recorded_days',
      ),
      where('user_id', '==', user),
    );
    const snapshot = await getDocs(q);
    let res = [];
    snapshot.forEach(async (i) => {
      const doc = i.data();
      let r = {};
      if (doc?.pregnancy_test_id) {
        r.pregnancy_test = await getRef(doc.pregnancy_test_id);
      }
      if (doc?.user_id) {
        r.user = await getRef(doc.user_id);
      }
      if (doc?.bleeding_type) {
        r.bleeding_type = await getRef(doc.bleeding_type);
      }
      if (doc?.sex_situation_id) {
        r.sex_situation = await getRef(doc.sex_situation_id);
      }
      if (doc?.feelings?.length) {
        r.feelings = await getRefs(doc.feelings);
        r.feelings = await Promise.all(r.feelings.map(async (i) => {
          return {
            feeling: await getRef(i.feeling_id) ?? null,
            intensity: i.intensity,
          };
        }));
      }
      if (doc?.misc?.length) {
        r.misc = await getRefs(doc.misc);
        r.misc = await Promise.all(r.misc.map(async (i) => {
          return {
            misc: await getRef(i.misc_id) ?? null,
            intensity: i.intensity,
          };
        }));
      }
      if (doc?.symptoms?.length) {
        r.symptoms = await getRefs(doc.symptoms);
        r.symptoms = await Promise.all(r.symptoms.map(async (i) => {
          return {
            symptom: await getRef(i.symptom_id) ?? null,
            intensity: i.intensity,
          };
        }));
      }
      if (doc?.vaginal_discharge?.length) {
        r.vaginal_discharge = await getRefs(doc.vaginal_discharge);
        r.vaginal_discharge = await Promise.all(r.vaginal_discharge.map(async (i) => {
          return {
            vaginal_discharge: await getRef(i.vaginal_discharge_id) ?? null,
            intensity: i.intensity,
          };
        }));
      }
      r = {
        ...r,
        bleeding_amount: doc?.bleeding_amount,
        medications: doc?.medications,
      }

      console.log(JSON.stringify(r, null, 2))
      res.push(r);
    });
    return res;
};

export default {
  getRecordedDaysForUser,
};
