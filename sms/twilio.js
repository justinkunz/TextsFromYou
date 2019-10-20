const { SMS_ID, SMS_TOKEN, SMS_FROM_NUM, DEV_NUM } = process.env;
const client = require("twilio")(SMS_ID, SMS_TOKEN);
const smsResponses = require("./responses.json");

sms = {
  welcomeMsg: num => {
    client.messages.create({
      body: smsResponses.signUp,
      from: SMS_FROM_NUM,
      to: num
    });
  },
  devNewUserAlert: (user, loc) => {
    client.messages.create({
      body: smsResponses.dev.newUser + createNewUserMsg(user, loc),
      from: SMS_FROM_NUM,
      to: DEV_NUM
    });
  },
  devError: (data, e) => {
    client.messages.create({
      body: smsResponses.dev.error + JSON.stringify(data) + "\n\nError: " + e,
      from: SMS_FROM_NUM,
      to: DEV_NUM
    });
  },
  pinMsg: (pin, num) => {
    client.messages.create({
      body: smsResponses.pin + pin,
      from: SMS_FROM_NUM,
      to: num
    });
  },
  devInbound: dbUsers => {
    client.messages.create({
      body: smsResponses.dev.inbound + dbUsers,
      from: SMS_FROM_NUM,
      to: DEV_NUM
    });
  },
  inboundResponse: (type, userGoal = null) => {
    const { stop, unstop, goals, info } = smsResponses;
    switch (type) {
      case "stop":
        return inboundRes(stop);
      case "unstop":
        return inboundRes(unstop);
      case "goalActions":
        return inboundRes(goals.generic);
      case "viewGoals":
        return inboundRes(goals.viewGoals + goalList(userGoal));
      case "addGoal":
        return inboundRes(goals.add.incomplete);
      case "addGoalSuccess":
        return inboundRes(goals.add.complete);
      case "deleteGoal":
        return inboundRes(goals.delete.incomplete + goalList(userGoal));
      case "deleteGoalSuccess":
        return inboundRes(goals.delete.complete);
      case "deleteGoalInvalid":
        return inboundRes(goals.delete.invalid + goalList(userGoal));
      case "deleteGoalLimit":
        return inboundRes(goals.delete.limit);
      default:
        return inboundRes(info);
    }
  }
};

const inboundRes = msg => {
  return "<Response><Message>" + msg + "</Message></Response>";
};

const createNewUserMsg = (user, loc) => {
  const region = loc.region || "NA";
  return `\n\n${user.firstName} ${
    user.lastName
  } from ${region} has signed up with the following goals:${goalList(
    user.goals
  )}`;
};
const goalList = goals => {
  var str = "\n\n";
  for (i = 0; i < goals.length; i++) {
    str += `${goals[i] + 1}.) ${goals[i]}\n`;
  }
  return str;
};

module.exports = sms;
