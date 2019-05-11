const mongoose = require('mongoose');

const artistSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: { type: String, required: true }
});

module.exports = mongoose.model('Artist', artistSchema);