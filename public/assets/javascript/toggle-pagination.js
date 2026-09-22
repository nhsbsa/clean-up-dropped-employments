// app/assets/javascript/toggle-pagination.js
document.querySelectorAll(".paginated-table").forEach((container) => {
  let rowsPerPage = 10;
  let currentPage = 1;
  let showingHidden = true;
  const toggleBtns = container.querySelectorAll(".toggleBtnHH, .toggleBtnCT");
  const allRows = Array.from(container.querySelectorAll(".rows-hh, .hrsError, .rows-conts, .contsError"));
  const rowsSelect = container.querySelector(".rows-per-page");
  const pagination = container.querySelector("#tablePaginationCt, #tablePagination");
  const prevBtn = pagination.querySelector(".nhsuk-pagination__previous");
  const nextBtn = pagination.querySelector(".nhsuk-pagination__next");
  const paginationList = pagination.querySelector(".nhsuk-pagination__list");
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L3RvZ2dsZS1wYWdpbmF0aW9uLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBhZ2luYXRlZC10YWJsZVwiKS5mb3JFYWNoKGNvbnRhaW5lciA9PiB7XG5cbiAgICBsZXQgcm93c1BlclBhZ2UgPSAxMFxuICAgIGxldCBjdXJyZW50UGFnZSA9IDFcbiAgICBsZXQgc2hvd2luZ0hpZGRlbiA9IHRydWVcblxuICAgIGNvbnN0IHRvZ2dsZUJ0bnMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbChcIi50b2dnbGVCdG5ISCwgLnRvZ2dsZUJ0bkNUXCIpXG4gICAgY29uc3QgYWxsUm93cyA9IEFycmF5LmZyb20oY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucm93cy1oaCwgLmhyc0Vycm9yLCAucm93cy1jb250cywgLmNvbnRzRXJyb3JcIikpXG4gICAgY29uc3Qgcm93c1NlbGVjdCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLnJvd3MtcGVyLXBhZ2VcIilcblxuICAgIGNvbnN0IHBhZ2luYXRpb24gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcihcIiN0YWJsZVBhZ2luYXRpb25DdCwgI3RhYmxlUGFnaW5hdGlvblwiKVxuICAgIGNvbnN0IHByZXZCdG4gPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3IoXCIubmhzdWstcGFnaW5hdGlvbl9fcHJldmlvdXNcIilcbiAgICBjb25zdCBuZXh0QnRuID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yKFwiLm5oc3VrLXBhZ2luYXRpb25fX25leHRcIilcbiAgICBjb25zdCBwYWdpbmF0aW9uTGlzdCA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvcihcIi5uaHN1ay1wYWdpbmF0aW9uX19saXN0XCIpXG5cbiAgICBpZiAocm93c1NlbGVjdCkge1xuICAgICAgICByb3dzU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSByb3dzU2VsZWN0LnZhbHVlXG4gICAgICAgICAgICByb3dzUGVyUGFnZSA9IHZhbHVlID09PSBcImFsbFwiID8gSW5maW5pdHkgOiBwYXJzZUludCh2YWx1ZSlcbiAgICAgICAgICAgIGN1cnJlbnRQYWdlID0gMVxuICAgICAgICAgICAgcmVuZGVyVGFibGUoKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vIGdldCB0aGUgcm93cyB0aGF0IHNob3VsZCBjdXJyZW50bHkgYmUgdmlzaWJsZVxuICAgIGZ1bmN0aW9uIGdldFZpc2libGVSb3dzKCkge1xuICAgICAgICByZXR1cm4gYWxsUm93cy5maWx0ZXIocm93ID0+IHtcbiAgICAgICAgICAgIC8vIGhpZGUgaGlkZGVuIHJvd3MgaWYgdG9nZ2xlIGlzIG9mZlxuICAgICAgICAgICAgaWYgKCFzaG93aW5nSGlkZGVuICYmIHJvdy5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRkZW4tcm93XCIpKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlUGFnZUl0ZW0ocGFnZSwgaXNDdXJyZW50ID0gZmFsc2UpIHtcblxuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKVxuICAgICAgICBsaS5jbGFzc05hbWUgPSBcIm5oc3VrLXBhZ2luYXRpb25fX2l0ZW1cIlxuXG4gICAgICAgIGlmIChpc0N1cnJlbnQpIGxpLmNsYXNzTGlzdC5hZGQoXCJuaHN1ay1wYWdpbmF0aW9uX19pdGVtLS1jdXJyZW50XCIpXG5cbiAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpXG4gICAgICAgIGxpbmsuaHJlZiA9IFwiI1wiXG4gICAgICAgIGxpbmsuY2xhc3NOYW1lID0gXCJuaHN1ay1wYWdpbmF0aW9uX19saW5rXCJcbiAgICAgICAgbGluay50ZXh0Q29udGVudCA9IHBhZ2VcblxuICAgICAgICBpZiAoaXNDdXJyZW50KSBsaW5rLnNldEF0dHJpYnV0ZShcImFyaWEtY3VycmVudFwiLCBcInBhZ2VcIilcblxuICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgY3VycmVudFBhZ2UgPSBwYWdlXG4gICAgICAgICAgICByZW5kZXJUYWJsZSgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgbGkuYXBwZW5kQ2hpbGQobGluaylcbiAgICAgICAgcmV0dXJuIGxpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyUGFnaW5hdGlvbih0b3RhbFBhZ2VzKSB7XG5cbiAgICAgICAgcGFnaW5hdGlvbkxpc3QuaW5uZXJIVE1MID0gXCJcIlxuXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHRvdGFsUGFnZXM7IGkrKykge1xuICAgICAgICAgICAgcGFnaW5hdGlvbkxpc3QuYXBwZW5kQ2hpbGQoY3JlYXRlUGFnZUl0ZW0oaSwgaSA9PT0gY3VycmVudFBhZ2UpKVxuICAgICAgICB9XG5cbiAgICAgICAgcHJldkJ0bi5zdHlsZS5kaXNwbGF5ID0gY3VycmVudFBhZ2UgPT09IDEgPyBcIm5vbmVcIiA6IFwiYmxvY2tcIlxuICAgICAgICBuZXh0QnRuLnN0eWxlLmRpc3BsYXkgPSBjdXJyZW50UGFnZSA9PT0gdG90YWxQYWdlcyA/IFwibm9uZVwiIDogXCJibG9ja1wiXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyVGFibGUoKSB7XG5cbiAgICAgICAgY29uc3QgdmlzaWJsZVJvd3MgPSBnZXRWaXNpYmxlUm93cygpXG4gICAgICAgIGNvbnN0IHRvdGFsUGFnZXMgPSBNYXRoLmNlaWwodmlzaWJsZVJvd3MubGVuZ3RoIC8gcm93c1BlclBhZ2UpIHx8IDFcblxuICAgICAgICBhbGxSb3dzLmZvckVhY2gocm93ID0+IHJvdy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCIpXG5cbiAgICAgICAgaWYgKHJvd3NQZXJQYWdlID09PSBJbmZpbml0eSkge1xuICAgICAgICAgICAgLy8gU2hvdyBhbGwgcm93c1xuICAgICAgICAgICAgdmlzaWJsZVJvd3MuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICAgICAgICAgIHJvdy5zdHlsZS5kaXNwbGF5ID0gXCJcIlxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gKGN1cnJlbnRQYWdlIC0gMSkgKiByb3dzUGVyUGFnZVxuICAgICAgICAgICAgY29uc3QgZW5kID0gc3RhcnQgKyByb3dzUGVyUGFnZVxuXG4gICAgICAgICAgICB2aXNpYmxlUm93cy5zbGljZShzdGFydCwgZW5kKS5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgICAgICAgcm93LnN0eWxlLmRpc3BsYXkgPSBcIlwiXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyUGFnaW5hdGlvbih0b3RhbFBhZ2VzKVxuXG4gICAgICAgIC8vIHBhZ2luYXRpb24uc3R5bGUuZGlzcGxheSA9IHNob3dpbmdIaWRkZW4gPyBcImJsb2NrXCIgOiBcIm5vbmVcIlxuICAgICAgICBwYWdpbmF0aW9uLnN0eWxlLmRpc3BsYXkgPSAocm93c1BlclBhZ2UgPT09IEluZmluaXR5IHx8ICFzaG93aW5nSGlkZGVuKVxuICAgICAgICA/IFwibm9uZVwiXG4gICAgICAgIDogXCJibG9ja1wiXG4gICAgfVxuXG4gICAgcHJldkJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBjdXJyZW50UGFnZS0tXG4gICAgICAgIHJlbmRlclRhYmxlKClcbiAgICB9KVxuXG4gICAgbmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBjdXJyZW50UGFnZSsrXG4gICAgICAgIHJlbmRlclRhYmxlKClcbiAgICB9KVxuXG4gICAgdG9nZ2xlQnRucy5mb3JFYWNoKHRvZ2dsZUJ0biA9PiB7XG5cbiAgICAgICAgdG9nZ2xlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cbiAgICAgICAgICAgIHNob3dpbmdIaWRkZW4gPSAhc2hvd2luZ0hpZGRlblxuXG4gICAgICAgICAgICB0b2dnbGVCdG4udGV4dENvbnRlbnQgPSBzaG93aW5nSGlkZGVuXG4gICAgICAgICAgICAgICAgPyBcIkhpZGUgY29ycmVjdCByb3dzXCJcbiAgICAgICAgICAgICAgICA6IFwiU2hvdyBjb3JyZWN0IHJvd3NcIlxuXG4gICAgICAgICAgICBjdXJyZW50UGFnZSA9IDFcbiAgICAgICAgICAgIHJlbmRlclRhYmxlKClcblxuICAgICAgICB9KVxuXG4gICAgfSlcblxuICAgIHJlbmRlclRhYmxlKClcblxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQUEsU0FBUyxpQkFBaUIsa0JBQWtCLEVBQUUsUUFBUSxlQUFhO0FBRS9ELE1BQUksY0FBYztBQUNsQixNQUFJLGNBQWM7QUFDbEIsTUFBSSxnQkFBZ0I7QUFFcEIsUUFBTSxhQUFhLFVBQVUsaUJBQWlCLDRCQUE0QjtBQUMxRSxRQUFNLFVBQVUsTUFBTSxLQUFLLFVBQVUsaUJBQWlCLCtDQUErQyxDQUFDO0FBQ3RHLFFBQU0sYUFBYSxVQUFVLGNBQWMsZ0JBQWdCO0FBRTNELFFBQU0sYUFBYSxVQUFVLGNBQWMsc0NBQXNDO0FBQ2pGLFFBQU0sVUFBVSxXQUFXLGNBQWMsNkJBQTZCO0FBQ3RFLFFBQU0sVUFBVSxXQUFXLGNBQWMseUJBQXlCO0FBQ2xFLFFBQU0saUJBQWlCLFdBQVcsY0FBYyx5QkFBeUI7QUFFekUsTUFBSSxZQUFZO0FBQ1osZUFBVyxpQkFBaUIsVUFBVSxNQUFNO0FBQ3hDLFlBQU0sUUFBUSxXQUFXO0FBQ3pCLG9CQUFjLFVBQVUsUUFBUSxXQUFXLFNBQVMsS0FBSztBQUN6RCxvQkFBYztBQUNkLGtCQUFZO0FBQUEsSUFDaEIsQ0FBQztBQUFBLEVBQ0w7QUFHQSxXQUFTLGlCQUFpQjtBQUN0QixXQUFPLFFBQVEsT0FBTyxTQUFPO0FBRXpCLFVBQUksQ0FBQyxpQkFBaUIsSUFBSSxVQUFVLFNBQVMsWUFBWSxFQUFHLFFBQU87QUFDbkUsYUFBTztBQUFBLElBQ1gsQ0FBQztBQUFBLEVBQ0w7QUFFQSxXQUFTLGVBQWUsTUFBTSxZQUFZLE9BQU87QUFFN0MsVUFBTSxLQUFLLFNBQVMsY0FBYyxJQUFJO0FBQ3RDLE9BQUcsWUFBWTtBQUVmLFFBQUksVUFBVyxJQUFHLFVBQVUsSUFBSSxpQ0FBaUM7QUFFakUsVUFBTSxPQUFPLFNBQVMsY0FBYyxHQUFHO0FBQ3ZDLFNBQUssT0FBTztBQUNaLFNBQUssWUFBWTtBQUNqQixTQUFLLGNBQWM7QUFFbkIsUUFBSSxVQUFXLE1BQUssYUFBYSxnQkFBZ0IsTUFBTTtBQUV2RCxTQUFLLGlCQUFpQixTQUFTLE9BQUs7QUFDaEMsUUFBRSxlQUFlO0FBQ2pCLG9CQUFjO0FBQ2Qsa0JBQVk7QUFBQSxJQUNoQixDQUFDO0FBRUQsT0FBRyxZQUFZLElBQUk7QUFDbkIsV0FBTztBQUFBLEVBQ1g7QUFFQSxXQUFTLGlCQUFpQixZQUFZO0FBRWxDLG1CQUFlLFlBQVk7QUFFM0IsYUFBUyxJQUFJLEdBQUcsS0FBSyxZQUFZLEtBQUs7QUFDbEMscUJBQWUsWUFBWSxlQUFlLEdBQUcsTUFBTSxXQUFXLENBQUM7QUFBQSxJQUNuRTtBQUVBLFlBQVEsTUFBTSxVQUFVLGdCQUFnQixJQUFJLFNBQVM7QUFDckQsWUFBUSxNQUFNLFVBQVUsZ0JBQWdCLGFBQWEsU0FBUztBQUFBLEVBQ2xFO0FBRUEsV0FBUyxjQUFjO0FBRW5CLFVBQU0sY0FBYyxlQUFlO0FBQ25DLFVBQU0sYUFBYSxLQUFLLEtBQUssWUFBWSxTQUFTLFdBQVcsS0FBSztBQUVsRSxZQUFRLFFBQVEsU0FBTyxJQUFJLE1BQU0sVUFBVSxNQUFNO0FBRWpELFFBQUksZ0JBQWdCLFVBQVU7QUFFMUIsa0JBQVksUUFBUSxTQUFPO0FBQ3ZCLFlBQUksTUFBTSxVQUFVO0FBQUEsTUFDeEIsQ0FBQztBQUFBLElBQ0wsT0FBTztBQUNILFlBQU0sU0FBUyxjQUFjLEtBQUs7QUFDbEMsWUFBTSxNQUFNLFFBQVE7QUFFcEIsa0JBQVksTUFBTSxPQUFPLEdBQUcsRUFBRSxRQUFRLFNBQU87QUFDekMsWUFBSSxNQUFNLFVBQVU7QUFBQSxNQUN4QixDQUFDO0FBQUEsSUFDTDtBQUVBLHFCQUFpQixVQUFVO0FBRzNCLGVBQVcsTUFBTSxVQUFXLGdCQUFnQixZQUFZLENBQUMsZ0JBQ3ZELFNBQ0E7QUFBQSxFQUNOO0FBRUEsVUFBUSxpQkFBaUIsU0FBUyxPQUFLO0FBQ25DLE1BQUUsZUFBZTtBQUNqQjtBQUNBLGdCQUFZO0FBQUEsRUFDaEIsQ0FBQztBQUVELFVBQVEsaUJBQWlCLFNBQVMsT0FBSztBQUNuQyxNQUFFLGVBQWU7QUFDakI7QUFDQSxnQkFBWTtBQUFBLEVBQ2hCLENBQUM7QUFFRCxhQUFXLFFBQVEsZUFBYTtBQUU1QixjQUFVLGlCQUFpQixTQUFTLE1BQU07QUFFdEMsc0JBQWdCLENBQUM7QUFFakIsZ0JBQVUsY0FBYyxnQkFDbEIsc0JBQ0E7QUFFTixvQkFBYztBQUNkLGtCQUFZO0FBQUEsSUFFaEIsQ0FBQztBQUFBLEVBRUwsQ0FBQztBQUVELGNBQVk7QUFFaEIsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
