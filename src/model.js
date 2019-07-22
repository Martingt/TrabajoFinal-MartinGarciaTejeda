class TerminalWindow {
    constructor(user, root) {
        this.user = user;
        this.workingDirectory = root;
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
        return this.workingDirectory;
    }

    createFolder(folderName) {
        let folder = new Directory(folderName, this.getUser());
        this.getWorkingDirectory().addDirectory(folder);
    }

    ls() {
        let directories = this.getWorkingDirectory().getSubdirectories();
        let files = this.getWorkingDirectory().getFiles();
        let output = '';
        for(let directory of directories) {
            output = output + directory.getName() + '\n';
        }
        for(files of files) {
            output = output + file.getName() + '\n';
        }
        return output;

    }


}

class File {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }
}

class Directory {
   
    constructor(directoryName, user) {
        this.directoryName = directoryName;
        this.subdirectories = [];
        this.files = [];
        this.user = user;
    }

    getName() {
        return this.directoryName;
    }
    getOwnerName() {
        return this.user.getName();
    }

    addDirectory(directory) {
        this.subdirectories.push(directory);
    }

    addFile(file) {
        this.files.push(file);
    }

    getSubdirectories() {
        return this.subdirectories;
    }

    getFiles() {
        return this.files;
    }
}

class User {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }
}



module.exports = {
    TerminalWindow,
    Directory,
    User
};