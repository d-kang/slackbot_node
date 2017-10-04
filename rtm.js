const token = process.env.SLACK_TOKEN || '';
const { RtmClient, MemoryDataStore, RTM_EVENTS } = require('@slack/client');


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

module.exports = { rtm, RTM_EVENTS };
