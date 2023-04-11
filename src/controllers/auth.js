import { auth as authService } from '../services/index.js';

export const signup = async (req, res) => {
    const r = await authService.signup(
        req.body.email,
        req.body.password,
    );
    if (!r) return res.sendStatus(400);
    return res.sendStatus(200);
};

export const login = async (req, res) => {
    const r = await authService.login(
        req.body.email,
        req.body.password,
    );
    if (!r) return res.status(404).send('User Not found');
    return res.sendStatus(200);
};

export const logout = async (req, res) => {
    const r = await authService.logout();
    if (!r) return res.status(400).send("Couldn't logout");
    return res.sendStatus(200);
};

export default {
    signup,
    login,
    logout,
};
