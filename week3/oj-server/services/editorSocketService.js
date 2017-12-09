module.exports = function(io) {

    // collaboration sessions
    const collaborations = {};
    // {
    //     participants: [1,2,3,4,5]
    // }

    // map from socketId to sessionid
    const socketIdToSessionId = {};

    io.on('connection', (socket)=>{
        // console.log(socket);
        // const message = socket.handshake.query['message'];
        // console.log(message);
        // io.to(socket.id).emit('message', 'hehehehehehash from server');

        const sessionId = socket.handshake.query['sessionId'];
        socketIdToSessionId[socket.id] = sessionId;

        if(!(sessionId in collaborations)){
            collaborations[sessionId] = {
                'participants': [],
            };
        }
        collaborations[sessionId]['participants'].push(socket.id);
        console.log(collaborations);

        socket.on('change', delta =>{
            const sessionId = socketIdToSessionId[socket.id];
            if(sessionId in collaborations){
                const participants = collaborations[sessionId]['participants'];
                for(let participant of participants){
                    if(socket.id !== participant){
                        // console.log('emmiting' + delta);
                        io.to(participant).emit('change', delta);
                    }
                }
            }
            else{
                console.error('error');
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
                        delete collaborations[sessionId];
                    }
                }
                console.log(collaborations);
            }
            if(!foundAndRemove){
                console.error('sessionId not exist for user:' + socket.id + ' at session:' + sessionId);
            }
        });
    });
}