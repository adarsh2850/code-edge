const {Queue} = require('bullmq');
const connection = require('../config/redis');

const submissionQueue = new Queue('submissions', {connection});

module.exports = submissionQueue;