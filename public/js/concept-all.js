// Compare data sets

// const compareToggleButton = document.getElementById('compare-toggle');
// const comparePanel = document.getElementById('compare-panel');

// compareToggleButton.addEventListener('click', () => {
//     const isOpen = comparePanel.hasAttribute('hidden') === false;

//     if (isOpen) {
//         comparePanel.setAttribute('hidden', '');
//         compareToggleButton.setAttribute('aria-expanded', 'false');
//         compareToggleButton.textContent = 'Compare data sets';
//     } else {
//         comparePanel.removeAttribute('hidden');
//         compareToggleButton.setAttribute('aria-expanded', 'true');
//         compareToggleButton.textContent = 'Hide compare';
//     }
// });

document.getElementById("compare-form").addEventListener("submit", function (e) {
  const checkboxes = document.querySelectorAll(".compareCheckboxes__input:checked");
  const error = document.getElementById("checkboxError");
  const formGroup = document.querySelector(".compareGroup");
  if (checkboxes.length > 2) {
    e.preventDefault(); // stop form submission
    error.style.display = "block"; // show error message
    formGroup.classList.add("nhsuk-form-group--error"); // highlight form group
  } else {
    error.style.display = "none"; // hide error
    formGroup.classList.remove("nhsuk-form-group--error"); // remove error highlight
  }
});

// Filter data sets
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('table-selector-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent page reload

    // Get all checkbox inputs in the form
    const checkboxes = form.querySelectorAll('input[name="tables"]');
    checkboxes.forEach(cb => {
      const tableId = cb.value;
      const tableEl = document.getElementById(tableId);
      if (!tableEl) return;

      // Show/hide the table based on whether the checkbox is ticked
      tableEl.style.display = cb.checked ? '' : 'none';
    });
  });
});
const toggleButton = document.getElementById('filters-toggle');
const panel = document.getElementById('filters-panel');
toggleButton.addEventListener('click', () => {
  const isOpen = panel.hasAttribute('hidden') === false;
  if (isOpen) {
    panel.setAttribute('hidden', '');
    toggleButton.setAttribute('aria-expanded', 'false');
    toggleButton.textContent = 'Show filters';
  } else {
    panel.removeAttribute('hidden');
    toggleButton.setAttribute('aria-expanded', 'true');
    toggleButton.textContent = 'Hide filters';
  }
});

// Service History Customise
document.addEventListener('DOMContentLoaded', () => {
  const shformCustom = document.getElementById('sh-table-custom-form');
  if (!shformCustom) return;
  shformCustom.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent page reload

    // Get all checkbox inputs in the form
    const checkboxes = shformCustom.querySelectorAll('input[value="columns"]');
    checkboxes.forEach(cb => {
      const shtableClass = cb.name;
      const shtableEls = document.getElementsByClassName(shtableClass);
      if (!shtableEls) return;

      // Show/hide the table based on whether the checkbox is ticked
      Array.from(shtableEls).forEach(el => {
        el.style.display = cb.checked ? '' : 'none';
      });
    });
  });
});
const toggleTableSH = document.getElementById('sh-toggle-data');
const panelSH = document.getElementById('sh-panel-data');
toggleTableSH.addEventListener('click', () => {
  const isOpen = panelSH.hasAttribute('hidden') === false;
  if (isOpen) {
    panelSH.setAttribute('hidden', '');
    toggleTableSH.setAttribute('aria-expanded', 'false');
    toggleTableSH.textContent = 'Customise data set';
  } else {
    panelSH.removeAttribute('hidden');
    toggleTableSH.setAttribute('aria-expanded', 'true');
    toggleTableSH.textContent = 'Hide customisable data';
  }
});

