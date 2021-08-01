const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages'); 
const userList = document.getElementById('users');


// Get username from url
const {username} = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
})

const clientSocket = io();

// Join Chatroom
clientSocket.emit('joinRoom', username); 

// Get Room Users 
clientSocket.on('roomUsers', ({users}) =>{
    outputUsers(users)
})

// Message from server
clientSocket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll Down 
    chatMessages.scrollTop = chatMessages.scrollHeight;
}); 

// Message Submit 
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
   
   // Get message text 
   let msg = e.target.elements.msg.value;
   
   msg = msg.trim();
   // Emit message to server 
   clientSocket.emit('chatMessage', msg); 
  
   // Clear message input
   e.target.elements.msg.value = '';
   e.target.elements.msg.focus(); 
}); 


// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message'); 
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += ` <span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.innerText = message.text;
    div.appendChild(para)
    
    document.querySelector('.chat-messages').appendChild(div); 
}

// Add userlist to DOM
function outputUsers(users){
   userList.innerHTML = "";
   
   users.forEach((user) => {
       const circle = '<i class="fas fa-circle"></i>  ';
       const li = document.createElement('li');
       const span = document.createElement('span');
       span.innerHTML = circle;
       if (user.status) {
           span.className = "online"
       } else {
           span.className = "offline"
       }
       li.appendChild(span);
       li.innerHTML +=  user.username;
       userList.appendChild(li)
   }); 

}

// Prompt the user before leaving the chat 
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom? ')
    if(leaveRoom) {
        window.location= '../index.html';
    } else {

    }
})
