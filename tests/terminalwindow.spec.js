const {TerminalWindow, Directory, User} = require('../src/model');
const {expect, assert} = require('chai');
// var expect = require('chai').expect;
// var assert = require('chai').assert;
// var should = require('chai').should();

describe('Terminal window', () => {
    let terminal;

    describe('Loggin', () => {
        let martin = new User('Martin');
        beforeEach(() => {
            
            terminal = new TerminalWindow(martin); 
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
            expect(terminal.ls()).equal(lsOutputExpected);
        });
    });
});
describe('Directory description', () => {
    let directory;
    beforeEach(() => {
        directory = new Directory();
    });
    it('Should display directory name', () => {
        expect(directory.getName()).equal('New folder');
    });
    it('Should have a owner', () => {
        expect(directory.getOwnerName()).equal('Martin');
    });
    it('Shouldc')
});
describe('User', () => {
    let user;
    beforeEach(() => {
        user = new User('Martin');
    });
    it('Should display user name', () => {
        expect(directory.getName()).equal('Martin');
    }); 
})