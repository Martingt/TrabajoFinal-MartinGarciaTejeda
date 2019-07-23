const {TerminalWindow, Directory, DataBase, Controller} = require('../src/model');
const readlineSync = require('readline-sync');

let ct;
let terminal;
let dataBase = new DataBase();
dataBase.createUser('martin', 'Martinlgt1');
dataBase.createUser('pedro123', 'pedro1');
dataBase.createUser('juan1234', 'juan1');
dataBase.createUser('lucas1234', 'lucas');
let rootUser = dataBase.getUsers().get('root')
let martin = dataBase.getUsers().get('martin');
let pedro = dataBase.getUsers().get('pedro123');
let juan = dataBase.getUsers().get('juan1234');
let lucas = dataBase.getUsers().get('lucas1234');
let root = new Directory('/', null, null);
let autos = new Directory('autos', pedro, root);
let series = new Directory('series', juan, root);
let peugeot = new Directory('peugeot', lucas, autos);
root.addDirectory(autos);
root.addDirectory(series);
autos.addDirectory(peugeot);
terminal = new TerminalWindow(rootUser, root, dataBase);
ct = new Controller(terminal);
let answer = '';

while(answer != 'exit') {
    answer = readlineSync.question(terminal.getUserName()+':'+terminal.printWorkingDirectory()+' ');
    console.log(ct.input(answer));
}