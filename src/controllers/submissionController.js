const Submission = require('../models/Submission');

async function getSubmissionById(req, res) {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

async function getSubmissionsByProblem(req, res) {
  try {
    const submissions = await Submission.find({ problemId: req.params.problemId })
      .sort({ createdAt: -1 })
      .select('verdict createdAt');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

module.exports = { getSubmissionById, getSubmissionsByProblem };