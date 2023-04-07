const admin = require('firebase-admin');
require('dotenv').config({
    path: `.env${process.env.MY_ENV}`
});

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
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