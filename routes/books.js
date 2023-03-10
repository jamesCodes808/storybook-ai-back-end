const express = require('express');
const Book = require('../models/BookModel');
const Page = require('../models/PageModel');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    organization: process.env.OPENAI_ORG_KEY,
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.get('', async (request, response) => {
    const books = await Book.find({ email: request.user.email });

    const sendBooks = books.map(async (book) => {
        const popBooks = await Book.findById(book._id).populate({
            path: 'pages',
        });

        return popBooks;
    });

    const populatedBooks = await Promise.all(sendBooks);

    if (populatedBooks.length > 0) {
        response.status(200).json(populatedBooks);
    } else {
        response.status(201).send([]);
    }
});

router.post('', async (request, response) => {
    const { title, noun, verb, location } = request.body;

    const prompt = `Create a 4 sentence story with 4 words each sentence of ${noun} ${verb} at ${location}`;

    const aiBook = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 100,
        temperature: 0.5,
    });

    const story = aiBook.data.choices[0].text;

    let pagesArray = story.split('. ' || ', ').map(async (item) => {
        const pagePic = await openai.createImage({
            prompt: `${item} in the style of a children's book`,
            n: 1,
            size: '256x256',
            response_format: 'b64_json',
        });
        let page = await Page.create({
            picture: pagePic.data.data[0].b64_json,
            text: item,
        });
        return page;
    });

    const coverPrompt = title + ", in the style of a children's book";
    const aiCover = await openai.createImage({
        prompt: coverPrompt,
        n: 1,
        size: '256x256',
        response_format: 'b64_json',
    });
    const cover = aiCover.data.data[0].b64_json;

    const pages = await Promise.all(pagesArray);

    try {

        const newBook = await Book.create({
            title: title,
            story: story,
            cover: cover,
            pages: pages,
            email: request.user.email,
        });
        response.status(200).json(newBook);
    } catch (error) {
        console.error(error);
        response.status(500).json('there was an error post');
    }
});

router.delete('/:id', async (request, response) => {
    const id = request.params.id;
    const email = request.user.email;
    const deleteBook = await Book.findOne({ _id: id, email: email });

    try {
        if (deleteBook) {
            deleteBook.pages.forEach(async item => {
                await Page.findByIdAndDelete({ _id: item })
            });
            await Book.findByIdAndDelete(id);
            response.status(200).send(`successfully deleted ${id}`);
        } else {
            response.status(404).send(`unable to find book with id ${id}`);
        }
    } catch (error) {
        response.status(404).send(`unable to delete book with id ${id}`);
    }
});

module.exports = router;
