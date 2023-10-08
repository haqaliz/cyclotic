const utils = require('./utils');

module.exports = (payload) => {
    const header = {
        1: '<h1>🌟 Day 1: Managing Menstrual Cramps and Fatigue 🌟</h1>',
        2: '<h1>🌟 Day 2: Beating Bloating After Your Period 🌟</h1>',
        3: '<h1>🌟 Day 3: Coping with Mood Swings and Breast Tenderness 🌟</h1>',
        4: '<h1>🌟 Day 4: Tackling Headaches in the Mid-Cycle Phase 🌟</h1>',
        5: '<h1>🌟 Day 5: Dealing with Increased Appetite and Hormonal Changes 🌟</h1>',
        6: '<h1>🌟 Day 6: Navigating Irritability, Anxiety, and Emotional Symptoms 🌟</h1>',
        7: '<h1>🌟 Day 6: Managing Depression, Acne, and Skin Issues 🌟</h1>',
    }[payload?.day];
    const intro = {
        1: `<p>🌼 It's the first day of your period, and we understand that menstrual cramps and fatigue can be challenging. We're here to provide support and tips to help you manage these symptoms. 🤗</p>
        <p>Here are some self-care suggestions:</p>
        <ul>
            <li>💆‍♀️ Apply a heating pad to ease cramps.</li>
            <li>💤 Get plenty of rest to combat fatigue.</li>
            <li>🍏 Maintain a balanced diet for overall well-being.</li>
        </ul>`,
        2: `<p>🌸 It's Day 2 of your cycle, you might be dealing with bloating or water retention. Don't worry; we've got some tips to help you beat the bloat! 💪</p>
        <p>Consider these strategies:</p>
        <ul>
            <li>🥦 Consume foods rich in potassium, like bananas, to reduce water retention.</li>
            <li>🥤 Stay hydrated to flush excess water from your body.</li>
            <li>🧘‍♀️ Gentle exercise like yoga can help alleviate bloating.</li>
        </ul>`,
        3: `<p>🌼 It's Day 3 of your cycle, and you might notice mood swings and breast tenderness. These are common PMS symptoms, and we're here to help you cope. 🤗</p>
        <p>Consider the following tips:</p>
        <ul>
            <li>😌 Practice relaxation techniques like deep breathing to manage mood swings.</li>
            <li>🌰 Wear a supportive bra to alleviate breast tenderness.</li>
            <li>💪 Engage in light exercises to boost your mood and reduce discomfort.</li>
        </ul>`,
        4: `<p>🌸 It's Day 4 of your cycle, and you might be dealing with headaches. These can be a common PMS symptom due to hormonal changes. Don't worry; we have some strategies to help you tackle them. 💪</p>
        <p>Try these headache-relief methods:</p>
        <ul>
            <li>💧 Stay hydrated to prevent dehydration, a common headache trigger.</li>
            <li>🍏 Maintain stable blood sugar levels by eating regular, balanced meals.</li>
            <li>🛌 Get enough rest and manage stress to reduce headache frequency.</li>
        </ul>`,
        5: `<p>🌼 Welcome to Day 5 of your cycle. During this late follicular phase, you might experience an increased appetite and hormonal changes. These are entirely normal, and we have some tips to help you manage them. 🤗</p>
        <p>Consider these suggestions:</p>
        <ul>
            <li>🥗 Opt for healthy snacks like fruits and nuts to satisfy your appetite.</li>
            <li>🥦 Focus on nutrient-rich foods to support your hormonal balance.</li>
            <li>🧘‍♀️ Engage in gentle exercises like yoga to boost your mood and energy.</li>
        </ul>`,
        6: `<p>🌸 It's Day 6, and as you approach the premenstrual phase, you might notice increased irritability, anxiety, and emotional symptoms. These are common PMS experiences, and we're here to help you navigate them. 💪</p>
        <p>Try these strategies for emotional well-being:</p>
        <ul>
            <li>😌 Practice relaxation techniques like mindfulness meditation to reduce anxiety.</li>
            <li>📝 Journaling can be a helpful way to express and understand your emotions.</li>
            <li>🍵 Sip on calming herbal teas like chamomile to soothe irritability.</li>
        </ul>`,
        7: `<p>🌼 It's the last day of your cycle, and you might be experiencing symptoms like depression, acne, or skin issues. These can be challenging, but we're here to provide support and guidance. 🤗</p>
        <p>Consider the following self-care tips:</p>
        <ul>
            <li>😌 Reach out to a trusted friend or therapist to talk about your emotions and feelings of depression.</li>
            <li>🧖‍♀️ Practice a gentle skincare routine to manage acne and skin issues.</li>
            <li>🥗 Maintain a balanced diet with skin-friendly foods like fruits and vegetables.</li>
        </ul>`,
    }[payload?.day];
    const img = {
        1: utils.images.cramps,
        2: utils.images.bloating,
        3: utils.images.mood_swings,
        4: utils.images.headaches,
        5: utils.images.appetite,
        6: utils.images.anxiety,
        7: utils.images.depression,
    }[payload?.day];
    return `<!DOCTYPE html>
    <html>
    <head>
        <title>${payload?.title}</title>
        ${utils.styles}
    </head>
    <body>
        <div class="container">
            <div class="header">${header}</div>
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
                        src="${img}"
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