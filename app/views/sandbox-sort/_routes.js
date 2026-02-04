// External dependencies
const express = require('express');
const router = express.Router();


router.get('/sort-one', function (req, res) {
    const sort = req.query.sort || 'idNum'
    const direction = req.query.direction === 'desc' ? 'desc' : 'asc'
  
    const tableData = [
        { idNum: '1', start: '01/04/2013', end: '31/03/2014', meal: 'Breakfast', food: 'Cereal' },
        { idNum: '2', start: '01/04/2014', end: '31/03/2015', meal: 'Lunch', food: 'Chicken' },
        { idNum: '3', start: '01/04/2015', end: '31/03/2016', meal: 'Breakfast', food: 'Eggs' },
        { idNum: '4', start: '01/04/2016', end: '31/03/2017', meal: 'Dinner', food: 'Curry' },
        { idNum: '5', start: '01/04/2017', end: '31/03/2018', meal: 'Lunch', food: 'Sandwich' }
    ]
  
    res.render('sandbox-sort/sort-one', { tableData, sort, direction })
})


module.exports = router;