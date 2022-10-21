let loggedInUsers = []
let loggedInUsersCount = 0

class User {
    constructor(userID,userName) {
        this.userID = userID
        this.userName = userName
    }
}

const createUser = (userName) => {
    let newUser = new User(loggedInUsersCount,userName);
    loggedInUsers.push(newUser)

    loggedInUsersCount ++ 
}


module.exports = {loggedInUsers,createUser}
