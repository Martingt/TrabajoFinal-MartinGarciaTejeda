const uuidV1 = require('uuid/v1');

class Controller {
    constructor(terminal) {
        this.terminal = terminal;
    }

    input(answer) {
        let answerSplited = answer.split(' ');
        if(answerSplited[0] == 'write') {
            let text = '';
            for(let i = 2; i < answerSplited.length; i++) {
                text = text + ' ' + answerSplited[i];
                
            }
           
            return this.terminal.writeOn(answerSplited[1], text);
        }
        if(answerSplited.length == 1) {
            switch(answerSplited[0]) {
                case 'ls':
                    return this.terminal.ls();
                case 'exit':
                    return 'Good bye!';
                default:
                    return 'Command not found';
            }
        }
        else if(answerSplited.length == 2) {
            switch(answerSplited[0]) {
                case 'cd':
                    this.terminal.cd(answerSplited[1]);
                    return '';
                case 'create':
                    return this.terminal.createFile(answerSplited[1]);
                case 'cat':
                    return this.terminal.read(answerSplited[1]);
                case 'mkdir':
                        return this.terminal.createFolder(answerSplited[1]);
                case 'rm':
                        return this.terminal.rm(answerSplited[1]);
                case 'rmdir':
                        return this.terminal.rmdir(answerSplited[1]);
                default:
                    return 'Command not found';   
            }
        } 
        else if(answerSplited.length == 3) {
            switch(answerSplited[0]) {
                case 'login':
                    return this.terminal.loginAs(answerSplited[1], answerSplited[2]);
                case 'newUser':
                    return this.terminal.createUser(answerSplited[1], answerSplited[2]);
                default:
                    return 'Command not found';

            }
        }
        else if(answerSplited.length == 4) {
            if(answerSplited[0] == 'chmod') {
                return this.terminal.chmodFile(answerSplited[1], answerSplited[2], answerSplited[3]);
            }
        }
        else if(answerSplited.length == 5) {
            if(answerSplited[0] == 'chmod') {
                return this.terminal.chmodFile(answerSplited[1], answerSplited[2], answerSplited[3], answerSplited[4]);
            }
        }
        return 'Command not found';
    }
}

class TerminalWindow {
    constructor(user, root, db) {
        this.user = user;
        this.workingDirectory = root;
        this.root = root;
        this.db = db;
    }

    createUser(userName, password) {
        if(this.isRootUserOnTerminal()){
            return this.db.createUser(userName, password);
        } else {
            return 'You can not create users';
        }
    }

    getDB() {
        return this.db;
    }

    loginAs(userName, password) {
        if(this.getDB().getUsers().has(userName)) {
            let user = this.getDB().getUsers().get(userName);
            if(user.getPassword() == password) {
                this.user = user;
                this.workingDirectory = this.root;
                return '';
            }
            return 'Wrong password';
        }
        return 'It does not exist '+userName;
    }
    getUserName() {
        return this.getUser().getName();
    }

    printWorkingDirectory() {
        return this.getWorkingDirectory().getName();
    }

    getUser() {
        return this.user;
    }

    getWorkingDirectory() {
        return this.workingDirectory;
    }

    createFolder(folderName) {
        if(this.userHasPermissionToWriteOn(this.getWorkingDirectory())) {
            let folder = new Directory(folderName, this.getUser(), this.getWorkingDirectory());
            this.getWorkingDirectory().addDirectory(folder);
            return folderName+' folder has been created';
        }
        return 'You do not have permissions to create '+folderName+' folder';
    }

    createFile(fileName) {
        if(this.userHasPermissionToWriteOn(this.getWorkingDirectory())) {
            let file = new File(fileName, this.getUser());
            this.getWorkingDirectory().addFile(file);
            return fileName+' file has been created';
        }
        return 'You do not have permissions to create '+fileName+' file';
    }

    ls() {
        let directories = this.getWorkingDirectory().getSubdirectories();
        let files = this.getWorkingDirectory().getFiles();
        let output = '\n';
        for(let directory of directories.values()) {
            output = output + directory.getName() + '\n';
        }
        for(let file of files.values()) {
            output = output + file.getName() + '\n';
        }
        return output;
    }

