const express = require('express');
const Book = require('../models').Book;
const sequelize = require('../models').sequelize;
const Center = require('../models').Center;
const router = express.Router();
const checkIDInput = require('../middleware/checkIDInput');
const checkIDExist = require('../middleware/checkIDExist')(Book);

// if a user already booked, it returns false
const checkUserBookExist = function (req, res, next) {  
    //console.log('Check ID exist');
    Book.count({ where: { nric: req.body.nric } }).then(count => {
        if (count != 0) {
            res.status(203).json('You already booked.');
        } else {
            //console.log('Nurse not found');
            next();
        }
    }); 
};

// return booked slot-numbers for selected date and selected center
router.post('/booked_slots', function(req, res){
    const query = `
        SELECT tb_data.slot_number
        FROM (
            SELECT 
                books.slot_number,
                COUNT(books.slot_number) as booked_count
            FROM books 
            where 
                books.center= ${req.body.center} 
                and date(books.date)= date('${req.body.date}')
            GROUP BY books.slot_number
        ) tb_data
        where tb_data.booked_count >= IFNULL(
            (
                select COUNT(nurse_workdays.nurse)
                from nurse_workdays
                where nurse_workdays.center = ${req.body.center}
                    and date(nurse_workdays.work_date) = date('${req.body.date}')
            ), 0
        )
    `;
    sequelize.query(query)
    .then(results => {
        const booked_slots = results[0];
        sequelize.query(`
            select
            IFNULL(
                (
                    select COUNT(nurse_workdays.nurse)
                    from nurse_workdays
                    where nurse_workdays.center = ${req.body.center}
                        and date(nurse_workdays.work_date) = date('${req.body.date}')
                ), 0
            ) as _count
        `)
        .then(results => {
            res.status(200).json({ booked_slots: booked_slots, total_nurses: results[0][0]._count});
        });
    });
});

// create new booking
router.post('/', [checkUserBookExist], function (req, res){
    const data = {
        center: req.body.center,
        date: req.body.date,
        name: req.body.name,
        nric: req.body.nric,
        slot_number: req.body.slot_number
    }

    Book.create(data).then(book => {
        res.status(200).json(book);
    }, err => {
        res.status(405).json('Error has occured');
    });
});

// get selected booking
router.get('/:id', [checkIDInput, checkIDExist], function(req, res){
    //console.log('Get book by id');
    Book.findByPk(req.params.id).then(book => {
        //console.log(book);
        res.status(200).json(book);
    });
});

// update selected booking
router.put('/:id', [checkIDInput, checkIDExist], function(req, res){
    //console.log('Update book by id');
    Book.update({
        center: req.body.center,
        date: req.body.date,
        name: req.body.name,
        nric: req.body.nric,
        slot_number: req.body.slot_number
    },{
        where: { id: req.params.id }
    }).then(result => {
        res.status(200).json(result);
    });
});

// delete selected booking
router.delete('/:id', [checkIDInput, checkIDExist], function(req, res){
    //console.log('Delete book by id');
    Book.destroy({
        where: { id: req.params.id }
    }).then(result => {
        res.status(200).json(result);
    });
});

// returns all bookings
router.get('/', function(req, res){
    //console.log('Getting all books');
    Book.findAll({
        include: [{
            model: Center
        }]
    }).then(books => {
        res.status(200).json(books);
    });
});


module.exports = router;