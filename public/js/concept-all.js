// Compare data sets

const compareToggleButton = document.getElementById('compare-toggle');
const comparePanel = document.getElementById('compare-panel');
compareToggleButton.addEventListener('click', () => {
  const isOpen = comparePanel.hasAttribute('hidden') === false;
  if (isOpen) {
    comparePanel.setAttribute('hidden', '');
    compareToggleButton.setAttribute('aria-expanded', 'false');
    compareToggleButton.textContent = 'Compare data sets';
  } else {
    comparePanel.removeAttribute('hidden');
    compareToggleButton.setAttribute('aria-expanded', 'true');
    compareToggleButton.textContent = 'Hide compare';
  }
});
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
// document.addEventListener('DOMContentLoaded', () => {
//     const ctFormCustom = document.getElementById('ct-table-custom-form')

//     if (!ctFormCustom) return

//     ctFormCustom.addEventListener('submit', function (e) {
//         e.preventDefault() // prevent page reload

//         // Get all checkbox inputs in the form
//         const checkboxes = ctFormCustom.querySelectorAll('input[value="columns"]')

//         checkboxes.forEach(cb => {
//             const ctTableClass = cb.name
//             const ctTableEls = document.getElementsByClassName(ctTableClass)

//             if (!ctTableEls) return

//             // Show/hide the table based on whether the checkbox is ticked
//             Array.from(ctTableEls).forEach(el => {
//                 el.style.display = cb.checked ? '' : 'none'
//             })
//         })
//     })
// })
// const toggleCustomCT = document.getElementById('ct-toggle-data');
// const panelCT = document.getElementById('ct-panel-data');

// toggleCustomCT.addEventListener('click', () => {
//     const isOpen = panelCT.hasAttribute('hidden') === false;

//     if (isOpen) {
//         panelCT.setAttribute('hidden', '');
//         toggleCustomCT.setAttribute('aria-expanded', 'false');
//         toggleCustomCT.textContent = 'Customise data set';
//     } else {
//         panelCT.removeAttribute('hidden');
//         toggleCustomCT.setAttribute('aria-expanded', 'true');
//         toggleCustomCT.textContent = 'Hide customisable data';
//     }
// });

// Hours History Customise
// document.addEventListener('DOMContentLoaded', () => {
//     const hhFormCustom = document.getElementById('hh-table-custom-form')

//     if (!hhFormCustom) return

//     hhFormCustom.addEventListener('submit', function (e) {
//         e.preventDefault() // prevent page reload

//         // Get all checkbox inputs in the form
//         const checkboxes = hhFormCustom.querySelectorAll('input[value="columns"]')

//         checkboxes.forEach(cb => {
//             const hhTableClass = cb.name
//             const hhTableEls = document.getElementsByClassName(hhTableClass)

//             if (!hhTableEls) return

//             // Show/hide the table based on whether the checkbox is ticked
//             Array.from(hhTableEls).forEach(el => {
//                 el.style.display = cb.checked ? '' : 'none'
//             })
//         })
//     })
//     })
//     const toggleCustomHH = document.getElementById('hh-toggle-data');
//     const panelHH = document.getElementById('hh-panel-data');

//     toggleCustomHH.addEventListener('click', () => {
//         const isOpen = panelHH.hasAttribute('hidden') === false;

//         if (isOpen) {
//             panelHH.setAttribute('hidden', '');
//             toggleCustomHH.setAttribute('aria-expanded', 'false');
//             toggleCustomHH.textContent = 'Customise data set';
//         } else {
//             panelHH.removeAttribute('hidden');
//             toggleCustomHH.setAttribute('aria-expanded', 'true');
//             toggleCustomHH.textContent = 'Hide customisable data';
//         }
//     });

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
      return direction === "asc" ? aVal - bVal : bVal - aVal;
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
    header.addEventListener("keypress", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        header.click();
      }
    });
  });
})();//# sourceMappingURL=concept-all.js.map