    cd(folderName) {
        if(folderName == '..') {
            let directory = this.getWorkingDirectory().getDirectoryParent();
            if(directory != null) {
                this.workingDirectory = directory;
            }
        } else {
            let folders = folderName.split('/');
            let workingDirectoryBackup = this.getWorkingDirectory();
            if(folders[0] == '') { 
                folders.shift();
                this.workingDirectory = this.root;
            }
            if(folders[0] != '') {
                for(let folder of folders) {
                    if(this.isFolderExist(folder)) {
                        let directory = this.getFolder(folder);
                        if(this.userHasPermissionToReadOn(directory)) {
                            this.workingDirectory = directory;
                        } else {
                            this.workingDirectory = workingDirectoryBackup;
                            return 'You do not have permissions to access '+folder+' folder';
                        }
                    } else {
                        this.workingDirectory = workingDirectoryBackup;
                        return 'It does not exist '+folder;
                    }
                }
            }
        }
    }

    writeOn(fileName, text) {
        if(this.isFileExist(fileName)) {
            let file = this.getFile(fileName);
            if(this.userHasPermissionToWriteOn(file)) {
                this.getWorkingDirectory().getFiles().get(fileName).setContent(text);
                return fileName+' file content is '+text;
            }
            return 'You do not have permissions to write on '+fileName+' file';
        }
        return 'It does not exist '+fileName;
    }


    read(fileName) {
        if(this.isFileExist(fileName)) {
            let file = this.getFile(fileName);
            if(this.userHasPermissionToReadOn(file)) {
                return this.getWorkingDirectory().getFiles().get(fileName).getContent();
            }
            return 'You do not have permissions to read '+fileName+' file';
        }
        return 'It does not exist '+fileName;
    }

    rm(fileName) {
        if(this.isFileExist(fileName)) {
            let file = this.getFile(fileName);
            if(this.userHasPermissionToWriteOn(file)) {
                this.getWorkingDirectory().getFiles().delete(fileName);
                return fileName+' file has been removed';
            }
            return 'You do not have permissions to remove '+fileName+' file';
        }
        return 'It does not exist '+fileName;
    }

    rmdir(folderName) {
        if(this.isFolderExist(folderName)) {
            let directory = this.getFolder(folderName);
            if(this.userHasPermissionToWriteOn(directory)) {
                this.getWorkingDirectory().getSubdirectories().delete(folderName);
                return folderName+' has been removed';
            }
            return 'You do not have permissions to remove '+folderName+' folder';
        }
        return 'It does not exist '+folderName;
    }

    userHasPermissionToWriteOn(archive) {
        if(this.isRootUserOnTerminalOrIsUserOwnerOf(archive) || this.isAllUsersAllowedToWriteOn(archive)) {
            return true;
        } 
        return false;
    }

    userHasPermissionToReadOn(archive) {
        if(this.isRootUserOnTerminalOrIsUserOwnerOf(archive) || this.isAllUsersAllowedToReadOn(archive)) {
            return true;
        } 
        return false;
    }


    isRootUserOnTerminalOrIsUserOwnerOf(archive) {
        if(this.isRootUserOnTerminal() || this.isUserOwnerOf(archive)) {
            return true;
        }
        return false;
    }

    isRootUserOnTerminal() {
        return this.getUser().isNamed('root');
    }

    isAllUsersAllowedToWriteOn(archive) {
        return archive.getPermissions().getWritePermissionForAllUsers();
    }

    isAllUsersAllowedToReadOn(archive) {
        return archive.getPermissions().getReadPermissionForAllUsers();
    }

    isUserOwnerOf(arhive) {
        return arhive.wasCreatedBy(this.getUser());
    }



    isFolderExist(folderName) {
        return this.getWorkingDirectory().getSubdirectories().has(folderName);
    }

    isFileExist(fileName) {
        return this.getWorkingDirectory().getFiles().has(fileName);
    }

    getFolder(folderName) {
        return this.getWorkingDirectory().getSubdirectories().get(folderName);
    }

    getFile(fileName) {
        return this.getWorkingDirectory().getFiles().get(fileName);
    }

    chmodFolder(folderName, readPermissionForAllUsers, writePermissionForAllUsers) {
        if((this.isFolderExist(folderName))) {
            let directory = this.getFolder(folderName);
            if(this.isRootUserOnTerminalOrIsUserOwnerOf(directory)) {
                directory.getPermissions().setReadPermissionForAllUsers(readPermissionForAllUsers);
                directory.getPermissions().setWritePermissionForAllUsers(writePermissionForAllUsers);
                return 'Done!';
            } else {
                return 'You do not have permissions';
            }
        } 
        return 'It does not exist '+folderName;
    }

