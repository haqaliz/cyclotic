const firestore = require('firebase/firestore');
const { firebase } = require('../config');
const _ = require('lodash');
const { differenceInDays } = require('date-fns');

const {
  collection,
  query,
  where,
  and,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  orderBy,
  limit,
  startAfter,
} = firestore;

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
      first_name: context?.first_name,
      last_name: context?.last_name,
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
    first_name: context?.first_name ? context?.first_name : metadata?.first_name,
    last_name: context?.last_name ? context?.last_name : metadata?.last_name,
    prefs: {
      ...metadata?.prefs,
      ...context?.prefs,
    },
    created_at: metadata?.created_at,
    updated_at: new Date(),
  };
  await setDoc(ref, content);
  const uphRef = doc(collection(firebase.db, 'users_preferences_history'));
  let uphContent = {
    user_id: metadata?.user_id,
    ...metadata?.prefs,
    ...context?.prefs,
    created_at: metadata?.created_at,
  };
  await setDoc(uphRef, uphContent);
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
  if (context.parent_id) {
    criteria.push(
      where('parent_id', '==', context.parent_id),
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

const getTrendsForUser = async (context) => {
  const res = await getPostsForUser({
    ...context,
    limit: 1000, // latest 1000 posts
  });
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
  return _.orderBy(
    Object.keys(groupedRes).map((i) => ({
      type: 'hashtag',
      value: i,
      count: groupedRes[i],
    })),
    (i) => i.count,
    'desc',
  ).slice(0, context.limit);
};

const getPostForUser = async (context) => {
  const ref = doc(firebase.db, 'posts', context.post_id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return;
  const post = {
    id: snapshot.id,
    ...snapshot.data(),
  };
  if (context.comments) {
    const comments = await getPostsForUser({
      parent_id: post.id,
    });
    post.comments = comments;
  }
  if (!context?.depth && post.parent_id) {
    const parent = await getPostForUser({
      post_id: post.parent_id,
      depth: 1,
    });
    post.parent = parent;
  }
  return post;
};

const deletePostForUser = async (context) => {
  const post = await getPostForUser(context);
  if (!post || post?.user_id !== context.user_id) return;
  const ref = doc(firebase.db, 'posts', post.id);
  await deleteDoc(ref);
  return ref;
};

const likePostForUser = async (context) => {
  const post = await getPostForUser(context);
  if (!post) return;
  const ref = doc(firebase.db, 'posts', post?.id);
  if (!post.likes) post.likes = {};
  if (context.user_id in post.likes) {
    delete post.likes[context.user_id];
  } else {
    post.likes[context.user_id] = new Date();
  }
  content = {
    ...post,
    likes: post.likes,
  };
  await setDoc(ref, content);
  return ref;
};

const getUsersActiveChallenges = async (context) => {
  const q = query(
    collection(
      firebase.db,
      'users_challenges',
    ),
    where('completed', '==', false),
  );
  const snapshot = await getDocs(q);
  let res = [];
  snapshot.forEach((i) => res.push({
    id: i.id,
    ...i.data(),
  }));
  return res;
};

const completeChallenge = async (context) => {
  const ref = doc(firebase.db, 'users_challenges', context?.id);
  await setDoc(ref, {
    ...context,
    completed: true,
  });
  return ref;
};

const getUserActiveChallenges = async (context) => {
  const q = query(
    collection(
      firebase.db,
      'users_challenges',
    ),
    and(
      where('user_id', '==', context?.user_id),
      where('completed', '==', false),
    ),
  );
  const snapshot = await getDocs(q);
  let res = [];
  snapshot.forEach((i) => res.push({
    id: i.id,
    ...i.data(),
  }));
  return res;
};

const getUserCompletedChallenges = async (context) => {
  const q = query(
    collection(
      firebase.db,
      'users_challenges',
    ),
    and(
      where('user_id', '==', context?.user_id),
      where('completed', '==', true),
    ),
  );
  const snapshot = await getDocs(q);
  let res = [];
  snapshot.forEach((i) => res.push({
    id: i.id,
    ...i.data(),
  }));
  return res;
};

const getUserActiveChallenge = async (context) => {
  const q = query(
    collection(
      firebase.db,
      'users_challenges',
    ),
    and(
      where('user_id', '==', context?.user_id),
      where('challenge_id', '==', context?.challenge_id),
      where('completed', '==', false),
    ),
    limit(1),
  );
  const snapshot = await getDocs(q);
  const challenge = snapshot.docs[0]
      && {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0]?.data(),
      };
  return challenge;
};

const createUserChallenge = async (context) => {
  let challenge = await getUserActiveChallenge(context);
  let content;
  if (!challenge) {
    const ref = doc(collection(firebase.db, 'users_challenges'));
    content = {
      user_id: context?.user_id,
      challenge_id: context?.challenge_id,
      created_at: new Date(),
      updated_at: new Date(),
      completed: false,
    };
    await setDoc(ref, content);
    return {
      id: ref.id,
      ...content,
    };
  }
  return challenge;
};

const deleteUserChallenge = async (context) => {
  const challenge = await getUserActiveChallenge(context);
  // we won't remove the challenges that has content
  if (challenge?.content?.length) return;
  const ref = doc(firebase.db, 'users_challenges', challenge.id);
  await deleteDoc(ref);
  return ref;
};

const updateUserChallenge = async (context) => {
  const userChallenge = await getUserActiveChallenge(context);
  if (!userChallenge) return;
  const ref = doc(firebase.db, 'users_challenges', userChallenge?.id);
  c = {
    user_id: userChallenge?.user_id,
    challenge_id: userChallenge?.challenge_id,
    completed: userChallenge?.completed,
    created_at: userChallenge?.created_at,
    updated_at: new Date(),
    content: userChallenge?.content,
  };
  const day = differenceInDays(new Date(), new Date(userChallenge.created_at.seconds * 1000));
  // Users can only submit or edit 7 days for each challenge
  if (day > 6) return;
  if (!c.content) c.content = {};
  c.content[day] = {
    value: context.content,
    created_at: new Date(),
  };
  await setDoc(ref, c);
  return c;
};

module.exports = {
  getUserMetadata,
  upsertUserMetadata,
  createPostForUser,
  getPostsForUser,
  getTrendsForUser,
  getPostForUser,
  deletePostForUser,
  likePostForUser,
  getUsersActiveChallenges,
  completeChallenge,
  getUserActiveChallenges,
  getUserCompletedChallenges,
  getUserActiveChallenge,
  createUserChallenge,
  deleteUserChallenge,
  updateUserChallenge,
};
