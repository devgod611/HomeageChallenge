const express = require('express');
const NurseWorkday = require('../models').Nurse_Workday;
const router = express.Router();

// formats date: yyyy-mm-dd
function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

// create/update workdays for selected nurse
router.post('/:nurse', function (req, res) {
    NurseWorkday.destroy({
        where: { nurse: req.params.nurse }
    }).then(result => {
        NurseWorkday.bulkCreate(req.body.map(item => {
            return {
                ...item,
                work_date: formatDate(item.work_date)
            }
        }))
        .then(results => {
            res.status(200).json(results);
        }, err => {
            console.log(err)
            res.status(405).json('Error has occured');
        });
    });
});

// return all nurse_workdays in center
router.get('/:nurse', function(req, res){
    //console.log('Getting all NurseWorkdays');
    NurseWorkday.findAll({
        where: { nurse: req.params.nurse }
    }).then(nurse_workdays => {
        res.status(200).json(nurse_workdays);
    });
});

module.exports = router;