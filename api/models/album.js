const mongoose = require('mongoose');

const albumSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: { type: String, required: true },
    artist_id: mongoose.Types.ObjectId
});

module.exports = mongoose.model('Album', albumSchema);