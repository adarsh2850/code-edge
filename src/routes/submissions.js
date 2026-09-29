const express = require('express');
const router = express.Router();
const { getSubmissionById, getSubmissionsByProblem } = require('../controllers/submissionController');

router.get('/submissions/:id', getSubmissionById);
router.get('/submissions/problem/:problemId', getSubmissionsByProblem);

module.exports = router;