const firestore = require('firebase/firestore');
const { firebase } = require('../config');
const flowIntensityPattern = require('./flow-intensity-pattern');
const insights = require('./insights');
const activities = require('./activities');
const dateFns = require('date-fns');

const { subDays } = dateFns;

const {
  collection,
  query,
  where,
  getDocs,
  and,
  getDoc,
  setDoc,
  limit,
  doc,
  deleteDoc,
} = firestore;

const createRecommendation = async (context) => {
  const ref = doc(collection(firebase.db, 'recommendations'));
  await setDoc(ref, context);
  return ref;
};

const getRecommendations = async (context) => {
  const criteria = [];
  const l = context?.limit > 100 ? 100 : context.limit;
  if (context?.type) {
    criteria.push(
      where('type', '==', context.type),
    );
  }
  const q = query(
    collection(
      firebase.db,
      'recommendations',
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

const updateRecommendation = async (context) => {
  const ref = doc(firebase.db, 'recommendations', context.recommendation_id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return;
  await setDoc(ref, {
    ...snapshot.data(),
    ...context,
  });
  return ref;
};

const deleteRecommendation = async (context) => {
  const ref = doc(firebase.db, 'recommendations', context.recommendation_id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return;
  await deleteDoc(ref);
  return ref;
};

const getMenstruationProductsRecommendations = async (context) => {
  const prefs = context?.metadata?.prefs;
  // menstruation products recommendations
  const menstruationProducts = [];
  if (prefs?.menstruation_products.tampon) menstruationProducts.push('tampon');
  if (prefs?.menstruation_products.cup) menstruationProducts.push('cup');
  if (prefs?.menstruation_products.pad) menstruationProducts.push('pad');
  const menstruationProductsBrands = Object.keys(prefs?.menstruation_products?.brands ?? {}).filter(
    (i) => prefs?.menstruation_products?.brands[i]
  );
  const queryChain = [
    collection(
      firebase.db,
      'recommendations',
    ),
  ];
  if (menstruationProductsBrands.length && menstruationProducts.length) {
    queryChain.push(and(
      where('brand', 'in', menstruationProductsBrands),
      where('type', 'in', menstruationProducts),
    ));
  }
  const q = query(...queryChain);
  const snapshot = await getDocs(q);
  let MP = [];
  snapshot.forEach((i) => MP.push({
    id: i.id,
    ...i.data(),
  }));
  return MP;
};

const getRecommendationsForUser = async (context) => {
  const to = new Date();
  const from = subDays(to, 30);
  const [
    flowIntensityOverMonth,
    menstruationProducts,
    hormoneHealthInsights,
    nutritionalGuidances,
    recommendedActivities,
  ] = await Promise.all([
    flowIntensityPattern.getFlowIntensityForUser({
      user_id: context?.uid,
      from,
      to,
    }),
    getMenstruationProductsRecommendations(context),
    insights.getInsights({
      type: 'hormone_health',
    }),
    insights.getInsights({
      type: 'nutritional_guidance',
    }),
    activities.getActivities({
      limit: 10,
    }),
  ]);
  const flowIntensity = flowIntensityOverMonth?.[0]?.flow_intensity ?? 0;
  const smartMenstruationProducts = menstruationProducts.filter((i) => {
    if (flowIntensity < 5.5) return i.type === 'pad';
    if (flowIntensity >= 5.5 && flowIntensity < 8) return i.type === 'tampon';
    // flowIntensity >= 8
    return i.type === 'cup';
  });
  return {
    menstruation_products: smartMenstruationProducts.length > 0 ? smartMenstruationProducts : menstruationProducts,
    hormone_health_insights: hormoneHealthInsights,
    nutritional_guidances: nutritionalGuidances,
    activities: recommendedActivities,
  };
};

module.exports = {
  createRecommendation,
  getRecommendations,
  updateRecommendation,
  deleteRecommendation,
  getMenstruationProductsRecommendations,
  getRecommendationsForUser,
};
