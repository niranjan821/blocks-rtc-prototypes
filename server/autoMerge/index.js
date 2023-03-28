const io = require('socket.io')(8001, {
    cors: {
        origin: ['http://localhost:3000']
    }
});

io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on('nodes', data => {
        socket.broadcast.emit('nodes', data)
    })
});