const admin = require('firebase-admin');
const Logger = require("../helpers/Logger");
require('dotenv').config({
    path: `.env${process.env.MY_ENV}`
});

const app = admin.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
});

const auth = admin.auth();

const verifyToken = async (token) => {
    try {
        const decodedToken = await auth.verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        return false;
    }
}
module.exports = {
    verifyToken
}