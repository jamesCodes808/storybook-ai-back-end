'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const PORT = process.env.PORT
const Books = require('./routes/books');
const DATABASE_URL = process.env.DATABASE_URL;

app.use(cors());
app.use(express.json());

app.use((request, response, next) => {
    console.log(request.path, request.method);
    next();
});

app.use('/', Books);

mongoose.connect(DATABASE_URL)
    .then(() => {
        app.listen(PORT, () => console.log(`Connected to mongodb and listening on ${PORT}`));
    })
    .catch((error) => {
        console.log(error);
    });