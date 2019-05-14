const firebase = require('../firebase/firebase');
const sms = require('../sms/twilio');

module.exports = function(snap, req){
    try {

        //declare and parse info
        const timestamp = Date.now();
        const data = snap.val();
        const inbound = req.body.Body.trim().toLowerCase();
        let from = req.body.From;
        if(from.length !== 10) from = from.substring(from.length-10, from.length);
        const userId = firebase.idByPhone(data, from);
        if(!userId || data[userId].repliedStop) return;

        //handle dev info request texts
        if(from === process.env.DEV_NUM && inbound === 'update'){
            let dataCount = 0;
            let stopCount = 0;
            let inboundsSent = 0;
            let usingInbounds = 0;
            for(key in data){ 
                dataCount++; 
                if(data[key].repliedStop) stopCount++;
                if(data[key].inbounds) {
                    usingInbounds++;
                    inboundsSent = inboundsSent + data[key].inbounds.length;
                }
            };
            return sms.devInbound(getDevMsg(dataCount, stopCount, usingInbounds, inboundsSent));
        };

        //record inbound in firebase
        const txtData = {
            msg: inbound,
            time: timestamp
        };
        if(data[userId].inbounds) {
            var newInbounds = data[userId].inbounds;
            newInbounds.push(txtData);
            firebase.update(userId, 'inbounds', newInbounds);
        } else {
            firebase.update(userId, 'inbounds', [txtData]);
        };
        
        //handle response / db updates based on inbonds
        switch(inbound) {
            case "stop":
                firebase.update(userId, 'repliedStop', true);
                break;
            case "start":
                if(data[userId].repliedStop) {
                    firebase.update(userId, 'repliedStop', false);
                    return sms.inboundResponse('unstop');
                };
                break;
            case "goals":
                res.send(sms.inboundResponse('goalActions'));
                break;
            case "addgoal":
                firebase.update(userId, 'addingGoal', true);
                return sms.inboundResponse('addGoal');
            case "deletegoal":
                if(data[userId].goals.length === 1){
                    return sms.inboundResponse('deleteGoalLimit');
                } else {
                    firebase.update(userId, 'deletingGoal', true);
                    return sms.inboundResponse('deleteGoal', data[userId].goals);
                };
            case "viewgoals":
                return sms.inboundResponse('viewGoals', data[userId].goals);
            default: 
                //deleting goal
                if(data[userId].deletingGoal && !isNaN(parseInt(inbound))){           
                    var index = parseInt(inbound);
                    if(index < data[userId].goals.length +1 && index > 0){
                        const oldGoals = data[userId].goals;
                        const newGoals = [];
                        for(i=0;i<oldGoals.length;i++){
                            if( i !== (index -1) ) newGoals.push(oldGoals[i]);
                        };
                        firebase.update(userId, 'goals', newGoals);
                        firebase.update(userId, 'deletingGoal', false);
                        return sms.inboundResponse('deleteGoalSuccess');
                    };
                    return sms.inboundResponse('deleteGoalInvalid', data[userId].goals);
                };
                //adding goal
                if(data[userId].addingGoal){                  
                    var goals = data[userId].goals;
                    goals.push(inbound);
                    firebase.update(userId, 'goals', goals);
                    firebase.update(userId, 'addingGoal', false);
                    return sms.inboundResponse('addGoalSuccess');
                };
                //return default
                return sms.inboundResponse('info');
            };
        } catch(err) {
            console.log(err);
            sms.send(sms.devError({
                from: req.body.From,
                msg: req.body.Body,
                userId: userId
            }, err));
        };
}

const getDevMsg = (dataCount, stopCount, usingInbounds, inboundsSent) => {
    return `# of Users: ${dataCount}\n
    # of STOPS: ${stopCount}\n
    # of Users using inbounds: ${usingInbounds}\n
    # of inbounds sent: ${inboundsSent}\n
    Cost of inbounds: $${(inboundsSent*0.01)}\n\n
    Est. Monthly Cost: $${calculateCost()}\n
    Est. Yearly Cost: $${calculateCost()*12}`;
};

const calculateCost = (dataCount, stopCount) => {
    const toSend = (dataCount-stopCount)*0.25;
    const totalSMSCost = toSend*30.42*0.006;
    return totalSMSCost+8;
};