// External dependencies
const express = require('express');
const router = express.Router();


router.post('/search', function (req, res) {
 
    res.redirect('results');

})

router.post('/search-cards', function (req, res) {
 
    res.redirect('results-cards');

})

module.exports = router;