const path = require('path');
const http = require('http'); 
const socketio = require('socket.io');
const express = require('express'); 
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getUsers} = require('./utils/users')

const app = express();
const server = http.createServer(app); 
const io = socketio(server); 


// Set Static Folder 
app.use(express.static(path.join(__dirname, 'public'))); 

const botName = 'ChatRoom'; 

// Run when client connects 
io.on('connection', socket => {

    socket.on('joinRoom', (username) => {
        const status = true;
        const user = userJoin(socket.id, username, status);
        socket.join(user);

        // Welcome current user 
        socket.emit('message', formatMessage(botName,'You joined. Welcome to Chatroom.')); 

        // Broadcast when a user connects 
        socket.broadcast.emit('message', formatMessage(botName, `${user.username} has joined the chat`)); 

        // Send user info
        io.emit('roomUsers', {users: getUsers()});

    });
   

    // Listen for chat message 
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id); 
        socket.emit('message', formatMessage('You', msg));
        socket.broadcast.emit('message', formatMessage(user.username, msg));
        // io.emit('message', formatMessage(user.username, msg));
    });


    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id); 
        if(user) {
            io.emit('message', formatMessage(botName,`${user.username} has left the chat`));
            
             // Send user info
            io.emit('roomUsers', {users: getUsers()});
        }
       
    });
   
})


const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))