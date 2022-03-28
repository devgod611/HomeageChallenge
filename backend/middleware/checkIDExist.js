module.exports = function checkIDExist(model) {
    return function (req, res, next) {  
        //console.log('Check ID exist');
        model.count({ where: { id: req.params.id } }).then(count => {
            if (count != 0) {
                next();
            } else {
                //console.log('Book not found');
                res.status(400).json('This entry is not found');
            }
        }); 
    };
}