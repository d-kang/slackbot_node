const mongoose = require('mongoose');

var Chat_Event = mongoose.model('chat_events', { event: String });



module.exports = { Chat_Event }
