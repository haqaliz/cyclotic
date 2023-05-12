const app = require('firebase/app');
const auth = require('firebase/auth');
const firestore = require('firebase/firestore');

const { initializeApp } = app;
const { getAuth } = auth;
const  { getFirestore } = firestore;

const firebaseApp = initializeApp({
    apiKey: "AIzaSyBPNCOqaqgIHo85oeEEf4fOH9RBNjhDuMA",
    authDomain: "cyclotic-fc537.firebaseapp.com",
    projectId: "cyclotic-fc537",
    storageBucket: "cyclotic-fc537.appspot.com",
    messagingSenderId: "497525688527",
    appId: "1:497525688527:web:ae73e8ecd0bf9e3681cfba",
    measurementId: "G-B6VP1G8FHY"
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
