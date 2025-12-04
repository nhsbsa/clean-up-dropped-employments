function createTableManager(tableId, paginationId, toggleBtnId, options = {}) {
    return {
        data: [],
        columnTitles: {},
        pageSize: options.pageSize || 5,
        currentPage: 1,
        hideCorrectRows: false,

        tableId,
        paginationId,
        toggleBtnId,

        load(data, columnTitles) {
            this.data = data;
            this.columnTitles = columnTitles;
            this.currentPage = 1;
            this.hideCorrectRows = false;

            document.getElementById(this.toggleBtnId).onclick = () => this.toggleRows();

            this.renderTable();
        },

        renderTable() {
            const { data, pageSize, currentPage, hideCorrectRows } = this;

            let rowsToRender = hideCorrectRows
                ? data
                : data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

            const table = document.getElementById(this.tableId);
            const headers = Object.keys(data[0]).filter(h => h !== "rowClass");

            let html = `
                <thead class="nhsuk-table__head" role="rowgroup"><tr role="row">
            `;

            headers.forEach(h => {
                html += `<th scope="col" class="nhsuk-table__header nhsuk-u-font-size-14">${this.columnTitles[h]}</th>`;
            });

            html += `</tr></thead><tbody class="nhsuk-table__body">`;

            rowsToRender.forEach(row => {
                const extraClass = row.rowClass || "";
                const isError = extraClass.includes("errorHighlight");
                const toggleClass = hideCorrectRows && !isError ? "hidden" : "";

                html += `<tr class="nhsuk-table__row ${toggleClass} ${extraClass}" role="row">`;

                headers.forEach(h => {
                    html += `<td class="nhsuk-table__cell nhsuk-u-font-size-14" role="cell">${row[h]}</td>`;
                });

                html += `</tr>`;
            });

            html += `</tbody>`;
            table.innerHTML = html;

            if (hideCorrectRows) {
                document.getElementById(this.paginationId).style.display = "none";
            } else {
                document.getElementById(this.paginationId).style.display = "flex";
                this.renderPagination(data.length);
            }
        },

        renderPagination(totalRows) {
            const totalPages = Math.ceil(totalRows / this.pageSize);
            const pagination = document.getElementById(this.paginationId);

            let html = `<ul class="nhsuk-pagination__list">`;

            if (this.currentPage > 1) {
                html += `<a href="#" class="nhsuk-pagination__previous" data-page="${this.currentPage - 1}" rel="prev">
                <svg class="nhsuk-icon nhsuk-icon--arrow-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" focusable="false" aria-hidden="true">
                <path d="M10.7 6.3c.4.4.4 1 0 1.4L7.4 11H19a1 1 0 0 1 0 2H7.4l3.3 3.3c.4.4.4 1 0 1.4a1 1 0 0 1-1.4 0l-5-5A1 1 0 0 1 4 12c0-.3.1-.5.3-.7l5-5a1 1 0 0 1 1.4 0Z" />
                </svg>
                <span class="nhsuk-pagination__title">Previous<span class="nhsuk-u-visually-hidden"> page</span>
                </span></a>`;
            }

            for (let i = 1; i <= totalPages; i++) {
                const active = i === this.currentPage ? 'nhsuk-pagination__item--current' : '';
                html += `
                    <li class="nhsuk-pagination__item ${active}">
                        <a href="#" class="nhsuk-pagination__link" data-page="${i}">${i}</a>
                    </li>`;
            }

            html += `</ul>`;

            if (this.currentPage < totalPages) {
                html += `<a href="#"class="nhsuk-pagination__next" data-page="${this.currentPage + 1}" rel="next">
                <span class="nhsuk-pagination__title">
                Next<span class="nhsuk-u-visually-hidden"> page</span>
                </span>
                <svg class="nhsuk-icon nhsuk-icon--arrow-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" focusable="false" aria-hidden="true">
                  <path d="m14.7 6.3 5 5c.2.2.3.4.3.7 0 .3-.1.5-.3.7l-5 5a1 1 0 0 1-1.4-1.4l3.3-3.3H5a1 1 0 0 1 0-2h11.6l-3.3-3.3a1 1 0 1 1 1.4-1.4Z" />
                </svg></a>`;
            }

            pagination.innerHTML = html;

            pagination.querySelectorAll("a[data-page]").forEach(link => {
                link.addEventListener("click", e => {
                    e.preventDefault();
                    this.currentPage = parseInt(link.dataset.page);
                    this.renderTable();
                });
            });
        },

        toggleRows() {
            this.hideCorrectRows = !this.hideCorrectRows;

            document.getElementById(this.toggleBtnId).textContent =
                this.hideCorrectRows ? "Show correct rows" : "Hide correct rows";

            if (!this.hideCorrectRows) this.currentPage = 1;

            this.renderTable();
        }
    };
}
