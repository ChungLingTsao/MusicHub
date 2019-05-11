const mongoose = require('mongoose');

const trackSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    album_id: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Track', trackSchema);