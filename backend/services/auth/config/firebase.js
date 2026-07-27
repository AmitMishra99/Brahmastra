const admin = require("firebase-admin");

const serviceAccount = require("../serviceAccountKey.json");

const app = admin.apps?.length
  ? admin.apps[0]
  : admin.initializeApp({
      credential: admin.cert(serviceAccount),
    });

module.exports = app;
