const utils = require('./utils');

module.exports = (payload) => `<!DOCTYPE html>
<html>
<head>
    <title>${payload?.title}</title>
    ${utils.styles}
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌟 Your Inquiry Submission 🌟</h1>
        </div>
        <div class="content">
            <p>Dear ${payload?.name},</p>
            <p class="strong">We're pleased to inform you that your recent inquiry has been successfully submitted. Our team will review it and respond as soon as possible.</p>
            <p>🌼 In the meantime, if you have any additional questions or need further assistance, please feel free to contact us at info@cyclo.dev. 🚀</p>
            <p>Thank you for choosing Cyclo. We're here to support you on your menstrual health journey. 🤝</p>
        </div>
        <div class="footer">
            <div class="logo">
                <!-- Company Logo -->
                <img src="https://cyclo.dev/img/misc/cyclo-logo.svg" alt="Company Logo">
                <strong>Cyclo</strong>
            </div>
            <p>Stay tuned for more updates from Cyclo! 🚀</p>
        </div>
    </div>
</body>
</html>`;