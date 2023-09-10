const app = require('firebase/app');
const auth = require('firebase/auth');
const firestore = require('firebase/firestore');

const { initializeApp } = app;
const { getAuth } = auth;
const  { getFirestore } = firestore;

const firebaseApp = initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
});
const firebaseAuth = getAuth(firebaseApp);
const firebaseStore = getFirestore(firebaseApp);
const firebase = {
    app: firebaseApp,
    auth: firebaseAuth,
    db: firebaseStore,
};

module.exports = {
    firebase,
};
