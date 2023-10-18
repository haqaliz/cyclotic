const firestore = require('firebase/firestore');
const { firebase } = require('../config');
const flowIntensityPattern = require('./flow-intensity-pattern');
const dateFns = require('date-fns');

const { subDays } = dateFns;

const {
  collection,
  query,
  where,
  getDocs,
  and
} = firestore;

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
  const q = query(
    collection(
      firebase.db,
      'recommendations',
    ),
    and(
      where('brand', 'in', menstruationProductsBrands),
      where('type', 'in', menstruationProducts),
    ),
  );
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
  const flowIntensityOverMonth = await flowIntensityPattern.getFlowIntensityForUser({
    user_id: context?.uid,
    from,
    to,
  });
  const flowIntensity = flowIntensityOverMonth?.[0]?.flow_intensity ?? 0;
  return {
    flowIntensity,
    menstruation_products: await getMenstruationProductsRecommendations(context),
  };
};

module.exports = {
  getRecommendationsForUser,
};
