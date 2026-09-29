const express = require('express');
const router = express.Router();
const { getAllProblem, getProblemById } = require('../controllers/problemController');

router.get('/problems', getAllProblem);
router.get('/problems/:id', getProblemById);

module.exports = router;