const mongoose = require('mongoose');

const gameTopicSchema = new mongoose.Schema({
    topic: String,
    content: String
});

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    topics: []
});

mongoose.model('Game', gameSchema)