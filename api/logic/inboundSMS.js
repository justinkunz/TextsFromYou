const firebase = require("../../db/firebase");
const sms = require("../../sms/twilio");
const devUpdate = require("./devUpdate");
const { DEV_NUM, UPDATE_KEYWORD } = process.env;

module.exports = (snap, req) => {
  try {
    const timestamp = Date.now();
    const data = snap.val();

    const inbound = req.body.Body.trim().toLowerCase();
    let from = req.body.From;

    if (from.length !== 10) {
      from = from.substring(from.length - 10, from.length);
    }

    const userId = firebase.idByPhone(data, from);
    if (!userId || data[userId].repliedStop) return;

    //handle dev info request texts
    if (from === DEV_NUM && inbound === UPDATE_KEYWORD) {
      return sms.devInbound(devUpdate(data));
    }

    //record inbound in firebase
    const smsData = {
      msg: inbound,
      time: timestamp
    };
    const inbounds = data[userId].inbounds || [];
    inbounds.push(smsData);
    firebase.update(userId, "inbounds", inbounds);

    //handle response / db updates based on inbonds
    switch (inbound) {
      case "stop":
        firebase.update(userId, "repliedStop", true);
        break;

      case "start":
        if (data[userId].repliedStop) {
          firebase.update(userId, "repliedStop", false);
          return sms.inboundResponse("unstop");
        }
        break;

      case "goals":
        return sms.inboundResponse("goalActions");

      case "addgoal":
        firebase.update(userId, "addingGoal", true);
        return sms.inboundResponse("addGoal");

      case "deletegoal":
        if (data[userId].goals.length === 1) {
          return sms.inboundResponse("deleteGoalLimit");
        } else {
          firebase.update(userId, "deletingGoal", true);
          return sms.inboundResponse("deleteGoal", data[userId].goals);
        }

      case "viewgoals":
        return sms.inboundResponse("viewGoals", data[userId].goals);

      default:
        //deleting goal
        if (data[userId].deletingGoal && !isNaN(parseInt(inbound))) {
          const index = parseInt(inbound);
          if (index < data[userId].goals.length + 1 && index > 0) {
            const oldGoals = data[userId].goals;
            const newGoals = [];
            for (i = 0; i < oldGoals.length; i++) {
              if (i !== index - 1) newGoals.push(oldGoals[i]);
            }
            firebase.update(userId, "goals", newGoals);
            firebase.update(userId, "deletingGoal", false);
            return sms.inboundResponse("deleteGoalSuccess");
          }
          return sms.inboundResponse("deleteGoalInvalid", data[userId].goals);
        }
        //adding goal
        if (data[userId].addingGoal) {
          var goals = data[userId].goals;
          goals.push(inbound);
          firebase.update(userId, "goals", goals);
          firebase.update(userId, "addingGoal", false);
          return sms.inboundResponse("addGoalSuccess");
        }
        //return default
        return sms.inboundResponse("info");
    }
  } catch (err) {
    console.log(err);
    sms.devError(
      {
        from: req.body.From,
        msg: req.body.Body,
        userId: userId
      },
      err
    );
    return;
  }
};
