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
    res.redirect('check-your-report');
})

router.post('/check-your-report', function (req, res) {
    res.redirect('report-submitted');
})

module.exports = router;