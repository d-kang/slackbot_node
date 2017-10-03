const { RtmClient, MemoryDataStore, RTM_EVENTS } = require('@slack/client');
const token = process.env.SLACK_TOKEN || '';

const rtm = new RtmClient(token, {
  logLevel: 'error',
  // logLevel: 'debug',
  // Initialise a data store for our client, this will load additional helper functions for the storing and retrieval of data
  dataStore: new MemoryDataStore(),
  // Boolean indicating whether Slack should automatically reconnect after an error response
  autoReconnect: true,
  // Boolean indicating whether each message should be marked as read or not after it is processed
  autoMark: true,
});

let state = null;

const setState = (newState) => {
  state = newState;
}

const handlers = {};

// basic router, can use botkit later on
const router = (message) => {
  if (!state) {
    handlers.DEFAULT(message);
  } else {
    handlers[state](message);
  }
}

handlers.DEFAULT = (message) => {
  rtm.sendMessage("Welcome! What's your name", message.channel);
  setState(states.GET_NAME);
}

/*
  1. add a new handler called GET_NAME
  2. have it collect and store the name of the user
  3. have it set the state to phone number
  4. collect and store the phone number
  5. do the same for collecting an address
  6. confirm with the user the input that you've stored
  7. if yes, say thanks, and loop back to the beginning, otherwise loop back with error
*/

// Listens to all `message` events from the team
rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  // console.log('message', message)
  if (message.text.indexOf('time') > -1) {
    rtm.sendMessage('The time is ' + new Date().toLocaleTimeString(), message.channel)
  }
  if (message.channel === "G79CLHEA3") {
    console.log('Bot sees a message in general and chooses not to respond')
  } else {
    // rtm.sendMessage('Beep boop hello world!', message.channel)
    // rtm.sendMessage(`Hi there @${message.user}`, message.channel)
    router(message);
  }
})

// setState("DEFAULT");
rtm.start();
