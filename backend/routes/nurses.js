const express = require('express');
const Nurse = require('../models').Nurse;
const checkIDInput = require('../middleware/checkIDInput');
const checkIDExist = require('../middleware/checkIDExist')(Nurse);
const router = express.Router();

// create a nurse
router.post('/', function (req, res){
    const data = {
        center: req.body.center,
        name: req.body.name,
    }

    Nurse.create(data).then(nurse => {
        res.status(200).json(nurse);
    }, err => {
        res.status(405).json('Error has occured');
    });
});

// return all nurses in center
router.get('/center/:center', function(req, res){
    //console.log('Getting all Nurses');
    Nurse.findAll({
        where: { center: req.params.center }
    }).then(nurses => {
        res.status(200).json(nurses);
    });
});

// returns selected nurse
router.get('/:id', [checkIDInput, checkIDExist], function(req, res){
    //console.log('Get Nurse by id');
    Nurse.findByPk(req.params.id).then(nurse => {
        //console.log(nurse);
        res.status(200).json(nurse);
    });
});

// update a nurse
router.put('/:id', [checkIDInput, checkIDExist], function(req, res){
    //console.log('Update Nurse by id');
    Nurse.update({
        center: req.body.center,
        name: req.body.name
    },{
        where: { id: req.params.id }
    }).then(result => {
        res.status(200).json(result);
    });
});

// delete a nurse
router.delete('/:id', [checkIDInput, checkIDExist], function(req, res){
    //console.log('Delete Nurse by id');
    Nurse.destroy({
        where: { id: req.params.id }
    }).then(result => {
        res.status(200).json(result);
    });
});

module.exports = router;