class TerminalWindow {
    constructor(user) {
        this.user = user;
    }

    loginAs(userName) {
        this.userName = userName;
    }
    getUserName() {
        return this.userName;
    }

    printWorkingDirectory() {
        return '/';
    }

    getUser() {
        return this.user;
    }

    getWorkingDirectory() {
        return this.getWorkingDirectory();
    }

    createFolder(folderName) {
        let folder = new Directory(folderName, this.getUser());
        this.getWorkingDirectory().add(folder);
    }


}

class Directory {
    constructor() {
    }

    getName() {
        return 'New folder';
    }
    getOwnerName() {
        return 'Martin';
    }
}

class User {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return 'New folder';
    }
    getOwnerName() {
        return 'Martin';
    }
}



module.exports = {
    TerminalWindow,
    Directory,
    User
};