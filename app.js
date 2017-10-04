const RtmClient = require('@slack/client').RtmClient;
const MemoryDataStore = require('@slack/client').MemoryDataStore;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const token = process.env.SLACK_TOKEN || "";
const witToken = process.env.WIT_ACCESS_TOKEN || "";
const witAppID = process.env.WIT_APP_ID || "";
const {Wit, log} = require("node-wit");

const wit = new Wit({accessToken: witToken});

const rtm = new RtmClient(token, {
    logLevel: 'error',
    // logLevel: 'debug',
    // Initialise a data store for our client, this will load additional helper functions for the storing and retrieval of data
    dataStore: new MemoryDataStore(),
    // Boolean indicating whether Slack should automatically reconnect after an error response
    autoReconnect: true,
    // Boolean indicating whether each message should be marked as read or not after it is processed
    autoMark: true
});

let data = {};

let state = null;
const setState = (newState) => {
    state = newState;
};

const handlers = {};
handlers.DEFAULT = (message) => {
    data = {};
    rtm.sendMessage("Welcome! What's your name?", message.channel);
    setState("GET_NAME");
};

handlers.GET_NAME = (message) => {
    data.name = message.text;
    rtm.sendMessage(`${data.name} is a nice name. What is your phone number?`, message.channel);
    setState("GET_PHONE_NUMBER");
};

handlers.GET_PHONE_NUMBER = (message) => {
    data.phoneNumber = message.text;
    rtm.sendMessage(`Where do you life?`, message.channel);
    setState("GET_ADDRESS");
};

handlers.GET_ADDRESS = (message) => {
    data.address = message.text;
    rtm.sendMessage(`So you are ${data.name} from ${data.address} and i can call you on ${data.phoneNumber}. Is this correct?`, message.channel);
    setState("CONFIRM");
};

handlers.CONFIRM = (message) => {
    if(message.text.toLowerCase() === "yes") {
        rtm.sendMessage(`Thanks ${data.name}.`, message.channel);
        setState("DEFAULT");
    } else {
        rtm.sendMessage(`Ohh. Something went wrong :( Let's try this again.`, message.channel);
        setState("DEFAULT");
        handlers[state](message);
    }
};

const router = (message) => {
    if(!state) {
        handlers.DEFAULT(message);
    } else {
        handlers[state](message);
    }
};

/*
  Add new entity types to wit to accomplish the following task:
  capture where, when and how much, asking them for what you don’t receive,
  storing and confirming
*/

// Listens to all `message` events from the team
rtm.on(RTM_EVENTS.MESSAGE, (message) => {
    if(message.channel === 'G79CLHEA3') {
        // console.log('Bot sees a message in General and ignores it.');
    } else {

      wit.message(message.text, {})
        .then((data) => {
          console.log('data', data);
          if (data && data.entities && data.entities.location) {
            console.log('wit thinks the location is: ', data.entities.location[0].value);

          }
        })
        .catch(console.error)

      // router(message);
    }
});

setState("DEFAULT");
rtm.start();
