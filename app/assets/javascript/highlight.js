let selectedRow = null;
const rows = document.querySelectorAll('.nhsuk-table__body tr');
    
rows.forEach(row => {
    row.addEventListener('click', () => {
        // If clicking the already selected row → deselect it
        if (selectedRow === row) {
            row.classList.remove('selected');
            selectedRow = null;
            return;
        }

        // Otherwise remove previous selection
        if (selectedRow) {
            selectedRow.classList.remove('selected');
        }

        // Select the new row
        row.classList.add('selected');
        selectedRow = row;
    });
});
