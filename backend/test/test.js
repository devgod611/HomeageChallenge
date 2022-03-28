var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var should = chai.should();
var Book = require('../models').Book;
var Center = require('../models').Center;
var Nurse = require('../models').Nurse;
var Nurse_Workday = require('../models').Nurse_Workday;

chai.use(chaiHttp);

describe('Book API', function(){
    //Before each test we empty the database
    // beforeEach(function(done){
    //     Book.destroy({
    //         where: {},
    //         truncate: true
    //     });
    //     done();
    // });
    describe('/GET books', function(){
        it('Getting all books', function(done){
            chai.request(app).get('/books').end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
        });
    });
    describe('/POST books', function(){
        it('Insert new book', function(done){
            var book = {
                name: 'Kyle',
                center: 'Bukit Batok CC',
                nric: '0000',
                date: '2022-03-19',
                slot_number: 0
            }
            chai.request(app).post('/books').send(book).end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
    });
    describe('/GET/:id books', function(){
        it('Get book by id', function(done){
            Book.create({
                name: 'Kyle',
                center: 'Bukit Batok CC',
                nric: '0000',
                date: '2022-03-19',
                slot_number: 0
            }).then(function(book){
                chai.request(app).get('/books/'+book.id).end(function(err, res){
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
            });
        });
        it('Get book by not existed id', function(done){
            chai.request(app).get('/books/100').end(function(err, res){
                res.should.have.status(400);
                res.body.should.equal('This entry is not found');
                done();
            })
        });
        it('Get book by invalid id', function(done){
            chai.request(app).get('/books/abc').end(function(err, res){
                res.should.have.status(400);
                res.body.should.equal('Invalid ID supplied');
                done();
            });
        });
    });
    describe('/PUT/:id books', function(){
        it('Update book by id', function(done){
            Book.create({
                name: 'Kyle',
                center: 'Bukit Batok CC',
                nric: '0000',
                date: '2022-03-19',
                slot_number: 0
            }).then(function(book){
                var bookEdit = {
                    name: 'John',
                    center: 'Bukit Batok CC',
                    nric: '0001',
                    date: '2022-03-19',
                    slot_number: 0
                }
                chai.request(app).put('/books/'+book.id).send(bookEdit).end(function(err, res){
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
            })
        });
    });
    describe('/DELETE/:id books', function(){
        it('Delete book by id', function(done){
            Book.create({
                name: 'Kyle',
                center: 'Kyle Center',
                nric: '0000',
                date: '2022-03-19',
                slot_number: 0
            }).then(function(book){
                chai.request(app).delete('/books/'+book.id).end(function(err, res){
                    res.should.have.status(200);
                    res.body.should.equal(1);
                    done();
                });
            })
        });
    });
});


describe('Nurse API', function(){
    //Before each test we empty the database
    // beforeEach(function(done){
    //     Nurse.destroy({
    //         where: {},
    //         truncate: true
    //     });
    //     done();
    // });
    describe('/GET nurses', function(){
        it('Getting all Nurses', function(done){
            chai.request(app).get('/nurses/center/1').end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
        });
    });
    describe('/POST nurses', function(){
        it('Insert new nurse', function(done){
            var nurse = {
                center: 'Bukit Batok CC',
                name: 'Sara'
            }
            chai.request(app).post('/nurses').send(nurse).end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
    });
    describe('/GET/:id nurses', function(){
        it('Get nurse by id', function(done){
            Nurse.create({
                center: 'Bukit Batok CC',
                name: 'Sara'
            }).then(function(nurse){
                chai.request(app).get('/nurses/'+nurse.id).end(function(err, res){
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
            });
        });
        it('Get nurse by not existed id', function(done){
            chai.request(app).get('/nurses/100').end(function(err, res){
                res.should.have.status(400);
                res.body.should.equal('This entry is not found');
                done();
            })
        });
        it('Get nurse by invalid id', function(done){
            chai.request(app).get('/nurses/abc').end(function(err, res){
                res.should.have.status(400);
                res.body.should.equal('Invalid ID supplied');
                done();
            });
        });
    });
    describe('/PUT/:id nurses', function(){
        it('Update nurse by id', function(done){
            Nurse.create({
                center: 'Bukit Batok CC',
                name: 'Sara'
            }).then(function(nurse){
                var nurseEdit = {
                    center: 'Bukit Batok CC',
                    name: 'Jane'
                }
                chai.request(app).put('/nurses/'+nurse.id).send(nurseEdit).end(function(err, res){
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
            })
        });
    });
    describe('/DELETE/:id nurses', function(){
        it('Delete nurse by id', function(done){
            Nurse.create({
                name: 'Kyle',
                center: 'Kyle Center',
                nric: '0000',
                date: '2022-03-19',
                slot_number: 0
            }).then(function(nurse){
                chai.request(app).delete('/nurses/'+nurse.id).end(function(err, res){
                    res.should.have.status(200);
                    res.body.should.equal(1);
                    done();
                });
            })
        });
    });
});

describe('Center API', function(){
    //Before each test we empty the database
    // beforeEach(function(done){
    //     Center.destroy({
    //         where: {},
    //         truncate: true
    //     });
    //     done();
    // });
    describe('/GET centers', function(){
        it('Getting all centers', function(done){
            chai.request(app).get('/centers').end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
        });
    });
});

describe('Nurse Workdays API', function(){
    //Before each test we empty the database
    beforeEach(function(done){
        Nurse_Workday.destroy({
            where: {},
            truncate: true
        });
        done();
    });
    describe('/GET nurse workdays', function(){
        it('Getting all nurse workdays', function(done){
            chai.request(app).get('/nurse_workdays/1').end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
        });
    });
    describe('/POST nurse workdays', function(){
        it('Insert new nurse workdays', function(done){
            var nurse_workdays = [
                { 
                    id: 1,
                    work_date: '2022-03-19',
                    nurse: 1,
                    center: 1
                }
            ];

            chai.request(app).post('/nurse_workdays/1').send(nurse_workdays).end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
        });
    });
});