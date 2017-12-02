const express = require('express');
const app = express();
const path = require('path');
// app.get('/', (req, res) => res.send('Hello World!'));

// connect mongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://user:user@ds135382.mlab.com:35382/coj');

const restRouter = require('./routes/rest')
const indexRouter = require('./routes/index');

app.use(express.static(path.join(__dirname, '../public/')));
app.use('/', indexRouter);
app.use('/api/v1', restRouter);

app.use((req, res) => {
    console.log("other case");
    res.sendFile('index.html', {root: path.join(__dirname, '../public/')});
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));