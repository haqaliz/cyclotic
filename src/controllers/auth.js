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
    return res.status(200).send({
        "token": r.user.accessToken,
    });
};

const logout = async (req, res) => {
    const r = await services.auth.logout(req.user);
    if (!r) return res.status(400).send("Couldn't logout");
    req.user = null;
    return res.sendStatus(200);
};

module.exports = {
    signup,
    login,
    logout,
};
