let waitingUsers = []
let playingUsers = []

class User {
    constructor(userName,userID) {
        this.userName = userName
        this.userID = userID
        this.color = null
        this.game = null
    }
}

module.exports = {User, waitingUsers, playingUsers}
