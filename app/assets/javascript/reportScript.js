document.addEventListener('DOMContentLoaded', function () {

    const tableBody = document.querySelector('#reportTable tbody');
    const addButton = document.getElementById('addRowButton');
    const form = document.getElementById('reportForm');
    const errorSummary = document.getElementById('errorSummary');
    const errorList = document.getElementById('errorList');

    // Remove row
    function bindRemoveLinks() {
        tableBody.querySelectorAll('.remove-row').forEach(link => {
            link.removeEventListener('click', removeHandler);
            link.addEventListener('click', removeHandler);
        });
    }

    function removeHandler(e) {
        e.preventDefault();
        const row = e.target.closest('tr');
        row.remove();
    }

    bindRemoveLinks();

    // Add new row
    addButton.addEventListener('click', function () {
        const rowCount = tableBody.rows.length;
        const newRow = document.createElement('tr');
        newRow.classList.add('nhsuk-table__row');
        newRow.innerHTML = `
        <td><input class="nhsuk-input" type="text" name="sets[]" aria-label="Sets row ${rowCount + 1}"></td>
        <td><input class="nhsuk-input" type="text" name="fields[]" aria-label="Fields row ${rowCount + 1}"></td>
        <td><input class="nhsuk-input" type="text" name="amendments[]" aria-label="Amendments row ${rowCount + 1}"></td>
        <td><a href="#" class="remove-row nhsuk-link">Remove</a></td>
      `;
        tableBody.appendChild(newRow);
        bindRemoveLinks();
    });

    // Form validation
    form.addEventListener('submit', function (e) {

        const rows = Array.from(tableBody.querySelectorAll('tr'));
        let errors = [];
        errorList.innerHTML = '';
        errorSummary.style.display = 'none';

        rows.forEach((row, index) => {

            const setsInput = row.querySelector('input[name="sets[]"]');
            const fieldsInput = row.querySelector('input[name="fields[]"]');
            const amendmentsInput = row.querySelector('input[name="amendments[]"]');

            const allEmpty = [setsInput, fieldsInput, amendmentsInput].every(input => input.value.trim() === '');

            if (allEmpty) {
                // Remove completely empty row
                row.remove();
                return;
            }

            // Validate each input
            if (setsInput.value.trim() === '') errors.push({ input: setsInput, text: `Row ${index + 1}: Enter a value for Sets` });
            if (fieldsInput.value.trim() === '') errors.push({ input: fieldsInput, text: `Row ${index + 1}: Enter a value for Fields` });
            if (amendmentsInput.value.trim() === '') errors.push({ input: amendmentsInput, text: `Row ${index + 1}: Enter amendments` });

        });

        if (errors.length > 0) {
            e.preventDefault();

            // Show error summary
            errors.forEach(err => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#';
                a.textContent = err.text;
                a.addEventListener('click', function (ev) {
                    ev.preventDefault();
                    err.input.focus();
                });
                li.appendChild(a);
                errorList.appendChild(li);

                // Highlight input
                err.input.classList.add('nhsuk-input--error');
            });

            errorSummary.style.display = 'block';

            // Focus error summary first
            errorSummary.focus();

            // Auto-focus first empty field
            if (errors.length > 0) errors[0].input.focus();
        }

    });

});