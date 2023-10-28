var jwt = require('jsonwebtoken');
const verifyToken = async (idToken) => {
    return jwt.verify(idToken, process.env.FIREBASE_TOKEN_SECRET);
};

module.exports = {
    verifyToken,
};