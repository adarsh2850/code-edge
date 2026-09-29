const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const submissionQueue = require('../queue/submissionQueue');

async function submitCode(req, res) {
  const { code, problemId } = req.body;

  if (!code || !problemId) {
    return res.status(400).json({ error: 'code and problemId are required' });
  }

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // create submission with PENDING status first
    const submission = await Submission.create({
      problemId,
      code,
      verdict: 'PENDING'
    });

    // add job to queue - worker will process it separately
    await submissionQueue.add('judge', {
      submissionId: submission._id.toString(),
      code,
      testCases: problem.testCases
    });

    // respond immediately - don't wait for execution
    res.json({
      message: 'Submission received',
      submissionId: submission._id,
      verdict: 'PENDING'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

module.exports = { submitCode };