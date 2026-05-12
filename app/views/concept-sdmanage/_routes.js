// External dependencies
const express = require('express');
const router = express.Router();


router.post('/search', function (req, res) {
    res.redirect('results');
})

router.post('/results', function (req, res) {
    const action = req.body.action;

    if (action === 'compareData') {
        res.redirect('compare-wide');
    } else if (action === 'createReport') {
        res.redirect('report');
    } else {
        res.redirect('results');
    }
})

router.post('/report', function (req, res) {
    res.redirect('check-your-report');
})

router.post('/check-your-report', function (req, res) {
    res.redirect('report-submitted');
})

router.post('/report-blank', function (req, res) {
    res.redirect('check-your-new-report');
})

router.post('/check-your-new-report', function (req, res) {
    res.redirect('report-submitted');
})

router.post('/ticket-management', function (req, res) {
    res.redirect('report-blank');
})

module.exports = router;