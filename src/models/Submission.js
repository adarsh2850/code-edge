const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
  code: String,
  verdict: String,
  failedCase: {
    input: String,
    expectedOutput: String,
    actualOutput: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);