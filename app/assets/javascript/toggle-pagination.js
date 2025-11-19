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
                html += `<a href="#" class="nhsuk-pagination__previous" data-page="${this.currentPage - 1}">Previous</a>`;
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
                html += `<a href="#"class="nhsuk-pagination__next" data-page="${this.currentPage + 1}">Next</a>`;
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
