const redisClient = require('../modules/redisClient');
const TIMEOUT_IN_SECONDS = 3600;

module.exports = function(io) {

    // collaboration sessions
    const collaborations = {};
    // {
    //     participants: [1,2,3,4,5]
    // }

    // map from socketId to sessionid
    const sessionPath = '/temp_sessions';
    const socketIdToSessionId = {};

    io.on('connection', (socket)=>{
        const sessionId = socket.handshake.query['sessionId'];
        socketIdToSessionId[socket.id] = sessionId;

        if(sessionId in collaborations){
           collaborations[sessionId]['participants'].push(socket.id);
        } else{
            redisClient.get(sessionPath + '/' + sessionId, data =>{
                if(data){
                    console.log('>> editorSocketService: session terminated previously, pulling back from redis for id:' + sessionId);
                    collaborations[sessionId] = {
                        'cachedInstructions': JSON.parse(data),
                        'participants': []
                    }
                    // console.log(collaborations);
                } else{
                    console.log('>> editorSocketService: create new session for id:' + sessionId);
                    collaborations[sessionId] = {
                        'cachedInstructions': [],
                        'participants': []
                    }
                } 
                collaborations[sessionId]['participants'].push(socket.id);
            })
        }

        socket.on('change', delta =>{
            const sessionId = socketIdToSessionId[socket.id];
            if(sessionId in collaborations){
                collaborations[sessionId]['cachedInstructions'].push(['change', delta, Date.now()]);

                const participants = collaborations[sessionId]['participants'];
                for(let participant of participants){
                    if(socket.id !== participant){
                        io.to(participant).emit('change', delta);
                    }
                }
            }
            else{
                console.error('error');
            }
        });

        // when user reset code, reset buffer
        socket.on('reset', ()=>{
            const sessionId = socketIdToSessionId[socket.id];
            console.log('>> editorSocketService: resetting everything for id:' + sessionId);
            if(sessionId in collaborations){
                collaborations[sessionId]['cachedInstructions'] = [];
            }
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

        socket.on('disconnect', () =>{
            const sessionId = socketIdToSessionId[socket.id];
            let foundAndRemove = false;
            if(sessionId in collaborations){
                const participants = collaborations[sessionId]['participants'];
                const index = participants.indexOf(socket.id);
                delete(socketIdToSessionId[socket.id]);
                if(index >= 0){
                    participants.splice(index, 1);
                    foundAndRemove = true; 
                    if(participants.length == 0){
                        const key = sessionPath + '/' + sessionId;
                        const value = JSON.stringify(collaborations[sessionId]['cachedInstructions']);
                        redisClient.set(key, value, redisClient.redisPrint);
                        redisClient.expire(key, TIMEOUT_IN_SECONDS);
                        delete collaborations[sessionId];
                    }
                }
                // console.log(collaborations);
            }
            if(!foundAndRemove){
                console.error('sessionId not exist for user:' + socket.id + ' at session:' + sessionId);
            }
        });
    });
}