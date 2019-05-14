const firebase = require('../../firebase/firebase');
const sms = require('../../sms/twilio');
const responses = require('../responses');

module.exports = function(snap, req){
  
        //phone number already in db 
        const b = req.body;
        const currData = snap.val();
        for(key in currData){
            if(currData[key].phoneNum === b.phoneNum){
                let changed = false
                let currGoals = currData[key].goals;
                for(i=0; i<b.goals.length;i++){
                    if(currGoals.indexOf(b.goals[i]) == -1){
                        currGoals.push(b.goals[i]);
                        changed = true;
                    };
                };
                if(changed){
                    firebase.update(key, 'goals', currGoals)
                };
                return responses.submission.success.alreadyAdded;
            };
        };

        //new user handeling
        firebase.writeToDb({
            firstName: b.firstName,
            lastName: b.lastName,
            phoneNum: b.phoneNum,
            goals: b.goals,
            smsAgreement: b.checkedSMS,
            tosAgreement: b.checkedTOS,
            version: process.env.current_version,
            createdTime: new Date(),
            userInfo: req.ipInfo
        });
        sms.welcomeMsg(b.phoneNum);
        sms.devNewUserAlert(b, req.ipInfo);   
        return responses.submission.success.generic;

};