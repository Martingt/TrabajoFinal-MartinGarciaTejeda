var prompt = require('prompt');
const {TerminalWindow, Directory, DataBase, User, isUserNameValid} = require('../src/model');
const uuidV1 = require('uuid/v1');

let dataBase
    let terminal;
    
    dataBase = new DataBase();
    dataBase.createUser('martin', 'Martinlgt1');
    dataBase.createUser('pedro123', 'pedro1');
    dataBase.createUser('juan1234', 'juan1');
    dataBase.createUser('lucas1234', 'lucas');
    let rootUser = dataBase.getUsers().get('root')
    let martin = dataBase.getUsers().get('martin');
    let pedro = dataBase.getUsers().get('pedro123');
    let juan = dataBase.getUsers().get('juan1234');
    let lucas = dataBase.getUsers().get('lucas1234');
    let root = new Directory('/', rootUser);
    let autos = new Directory('autos', pedro);
    let series = new Directory('series', juan);
    let peugeot = new Directory('peugeot', lucas);
    root.addDirectory(autos);
    root.addDirectory(series);
    autos.addDirectory(peugeot);

    terminal = new TerminalWindow(rootUser, root, dataBase); 

    terminal.loginAs('martin', 'Martinlgt1');

    console.log(terminal.getUser());
    console.log(martin);
        
//   readline.question(`What's your name?`, (name) => {
//     console.log(`Hi ${name}!`)
//     readline.close()
//   })

// console.log(uuidV1());

// let map = new Map();
// //let caca = [1 : 'pepe'};
// map.set(1,'pepe');
// map.set('hi','choto');

// // while('./exit') {

// // }

// console.log(map);
// // let terminal;
// // let martin = new User('Martin');
// // let rootUser = new User('root');
// // let root = new Directory('/', rootUser);

// // terminal = new TerminalWindow(martin, root);
// // terminal.createFolder('Movies');

// // let directories = terminal.getWorkingDirectory().getSubdirectories();
// //         //let files = terminal.getWorkingDirectory().getFiles();
// //         let output = '';
// //         for(let directory of directories) {
// //             output = output + directory.getName() + '\n';
// //         }

// // console.log(terminal.getWorkingDirectory());
// // console.log(output);
// // console.log('Movies'+'\n');
// // console.log(terminal.ls());


// // // class TerminalWindow {

// // // }
// // //
// // // Start the prompt
// // //
// // console.log('puto');
// // prompt.start();

// // //
// // // Get two properties from the user: username and email
// // //
// // prompt.get(['pt', 'email'], function (err, result) {
// //   //
// //   // Log the results.
// //   //
// //   console.log('Command-line input received:');
// //   console.log('  username: ' + result.username);
// //   console.log('  email: ' + result.email);
// // });