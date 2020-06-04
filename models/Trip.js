const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TripSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    instructions:{
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    username: {
        type: String
    },
    lat: {
        type: Number
    },
    lon: {
        type: Number
    }
})

TripSchema.index({
    '$**': 'text'
});

module.exports = mongoose.model('Trip', TripSchema)