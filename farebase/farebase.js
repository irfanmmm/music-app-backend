const admin = require("firebase-admin");
const serviceaccount = require("./farebase-admin-SDK.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceaccount),
});

module.exports = admin;
