let loggedInUsers = []

class User {
    constructor(userName,userID) {
        this.userID = userID
        this.userName = userName
        this.waitingForGame = true
    }
}

const createUser = (userName,userID) => {
    let newUser = new User(userName,userID);
    
    return newUser
}


module.exports = {loggedInUsers,createUser}
