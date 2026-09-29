const express = require('express');
const router = express.Router();
const {submitCode}= require('../controllers/submitControllers');

router.post('/submit', submitCode);

module.exports = router