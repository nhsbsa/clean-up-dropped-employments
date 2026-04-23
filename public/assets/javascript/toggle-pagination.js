// app/assets/javascript/toggle-pagination.js
document.querySelectorAll(".paginated-table").forEach((container) => {
  let rowsPerPage = 10;
  let currentPage = 1;
  let showingHidden = true;
  const toggleBtns = container.querySelectorAll(".toggleBtnHH, .toggleBtnCT");
  const allRows = Array.from(container.querySelectorAll(".rows-hh, .hrsError, .rows-conts, .contsError"));
  const rowsSelect = container.querySelector(".rows-per-page");
  const prevBtn = container.querySelector(".nhsuk-pagination__previous");
  const nextBtn = container.querySelector(".nhsuk-pagination__next");
  const paginationList = container.querySelector(".nhsuk-pagination__list");
  const pagination = container.querySelector(".nhsuk-pagination");
  if (rowsSelect) {
    rowsSelect.addEventListener("change", () => {
      const value = rowsSelect.value;
      rowsPerPage = value === "all" ? Infinity : parseInt(value);
      currentPage = 1;
      renderTable();
    });
  }
  function getVisibleRows() {
    return allRows.filter((row) => {
      if (!showingHidden && row.classList.contains("hidden-row")) return false;
      return true;
    });
  }
  function createPageItem(page, isCurrent = false) {
    const li = document.createElement("li");
    li.className = "nhsuk-pagination__item";
    if (isCurrent) li.classList.add("nhsuk-pagination__item--current");
    const link = document.createElement("a");
    link.href = "#";
    link.className = "nhsuk-pagination__link";
    link.textContent = page;
    if (isCurrent) link.setAttribute("aria-current", "page");
    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = page;
      renderTable();
    });
    li.appendChild(link);
    return li;
  }
  function renderPagination(totalPages) {
    paginationList.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      paginationList.appendChild(createPageItem(i, i === currentPage));
    }
    prevBtn.style.display = currentPage === 1 ? "none" : "block";
    nextBtn.style.display = currentPage === totalPages ? "none" : "block";
  }
  function renderTable() {
    const visibleRows = getVisibleRows();
    const totalPages = Math.ceil(visibleRows.length / rowsPerPage) || 1;
    allRows.forEach((row) => row.style.display = "none");
    if (rowsPerPage === Infinity) {
      visibleRows.forEach((row) => {
        row.style.display = "";
      });
    } else {
      const start = (currentPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      visibleRows.slice(start, end).forEach((row) => {
        row.style.display = "";
      });
    }
    renderPagination(totalPages);
    pagination.style.display = rowsPerPage === Infinity || !showingHidden ? "none" : "block";
  }
  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    currentPage--;
    renderTable();
  });
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    currentPage++;
    renderTable();
  });
  toggleBtns.forEach((toggleBtn) => {
    toggleBtn.addEventListener("click", () => {
      showingHidden = !showingHidden;
      toggleBtn.textContent = showingHidden ? "Hide correct rows" : "Show correct rows";
      currentPage = 1;
      renderTable();
    });
  });
  renderTable();
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L3RvZ2dsZS1wYWdpbmF0aW9uLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBhZ2luYXRlZC10YWJsZVwiKS5mb3JFYWNoKGNvbnRhaW5lciA9PiB7XG5cbiAgICBsZXQgcm93c1BlclBhZ2UgPSAxMFxuICAgIGxldCBjdXJyZW50UGFnZSA9IDFcbiAgICBsZXQgc2hvd2luZ0hpZGRlbiA9IHRydWVcblxuICAgIGNvbnN0IHRvZ2dsZUJ0bnMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbChcIi50b2dnbGVCdG5ISCwgLnRvZ2dsZUJ0bkNUXCIpXG4gICAgY29uc3QgYWxsUm93cyA9IEFycmF5LmZyb20oY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucm93cy1oaCwgLmhyc0Vycm9yLCAucm93cy1jb250cywgLmNvbnRzRXJyb3JcIikpXG4gICAgY29uc3Qgcm93c1NlbGVjdCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLnJvd3MtcGVyLXBhZ2VcIilcblxuICAgIGNvbnN0IHByZXZCdG4gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5uaHN1ay1wYWdpbmF0aW9uX19wcmV2aW91c1wiKVxuICAgIGNvbnN0IG5leHRCdG4gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5uaHN1ay1wYWdpbmF0aW9uX19uZXh0XCIpXG4gICAgY29uc3QgcGFnaW5hdGlvbkxpc3QgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5uaHN1ay1wYWdpbmF0aW9uX19saXN0XCIpXG4gICAgY29uc3QgcGFnaW5hdGlvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLm5oc3VrLXBhZ2luYXRpb25cIilcblxuICAgIGlmIChyb3dzU2VsZWN0KSB7XG4gICAgICAgIHJvd3NTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHJvd3NTZWxlY3QudmFsdWVcbiAgICAgICAgICAgIHJvd3NQZXJQYWdlID0gdmFsdWUgPT09IFwiYWxsXCIgPyBJbmZpbml0eSA6IHBhcnNlSW50KHZhbHVlKVxuICAgICAgICAgICAgY3VycmVudFBhZ2UgPSAxXG4gICAgICAgICAgICByZW5kZXJUYWJsZSgpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gZ2V0IHRoZSByb3dzIHRoYXQgc2hvdWxkIGN1cnJlbnRseSBiZSB2aXNpYmxlXG4gICAgZnVuY3Rpb24gZ2V0VmlzaWJsZVJvd3MoKSB7XG4gICAgICAgIHJldHVybiBhbGxSb3dzLmZpbHRlcihyb3cgPT4ge1xuICAgICAgICAgICAgLy8gaGlkZSBoaWRkZW4gcm93cyBpZiB0b2dnbGUgaXMgb2ZmXG4gICAgICAgICAgICBpZiAoIXNob3dpbmdIaWRkZW4gJiYgcm93LmNsYXNzTGlzdC5jb250YWlucyhcImhpZGRlbi1yb3dcIikpIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVQYWdlSXRlbShwYWdlLCBpc0N1cnJlbnQgPSBmYWxzZSkge1xuXG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpXG4gICAgICAgIGxpLmNsYXNzTmFtZSA9IFwibmhzdWstcGFnaW5hdGlvbl9faXRlbVwiXG5cbiAgICAgICAgaWYgKGlzQ3VycmVudCkgbGkuY2xhc3NMaXN0LmFkZChcIm5oc3VrLXBhZ2luYXRpb25fX2l0ZW0tLWN1cnJlbnRcIilcblxuICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIilcbiAgICAgICAgbGluay5ocmVmID0gXCIjXCJcbiAgICAgICAgbGluay5jbGFzc05hbWUgPSBcIm5oc3VrLXBhZ2luYXRpb25fX2xpbmtcIlxuICAgICAgICBsaW5rLnRleHRDb250ZW50ID0gcGFnZVxuXG4gICAgICAgIGlmIChpc0N1cnJlbnQpIGxpbmsuc2V0QXR0cmlidXRlKFwiYXJpYS1jdXJyZW50XCIsIFwicGFnZVwiKVxuXG4gICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICBjdXJyZW50UGFnZSA9IHBhZ2VcbiAgICAgICAgICAgIHJlbmRlclRhYmxlKClcbiAgICAgICAgfSlcblxuICAgICAgICBsaS5hcHBlbmRDaGlsZChsaW5rKVxuICAgICAgICByZXR1cm4gbGlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXJQYWdpbmF0aW9uKHRvdGFsUGFnZXMpIHtcblxuICAgICAgICBwYWdpbmF0aW9uTGlzdC5pbm5lckhUTUwgPSBcIlwiXG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gdG90YWxQYWdlczsgaSsrKSB7XG4gICAgICAgICAgICBwYWdpbmF0aW9uTGlzdC5hcHBlbmRDaGlsZChjcmVhdGVQYWdlSXRlbShpLCBpID09PSBjdXJyZW50UGFnZSkpXG4gICAgICAgIH1cblxuICAgICAgICBwcmV2QnRuLnN0eWxlLmRpc3BsYXkgPSBjdXJyZW50UGFnZSA9PT0gMSA/IFwibm9uZVwiIDogXCJibG9ja1wiXG4gICAgICAgIG5leHRCdG4uc3R5bGUuZGlzcGxheSA9IGN1cnJlbnRQYWdlID09PSB0b3RhbFBhZ2VzID8gXCJub25lXCIgOiBcImJsb2NrXCJcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXJUYWJsZSgpIHtcblxuICAgICAgICBjb25zdCB2aXNpYmxlUm93cyA9IGdldFZpc2libGVSb3dzKClcbiAgICAgICAgY29uc3QgdG90YWxQYWdlcyA9IE1hdGguY2VpbCh2aXNpYmxlUm93cy5sZW5ndGggLyByb3dzUGVyUGFnZSkgfHwgMVxuXG4gICAgICAgIGFsbFJvd3MuZm9yRWFjaChyb3cgPT4gcm93LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIilcblxuICAgICAgICBpZiAocm93c1BlclBhZ2UgPT09IEluZmluaXR5KSB7XG4gICAgICAgICAgICAvLyBTaG93IGFsbCByb3dzXG4gICAgICAgICAgICB2aXNpYmxlUm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgICAgICAgcm93LnN0eWxlLmRpc3BsYXkgPSBcIlwiXG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSAoY3VycmVudFBhZ2UgLSAxKSAqIHJvd3NQZXJQYWdlXG4gICAgICAgICAgICBjb25zdCBlbmQgPSBzdGFydCArIHJvd3NQZXJQYWdlXG5cbiAgICAgICAgICAgIHZpc2libGVSb3dzLnNsaWNlKHN0YXJ0LCBlbmQpLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgICAgICAgICByb3cuc3R5bGUuZGlzcGxheSA9IFwiXCJcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXJQYWdpbmF0aW9uKHRvdGFsUGFnZXMpXG5cbiAgICAgICAgLy8gcGFnaW5hdGlvbi5zdHlsZS5kaXNwbGF5ID0gc2hvd2luZ0hpZGRlbiA/IFwiYmxvY2tcIiA6IFwibm9uZVwiXG4gICAgICAgIHBhZ2luYXRpb24uc3R5bGUuZGlzcGxheSA9IChyb3dzUGVyUGFnZSA9PT0gSW5maW5pdHkgfHwgIXNob3dpbmdIaWRkZW4pXG4gICAgICAgID8gXCJub25lXCJcbiAgICAgICAgOiBcImJsb2NrXCJcbiAgICB9XG5cbiAgICBwcmV2QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGN1cnJlbnRQYWdlLS1cbiAgICAgICAgcmVuZGVyVGFibGUoKVxuICAgIH0pXG5cbiAgICBuZXh0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGN1cnJlbnRQYWdlKytcbiAgICAgICAgcmVuZGVyVGFibGUoKVxuICAgIH0pXG5cbiAgICB0b2dnbGVCdG5zLmZvckVhY2godG9nZ2xlQnRuID0+IHtcblxuICAgICAgICB0b2dnbGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblxuICAgICAgICAgICAgc2hvd2luZ0hpZGRlbiA9ICFzaG93aW5nSGlkZGVuXG5cbiAgICAgICAgICAgIHRvZ2dsZUJ0bi50ZXh0Q29udGVudCA9IHNob3dpbmdIaWRkZW5cbiAgICAgICAgICAgICAgICA/IFwiSGlkZSBjb3JyZWN0IHJvd3NcIlxuICAgICAgICAgICAgICAgIDogXCJTaG93IGNvcnJlY3Qgcm93c1wiXG5cbiAgICAgICAgICAgIGN1cnJlbnRQYWdlID0gMVxuICAgICAgICAgICAgcmVuZGVyVGFibGUoKVxuXG4gICAgICAgIH0pXG5cbiAgICB9KVxuXG4gICAgcmVuZGVyVGFibGUoKVxuXG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxTQUFTLGlCQUFpQixrQkFBa0IsRUFBRSxRQUFRLGVBQWE7QUFFL0QsTUFBSSxjQUFjO0FBQ2xCLE1BQUksY0FBYztBQUNsQixNQUFJLGdCQUFnQjtBQUVwQixRQUFNLGFBQWEsVUFBVSxpQkFBaUIsNEJBQTRCO0FBQzFFLFFBQU0sVUFBVSxNQUFNLEtBQUssVUFBVSxpQkFBaUIsK0NBQStDLENBQUM7QUFDdEcsUUFBTSxhQUFhLFVBQVUsY0FBYyxnQkFBZ0I7QUFFM0QsUUFBTSxVQUFVLFVBQVUsY0FBYyw2QkFBNkI7QUFDckUsUUFBTSxVQUFVLFVBQVUsY0FBYyx5QkFBeUI7QUFDakUsUUFBTSxpQkFBaUIsVUFBVSxjQUFjLHlCQUF5QjtBQUN4RSxRQUFNLGFBQWEsVUFBVSxjQUFjLG1CQUFtQjtBQUU5RCxNQUFJLFlBQVk7QUFDWixlQUFXLGlCQUFpQixVQUFVLE1BQU07QUFDeEMsWUFBTSxRQUFRLFdBQVc7QUFDekIsb0JBQWMsVUFBVSxRQUFR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
