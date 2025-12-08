document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('table-selector-form')

    if (!form) return

    form.addEventListener('submit', function (e) {
        e.preventDefault() // prevent page reload

        // Get all checkbox inputs in the form
        const checkboxes = form.querySelectorAll('input[name="tables"]')

        checkboxes.forEach(cb => {
            const tableClass = cb.value
            const tableEls = document.getElementsByClassName(tableClass)

            if (!tableEls) return

            // Show/hide the table based on whether the checkbox is ticked
            Array.from(tableEls).forEach(el => {
                el.style.display = cb.checked ? '' : 'none'
            })
        })
    })

    const formCustom = document.getElementById('table-custom-form')

    if (!formCustom) return

    formCustom.addEventListener('submit', function (e) {
        e.preventDefault() // prevent page reload

        // Get all checkbox inputs in the form
        const checkboxes = formCustom.querySelectorAll('input[name="columns"]')

        checkboxes.forEach(cb => {
            const tableClass = cb.value
            const tableEls = document.getElementsByClassName(tableClass)

            if (!tableEls) return

            // Show/hide the table based on whether the checkbox is ticked
            Array.from(tableEls).forEach(el => {
                el.style.display = cb.checked ? '' : 'none'
            })
        })
    })
})

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


const toggleTableFilter = document.getElementById('filters-toggle-data');
const panelTF = document.getElementById('filters-panel-data');

toggleTableFilter.addEventListener('click', () => {
    const isOpen = panelTF.hasAttribute('hidden') === false;

    if (isOpen) {
        panelTF.setAttribute('hidden', '');
        toggleTableFilter.setAttribute('aria-expanded', 'false');
        toggleTableFilter.textContent = 'Customise data set';
    } else {
        panelTF.removeAttribute('hidden');
        toggleTableFilter.setAttribute('aria-expanded', 'true');
        toggleTableFilter.textContent = 'Hide customisable data';
    }
});


(function () {

    function parseValue(value, type) {
      value = value.trim();
  
      if (type === "number") {
        return parseFloat(value) || 0;
      }
  
      if (type === "date") {
        if (!value) return 0;
        const parts = value.split("/");
        return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
      }
  
      return value.toLowerCase();
    }
  
    function clearSortStates(headers) {
      headers.forEach(h => h.removeAttribute("aria-sort"));
    }
  
    function sortTable(table, columnIndex, type, direction) {
      const tbody = table.querySelector("tbody");
      const rows = Array.from(tbody.querySelectorAll("tr"));
  
      rows.sort((a, b) => {
        const aText = a.children[columnIndex].innerText;
        const bText = b.children[columnIndex].innerText;
  
        const aVal = parseValue(aText, type);
        const bVal = parseValue(bText, type);
  
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
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
  
        sortTable(table, columnIndex, type, newDirection === "ascending" ? "asc" : "desc");
      });
  
      // Allow keyboard sorting
      header.addEventListener("keypress", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          header.click();
        }
      });
  
    });
  
  })();