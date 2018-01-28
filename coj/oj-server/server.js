const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const io = socketIO();
const editorSocketService = require('./services/editorSocketService')(io);
const config = require('./config.json');

const SERVER_PORT = config.SERVER_PORT;

// connect mongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://user:user@ds135382.mlab.com:35382/coj');

const restRouter = require('./routes/rest')
const indexRouter = require('./routes/index');

app.use(express.static(path.join(__dirname, '../public/')));
app.use('/', indexRouter);
app.use('/api/v1', restRouter);

app.use((req, res) => {
    console.log(">> server: other case routing, back to browser");
    res.sendFile('index.html', {root: path.join(__dirname, '../public/')});
});

// app.listen(3000, () => console.log('Example app listening on port 3000!'));
const server = http.createServer(app);
io.attach(server);
server.listen(SERVER_PORT);
server.on('listening', onListening);

function onListening(){
    console.log('Example app listening on port 3000!');
}