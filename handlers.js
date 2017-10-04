const { rtm } = require('./rtm');
const setState = require('./app');
const { Chat_Event } = require('./models');

Chat_Event.find({_id: '59d469baf1739b1e1901c28d'}, (err, som) => {
  console.log('err', err)
  console.log('som', som)
})

// var chat_event = new Chat_Event ({event: null});
// chat_event.save((err) => {
//   if (err) {
//     console.log('err', err);
//   } else {
//     console.log('meow');
//   }
// })

/*
  1. add a new handler called GET_NAME
  2. have it collect and store the name of the user
  3. have it set the state to phone number
  4. collect and store the phone number
  5. do the same for collecting an address
  6. confirm with the user the input that you've stored
  7. if yes, say thanks, and loop back to the beginning, otherwise loop back with error
*/
let event = null;

const handlers = {};
handlers.DEFAULT = (message) => {
  rtm.sendMessage("Welcome! What's your name?", message.channel);
  console.log('eventfirst', event);
  event = 'GET_NAME';
  console.log('eventsecond', event);
}

handlers.GET_NAME = (message) => {
  setState(state, {name: message.text});

  rtm.sendMessage(`Nice to meet you ${state.name}`, message.channel);
  rtm.sendMessage(`What is your phone number?`, message.channel);
  event = 'GET_NUMBER';
}

handlers.GET_NUMBER = (message) => {
  setState(state, {phoneNumber: message.text});

  rtm.sendMessage(`Thanks for your phone number! ${state.phoneNumber}`, message.channel);
  rtm.sendMessage(`What is your address?`, message.channel);
  event = 'GET_ADDRESS';
}

handlers.GET_ADDRESS = (message) => {
  setState(state, {address: message.text});

  rtm.sendMessage(`Got it! ${state.address}`, message.channel);
  rtm.sendMessage(`Is all this information correct?`, message.channel);
  rtm.sendMessage(
    `name: ${state.name}
    phone-number: ${state.phoneNumber}
    address: ${state.address}`, message.channel);
  event = 'CONFIRM';
}

handlers.CONFIRM = (message) => {
  const isConfirmed = message.text.toLowerCase();
  console.log('isConfirmed', isConfirmed);
  if (isConfirmed.indexOf('yes') > -1) {
    rtm.sendMessage('Great glad it was all correct!', message.channel);
  } else {
    rtm.sendMessage('oh noes! lets start over', message.channel);
  }
  event = null;
}

module.exports = { handlers, event };
