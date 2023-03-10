const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL);

const Book = require('./models/BookModel');
const Page = require('./models/PageModel');

async function clear() {
    try {
        await Book.deleteMany({});
        console.log('Books cleared');
        await Page.deleteMany({});
        console.log('Pages cleared');
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

clear();