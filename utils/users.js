const users = [];

// Join user to chat 
function userJoin(id, username, status) {
    const user = {id, username, status};
    users.push(user);
    
    return user;
}

// Get current user 
function getCurrentUser(id) {
    return users.find(user => user.id === id)
}

// User Leaves the chat 

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        users[index].status = false;
        return users[index];
    }
}

function getUsers() {
    return users;
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getUsers,
}

