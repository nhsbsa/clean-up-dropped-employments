// External dependencies
const express = require('express');
const router = express.Router();


router.post('/search', function (req, res) {
    res.redirect('results');
})

router.post('/results', function (req, res) {
    res.redirect('report');
})

router.post('/report', function (req, res) {
    res.redirect('confirm-report');
})


module.exports = router;