
function setupTableScroll(tableId, controlsId, leftId, rightId) {
    const tableScroll = document.getElementById(tableId);
    const tableScrollControls = document.getElementById(controlsId);
    const tableScrollLeft = document.getElementById(leftId);
    const tableScrollRight = document.getElementById(rightId);

    function updateTableScrollControls() {
        const maximumScroll = tableScroll.scrollWidth - tableScroll.clientWidth;
        const canScrollLeft = tableScroll.scrollLeft > 1;
        const canScrollRight = tableScroll.scrollLeft < maximumScroll - 1;

        tableScrollLeft.hidden = !canScrollLeft;
        tableScrollRight.hidden = !canScrollRight;
        tableScrollControls.hidden = !canScrollLeft && !canScrollRight;
    }

    function scrollTable(amount) {
        tableScroll.scrollBy({ left: amount, behavior: 'smooth' });
    }

    tableScrollLeft.addEventListener('click', () => scrollTable(-200));
    tableScrollRight.addEventListener('click', () => scrollTable(200));
    tableScroll.addEventListener('scroll', updateTableScrollControls);
    window.addEventListener('resize', updateTableScrollControls);
    new ResizeObserver(updateTableScrollControls).observe(tableScroll.querySelector('table'));
    updateTableScrollControls();
}

setupTableScroll('tableScrollSh', 'service-history-table-scroll-controls', 'service-history-table-scroll-left', 'service-history-table-scroll-right');
setupTableScroll('tableScrollSg', 'service-group-table-scroll-controls', 'service-group-table-scroll-left', 'service-group-table-scroll-right');
setupTableScroll('tableScrollEs', 'employment-table-scroll-controls', 'employment-table-scroll-left', 'employment-table-scroll-right');
setupTableScroll('tableScrollLe', 'linked-employment-table-scroll-controls', 'linked-employment-table-scroll-left', 'linked-employment-table-scroll-right');
setupTableScroll('tableScrollCt', 'conts-tpp-table-scroll-controls', 'conts-tpp-table-scroll-left', 'conts-tpp-table-scroll-right');
setupTableScroll('tableScrollHh', 'hours-history-table-scroll-controls', 'hours-history-table-scroll-left', 'hours-history-table-scroll-right');
