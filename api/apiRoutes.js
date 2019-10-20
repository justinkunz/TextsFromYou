const firebase = require("../db/firebase");
const responses = require("./responses");
const logic = require("./logic");
const { display_error, error_type } = process.env;

module.exports = app => {
  app.get("/api/display-details", (req, res) => {
    res.send(responses.defaultDisplay);
  });

  app.get("/api/display-errors", (req, res) => {
    if (display_error === "false") {
      res.json(responses.errors.none);
    } else {
      res.json(responses.errors.type[error_type]);
    }
  });

  app.get("/api/unsub-inst", (req, res) => {
    res.json(responses.unsubInstructions);
  });

  app.get("/api/contact-details", (req, res) => {
    res.json(responses.contactDetails);
  });

  app.post("/api/new-account", (req, res) => {
    const validation = logic.validation(req);
    if (!validation.valid) {
      res.json(validation);
      return;
    }
    firebase.read().then(snap => {
      res.send(logic.signUp(snap, req));
    });
  });

  app.post("/api/sms", (req, res) => {
    firebase.read().then(snap => {
      res.send(logic.inboundSMS(snap, req));
    });
  });
};
