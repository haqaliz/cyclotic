var jwt = require('jsonwebtoken');
const verifyToken = async (idToken) => {
    const r = await fetch(process.env.GSERVICE_SECURE_TOKEN_API).catch((e) => e.response);
    if (!r?.ok) throw new Error('secured tokens couldn\'t fetch');
    const GST = await r.json();
    try {
        for (const i in GST) {
            const secret = GST[i];
            return jwt.verify(idToken, secret);
        }
    } catch (e) {
        // invalid signature
    }
};

module.exports = {
    verifyToken,
};