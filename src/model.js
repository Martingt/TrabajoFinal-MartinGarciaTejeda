const uuidV1 = require('uuid/v1');

class TerminalWindow {
    constructor(user, root, db) {
        this.user = user;
        this.workingDirectory = root;
        this.db = db;
    }

    getDB() {
        return this.db;
    }

    loginAs(userName, password) {
        if(this.getDB().getUsers().has(userName)) {
            let user = this.getDB().getUsers().get(userName);
            if(user.getPassword() == password) {
                this.user = user;
                return;
            }
            return 'Wrong password';
        }
        return 'It does not exist '+userName;
    }
    getUserName() {
        return this.getUser().getName();
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
        this.uuid = uuidV1();
    }

    getName() {
        return this.name;
    }

    getUuid() {
        return this.uuid;
    }
}

class Directory {
   
    constructor(directoryName, user) {
        this.directoryName = directoryName;
        this.uuid = uuidV1();
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

    getUuid() {
        return this.uuid;
    }
}

class User {
    constructor(name, password) {
        this.name = name;
        this.password = password;
        this.uuid = uuidV1();
    }

    getName() {
        return this.name;
    }

    getUuid() {
        return this.uuid;
    }

    getPassword() {
        return this.password;
    }

    
}
class RootUser extends User {
    constructor(name, password) {
        super(name, password);
    }
    
    createUser(userName, password, db) {
        return db.createUser(userName, password);
    }

}
class RegularUser extends User {
    constructor(name, password) {
        super(name, password);
    }

    createUser(userName, password, db) {
        return 'No soy root';
    }
}

class DataBase {
    constructor() {
        this.users = new Map();
        this.users.set('root', new RootUser('root', 'Matroska1'));
    }

    createUser(userName, password) {
        let isUserNameValidOutput = isUserNameValid(userName);
        if(!this.users.has(userName) && isUserNameValidOutput) {
            this.users.set(userName, new RegularUser(userName, password));
            return 'El usuario '+userName+' ha sido creado';
        }
        return 'No se ha podido crear el usuario porque '+(isUserNameValidOutput ? 'ya existe' : 'el nombre no es valido');
    }

    getUsers() {
        return this.users;
    }
}

function isUserNameValid(userName) {
    let length = userName.length;
    if(!(6 <= length && length <= 25)) {
        return false;
    }
    let i=0;
    while (i < length){
        character = userName[i];
        if ( !(97 <= character.charCodeAt() && character.charCodeAt() <= 122) && isNaN(character * 1)  && character != '-' && character != '_'){
            return false;
        }
        i++;
    }
    return true;
}

module.exports = {
    TerminalWindow,
    Directory,
    User,
    DataBase,
    isUserNameValid
};