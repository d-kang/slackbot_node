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

// Listens to all `message` events from the team
rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  if (message.channel === "G79CLHEA3") {
    console.log('Bot sees a message in general and chooses no to respond')
  } else {
    rtm.sendMessage('Beep boop hello world!', message.channel)
    console.log('message', message)
    rtm.sendMessage(`Hi there @${message.user}`, message.channel)
  }
})

rtm.start();