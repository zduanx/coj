const redisClient = require('../modules/redisClient');
const TIMEOUT_IN_SECONDS = 3600;

module.exports = function(io) {

    // collaboration sessions
    const collaborations = {};
    // {
    //     participants: {$id:{$name, $color}}
    // }

    // map from socketId to sessionid
    const sessionPath = '/coj_sessions';
    const socketIdToSessionId = {};

    io.on('connection', (socket)=>{
        const sessionId = socket.handshake.query['sessionId'];
        const sid = socket.id;
        socketIdToSessionId[socket.id] = sessionId;

        if(sessionId in collaborations){
            collaborations[sessionId]['participants'][sid] = {'name': '', 'color':''};
            io.to(socket.id).emit('langChange', collaborations[sessionId]['language']);
        } else{
            redisClient.get(sessionPath + '/' + sessionId, data =>{
                if(data){
                    console.log('>> editorSocketService: session terminated previously, pulling back from redis for id:' + sessionId);
                    data = JSON.parse(data);
                    collaborations[sessionId] = {
                        'cachedInstructions': data['inst'],
                        'language': data['lang'],
                        'participants': {}
                    }
                    // console.log(collaborations);
                } else{
                    console.log('>> editorSocketService: create new session for id:' + sessionId);
                    collaborations[sessionId] = {
                        'cachedInstructions': [],
                        'language': "",
                        'participants': {}
                    }
                } 
                collaborations[sessionId]['participants'][sid] = {'name': '', 'color':''};
                io.to(socket.id).emit('langChange', collaborations[sessionId]['language']);
            })
        }

        // when langChange emit empty string, client will reply langSet
        socket.on('langSet', lang => {
            const sessionId = socketIdToSessionId[socket.id];
            console.log('>> editorSocketService: language change for id:' + sessionId);
            if(sessionId in collaborations){
                collaborations[sessionId]['language'] = lang;
            }
            forwardEvent(socket.id, 'langChange', lang);
        });

        socket.on('change', delta =>{
            const sessionId = socketIdToSessionId[socket.id];
            if(sessionId in collaborations){
                collaborations[sessionId]['cachedInstructions'].push(['change', delta, Date.now()]);
            }

            forwardEvent(socket.id, 'change', delta);
        });

        // when user reset code, reset buffer
        socket.on('reset', ()=>{
            const sessionId = socketIdToSessionId[socket.id];
            console.log('>> editorSocketService: resetting everything for id:' + sessionId);
            if(sessionId in collaborations){
                collaborations[sessionId]['cachedInstructions'] = [];
            }
            forwardEvent(socket.id, 'langChange', collaborations[sessionId]['language']);
        });
        
        // from payson
        socket.on('cursorMove', cursor => {
            // console.log('>> editorSocketService: cursor move for session: ' + socketIdToSessionId[socket.id] + ', socketId:' + socket.id);
            cursor = JSON.parse(cursor);
            cursor['socketId'] = socket.id;
            forwardEvent(socket.id, 'cursorMove', JSON.stringify(cursor));
        });

        socket.on('restoreBuffer', ()=>{
            const sessionId = socketIdToSessionId[socket.id];
            if(sessionId in collaborations){
                const instructions = collaborations[sessionId]['cachedInstructions'];
                for(let instruction of instructions){
                    socket.emit(instruction[0], instruction[1]);
                }
            }
        });

        socket.on('register', (userInfo)=>{
            const sessionId = socketIdToSessionId[socket.id];
            if(sessionId in collaborations && socket.id in collaborations[sessionId]['participants']){
                let newUser = JSON.parse(userInfo);
                collaborations[sessionId]['participants'][socket.id] = newUser;
                forwardEvent(socket.id, 'addUser', JSON.stringify({'id': socket.id, 'name': newUser['name'], 'color': newUser['color']}));
            }
        });

        // following two function will also notify sender
        socket.on('updateColor', (color)=>{
            const sessionId = socketIdToSessionId[socket.id];
            if(sessionId in collaborations && socket.id in collaborations[sessionId]['participants']){
                collaborations[sessionId]['participants'][socket.id]['color'] = color;
                forwardEventAll(socket.id, 'updateColor', JSON.stringify({'id': socket.id, 'color': color}));
            }
        });

        socket.on('updateUserName', (username)=>{
            const sessionId = socketIdToSessionId[socket.id];
            if(sessionId in collaborations && socket.id in collaborations[sessionId]['participants']){
                collaborations[sessionId]['participants'][socket.id]['name'] = username;
                forwardEventAll(socket.id, 'updateUserName', JSON.stringify({'id': socket.id, 'name': username}));
            }
        });

        // load all existing users
        socket.on('restoreUser', ()=>{
            const sessionId = socketIdToSessionId[socket.id];
            if(sessionId in collaborations){
                for(let uid of Object.keys(collaborations[sessionId]['participants'])){
                    io.to(socket.id).emit(
                        'addUser', 
                        JSON.stringify({
                            'id': uid,
                            'name': collaborations[sessionId]['participants'][uid]['name'],
                            'color': collaborations[sessionId]['participants'][uid]['color']
                        })
                    );
                }
            }
        });

        socket.on('querySID', ()=>{
            io.to(socket.id).emit('querySID', socket.id);
        });

        socket.on('deleteMyself', ()=>{
            forwardEvent(socket.id, 'deleteUser', socket.id);
            cleanUpId(socket.id);
        });

        socket.on('disconnect', () =>{
            forwardEvent(socket.id, 'deleteUser', socket.id);
            cleanUpId(socket.id);
        });
    });

    const cleanUpId = function(socketId){
        console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
        if(socketId in socketIdToSessionId){
            const sessionId = socketIdToSessionId[socketId];
            delete socketIdToSessionId[socketId];
            let foundAndRemove = false;
            if(sessionId in collaborations){
                const participants = collaborations[sessionId]['participants'];
                foundAndRemove = socketId in participants;
                if(foundAndRemove){
                    delete participants[socketId];
                    foundAndRemove = true; 
                    if(Object.keys(participants).length == 0){
                        console.log('>> editorSocketService: everyone left, save redis for id:' + sessionId);
                        const key = sessionPath + '/' + sessionId;
                        const value = JSON.stringify({'inst': collaborations[sessionId]['cachedInstructions'], 'lang': collaborations[sessionId]['language']});
                        redisClient.set(key, value, redisClient.redisPrint);
                        redisClient.expire(key, TIMEOUT_IN_SECONDS);
                        delete collaborations[sessionId];
                    }
                }
                // console.log(collaborations);
            }
            if(!foundAndRemove){
                console.error('sessionId not exist for user:' + socketId + ' at session:' + sessionId);
            }
        }
    };

    // from payson
    const forwardEvent = function(socketId, eventName, dataString) {
        const sessionId = socketIdToSessionId[socketId];
        if (sessionId in collaborations) {
            const participants = collaborations[sessionId]['participants'];

            for(let participant of Object.keys(participants)) {
                if (socketId != participant) {
                    io.to(participant).emit(eventName, dataString);
                }
            }
        } else {
            console.warn('<< editorSocketService --- WARNING: sessionId should exist');
        }
    }
    const forwardEventAll = function(socketId, eventName, dataString) {
        const sessionId = socketIdToSessionId[socketId];
        if (sessionId in collaborations) {
            const participants = collaborations[sessionId]['participants'];

            for(let participant of Object.keys(participants)) {
                io.to(participant).emit(eventName, dataString);
            }
        } else {
            console.warn('<< editorSocketService --- WARNING: sessionId should exist');
        }
    }
}