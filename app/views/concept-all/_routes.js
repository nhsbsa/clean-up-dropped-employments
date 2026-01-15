// External dependencies
const express = require('express');
const router = express.Router();


router.post('/search', function (req, res) {
 
    res.redirect('results');

})


router.post('/results', function (req, res) {
 
    res.redirect('compare-wide');

})

module.exports = router;