const { rtm, RTM_EVENTS } = require('./rtm');
const { handlers } = require('./handlers');
const db = require('./db');

let state = {
  name: '',
  phoneNumber: '',
  address: '',
};

const setState = (oldState, newState) => {
  state = Object.assign({}, oldState, newState);
}



// basic router, can use botkit later on
const router = (event, message) => {
  if (!event) {
    handlers.DEFAULT(message);
  } else {
    handlers[event](message);
  }
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
    let { event } = require('./handlers');
    console.log('event', event);
    router(event, message);
  }
})

rtm.start();


module.exports = setState;
