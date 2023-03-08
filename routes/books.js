const express = require('express');
const Book = require('../models/BookModel');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    organization: process.env.OPENAI_ORG_KEY,
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

router.get('', async (request, response) => {
    const books = await Book.find({ email: request.user.email });
    console.log(books);
    response.status(200).json(books);
});

// create a 4 sentence story with 4 words each sentence of a ${noun} ${verb} at ${location}

router.post('', async (request, response) => {
    const { title, noun, verb, location } = request.body;
    console.log(request.body);
    console.log(title);
    console.log(noun);
    console.log(verb);
    console.log(location, '\n');

    const prompt = `Create a 4 sentence story with 4 words each sentence of ${noun} ${verb} at ${location}`;
    console.log(prompt);

    const aiBook = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 100,
        temperature: 0.5,
    });

    console.log(aiBook.data.choices)

    const story = aiBook.data.choices[0].text;
    console.log(story);

    try {
        const newBook = await Book.create({ title: title, story: story, email: request.user.email });
        response.status(200).json(newBook);
    } catch (error) {
        response.status(500).json("there was an error post");
    }
})

/* router.put('/books/:id', async (request, response) => {
    const id = request.params.id;
    const { email } = request.user.email;

    try {
        const book = await Book.findOne({ _id: id, email: email });
        if (!book) {
            response.status(400).send('unable to update book');
        } else {
            let updatedBook = await Book.findByIdAndUpdate(id, request.body, { new: true });
            response.status(202).json(updatedBook);
        }
    } catch (error) {
        response.status(404).send('unable to update');
        console.error(error);
    }
}); */

router.delete('/:id', async (request, response) => {
    const id = request.params.id;
    const email = request.user.email;

    try {
        if (await Book.findOne({ _id: id, email: email })) {
            await Book.findByIdAndDelete(id);
            response.status(200).send(`successfully deleted ${id}`);
        } else {
            response.status(404).send(`unable to find book with id ${id}`);
        }
    } catch (error) {
        response.status(404).send(`unable to delete book with id ${id}`);
    }
})

/* router.get('/user', async (response, request) => {
    console.log('getting user');
    response.status(200).send(request.user);
}) */

module.exports = router;