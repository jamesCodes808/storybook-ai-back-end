const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL);

const Book = require('./models/BookModel');

async function seed() {
    let dogRunPark = await Book.create({
        title: 'Dog Runing in Park',
        story: 'Dog dashes through park, Paws pounding on dirt. Tail wagging wildly, Tongue lolling out merrily.'
    });

    console.log(dogRunPark);

    let catClimbTree = await Book.create({
        title: 'Cat Climbs Tree',
        story: 'Sleek feline scales bark, Paws gripping tightly, Eyes fixed on branches, Nature\'s playground explored.'
    });

    console.log(catClimbTree);

    let parrotTalkKitchen = await Book.create({
        title: 'Parrot Talks in Kitchen',
        story: 'Vibrant bird chirps loudly, Perched atop chair-back, Observing bustling kitchen, Repeating phrases with gusto.'
    });

    console.log(parrotTalkKitchen);

    mongoose.disconnect();
}

seed();