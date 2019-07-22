var prompt = require('prompt');
const {TerminalWindow, Directory, User} = require('../src/model');
 
// let terminal;
// let martin = new User('Martin');
// let rootUser = new User('root');
// let root = new Directory('/', rootUser);

// terminal = new TerminalWindow(martin, root);
// terminal.createFolder('Movies');

// let directories = terminal.getWorkingDirectory().getSubdirectories();
//         //let files = terminal.getWorkingDirectory().getFiles();
//         let output = '';
//         for(let directory of directories) {
//             output = output + directory.getName() + '\n';
//         }

// console.log(terminal.getWorkingDirectory());
// console.log(output);
// console.log('Movies'+'\n');
// console.log(terminal.ls());


// // class TerminalWindow {

// // }
// //
// // Start the prompt
// //
// console.log('puto');
// prompt.start();

// //
// // Get two properties from the user: username and email
// //
// prompt.get(['pt', 'email'], function (err, result) {
//   //
//   // Log the results.
//   //
//   console.log('Command-line input received:');
//   console.log('  username: ' + result.username);
//   console.log('  email: ' + result.email);
// });