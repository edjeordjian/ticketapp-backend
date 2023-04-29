const admin = require('firebase-admin');
const Logger = require("../../helpers/Logger");
const { FIREBASE_URL } = require("../../constants/URLs");
const { logError } = require("../../helpers/Logger");

const fetch = require('node-fetch');

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

const getFirebaseUserData = async (token) => {
    const userInfoResponse = await fetch(FIREBASE_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return userInfoResponse.json();
};

const auth = admin.auth();

const verifyToken = async (token) => {
    try {
        const decodedToken = await auth.verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        logError(error.stack);

        return false;
    }
}

module.exports = {
    verifyToken, getFirebaseUserData
}