var admin = require("firebase-admin");

var serviceAccount = require("../../complete-sector-300008-firebase-adminsdk-nbp16-340ba5831c.json");

const admin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin