const { Worker } = require('bullmq');
const connection = require('../config/redis');
const executeCpp = require('../executor');
const Submission = require('../models/Submission');
const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Worker : MongoDB connected'))
  .catch((err) => console.error('Worker: MongoDB connection error:', err));

const worker = new Worker('submissions', async (job) => {
  const { submissionId, code, testCases } = job.data;

  let finalVerdict = 'SUCCESS';
  let failedCase = null;

  for (const testCase of testCases) {
    const result = await executeCpp(code, testCase.input);

    if (result.verdict !== 'SUCCESS') {
      finalVerdict = result.verdict;
      break;
    }

    const actualOutput = result.stdout.trim();
    const expectedOutput = testCase.expectedOutput.trim();

    if (actualOutput !== expectedOutput) {
      finalVerdict = 'WRONG_ANSWER';
      failedCase = {
        input: testCase.input,
        expectedOutput,
        actualOutput
      };
      break;
    }
  }

  await Submission.findByIdAndUpdate(submissionId, { verdict: finalVerdict, failedCase });
  console.log(`Submission ${submissionId} processed: ${finalVerdict}`);

}, { connection });

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

console.log('Worker is listening for jobs...');