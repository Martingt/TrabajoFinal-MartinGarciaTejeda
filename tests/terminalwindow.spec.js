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
    beforeEach(() => {
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
    });
    it('Should show Martin as user login', () => {
        terminal.loginAs('martin', 'Martinlgt1');
        expect(terminal.getUser().getName()).equal('martin');
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
    it('Should move from / to autos', () => {
        terminal.cd('autos');
        expect(terminal.printWorkingDirectory()).equal('autos');
    });
    it('Should move from autos to / when cd .. command it is sent', () => {
        terminal.cd('autos');
        terminal.cd('..');
        expect(terminal.printWorkingDirectory()).equal('/');
    });
    it('Should not allow the user named martin delete autos folder without permissions', () => {
        terminal.loginAs('martin', 'Martinlgt1');
        expect(terminal.rmdir('autos')).equal('You do not have permissions to remove autos folder');
    });
    it('Should allow the root user delete autos folder', () => {
        expect(terminal.rmdir('autos')).equal('autos has been removed');
    });
    it('Should allow delete autos folder by the owner', () => {
        terminal.loginAs('pedro123', 'pedro1');
        expect(terminal.rmdir('autos')).equal('autos has been removed');
    });
    it('Should change folder permission by the rooter and allow martin to delete it', () => {
        terminal.chmodFolder('autos', '+r', '+w');
        terminal.loginAs('martin', 'Martinlgt1');
        expect(terminal.rmdir('autos')).equal('autos has been removed');

    });
    it('Should change folder permission by the owner and allow martin to delete it', () => {
        terminal.loginAs('pedro123', 'pedro1');
        terminal.chmodFolder('autos', '+r', '+w');
        terminal.loginAs('martin', 'Martinlgt1');
        expect(terminal.rmdir('autos')).equal('autos has been removed');

    });
    it('Should not allow change autos folder permission by martin', () => {
        terminal.loginAs('martin', 'Martinlgt1');
        terminal.chmodFolder('autos', '+r', '+w');
        expect(terminal.rmdir('autos')).equal('You do not have permissions to remove autos folder');

    });
    it('Should martin create a folder named Musica and be the owner', () => {
        terminal.loginAs('martin', 'Martinlgt1');
        terminal.createFolder('Musica')
        expect(terminal.getFolder('Musica').wasCreatedBy(terminal.getUser())).is.true;

    });
    it('Should martin create a folder named Musica and be the owner', () => {
        terminal.loginAs('martin', 'Martinlgt1');
        terminal.createFolder('Musica')
        expect(terminal.getFolder('Musica').wasCreatedBy(terminal.getUser())).is.true;

    });
    it('Should allow martin create a file named Argentina', () => {
        terminal.loginAs('martin', 'Martinlgt1');
        expect(terminal.createFile('Argentina')).equal('Argentina file has been created');
    });
    it('Should not allow martin create a file named Argentina without permissions', () => {
        terminal.loginAs('martin', 'Martinlgt1');
        terminal.cd('autos');
        expect(terminal.createFile('Argentina')).equal('You do not have permissions to create Argentina file');
    });
    it('Should not allow pedro delete a file named Argentina without permissions', () => {
        terminal.loginAs('martin', 'Martinlgt1');
        terminal.createFile('Argentina')
        terminal.loginAs('pedro123', 'pedro1');
        expect(terminal.rm('Argentina')).equal('You do not have permissions to remove Argentina file');
    });
    it('Should  allow martin delete a file named Argentina', () => {
        terminal.loginAs('martin', 'Martinlgt1');
        terminal.createFile('Argentina')
        expect(terminal.rm('Argentina')).equal('Argentina file has been removed');
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