// Service Group Customise
document.addEventListener('DOMContentLoaded', () => {
  const sgFormCustom = document.getElementById('sg-table-custom-form');
  if (!sgFormCustom) return;
  sgFormCustom.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent page reload

    // Get all checkbox inputs in the form
    const checkboxes = sgFormCustom.querySelectorAll('input[value="columns"]');
    checkboxes.forEach(cb => {
      const sgTableClass = cb.name;
      const sgTableEls = document.getElementsByClassName(sgTableClass);
      if (!sgTableEls) return;

      // Show/hide the table based on whether the checkbox is ticked
      Array.from(sgTableEls).forEach(el => {
        el.style.display = cb.checked ? '' : 'none';
      });
    });
  });
});
const toggleTableSG = document.getElementById('sg-toggle-data');
const panelSG = document.getElementById('sg-panel-data');
toggleTableSG.addEventListener('click', () => {
  const isOpen = panelSG.hasAttribute('hidden') === false;
  if (isOpen) {
    panelSG.setAttribute('hidden', '');
    toggleTableSG.setAttribute('aria-expanded', 'false');
    toggleTableSG.textContent = 'Customise data set';
  } else {
    panelSG.removeAttribute('hidden');
    toggleTableSG.setAttribute('aria-expanded', 'true');
    toggleTableSG.textContent = 'Hide customisable data';
  }
});

// Employment History Customise
document.addEventListener('DOMContentLoaded', () => {
  const ehFormCustom = document.getElementById('eh-table-custom-form');
  if (!ehFormCustom) return;
  ehFormCustom.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent page reload

    // Get all checkbox inputs in the form
    const checkboxes = ehFormCustom.querySelectorAll('input[value="columns"]');
    checkboxes.forEach(cb => {
      const ehTableClass = cb.name;
      const ehTableEls = document.getElementsByClassName(ehTableClass);
      if (!ehTableEls) return;

      // Show/hide the table based on whether the checkbox is ticked
      Array.from(ehTableEls).forEach(el => {
        el.style.display = cb.checked ? '' : 'none';
      });
    });
  });
});
const toggleCustomEH = document.getElementById('eh-toggle-data');
const panelEH = document.getElementById('eh-panel-data');
toggleCustomEH.addEventListener('click', () => {
  const isOpen = panelEH.hasAttribute('hidden') === false;
  if (isOpen) {
    panelEH.setAttribute('hidden', '');
    toggleCustomEH.setAttribute('aria-expanded', 'false');
    toggleCustomEH.textContent = 'Customise data set';
  } else {
    panelEH.removeAttribute('hidden');
    toggleCustomEH.setAttribute('aria-expanded', 'true');
    toggleCustomEH.textContent = 'Hide customisable data';
  }
});

// Conts and TPP Customise
document.addEventListener('DOMContentLoaded', () => {
  const ctFormCustom = document.getElementById('ct-table-custom-form');
  if (!ctFormCustom) return;
  ctFormCustom.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent page reload

    // Get all checkbox inputs in the form
    const checkboxes = ctFormCustom.querySelectorAll('input[value="columns"]');
    checkboxes.forEach(cb => {
      const ctTableClass = cb.name;
      const ctTableEls = document.getElementsByClassName(ctTableClass);
      if (!ctTableEls) return;

      // Show/hide the table based on whether the checkbox is ticked
      Array.from(ctTableEls).forEach(el => {
        el.style.display = cb.checked ? '' : 'none';
      });
    });
  });
});
const toggleCustomCT = document.getElementById('ct-toggle-data');
const panelCT = document.getElementById('ct-panel-data');
toggleCustomCT.addEventListener('click', () => {
  const isOpen = panelCT.hasAttribute('hidden') === false;
  if (isOpen) {
    panelCT.setAttribute('hidden', '');
    toggleCustomCT.setAttribute('aria-expanded', 'false');
    toggleCustomCT.textContent = 'Customise data set';
  } else {
    panelCT.removeAttribute('hidden');
    toggleCustomCT.setAttribute('aria-expanded', 'true');
    toggleCustomCT.textContent = 'Hide customisable data';
  }
});

