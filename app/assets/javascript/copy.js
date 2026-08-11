
document.addEventListener('DOMContentLoaded', function () {
    const copyButton = document.getElementById('copyIssueDetailsButton');
    const table = document.getElementById('reportTable');
    const status = document.getElementById('copyIssueDetailsStatus');

    if (!copyButton || !table || !status) {
        return;
    }

    function getTableText(tableElement) {
        const rows = Array.from(tableElement.querySelectorAll('tr'));

        return rows
            .map((row) => Array.from(row.querySelectorAll('th, td'))
                .map((cell) => cell.textContent.replace(/\s+/g, ' ').trim())
                .join('\t'))
            .filter((line) => line.length > 0)
            .join('\n');
    }

    function getStyledTableHtml(tableElement) {
        const clone = tableElement.cloneNode(true);

        clone.removeAttribute('id');
        clone.style.borderCollapse = 'collapse';
        clone.style.width = '100%';
        clone.style.fontFamily = 'Arial, sans-serif';
        clone.style.fontSize = '14px';

        const caption = clone.querySelector('caption');
        if (caption) {
            caption.className = '';
            caption.style.captionSide = 'top';
            caption.style.textAlign = 'left';
            caption.style.fontWeight = '700';
            caption.style.marginBottom = '8px';
        }

        clone.querySelectorAll('th, td').forEach((cell) => {
            cell.style.border = '1px solid #d8dde0';
            cell.style.padding = '8px';
            cell.style.textAlign = 'left';
            cell.style.verticalAlign = 'top';
        });

        clone.querySelectorAll('th').forEach((headerCell) => {
            headerCell.style.backgroundColor = '#f0f4f5';
            headerCell.style.fontWeight = '700';
        });

        return clone.outerHTML;
    }

    copyButton.addEventListener('click', async function () {
        const tableText = getTableText(table);
        const tableHtml = getStyledTableHtml(table);

        if (!tableText) {
            status.textContent = 'No issue details available to copy.';
            return;
        }

        try {
            if (navigator.clipboard && window.ClipboardItem) {
                const clipboardItem = new ClipboardItem({
                    'text/html': new Blob([tableHtml], { type: 'text/html' }),
                    'text/plain': new Blob([tableText], { type: 'text/plain' })
                });

                await navigator.clipboard.write([clipboardItem]);
            } else {
                await navigator.clipboard.writeText(tableText);
            }

            status.textContent = 'Issue details copied.';
        } catch (error) {
            const fallback = document.createElement('textarea');
            fallback.value = tableText;
            fallback.setAttribute('readonly', '');
            fallback.style.position = 'absolute';
            fallback.style.left = '-9999px';

            document.body.appendChild(fallback);
            fallback.select();

            try {
                document.execCommand('copy');
                status.textContent = 'Issue details copied.';
            } catch (copyError) {
                status.textContent = 'Unable to copy issue details.';
            }

            document.body.removeChild(fallback);
        }
    });
});
