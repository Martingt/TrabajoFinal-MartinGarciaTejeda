const {TerminalWindow, Directory, User, DataBase} = require('../src/model');
const {expect, assert} = require('chai');

// var expect = require('chai').expect;
// var assert = require('chai').assert;
// var should = require('chai').should();

describe('Data base', () => {
    let db;
    beforeEach(() => {
        db = new DataBase();
    });
    it('Should have a root user', () => {
        expect(db.getUsers().has('root')).is.true;
    });
    it('Should create a user named martin', () => {
        db.createUser('martin', '12345');
        expect(db.getUsers().has('martin')).is.true;
    });
    it('Should create a user named coca_2', () => {
        db.createUser('coca_2', 'pepsi');
        expect(db.getUsers().has('coca_2')).is.true;
    });
    it('Should not create a user named coca_2!', () => {
        db.createUser('coca_2!', 'pepsi');
        expect(db.getUsers().has('coca_2!')).is.false;
    });
    it('Should not create a user named Coca_2', () => {
        db.createUser('Coca_2', 'pepsi');
        expect(db.getUsers().has('Coca_2')).is.false;
    });
    it('Should not create a user named coca becouse the length name is 4', () => {
        db.createUser('coca', 'pepsi');
        expect(db.getUsers().has('coca')).is.false;
    });
    it('Should not create a user named martinlaureanogarciatejeda becouse the length name is 26', () => {
        db.createUser('martinlaureanogarciatejeda', 'pepsi');
        expect(db.getUsers().has('martinlaureanogarciatejeda')).is.false;
    });
    it('Should create a user named martinlaureanogarciatejed becouse the length name is 25', () => {
        db.createUser('martinlaureanogarciatejed', 'pepsi');
        expect(db.getUsers().has('martinlaureanogarciatejed')).is.true;
    });
    it('Should create a user named 123456 becouse the length name is 6', () => {
        db.createUser('123456', 'pepsi');
        expect(db.getUsers().has('123456')).is.true;
    });
    it('Should not create duplicated user', () => {
        db.createUser('martin', 'pepsi');
        db.createUser('martin', 'coca');
        db.createUser('martin', 'manaos');
        expect(db.getUsers().size).equal(2);
    });
});
describe('Terminal window', () => {
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
    let root = new Directory('/', rootUser);
    let autos = new Directory('autos', pedro);
    let series = new Directory('series', juan);
    let peugeot = new Directory('peugeot', lucas);
    root.addDirectory(autos);
    root.addDirectory(series);
    autos.addDirectory(peugeot);

    beforeEach(() => {  
        terminal = new TerminalWindow(rootUser, root, dataBase); 
    });
    it('Should show Martin as user login', () => {
        terminal.loginAs('martin', 'Martinlgt1');
        expect(terminal.getUser()).equal(martin);
        expect(terminal.getUserName()).equal('martin');
    });
    it('Should show the user on the root directory', () => {
        expect(terminal.printWorkingDirectory()).equal('/');
    });
    it('Should create a folder named Movies owned by the user', () => {
        terminal.createFolder('Movies');
        expect(terminal.ls()).equal('autos\nseries\nMovies'+'\n');
    });
    it('Should create a user by the root', () => {
        expect(terminal.getUser().createUser('messi_barsa', 'barcelona', terminal.getDB())).equal('El usuario messi_barsa ha sido creado');
    })
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