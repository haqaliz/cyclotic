const auth = require('firebase/auth');
const { firebase } = require('../config');
const globals = require('../globals');

const {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} = auth;

const signup = async (email, password) => {
    const r = await createUserWithEmailAndPassword(
        firebase.auth,
        email,
        password,
    ).catch((e) => e);
    if (r?.code) return;
    return r.user;
};

const login = async (email, password) => {
    const r = await signInWithEmailAndPassword(
        firebase.auth,
        email,
        password,
    ).catch((e) => e);
    if (r?.code) return;
    globals.users[r.user.accessToken] = r.user;
    return r;
};

const logout = async (user) => {
    const r = await signOut(
        firebase.auth,
    ).catch((e) => e);
    if (r === undefined) {
        delete globals.users[user.accessToken];
        return true;
    }
    return r.code;
};

module.exports = {
    signup,
    login,
    logout,
};
