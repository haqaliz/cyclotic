const services = require('../services');

const signup = async (req, res) => {
    const r = await services.auth.signup(
        req.body.email,
        req.body.password,
    );
    if (!r) return res.sendStatus(400);
    return res.sendStatus(200);
};

const login = async (req, res) => {
    const r = await services.auth.login(
        req.body.email,
        req.body.password,
    );
    if (!r) return res.status(404).send('User Not found');
    return res.sendStatus(200);
};

const logout = async (req, res) => {
    const r = await services.auth.logout();
    if (!r) return res.status(400).send("Couldn't logout");
    return res.sendStatus(200);
};

module.exports = {
    signup,
    login,
    logout,
};
