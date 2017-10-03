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

let state = {
  name: '',
  phoneNumber: '',
  address: '',

};

let event = null;

const setState = (oldState, newState) => {
  state = Object.assign({}, oldState, newState);
}
const setEvent = (next) => {
  event = next;
}

const handlers = {};

// basic router, can use botkit later on
const router = (message) => {
  if (!event) {
    handlers.DEFAULT(message);
  } else {
    handlers[event](message);
  }
}

handlers.DEFAULT = (message) => {
  rtm.sendMessage("Welcome! What's your name", message.channel);
  setEvent('GET_NAME');
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

handlers.GET_NAME = (message) => {
  setState(state, {name: message.text});

  rtm.sendMessage(`Nice to meet you ${state.name}`, message.channel);
  rtm.sendMessage(`What is your phone number?`, message.channel);
  setEvent('GET_NUMBER')
}

handlers.GET_NUMBER = (message) => {
  setState(state, {phoneNumber: message.text});

  rtm.sendMessage(`Thanks for your phone number! ${state.phoneNumber}`, message.channel);
  rtm.sendMessage(`What is your address?`, message.channel);
  setEvent('GET_ADDRESS')
}

handlers.GET_ADDRESS = (message) => {
  setState(state, {address: message.text});

  rtm.sendMessage(`Got it! ${state.address}`, message.channel);
  rtm.sendMessage(`Is all this information correct? ${state.address}`, message.channel);
  rtm.sendMessage(
    `name: ${state.name}
    phone-number: ${state.phoneNumber}
    address: ${state.address}`, message.channel);
  setEvent('CONFIRM')
}

handlers.CONFIRM = (message) => {
  const isConfirmed = message.text.toLowerCase();
  console.log('isConfirmed', isConfirmed);
  if (isConfirmed.indexOf('yes') > -1) {
    rtm.sendMessage('Great glad it was all correct!', message.channel);
  } else {
    rtm.sendMessage('oh noes! lets start over', message.channel);
  }
  setEvent(null);
}

/*
  1. Validate the phone number
  2. Either confirm and pass them to the next step
  3. Or ask them for it again with an error message
*/



// Listens to all `message` events from the team
rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  if (message.channel === "G79CLHEA3") {
    console.log('Bot sees a message in general and chooses not to respond')
  } else {
    if (message.text.indexOf('time') > -1) {
      rtm.sendMessage('The time is ' + new Date().toLocaleTimeString(), message.channel)
    }
    // rtm.sendMessage('Beep boop hello world!', message.channel)
    // rtm.sendMessage(`Hi there @${message.user}`, message.channel)
    router(message);
  }
})

rtm.start();
