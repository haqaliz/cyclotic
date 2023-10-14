const resources = require('../resources');
const services = require('../services');
const templates = require('../templates');

const contact = async (req, res) => {
    const r = await services.misc.contact({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
    });
    if (!r) return res.sendStatus(400);
    await resources.mailer.send(
        req.body.email,
        'Your Inquiry Submission',
        templates.support({
            title: 'Your Inquiry Submission - Cyclo',
            name: req.body.name,
        }),
    );
    return res.sendStatus(200);
};

module.exports = {
    contact,
};
