const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');

const firebaseConfig = {
    apiKey: "AIzaSyCW4OzuR_HWG28C5IwFjGbjj1MwBYprCjI",
    authDomain: "my-firebase-e3f67.firebaseapp.com",
    databaseURL: "https://my-firebase-e3f67-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "my-firebase-e3f67",
    storageBucket: "my-firebase-e3f67.appspot.com",
    messagingSenderId: "23221906205",
    appId: "1:23221906205:web:e74bd13c02cd0b0ec9cff4"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

module.exports = database;