// Hours History Customise
document.addEventListener('DOMContentLoaded', () => {
  const hhFormCustom = document.getElementById('hh-table-custom-form');
  if (!hhFormCustom) return;
  hhFormCustom.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent page reload

    // Get all checkbox inputs in the form
    const checkboxes = hhFormCustom.querySelectorAll('input[value="columns"]');
    checkboxes.forEach(cb => {
      const hhTableClass = cb.name;
      const hhTableEls = document.getElementsByClassName(hhTableClass);
      if (!hhTableEls) return;

      // Show/hide the table based on whether the checkbox is ticked
      Array.from(hhTableEls).forEach(el => {
        el.style.display = cb.checked ? '' : 'none';
      });
    });
  });
});
const toggleCustomHH = document.getElementById('hh-toggle-data');
const panelHH = document.getElementById('hh-panel-data');
toggleCustomHH.addEventListener('click', () => {
  const isOpen = panelHH.hasAttribute('hidden') === false;
  if (isOpen) {
    panelHH.setAttribute('hidden', '');
    toggleCustomHH.setAttribute('aria-expanded', 'false');
    toggleCustomHH.textContent = 'Customise data set';
  } else {
    panelHH.removeAttribute('hidden');
    toggleCustomHH.setAttribute('aria-expanded', 'true');
    toggleCustomHH.textContent = 'Hide customisable data';
  }
});

// Linked Employments Customise

document.addEventListener('DOMContentLoaded', () => {
  const leFormCustom = document.getElementById('le-table-custom-form');
  if (!leFormCustom) return;
  leFormCustom.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent page reload

    // Get all checkbox inputs in the form
    const checkboxes = leFormCustom.querySelectorAll('input[value="columns"]');
    checkboxes.forEach(cb => {
      const leTableClass = cb.name;
      const leTableEls = document.getElementsByClassName(leTableClass);
      if (!leTableEls) return;

      // Show/hide the table based on whether the checkbox is ticked
      Array.from(leTableEls).forEach(el => {
        el.style.display = cb.checked ? '' : 'none';
      });
    });
  });
});
const toggleCustomLE = document.getElementById('le-toggle-data');
const panelLE = document.getElementById('le-panel-data');
toggleCustomLE.addEventListener('click', () => {
  const isOpen = panelLE.hasAttribute('hidden') === false;
  if (isOpen) {
    panelLE.setAttribute('hidden', '');
    toggleCustomLE.setAttribute('aria-expanded', 'false');
    toggleCustomLE.textContent = 'Customise data set';
  } else {
    panelLE.removeAttribute('hidden');
    toggleCustomLE.setAttribute('aria-expanded', 'true');
    toggleCustomLE.textContent = 'Hide customisable data';
  }
});

//Pagination

