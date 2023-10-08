module.exports = `<style>
/* CSS Styles */
body {
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    margin: 0;
    padding: 0;
}

.container {
    max-width: 600px;
    margin: 2rem auto;
    background-color: #141414;
    border-radius: 10px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

.header {
    background: linear-gradient(to right, rgb(233, 213, 255), #ff4d7a);
    padding: 40px;
    text-align: center;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.header h1 {
    color: #141414;
    font-size: 30px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.content {
    background-color: rgb(233, 213, 255);
    padding: 20px;
    color: #333;
}

.content p {
    margin: 15px 0;
    font-size: 18px;
}

.strong {
    font-weight: bold;
}

.emphasize {
    font-style: italic;
}

.logo {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.logo img {
    max-width: 200px;
    height: auto;
}

.logo strong {
    font-size: 1.4rem;
    font-weight: 600;
    margin-left: 0.5rem;
}

.illustration {
    text-align: center;
    margin-top: 20px;
}

.illustration img {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
    transition: transform 0.15s ease-in-out;
}

.illustration img:hover {
    transform: scale(1.3);
}

.footer {
    background: linear-gradient(to right, rgb(233, 213, 255), #ff4d7a);
    padding: 20px;
    text-align: center;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    animation: fadeIn 1s;
}

.footer p {
    color: #141414;
    font-size: 20px;
}

/* Keyframe Animation */
@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>`;