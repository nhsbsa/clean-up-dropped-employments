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

router.get('/ticket-management-entry', function (req, res) {

    // Example ticket data
    const tickets = [
        { id: 'XX-12345678', subject: 'Re-employed pensioner', name: '12345678', status: 'Closed' },
        { id: 'XX-87654321', subject: 'Subject line for corruption', name: '87654321', status: 'Open' },
        { id: 'XX-24681357', subject: 'Subject line for corruption', name: '24681357', status: 'Updated' },
        { id: 'XX-13572468', subject: 'Subject line for corruption', name: '13572468', status: 'Resolved' },
        { id: 'XX-86427531', subject: 'Subject line for corruption', name: '86427531', status: 'Closed' },
        { id: 'XX-75318642', subject: 'Subject line for corruption', name: '75318642', status: 'New' },
        { id: 'XX-91827364', subject: 'Subject line for corruption', name: '91827364', status: 'Closed' },
        { id: 'XX-64738291', subject: 'Subject line for corruption', name: '64738291', status: 'New' },
        { id: 'XX-22638471', subject: 'Subject line for corruption', name: '22638471', status: 'Closed' },
        { id: 'XX-81726492', subject: 'Subject line for corruption', name: '81726492', status: 'Closed' },
        { id: 'XX-62835192', subject: 'Subject line for corruption', name: '62835192', status: 'Updated' },
        { id: 'XX-91730461', subject: 'Subject line for corruption', name: '91730461', status: 'Resolved' },
        { id: 'XX-71946291', subject: 'Subject line for corruption', name: '71946291', status: 'Updated' },
        { id: 'XX-29165495', subject: 'Subject line for corruption', name: '29165495', status: 'Closed' }
    ]

    // Search term
    const search = (req.query.search || '').toLowerCase()

    // Filter tickets
    const filteredTickets = tickets.filter(ticket => {
        return (
        ticket.id.toLowerCase().includes(search) ||
        ticket.name.toLowerCase().includes(search) ||
        ticket.status.toLowerCase().includes(search)
        )
    })

    // Pagination settings
    const pageSize = 10
    const currentPage = parseInt(req.query.page) || 1

    // Paginate filtered results
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize

    const paginatedTickets = filteredTickets.slice(startIndex, endIndex)

    const totalPages = Math.ceil(filteredTickets.length / pageSize)

    res.render('app/views/concept-ticketmanage/ticket-management-entry', {
        tickets: paginatedTickets,
        search,
        currentPage,
        totalPages,
        totalResults: filteredTickets.length
    })

})

module.exports = router;