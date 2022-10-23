let loggedInUsers = []

class User {
    constructor(userName,userID,game) {
        this.userID = userID
        this.userName = userName
        this.color = null
    }
}

const createUser = (userName,userID) => {
    let newUser = new User(userName,userID);    
    return newUser
}


module.exports = {loggedInUsers,createUser}
