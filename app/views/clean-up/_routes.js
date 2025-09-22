// External dependencies
const express = require('express');
const router = express.Router();


router.post('/search', function (req, res) {
 
    res.redirect('results');

})

module.exports = router;