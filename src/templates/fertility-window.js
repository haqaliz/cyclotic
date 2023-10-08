const utils = require('./utils');

module.exports = (payload) => {
    const intro = {
        1: `<p>🎉 We're thrilled to share some exciting news with you. Your fertility window for this cycle has officially started today, ${payload?.date}, and we have all the details you need. 📅</p>`,
        3: `<p>🎉 Today is the most significant day of your fertility window – ovulation day! Your fertility is at its peak, and it's an excellent time for conception if that's your goal. 🌟</p>
        <p>Here are some key reminders:</p>
        <ul>
            <li>💑 If you're trying to conceive, this is a prime opportunity!</li>
            <li>📊 Continue tracking your symptoms and experiences in the Cyclo app for the most accurate insights.</li>
            <li>🤗 Take care of yourself and enjoy this special phase of your cycle.</li>
        </ul>`,
    }[payload?.day] ?? `<p>📊 It's the ${payload?.ordinalDay} day of your fertility window, and we encourage you to continue tracking your symptoms and experiences in the Cyclo app. Your data helps us provide you with more accurate insights. 🌼</p>`;
    return `<!DOCTYPE html>
    <html>
    <head>
        <title>${payload?.title}</title>
        ${utils.styles}
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌟 Day ${payload?.day} of Your Fertility Window Has Begun! 🌟</h1>
            </div>
            <div class="content">
                <p>Dear ${payload?.name},</p>
                ${intro}
                <p class="strong">Your Trusted Menstrual Health Companion:</p>
                <p>🌼 Remember, knowledge empowers you! Cyclo is your faithful companion throughout your menstrual health journey. It provides not just information but also personalized insights and tips tailored to your unique needs. 🚀</p>
                <p>If you have any questions or need guidance on any aspect of your menstrual health, we're here to assist you. Please don't hesitate to reach out. 🤝</p>
                <p class="strong">Thank You for Choosing Cyclo:</p>
                <p>💖 We're deeply honored that you've chosen Cyclo as your menstrual health partner, ${payload?.name}. We're committed to supporting you every step of the way. 🌟</p>
                <p class="emphasize">P.S. Don't forget to diligently log any symptoms, changes, or experiences related to your fertility window in the Cyclo app. Your valuable data aids us in providing even more accurate insights in the future! 📊</p>
                <div class="illustration">
                    <!-- Hosted Illustration -->
                    <img
                        src="${utils.images.fertility_window}"
                        alt="Fertility Window Illustration"
                        width="300" height="200"
                    >
                </div>
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
};