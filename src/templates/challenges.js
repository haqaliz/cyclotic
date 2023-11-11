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
            <h1>🎉 Congratulations! Challenge Completed 🏆</h1>
        </div>
        <div class="content">
            <p>Dear ${payload?.name},</p>
            <p>We're excited to announce that the challenge you participated in has reached its successful completion! Your dedication and engagement in this wellness journey are truly commendable. 👏</p>
            <p>During this challenge, you've taken significant strides towards a healthier lifestyle, and we hope it has been an enriching experience for you. 🌟</p>
            <p>Stay tuned for more engaging challenges, new rewards, and opportunities to continue your wellness journey with Cyclo! 🚀</p>
            <p>Keep up the fantastic work! 💪</p>
            <a href="https://cyclo.dev/challenges/${payload?.challenge?.id}" class="box" style="margin-top: 10px !important;">
              <div class="illustration">
                  <img
                      src="${payload?.challenge?.img}"
                      alt="${payload?.challenge?.type}"
                      width="300" height="200"
                  >
              </div>
              <div style="padding: 1rem;">
                <h2>${payload?.challenge?.type}</h2>
                <p>
                    ${payload?.challenge?.value}
                </p>
              </div>
            </a>
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