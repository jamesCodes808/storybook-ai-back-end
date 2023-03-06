const mongoose = require('mongoose');
const Book = require('./models/book');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL);

seed = async () => {
  await Book.create({
    title: 'The Giver',
    description: 'The Giver is a 1993 American young adult dystopian novel written by Lois Lowry, set in a society which at first appears to be utopian but is revealed to be dystopian as the story progresses. In the novel, the society has taken away pain and strife by converting to "Sameness", a plan that has also eradicated emotional depth from their lives. In an effort to preserve order, the society also lacks any color, climate, terrain, and a true sense of equality. The protagonist of the story, a 12-year-old boy named Jonas, is selected to inherit the position of Receiver of Memory, the person who stores all the past memories of the time before Sameness. Jonas struggles with concepts of the new emotions and things introduced to him, and whether they are inherently good, evil, or in between, and whether it is possible to have one without the other.' ,
    status: 'Read',
  })

  await Book.create({
    title: 'The Outsiders',
    description: 'The Outsiders is a coming-of-age novel by S.E. Hinton, first published in 1967 by Viking Press. Hinton was only 15 when she started writing the novel; however, she did most of the work when she was 16 and a junior in high school. Hinton was 18 when the book was published. The book details the conflict between two rival gangs divided by their socioeconomic status: the working-class "greasers" and the upper-class "Socs". The story is told in first-person perspective by teenage protagonist Ponyboy Curtis',
    status: 'Read'
  })

  await Book.create({
    title: 'Animal Farm',
    description: 'Animal Farm is a beast fable, in the form of a satirical allegorical novella, by George Orwell, first published in England on 17 August 1945.It tells the story of a group of farm animals who rebel against their human farmer, hoping to create a society where the animals can be equal, free, and happy. Ultimately, the rebellion is betrayed, and under the dictatorship of a pig named Napoleon, the farm ends up in a state as bad as it was before.',
    status: 'Read',
  })

  console.log('seeding data');

  mongoose.disconnect();
}

seed();