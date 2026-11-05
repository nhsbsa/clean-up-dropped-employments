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
        res.redirect('raise-ticket');
    } else {
        res.redirect('results');
    }
})

router.post('/raise-ticket', function (req, res) {
    let uploadedFiles = [];

    try {
        const parsed = JSON.parse(req.body.uploadedFileNames || '[]');
        if (Array.isArray(parsed)) {
            uploadedFiles = parsed.filter((name) => typeof name === 'string' && name.trim() !== '');
        }
    } catch (error) {
        uploadedFiles = [];
    }

    req.session.data.uploadedFiles = uploadedFiles;
    res.redirect('check-ticket');
})

router.post('/check-ticket', function (req, res) {
    res.redirect('ticket-submitted');
})


router.post('/ticket-submitted', function (req, res) {
    res.redirect('search');
})


module.exports = router;