    chmodFile(fileName, readPermissionForAllUsers, writePermissionForAllUsers, executePermissionForAllUsers) {
        if(!(this.getWorkingDirectory().getFiles().has(fileName))) {
            return 'It does not exist '+fileName;
        } 
        let file = this.getWorkingDirectory().getFiles().get(fileName);
        if(this.getUser().getName() == 'root' || file.getOwnerName() == this.getUser().getName()) {
            file.getPermissions().setReadPermissionForAllUsers(readPermissionForAllUsers);
            file.getPermissions().setWritePermissionForAllUsers(writePermissionForAllUsers);
            file.getPermissions().setExecutePermissionForAllUsers(executePermissionForAllUsers);
            return 'Done!';
        } else {
            return 'You do not have permissions';
        }
    }


}

class Permissions {
    constructor(readPermissionForAllUsers, writePermissionForAllUsers) {
        this.readPermissionForAllUsers = readPermissionForAllUsers;
        this.writePermissionForAllUsers = writePermissionForAllUsers;
    }

    getReadPermissionForAllUsers() {
        return this.readPermissionForAllUsers;
    }

    getWritePermissionForAllUsers() {
        return this.writePermissionForAllUsers;
    }

    setReadPermissionForAllUsers(readPermission) {
        if(readPermission == '+r') {
            this.readPermissionForAllUsers = true;
        }
        else if(readPermission == '-r') {
            this.readPermissionForAllUsers = false;
        }
    }

    setWritePermissionForAllUsers(writePermission) {
        if(writePermission == '+w') {
            this.writePermissionForAllUsers = true;
        }
        else if(writePermission == '-w') {
            this.writePermissionForAllUsers = false;
        }
    }
}

class DirectoryPermissions extends Permissions {
    constructor(readPermissionForAllUsers, writePermissionForAllUsers) {
        super(readPermissionForAllUsers, writePermissionForAllUsers);
    }
}

class FilePermissions extends Permissions {
    constructor(readPermissionForAllUsers, writePermissionForAllUsers) {
        super(readPermissionForAllUsers, writePermissionForAllUsers);
        this.executePermissionForAllUsers = false;
    }

    getExecutePermissionForAllUsers() {
        return this.executePermissionForAllUsers;
    }

    setExecutePermissionForAllUsers(executePermission) {
        if(executePermission == '+x') {
            this.executePermissionForAllUsers = true;
        }
        else if(executePermission == '-x') {
            this.executePermissionForAllUsers = false;
        }
    }
}

class File {
    constructor(name, user) {
        this.name = name;
        this.uuid = uuidV1();
        this.permissions = new FilePermissions(true, false);
        this.user = user;
        this.content = '';
    }

    getContent() {
        return this.content;
    }

    setContent(text) {
        this.content = text;
    }

    getOwnerName() {
        return this.user.getName();
    }

    getName() {
        return this.name;
    }

    getUuid() {
        return this.uuid;
    }

    getPermissions() {
        return this.permissions;
    }

    wasCreatedBy(user) {
        return this.user == user;
    }
}

class Directory {
   
    constructor(directoryName, user, directoryParent) {
        this.directoryName = directoryName;
        this.directoryParent = directoryParent;
        this.uuid = uuidV1();
        if(user == null) {
            this.permissions = new DirectoryPermissions(true, true);
        } else {
            this.permissions = new DirectoryPermissions(true, false);
        }
        this.subdirectories = new Map();
        this.files = new Map();
        this.user = user;
    }


    wasCreatedBy(user) {
        return this.user == user;
    }

    getPermissions() {
        return this.permissions;
    }

    getName() {
        return this.directoryName;
    }
    getOwnerName() {
        return this.user.getName();
    }

    getDirectoryParent() {
        return this.directoryParent;
    }

    addDirectory(directory) {
        this.subdirectories.set(directory.getName(), directory);
    }

    addFile(file) {
        this.files.set(file.getName(), file);
    }

    getDirectory(directoryName) {
        return this.subdirectories.get(directoryName);
    }

    getFile(fileName) {
        return this.subdirectories.get(fileName);
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

    isNamed(name) {
        return this.name == name;
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
            return 'The user '+userName+' has been created';
        }
        return 'The user could not be created because '+(isUserNameValidOutput ? 'it is already existed' : 'the name is not valid');
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
    isUserNameValid,
    Controller
};