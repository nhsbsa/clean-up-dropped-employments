// app/assets/javascript/application-sandbox.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("table-selector-form");
  if (!form) return;
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    const checkboxes = form.querySelectorAll('input[name="tables"]');
    checkboxes.forEach((cb) => {
      const tableClass = cb.value;
      const tableEls = document.getElementsByClassName(tableClass);
      if (!tableEls) return;
      Array.from(tableEls).forEach((el) => {
        el.style.display = cb.checked ? "" : "none";
      });
    });
  });
  const formCustom = document.getElementById("table-custom-form");
  if (!formCustom) return;
  formCustom.addEventListener("submit", function(e) {
    e.preventDefault();
    const checkboxes = formCustom.querySelectorAll('input[name="columns"]');
    checkboxes.forEach((cb) => {
      const tableClass = cb.value;
      const tableEls = document.getElementsByClassName(tableClass);
      if (!tableEls) return;
      Array.from(tableEls).forEach((el) => {
        el.style.display = cb.checked ? "" : "none";
      });
    });
  });
});
var toggleButton = document.getElementById("filters-toggle");
var panel = document.getElementById("filters-panel");
toggleButton.addEventListener("click", () => {
  const isOpen = panel.hasAttribute("hidden") === false;
  if (isOpen) {
    panel.setAttribute("hidden", "");
    toggleButton.setAttribute("aria-expanded", "false");
    toggleButton.textContent = "Show filters";
  } else {
    panel.removeAttribute("hidden");
    toggleButton.setAttribute("aria-expanded", "true");
    toggleButton.textContent = "Hide filters";
  }
});
var toggleTableFilter = document.getElementById("filters-toggle-data");
var panelTF = document.getElementById("filters-panel-data");
toggleTableFilter.addEventListener("click", () => {
  const isOpen = panelTF.hasAttribute("hidden") === false;
  if (isOpen) {
    panelTF.setAttribute("hidden", "");
    toggleTableFilter.setAttribute("aria-expanded", "false");
    toggleTableFilter.textContent = "Customise data set";
  } else {
    panelTF.removeAttribute("hidden");
    toggleTableFilter.setAttribute("aria-expanded", "true");
    toggleTableFilter.textContent = "Hide customisable data";
  }
});
(function() {
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
    headers.forEach((h) => h.removeAttribute("aria-sort"));
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
    rows.forEach((row) => tbody.appendChild(row));
  }
  document.querySelectorAll("table .sortable").forEach((header) => {
    header.addEventListener("click", function() {
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
    header.addEventListener("keypress", function(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        header.click();
      }
    });
  });
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L2FwcGxpY2F0aW9uLXNhbmRib3guanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWJsZS1zZWxlY3Rvci1mb3JtJylcblxuICAgIGlmICghZm9ybSkgcmV0dXJuXG5cbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKSAvLyBwcmV2ZW50IHBhZ2UgcmVsb2FkXG5cbiAgICAgICAgLy8gR2V0IGFsbCBjaGVja2JveCBpbnB1dHMgaW4gdGhlIGZvcm1cbiAgICAgICAgY29uc3QgY2hlY2tib3hlcyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1cInRhYmxlc1wiXScpXG5cbiAgICAgICAgY2hlY2tib3hlcy5mb3JFYWNoKGNiID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRhYmxlQ2xhc3MgPSBjYi52YWx1ZVxuICAgICAgICAgICAgY29uc3QgdGFibGVFbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRhYmxlQ2xhc3MpXG5cbiAgICAgICAgICAgIGlmICghdGFibGVFbHMpIHJldHVyblxuXG4gICAgICAgICAgICAvLyBTaG93L2hpZGUgdGhlIHRhYmxlIGJhc2VkIG9uIHdoZXRoZXIgdGhlIGNoZWNrYm94IGlzIHRpY2tlZFxuICAgICAgICAgICAgQXJyYXkuZnJvbSh0YWJsZUVscykuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IGNiLmNoZWNrZWQgPyAnJyA6ICdub25lJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9KVxuXG4gICAgY29uc3QgZm9ybUN1c3RvbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWJsZS1jdXN0b20tZm9ybScpXG5cbiAgICBpZiAoIWZvcm1DdXN0b20pIHJldHVyblxuXG4gICAgZm9ybUN1c3RvbS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCkgLy8gcHJldmVudCBwYWdlIHJlbG9hZFxuXG4gICAgICAgIC8vIEdldCBhbGwgY2hlY2tib3ggaW5wdXRzIGluIHRoZSBmb3JtXG4gICAgICAgIGNvbnN0IGNoZWNrYm94ZXMgPSBmb3JtQ3VzdG9tLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJjb2x1bW5zXCJdJylcblxuICAgICAgICBjaGVja2JveGVzLmZvckVhY2goY2IgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFibGVDbGFzcyA9IGNiLnZhbHVlXG4gICAgICAgICAgICBjb25zdCB0YWJsZUVscyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGFibGVDbGFzcylcblxuICAgICAgICAgICAgaWYgKCF0YWJsZUVscykgcmV0dXJuXG5cbiAgICAgICAgICAgIC8vIFNob3cvaGlkZSB0aGUgdGFibGUgYmFzZWQgb24gd2hldGhlciB0aGUgY2hlY2tib3ggaXMgdGlja2VkXG4gICAgICAgICAgICBBcnJheS5mcm9tKHRhYmxlRWxzKS5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gY2IuY2hlY2tlZCA/ICcnIDogJ25vbmUnXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH0pXG59KVxuXG5jb25zdCB0b2dnbGVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsdGVycy10b2dnbGUnKTtcbmNvbnN0IHBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbHRlcnMtcGFuZWwnKTtcblxudG9nZ2xlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGNvbnN0IGlzT3BlbiA9IHBhbmVsLmhhc0F0dHJpYnV0ZSgnaGlkZGVuJykgPT09IGZhbHNlO1xuXG4gICAgaWYgKGlzT3Blbikge1xuICAgICAgICBwYW5lbC5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICcnKTtcbiAgICAgICAgdG9nZ2xlQnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICB0b2dnbGVCdXR0b24udGV4dENvbnRlbnQgPSAnU2hvdyBmaWx0ZXJzJztcbiAgICB9IGVsc2Uge1xuICAgICAgICBwYW5lbC5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgICAgICB0b2dnbGVCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgdG9nZ2xlQnV0dG9uLnRleHRDb250ZW50ID0gJ0hpZGUgZmlsdGVycyc7XG4gICAgfVxufSk7XG5cblxuY29uc3QgdG9nZ2xlVGFibGVGaWx0ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsdGVycy10b2dnbGUtZGF0YScpO1xuY29uc3QgcGFuZWxURiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWx0ZXJzLXBhbmVsLWRhdGEnKTtcblxudG9nZ2xlVGFibGVGaWx0ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgY29uc3QgaXNPcGVuID0gcGFuZWxURi5oYXNBdHRyaWJ1dGUoJ2hpZGRlbicpID09PSBmYWxzZTtcblxuICAgIGlmIChpc09wZW4pIHtcbiAgICAgICAgcGFuZWxURi5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICcnKTtcbiAgICAgICAgdG9nZ2xlVGFibGVGaWx0ZXIuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgIHRvZ2dsZVRhYmxlRmlsdGVyLnRleHRDb250ZW50ID0gJ0N1c3RvbWlzZSBkYXRhIHNldCc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcGFuZWxURi5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgICAgICB0b2dnbGVUYWJsZUZpbHRlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICB0b2dnbGVUYWJsZUZpbHRlci50ZXh0Q29udGVudCA9ICdIaWRlIGN1c3RvbWlzYWJsZSBkYXRhJztcbiAgICB9XG59KTtcblxuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSwgdHlwZSkge1xuICAgICAgdmFsdWUgPSB2YWx1ZS50cmltKCk7XG4gIFxuICAgICAgaWYgKHR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpIHx8IDA7XG4gICAgICB9XG4gIFxuICAgICAgaWYgKHR5cGUgPT09IFwiZGF0ZVwiKSB7XG4gICAgICAgIGlmICghdmFsdWUpIHJldHVybiAwO1xuICAgICAgICBjb25zdCBwYXJ0cyA9IHZhbHVlLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHBhcnRzWzJdLCBwYXJ0c1sxXSAtIDEsIHBhcnRzWzBdKS5nZXRUaW1lKCk7XG4gICAgICB9XG4gIFxuICAgICAgcmV0dXJuIHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuICBcbiAgICBmdW5jdGlvbiBjbGVhclNvcnRTdGF0ZXMoaGVhZGVycykge1xuICAgICAgaGVhZGVycy5mb3JFYWNoKGggPT4gaC5yZW1vdmVBdHRyaWJ1dGUoXCJhcmlhLXNvcnRcIikpO1xuICAgIH1cbiAgXG4gICAgZnVuY3Rpb24gc29ydFRhYmxlKHRhYmxlLCBjb2x1bW5JbmRleCwgdHlwZSwgZGlyZWN0aW9uKSB7XG4gICAgICBjb25zdCB0Ym9keSA9IHRhYmxlLnF1ZXJ5U2VsZWN0b3IoXCJ0Ym9keVwiKTtcbiAgICAgIGNvbnN0IHJvd3MgPSBBcnJheS5mcm9tKHRib2R5LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKSk7XG4gIFxuICAgICAgcm93cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IGFUZXh0ID0gYS5jaGlsZHJlbltjb2x1bW5JbmRleF0uaW5uZXJUZXh0O1xuICAgICAgICBjb25zdCBiVGV4dCA9IGIuY2hpbGRyZW5bY29sdW1uSW5kZXhdLmlubmVyVGV4dDtcbiAgXG4gICAgICAgIGNvbnN0IGFWYWwgPSBwYXJzZVZhbHVlKGFUZXh0LCB0eXBlKTtcbiAgICAgICAgY29uc3QgYlZhbCA9IHBhcnNlVmFsdWUoYlRleHQsIHR5cGUpO1xuICBcbiAgICAgICAgaWYgKGFWYWwgPCBiVmFsKSByZXR1cm4gZGlyZWN0aW9uID09PSBcImFzY1wiID8gLTEgOiAxO1xuICAgICAgICBpZiAoYVZhbCA+IGJWYWwpIHJldHVybiBkaXJlY3Rpb24gPT09IFwiYXNjXCIgPyAxIDogLTE7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfSk7XG4gIFxuICAgICAgcm93cy5mb3JFYWNoKHJvdyA9PiB0Ym9keS5hcHBlbmRDaGlsZChyb3cpKTtcbiAgICB9XG4gIFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0YWJsZSAuc29ydGFibGVcIikuZm9yRWFjaChoZWFkZXIgPT4ge1xuICBcbiAgICAgIGhlYWRlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCB0YWJsZSA9IGhlYWRlci5jbG9zZXN0KFwidGFibGVcIik7XG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSB0YWJsZS5xdWVyeVNlbGVjdG9yQWxsKFwiLnNvcnRhYmxlXCIpO1xuICAgICAgICBjb25zdCBjb2x1bW5JbmRleCA9IEFycmF5LmZyb20oaGVhZGVyLnBhcmVudE5vZGUuY2hpbGRyZW4pLmluZGV4T2YoaGVhZGVyKTtcbiAgICAgICAgY29uc3QgdHlwZSA9IGhlYWRlci5kYXRhc2V0LnNvcnRUeXBlO1xuICAgICAgICBjb25zdCBjdXJyZW50U29ydCA9IGhlYWRlci5nZXRBdHRyaWJ1dGUoXCJhcmlhLXNvcnRcIik7XG4gIFxuICAgICAgICBjb25zdCBuZXdEaXJlY3Rpb24gPSBjdXJyZW50U29ydCA9PT0gXCJhc2NlbmRpbmdcIiA/IFwiZGVzY2VuZGluZ1wiIDogXCJhc2NlbmRpbmdcIjtcbiAgXG4gICAgICAgIGNsZWFyU29ydFN0YXRlcyhoZWFkZXJzKTtcbiAgICAgICAgaGVhZGVyLnNldEF0dHJpYnV0ZShcImFyaWEtc29ydFwiLCBuZXdEaXJlY3Rpb24pO1xuICBcbiAgICAgICAgc29ydFRhYmxlKHRhYmxlLCBjb2x1bW5JbmRleCwgdHlwZSwgbmV3RGlyZWN0aW9uID09PSBcImFzY2VuZGluZ1wiID8gXCJhc2NcIiA6IFwiZGVzY1wiKTtcbiAgICAgIH0pO1xuICBcbiAgICAgIC8vIEFsbG93IGtleWJvYXJkIHNvcnRpbmdcbiAgICAgIGhlYWRlci5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIgfHwgZS5rZXkgPT09IFwiIFwiKSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGhlYWRlci5jbGljaygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgXG4gICAgfSk7XG4gIFxuICB9KSgpOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxTQUFTLGlCQUFpQixvQkFBb0IsTUFBTTtBQUNoRCxRQUFNLE9BQU8sU0FBUyxlQUFlLHFCQUFxQjtBQUUxRCxNQUFJLENBQUMsS0FBTTtBQUVYLE9BQUssaUJBQWlCLFVBQVUsU0FBVSxHQUFHO0FBQ3pDLE1BQUUsZUFBZTtBQUdqQixVQUFNLGFBQWEsS0FBSyxpQkFBaUIsc0JBQXNCO0FBRS9ELGVBQVcsUUFBUSxRQUFNO0FBQ3JCLFlBQU0sYUFBYSxHQUFHO0FBQ3RCLFlBQU0sV0FBVyxTQUFTLHVCQUF1QixVQUFVO0FBRTNELFVBQUksQ0FBQyxTQUFV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
