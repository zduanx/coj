const express = require('express');
const app = express();
const restRouter = require('./routes/rest')
// app.get('/', (req, res) => res.send('Hello World!'));

// connect mongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://user:user@ds135382.mlab.com:35382/coj');

app.use('/api/v1', restRouter);

app.listen(3000, () => console.log('Example app listening on port 3000!'));