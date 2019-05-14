const firebase = require('../firebase/firebase');
const responses = require('./responses');
const logic = require('./logic');

module.exports = function(app){

    app.get('/api/display-details', function(req, res){
        res.send(responses.defaultDisplay);
    });
    
    app.get('/api/display-errors', function(req, res){
        if(process.env.display_error === "false"){
            res.json(responses.errors.none);
        } else {
            res.json(responses.errors.type[process.env.error_type]);
        };
    });

    app.get('/api/unsub-inst', function(req, res){ 
        res.json(responses.unsubInstructions);
    });

    app.get('/api/contact-details', function(req, res){
        res.json(responses.contactDetails);
    });

    app.post('/api/new-account', function(req, res){
        const validation = logic.validation(req);
        if(!validation.valid) {
            res.json(validation);
            return;
        }
        firebase.read().then(function (snap) {
            res.send(logic.signUp(snap, req));
        });
    });

    app.post('/api/sms', function(req, res){
        firebase.read().then(function (snap) {
            res.send(logic.inboundSMS(snap, req));
        });
    });
}