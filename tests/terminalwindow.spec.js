const {TerminalWindow, Directory, User} = require('../src/model');
const {expect, assert} = require('chai');
// var expect = require('chai').expect;
// var assert = require('chai').assert;
// var should = require('chai').should();

// describe('Data base', () => {
//     let db;
//     beforeEach(() => {
//         db = new dataBase();
//     });
// });
describe('Terminal window', () => {
    let terminal;
    let martin = new User('Martin');
    let rootUser = new User('root');
    let root = new Directory('/', rootUser);
    beforeEach(() => {  
        terminal = new TerminalWindow(martin, root); 
    });
    it('Should show Martin as user login', () => {
        terminal.loginAs('Martin', '12345');
        expect(terminal.getUser()).equal(martin);
        expect(terminal.getUserName()).equal('Martin');
    });
    it('Should show the user on the root directory', () => {
        expect(terminal.printWorkingDirectory()).equal('/');
    });
    it('Should create a folder named Movies owned by the user', () => {
        let moviesFolder = new Directory('Movies');
        let lsOutputExpected = [moviesFolder];
        terminal.createFolder('Movies');
        expect(terminal.ls()).equal('Movies'+'\n');
    });
});
describe('Directory description', () => {
    let directory;
    let martin = new User('Martin');
    beforeEach(() => {
        directory = new Directory('Movies', martin);
    });
    it('Should display directory name', () => {
        expect(directory.getName()).equal('Movies');
    });
    it('Should have a owner', () => {
        expect(directory.getOwnerName()).equal('Martin');
    });
});
describe('User', () => {
    let user;
    beforeEach(() => {
        user = new User('Martin');
    });
    it('Should display user name', () => {
        expect(user.getName()).equal('Martin');
    }); 
})