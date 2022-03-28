const express = require('express');
const Center = require('../models').Center;
const router = express.Router();

// returns all centers
router.get('/', function(req, res){
    //console.log('Getting all books');
    Center.findAll().then(data => {
        res.status(200).json(data);
    });
});

module.exports = router;