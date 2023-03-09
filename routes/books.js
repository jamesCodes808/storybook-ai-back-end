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

  console.log('**************sendBooks************');
  console.log(populatedBooks);

  if (populatedBooks.length > 0) {
    response.status(200).json(populatedBooks);
  } else {
    response.status(201).send([]);
  }
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
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: 100,
    temperature: 0.5,
  });

  const story = aiBook.data.choices[0].text;

  // console.log('-------------------STORY-----------------', story)

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
    // console.log('********PAGE*******');
    // console.log(page);
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

  // const insertedPages = await Page.insertMany([
  //     pagesArray
  // ])

  // const listOfPagesIds = await Promise.all(insertedPages.map(page => page._id))

  // const insertedBook = await Book.create({
  //     title: title,
  //     story: story,
  //     cover: cover,
  //     pages: listOfPagesIds,
  //     email: request.user.email
  // })

  // const populatedBook = await Page.findById(insertedBook._id).
  //     populate({
  //         path: "pages"
  //     })

  try {
    // console.log('------------------------POPULATED BOOK WITH PAGES--------------', populatedBook)

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
});

/* router.get('/user', async (response, request) => {
    console.log('getting user');
    response.status(200).send(request.user);
}) */

module.exports = router;
