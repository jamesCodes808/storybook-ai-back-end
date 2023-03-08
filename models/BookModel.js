const mongoose = require('mongoose');
const Page = require('./PageModel');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    story: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: true
    },
    pages: [{
        type: [Page.Schema],
        ref: 'Page'
    }],
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Book', bookSchema);