function createTableManager(tableId, paginationId, toggleBtnId, options = {}) {
  return {
    data: [],
    columnTitles: {},
    pageSize: options.pageSize || 5,
    datasetName: options.datasetName || "dataset",
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
      const {
        data,
        pageSize,
        currentPage,
        hideCorrectRows
      } = this;
      let rowsToRender = hideCorrectRows ? data : data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
      const table = document.getElementById(this.tableId);
      const headers = Object.keys(data[0]).filter(h => h !== "rowClass");
      let html = `
                <thead class="nhsuk-table__head" role="rowgroup"><tr role="row">
            `;
      headers.forEach(h => {
        const colClass = `${this.datasetName}__${h}`;
        if (colClass === 'datasetCT__empId' || colClass === 'datasetHH__empId') {
          html += `
                    <th scope="col" aria-sort="none" class="nhsuk-table__header nhsuk-u-font-size-14 ${colClass} sortable" data-sort-type="number" tabindex="0" role="columnheader">
                    ${this.columnTitles[h]}
                    <span class="sort-icon sort-icon--default">
                      <svg width="22" height="22" focusable="false" aria-hidden="true" role="img" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.1875 9.5L10.9609 3.95703L13.7344 9.5H8.1875Z" fill="currentColor"></path>
                        <path d="M13.7344 12.0781L10.9609 17.6211L8.1875 12.0781H13.7344Z" fill="currentColor"></path>
                      </svg>
                    </span>
                    <span class="sort-icon sort-icon--asc">
                      <svg width="22" height="22" focusable="false" aria-hidden="true" role="img" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.5625 15.5L11 6.63125L15.4375 15.5H6.5625Z" fill="currentColor"></path>
                      </svg>
                    </span>
                    <span class="sort-icon sort-icon--desc">
                      <svg width="22" height="22" focusable="false" aria-hidden="true" role="img" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.4375 7L11 15.8687L6.5625 7L15.4375 7Z" fill="currentColor"></path>
                      </svg>
                    </span>
                    </th>`;
        } else if (colClass === 'datasetCT__start' || colClass === 'datasetCT__end' || colClass === 'datasetHH__start' || colClass === 'datasetHH__end') {
          html += `
                    <th scope="col" aria-sort="none" class="nhsuk-table__header nhsuk-u-font-size-14 ${colClass} sortable" data-sort-type="date" tabindex="0" role="columnheader">
                    ${this.columnTitles[h]}
                    <span class="sort-icon sort-icon--default">
                      <svg width="22" height="22" focusable="false" aria-hidden="true" role="img" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.1875 9.5L10.9609 3.95703L13.7344 9.5H8.1875Z" fill="currentColor"></path>
                        <path d="M13.7344 12.0781L10.9609 17.6211L8.1875 12.0781H13.7344Z" fill="currentColor"></path>
                      </svg>
                    </span>
                    <span class="sort-icon sort-icon--asc">
                      <svg width="22" height="22" focusable="false" aria-hidden="true" role="img" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.5625 15.5L11 6.63125L15.4375 15.5H6.5625Z" fill="currentColor"></path>
                      </svg>
                    </span>
                    <span class="sort-icon sort-icon--desc">
                      <svg width="22" height="22" focusable="false" aria-hidden="true" role="img" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.4375 7L11 15.8687L6.5625 7L15.4375 7Z" fill="currentColor"></path>
                      </svg>
                    </span>
                    </th>`;
        } else {
          html += `<th scope="col" class="nhsuk-table__header nhsuk-u-font-size-14 ${colClass}">${this.columnTitles[h]}</th>`;
        }
      });
      html += `</tr></thead><tbody class="nhsuk-table__body">`;
      rowsToRender.forEach(row => {
        const extraClass = row.rowClass || "";
        const isError = extraClass.includes("errorHighlight");
        const toggleClass = hideCorrectRows && !isError ? "hidden" : "";
        html += `<tr class="nhsuk-table__row ${toggleClass} ${extraClass}" role="row">`;
        headers.forEach(h => {
          const colClass = `${this.datasetName}__${h}`;
          html += `<td class="nhsuk-table__cell nhsuk-u-font-size-14 ${colClass}" role="cell">${row[h]}</td>`;
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
      document.getElementById(this.toggleBtnId).textContent = this.hideCorrectRows ? "Show correct rows" : "Hide correct rows";
      if (!this.hideCorrectRows) this.currentPage = 1;
      this.renderTable();
    }
  };
}

// Sortable

(function () {
  function parseValue(value, type) {
    value = value.trim();
    if (type === "number") return parseFloat(value) || 0;
    if (type === "date") {
      if (!value) return 0;
      const parts = value.split("/");
      return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
    }
    return value.toLowerCase();
  }
  function clearSortStates(headers) {
    headers.forEach(h => h.setAttribute("aria-sort", "none"));
  }
  function sortTable(table, columnIndex, type, direction) {
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    rows.sort((a, b) => {
      const aText = a.children[columnIndex].innerText;
      const bText = b.children[columnIndex].innerText;
      const aVal = parseValue(aText, type);
      const bVal = parseValue(bText, type);
      return direction === "ascending" ? aVal - bVal : bVal - aVal;
    });
    rows.forEach(row => tbody.appendChild(row));
  }
  document.querySelectorAll("table .sortable").forEach(header => {
    header.addEventListener("click", function () {
      const table = header.closest("table");
      const headers = table.querySelectorAll(".sortable");
      const columnIndex = Array.from(header.parentNode.children).indexOf(header);
      const type = header.dataset.sortType;
      const currentSort = header.getAttribute("aria-sort");
      const newDirection = currentSort === "ascending" ? "descending" : "ascending";
      clearSortStates(headers);
      header.setAttribute("aria-sort", newDirection);
      sortTable(table, columnIndex, type, newDirection);
    });
    header.addEventListener("keypress", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        header.click();
      }
    });
  });
})();//# sourceMappingURL=concept-all.js.map
