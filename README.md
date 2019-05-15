# Texts From You

Texts From You is an app with **500+ Users** that sends users encouraging SMS messages from their future self.

Try it at _https://www.textsfromyou.com_

Made with:

- React
- NodeJS
- ExpressJS
- Firebase
- Twilio
- Heroku
- App Script
- Google Analytics

## Interactive SMS

This app includes an interactive SMS feature. After signing up, users can text multiple keywords to the app's phone number to trigger account actions.

Code for this can be viewed in `api/logic/inboundSMS.js`

### Keywords and Actions

- **VIEWGOALS** - Responds with a list of that user's current goals
- **DELETEGOAL** - Allows users to delete one of their goals
- **ADDGOAL** - Allows users to add a goal to their list

### Developer Keywords

If the app developer texts a specified keyword to the app's phone number, an update will sent to the developer's phone including specific app information.

### Other Commands

If the user text's the word **GOAL**, a response is sent containing the above keywords and their associated action. User's can opt out by sending the word **STOP**. If a user has already opted out, texting the word **START** will allow the app continue SMS communication. Any other received texts sent will get a generic TextsFromYou information reply.

## Receiving Texts

Each day, every user has a **25%** chance of receiving a text message from TextsFromYou. This chance is subject to change based on the number of active users the app has.

### Message Structure

Each message is structured to feel personal. This is done by using an expansive template with many randomized options. Each message will also choose one of the user's listed goals at random

### Message Examples

Below are examples of the messages sent to users

```
 Hey George!

You should try to eat healthier today. It'll
make the day great, don't you agree? I'll
thank you later! :)

xoxo,
Future George
```

```
Hows it going Kathy!

You should try to study today. There's
no time like the present! I would thank
you!

Love,
Future Kathy
```
