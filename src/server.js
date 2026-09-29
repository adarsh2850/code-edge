require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const submitRoute = require('./routes/submit');
const problemsRoute = require('./routes/problems');
const submissionsRoute = require('./routes/submissions')

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', submitRoute);
app.use('/api', problemsRoute);
app.use('/api', submissionsRoute);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error :', err));

app.get('/', (req, res) => {
    res.send('code-edge API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});