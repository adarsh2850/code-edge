const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
    input: String,
    expectedOutput: String
});

const problemSchema = new mongoose.Schema({
title: {type: String, required: true},
description: String,
difficulty: {type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy'},
tags:[String],
testCases: [testCaseSchema]
});

module.exports = mongoose.model('Problem', problemSchema);