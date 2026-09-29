require('dotenv').config();
const mongoose = require('mongoose');
const Problem = require('./models/Problem');

const problems = [
  {
    title: 'Add Two Numbers',
    description: 'Read two integers and print their sum.',
    difficulty: 'Easy',
    tags: ['math', 'basics'],
    testCases: [
      { input: '3 4\n', expectedOutput: '7' },
      { input: '10 20\n', expectedOutput: '30' },
      { input: '-5 5\n', expectedOutput: '0' }
    ]
  },
  {
    title: 'Multiply Two Numbers',
    description: 'Read two integers and print their product.',
    difficulty: 'Easy',
    tags: ['math', 'basics'],
    testCases: [
      { input: '3 4\n', expectedOutput: '12' },
      { input: '0 99\n', expectedOutput: '0' },
      { input: '-2 6\n', expectedOutput: '-12' }
    ]
  },
  {
    title: 'Even or Odd',
    description: 'Read an integer n. Print "Even" if n is even, otherwise print "Odd".',
    difficulty: 'Easy',
    tags: ['math', 'conditionals'],
    testCases: [
      { input: '4\n', expectedOutput: 'Even' },
      { input: '7\n', expectedOutput: 'Odd' },
      { input: '0\n', expectedOutput: 'Even' }
    ]
  },
  {
    title: 'Maximum of Three',
    description: 'Read three integers and print the largest one.',
    difficulty: 'Easy',
    tags: ['conditionals'],
    testCases: [
      { input: '1 2 3\n', expectedOutput: '3' },
      { input: '9 4 6\n', expectedOutput: '9' },
      { input: '-1 -5 -3\n', expectedOutput: '-1' }
    ]
  },
  {
    title: 'Reverse a String',
    description: 'Read a single word (no spaces) and print it reversed.',
    difficulty: 'Easy',
    tags: ['strings'],
    testCases: [
      { input: 'hello\n', expectedOutput: 'olleh' },
      { input: 'a\n', expectedOutput: 'a' },
      { input: 'racecar\n', expectedOutput: 'racecar' }
    ]
  },
  {
    title: 'Palindrome Check',
    description: 'Read a single word. Print "YES" if it reads the same forwards and backwards, otherwise "NO".',
    difficulty: 'Medium',
    tags: ['strings'],
    testCases: [
      { input: 'level\n', expectedOutput: 'YES' },
      { input: 'hello\n', expectedOutput: 'NO' },
      { input: 'abba\n', expectedOutput: 'YES' }
    ]
  },
  {
    title: 'Factorial',
    description: 'Read an integer n (0 <= n <= 12) and print n!.',
    difficulty: 'Medium',
    tags: ['math', 'loops'],
    testCases: [
      { input: '5\n', expectedOutput: '120' },
      { input: '0\n', expectedOutput: '1' },
      { input: '10\n', expectedOutput: '3628800' }
    ]
  },
  {
    title: 'Nth Fibonacci Number',
    description: 'Read n (0 <= n <= 30). Print the nth Fibonacci number, where F(0)=0 and F(1)=1.',
    difficulty: 'Medium',
    tags: ['math', 'dp'],
    testCases: [
      { input: '0\n', expectedOutput: '0' },
      { input: '10\n', expectedOutput: '55' },
      { input: '30\n', expectedOutput: '832040' }
    ]
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Problem.deleteMany({});
  // optional, add inside seed() after Problem.deleteMany({})
  await require('./models/Submission').deleteMany({});
  const inserted = await Problem.insertMany(problems);
  console.log(`Inserted ${inserted.length} problems`);
  await mongoose.disconnect();
}

seed();