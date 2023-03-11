const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL);

const Book = require('../models/BookModel');

async function seed() {
    let dogRunPark = await Book.create({
        title: 'Dog Running in Park',
        story: 'Dog dashes through park, Paws pounding on dirt. Tail wagging wildly, Tongue lolling out merrily.',
        email: 'ekalbers22@gmail.com'
    });

    console.log(dogRunPark);

    let catClimbTree = await Book.create({
        title: 'Cat Climbs Tree',
        story: 'Sleek feline scales bark, Paws gripping tightly, Eyes fixed on branches, Nature\'s playground explored.',
        email: 'ekalbers22@gmail.com'
    });

    console.log(catClimbTree);

    let parrotTalkKitchen = await Book.create({
        title: 'Parrot Talks in Kitchen',
        story: 'Vibrant bird chirps loudly, Perched atop chair-back, Observing bustling kitchen, Repeating phrases with gusto.',
        email: 'ekalbers22@gmail.com'
    });

    console.log(parrotTalkKitchen);

    let dogRunPark2 = await Book.create({
        title: 'Dog Running in Park',
        story: 'Dog dashes through park, Paws pounding on dirt. Tail wagging wildly, Tongue lolling out merrily.',
        email: 'ethankalbers@gmail.com'
    });

    console.log(dogRunPark2);

    let catClimbTree2 = await Book.create({
        title: 'Cat Climbs Tree',
        story: 'Sleek feline scales bark, Paws gripping tightly, Eyes fixed on branches, Nature\'s playground explored.',
        email: 'ethankalbers@gmail.com'
    });

    console.log(catClimbTree2);

    let parrotTalkKitchen2 = await Book.create({
        title: 'Parrot Talks in Kitchen',
        story: 'Vibrant bird chirps loudly, Perched atop chair-back, Observing bustling kitchen, Repeating phrases with gusto.',
        email: 'ethankalbers@gmail.com'
    });

    console.log(parrotTalkKitchen2);

    mongoose.disconnect();
}

seed();