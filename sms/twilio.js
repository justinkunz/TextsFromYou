
const accountSid = process.env.SMS_ID;
const authToken = process.env.SMS_TOKEN;
const client = require('twilio')(accountSid, authToken);
const smsResponses = require('./responses.json');

sms = {
    welcomeMsg: function(num){
        client.messages.create({
            body: smsResponses.signUp,
            from: process.env.SMS_FROM_NUM,
            to: num
        });
    },
    devNewUserAlert: function(user, loc){
        client.messages.create({
            body: smsResponses.dev.newUser + createNewUserMsg(user, loc),
            from: process.env.SMS_FROM_NUM,
            to: process.env.DEV_NUM
        })
    },
    devError: function(data, e){
        client.messages.create({
            body: smsResponses.dev.error + JSON.stringify(data) + "\n\nError: " + e,
            from: process.env.SMS_FROM_NUM,
            to: process.env.DEV_NUM
        });
    },
    pinMsg: function(pin, num){
        client.messages.create({
            body: smsResponses.pin + pin,
            from: process.env.SMS_FROM_NUM,
            to: num
        });
    },
    devInbound: function(data){
        return createInboundResponse(smsResponses.dev.inbound + data);
    },
    inboundResponse: function(type, goals = null){
        switch(type) {
            case "stop":
                return createInboundResponse(smsResponses.stop);
            case "unstop":
                return createInboundResponse(smsResponses.unstop);
            case "goalActions":
                return createInboundResponse(smsResponses.goals.generic);
            case "viewGoals":
                return createInboundResponse(smsResponses.goals.viewGoals + createGoalList(goals));
            case "addGoal":
                return createInboundResponse(smsResponses.goals.add.incomplete);
            case "addGoalSuccess":
                return createInboundResponse(smsResponses.goals.add.complete);
            case "deleteGoal":
                return createInboundResponse(smsResponses.goals.delete.incomplete + createGoalList(goals));
            case "deleteGoalSuccess":
                return createInboundResponse(smsResponses.goals.delete.complete);
            case "deleteGoalInvalid":
                return createInboundResponse(smsResponses.goals.delete.invalid +  createGoalList(goals));
            case "deleteGoalLimit":
                return createInboundResponse(smsResponses.goals.delete.limit);
            default:
                return createInboundResponse(smsResponses.info);
        };
    }
};

function createInboundResponse(msg){
    return"<Response><Message>" + msg + "</Message></Response>"
}

function createNewUserMsg(user, loc){
    const region = loc.region || 'NA'
    return `\n\n${user.firstName} ${user.lastName} from ${region} has signed up with the following goals:${createGoalList(user.goals)}`
}
function createGoalList(goals){
    var str = "\n\n";
    for(i=0;i<goals.length;i++){
        var goalNum = i +1
        str = str + goalNum + ".)" + goals[i] + "\n"
    };
    return str;
};

  module.exports = sms;
