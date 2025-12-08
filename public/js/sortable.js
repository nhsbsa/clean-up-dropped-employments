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
})();//# sourceMappingURL=sortable.js.map
