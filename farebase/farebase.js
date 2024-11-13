const admin = require("firebase-admin");

const path = require("path");

const serviceaccount = path.join(__dirname, "./farebase-admin-SDK.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceaccount),
});

module.exports = admin;
