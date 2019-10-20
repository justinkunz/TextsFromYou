const admin = require("firebase-admin");
const serviceAccount = require("./firebaseToken.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.firebase_db_url
});
db = admin.database();

firebase = {
  writeToDb: function(data) {
    db.ref().push(data);
  },
  read: function() {
    return db.ref().once("value");
  },
  idByPhone: function(data, num) {
    for (key in data) {
      if (data[key].phoneNum === num) {
        return key;
      }
    }
  },
  update: function(id, field, data) {
    return db.ref(id + "/" + field).set(data);
  },
  deleteGoal: function(id, index) {
    return db.ref(id + "/goals/" + index).remove();
  },
  delete: function(id) {
    return db.ref(id).remove();
  }
};

module.exports = firebase;
