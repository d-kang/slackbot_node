const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/slackbot', { useMongoClient: true, promiseLibrary: global.Promise });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('db connection successful! =======================')
})

module.exports = db;
