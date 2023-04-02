import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { firebase } from '../config.js';

export const signup = async (email, password) => {
    const r = await createUserWithEmailAndPassword(
        firebase.auth,
        email,
        password,
    ).catch((e) => e);
    if (r?.code) return;
    return r.user;
};

export const login = async (email, password) => {
    const r = await signInWithEmailAndPassword(
        firebase.auth,
        email,password,
    ).catch((e) => e);
    if (r?.code) return;
    return r;
};

export const logout = async () => {
    const r = await signOut(
        firebase.auth,
    ).catch((e) => e);
    return !r?.code;
};

export default {
    signup,
    login,
    logout,
};