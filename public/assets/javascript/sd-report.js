// app/assets/javascript/sd-report.js
document.addEventListener("DOMContentLoaded", function() {
  const tableBody = document.querySelector("#reportTable tbody");
  const addButton = document.getElementById("addRowButton");
  function bindRemoveLinks() {
    tableBody.querySelectorAll(".remove-row").forEach((link) => {
      link.removeEventListener("click", removeHandler);
      link.addEventListener("click", removeHandler);
    });
  }
  function removeHandler(e) {
    e.preventDefault();
    const row = e.target.closest("tr");
    row.remove();
  }
  bindRemoveLinks();
  addButton.addEventListener("click", function() {
    const rowCount = tableBody.querySelectorAll("tr").length + 1;
    const newRow = document.createElement("tr");
    newRow.classList.add("nhsuk-table__row");
    newRow.innerHTML = `
        <td class="nhsuk-table__cell">
            <input class="nhsuk-input nhsuk-input--width-10 nhsuk-u-font-size-14"
                    id="sets-${rowCount}"
                    name="sets[]"
                    type="text">
        </td>
    
        <td class="nhsuk-table__cell">
            <input class="nhsuk-input nhsuk-input--width-10 nhsuk-u-font-size-14"
                    id="fields-${rowCount}"
                    name="fields[]"
                    type="text">
        </td>
    
        <td class="nhsuk-table__cell">
            <input class="nhsuk-input nhsuk-u-font-size-14"
                    id="amendments-${rowCount}"
                    name="amendments[]"
                    type="text">
        </td>
    
        <td class="nhsuk-table__cell">
            <input class="nhsuk-input nhsuk-u-font-size-14"
                    id="reason-${rowCount}"
                    name="reason[]"
                    type="text">
        </td>
    
        <td class="nhsuk-table__cell  nhsuk-u-font-size-14">
        <a href="#" class="remove-row nhsuk-link">
            Remove
            <span class="nhsuk-u-visually-hidden">row ${rowCount}</span>
        </a>
        </td>
    `;
    tableBody.appendChild(newRow);
    bindRemoveLinks();
  });
  const form = document.getElementById("reportForm");
  const errorSummary = document.getElementById("errorSummary");
  const errorList = document.getElementById("errorList");
  const table = document.getElementById("reportTable");
  const fields = ["sets[]", "fields[]", "amendments[]", "reason[]"];
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    clearErrors();
    let errors = [];
    let firstErrorField = null;
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach((row, rowIndex) => {
      const inputs = getRowInputs(row);
      const rowHasData = inputs.some((i) => i.value.trim() !== "");
      if (!rowHasData) return;
      inputs.forEach((input, colIndex) => {
        const message = getErrorMessage(colIndex);
        if (!input.value.trim()) {
          const errorId = ensureError(input, message, rowIndex);
          errors.push(
            `<li><a href="#${errorId}">${message} (row ${rowIndex + 1})</a></li>`
          );
          if (!firstErrorField) {
            firstErrorField = input;
          }
        }
      });
    });
    if (errors.length > 0) {
      errorList.innerHTML = errors.join("");
      errorSummary.style.display = "block";
      errorSummary.scrollIntoView({ behavior: "smooth" });
      if (firstErrorField) {
        setTimeout(() => {
          firstErrorField.focus();
          firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 200);
      }
      return;
    }
    form.submit();
  });
  table.addEventListener("input", function(e) {
    const input = e.target;
    if (!input.matches("input")) return;
    const cell = input.closest("td");
    if (input.value.trim()) {
      removeError(input, cell);
    }
  });
  function getRowInputs(row) {
    return [
      row.querySelector('input[name="sets[]"]'),
      row.querySelector('input[name="fields[]"]'),
      row.querySelector('input[name="amendments[]"]'),
      row.querySelector('input[name="reason[]"]')
    ];
  }
  function getErrorMessage(index) {
    switch (index) {
      case 0:
        return '<span class="nhsuk-u-visually-hidden">Error:</span>Enter the set';
      case 1:
        return '<span class="nhsuk-u-visually-hidden">Error:</span>Enter the field';
      case 2:
        return '<span class="nhsuk-u-visually-hidden">Error:</span>Enter the amendment';
      case 3:
        return '<span class="nhsuk-u-visually-hidden">Error:</span>Enter the reason';
      default:
        return "This field is required";
    }
  }
  function ensureError(input, message, rowIndex) {
    const cell = input.closest("td");
    cell.classList.add("nhsuk-form-group--error");
    let error = cell.querySelector(".nhsuk-error-message");
    if (!error) {
      error = document.createElement("span");
      error.className = "nhsuk-error-message nhsuk-u-font-size-14";
      cell.insertBefore(error, input);
    }
    error.innerHTML = message;
    const errorId = input.id || `row-${rowIndex}-${Math.random().toString(36).slice(2, 7)}`;
    input.setAttribute("aria-describedby", errorId);
    input.id = errorId;
    return errorId;
  }
  function removeError(input, cell) {
    if (!cell) return;
    const error = cell.querySelector(".nhsuk-error-message");
    if (error) error.remove();
    cell.classList.remove("nhsuk-form-group--error");
    input.removeAttribute("aria-describedby");
  }
  function clearErrors() {
    errorList.innerHTML = "";
    errorSummary.style.display = "none";
    document.querySelectorAll(".nhsuk-form-group--error").forEach((el) => el.classList.remove("nhsuk-form-group--error"));
    document.querySelectorAll(".nhsuk-error-message").forEach((el) => el.remove());
  }
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L3NkLXJlcG9ydC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcblxuICAgIGNvbnN0IHRhYmxlQm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXBvcnRUYWJsZSB0Ym9keScpO1xuICAgIGNvbnN0IGFkZEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRSb3dCdXR0b24nKTtcbiAgICAvL2NvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVwb3J0Rm9ybScpO1xuICAgIC8vIGNvbnN0IGVycm9yU3VtbWFyeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcnJvclN1bW1hcnknKTtcbiAgICAvLyBjb25zdCBlcnJvckxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyb3JMaXN0Jyk7XG5cbiAgICAvLyBSZW1vdmUgcm93XG4gICAgZnVuY3Rpb24gYmluZFJlbW92ZUxpbmtzKCkge1xuICAgICAgICB0YWJsZUJvZHkucXVlcnlTZWxlY3RvckFsbCgnLnJlbW92ZS1yb3cnKS5mb3JFYWNoKGxpbmsgPT4ge1xuICAgICAgICAgICAgbGluay5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHJlbW92ZUhhbmRsZXIpO1xuICAgICAgICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJlbW92ZUhhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVIYW5kbGVyKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCByb3cgPSBlLnRhcmdldC5jbG9zZXN0KCd0cicpO1xuICAgICAgICByb3cucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgYmluZFJlbW92ZUxpbmtzKCk7XG5cbiAgICAvLyBBZGQgbmV3IHJvd1xuICAgIGFkZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBjb25zdCByb3dDb3VudCA9IHRhYmxlQm9keS5xdWVyeVNlbGVjdG9yQWxsKCd0cicpLmxlbmd0aCArIDE7XG5cbiAgICAgICAgY29uc3QgbmV3Um93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcbiAgICAgICAgbmV3Um93LmNsYXNzTGlzdC5hZGQoJ25oc3VrLXRhYmxlX19yb3cnKTtcblxuICAgICAgICBuZXdSb3cuaW5uZXJIVE1MID0gYFxuICAgICAgICA8dGQgY2xhc3M9XCJuaHN1ay10YWJsZV9fY2VsbFwiPlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwibmhzdWstaW5wdXQgbmhzdWstaW5wdXQtLXdpZHRoLTEwIG5oc3VrLXUtZm9udC1zaXplLTE0XCJcbiAgICAgICAgICAgICAgICAgICAgaWQ9XCJzZXRzLSR7cm93Q291bnR9XCJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInNldHNbXVwiXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCI+XG4gICAgICAgIDwvdGQ+XG4gICAgXG4gICAgICAgIDx0ZCBjbGFzcz1cIm5oc3VrLXRhYmxlX19jZWxsXCI+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJuaHN1ay1pbnB1dCBuaHN1ay1pbnB1dC0td2lkdGgtMTAgbmhzdWstdS1mb250LXNpemUtMTRcIlxuICAgICAgICAgICAgICAgICAgICBpZD1cImZpZWxkcy0ke3Jvd0NvdW50fVwiXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJmaWVsZHNbXVwiXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCI+XG4gICAgICAgIDwvdGQ+XG4gICAgXG4gICAgICAgIDx0ZCBjbGFzcz1cIm5oc3VrLXRhYmxlX19jZWxsXCI+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJuaHN1ay1pbnB1dCBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiXG4gICAgICAgICAgICAgICAgICAgIGlkPVwiYW1lbmRtZW50cy0ke3Jvd0NvdW50fVwiXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJhbWVuZG1lbnRzW11cIlxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiPlxuICAgICAgICA8L3RkPlxuICAgIFxuICAgICAgICA8dGQgY2xhc3M9XCJuaHN1ay10YWJsZV9fY2VsbFwiPlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwibmhzdWstaW5wdXQgbmhzdWstdS1mb250LXNpemUtMTRcIlxuICAgICAgICAgICAgICAgICAgICBpZD1cInJlYXNvbi0ke3Jvd0NvdW50fVwiXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJyZWFzb25bXVwiXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCI+XG4gICAgICAgIDwvdGQ+XG4gICAgXG4gICAgICAgIDx0ZCBjbGFzcz1cIm5oc3VrLXRhYmxlX19jZWxsICBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiPlxuICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzPVwicmVtb3ZlLXJvdyBuaHN1ay1saW5rXCI+XG4gICAgICAgICAgICBSZW1vdmVcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5yb3cgJHtyb3dDb3VudH08L3NwYW4+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPC90ZD5cbiAgICBgO1xuXG4gICAgICAgIHRhYmxlQm9keS5hcHBlbmRDaGlsZChuZXdSb3cpO1xuICAgICAgICBiaW5kUmVtb3ZlTGlua3MoKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlcG9ydEZvcm1cIik7XG4gICAgY29uc3QgZXJyb3JTdW1tYXJ5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvclN1bW1hcnlcIik7XG4gICAgY29uc3QgZXJyb3JMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvckxpc3RcIik7XG5cbiAgICBjb25zdCB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVwb3J0VGFibGVcIik7XG5cbiAgICBjb25zdCBmaWVsZHMgPSBbXCJzZXRzW11cIiwgXCJmaWVsZHNbXVwiLCBcImFtZW5kbWVudHNbXVwiLCBcInJlYXNvbltdXCJdO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIFNVQk1JVCBWQUxJREFUSU9OXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgY2xlYXJFcnJvcnMoKTtcblxuICAgICAgICBsZXQgZXJyb3JzID0gW107XG4gICAgICAgIGxldCBmaXJzdEVycm9yRmllbGQgPSBudWxsO1xuXG4gICAgICAgIGNvbnN0IHJvd3MgPSB0YWJsZS5xdWVyeVNlbGVjdG9yQWxsKFwidGJvZHkgdHJcIik7XG5cbiAgICAgICAgcm93cy5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbnB1dHMgPSBnZXRSb3dJbnB1dHMocm93KTtcblxuICAgICAgICAgICAgY29uc3Qgcm93SGFzRGF0YSA9IGlucHV0cy5zb21lKGkgPT4gaS52YWx1ZS50cmltKCkgIT09IFwiXCIpO1xuXG4gICAgICAgICAgICAvLyBpZ25vcmUgZW1wdHkgcm93cyBjb21wbGV0ZWx5XG4gICAgICAgICAgICBpZiAoIXJvd0hhc0RhdGEpIHJldHVybjtcblxuICAgICAgICAgICAgaW5wdXRzLmZvckVhY2goKGlucHV0LCBjb2xJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBnZXRFcnJvck1lc3NhZ2UoY29sSW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFpbnB1dC52YWx1ZS50cmltKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3JJZCA9IGVuc3VyZUVycm9yKGlucHV0LCBtZXNzYWdlLCByb3dJbmRleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICBgPGxpPjxhIGhyZWY9XCIjJHtlcnJvcklkfVwiPiR7bWVzc2FnZX0gKHJvdyAke3Jvd0luZGV4ICsgMX0pPC9hPjwvbGk+YFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBpbnB1dDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGVycm9yTGlzdC5pbm5lckhUTUwgPSBlcnJvcnMuam9pbihcIlwiKTtcbiAgICAgICAgICAgIGVycm9yU3VtbWFyeS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXG4gICAgICAgICAgICBlcnJvclN1bW1hcnkuc2Nyb2xsSW50b1ZpZXcoeyBiZWhhdmlvcjogXCJzbW9vdGhcIiB9KTtcblxuICAgICAgICAgICAgaWYgKGZpcnN0RXJyb3JGaWVsZCkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBmaXJzdEVycm9yRmllbGQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkLnNjcm9sbEludG9WaWV3KHsgYmVoYXZpb3I6IFwic21vb3RoXCIsIGJsb2NrOiBcImNlbnRlclwiIH0pO1xuICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm0uc3VibWl0KCk7XG4gICAgfSk7XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gTElWRSBWQUxJREFUSU9OIChvbiBpbnB1dClcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgdGFibGUuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQ7XG5cbiAgICAgICAgaWYgKCFpbnB1dC5tYXRjaGVzKFwiaW5wdXRcIikpIHJldHVybjtcblxuICAgICAgICBjb25zdCBjZWxsID0gaW5wdXQuY2xvc2VzdChcInRkXCIpO1xuXG4gICAgICAgIGlmIChpbnB1dC52YWx1ZS50cmltKCkpIHtcbiAgICAgICAgICAgIHJlbW92ZUVycm9yKGlucHV0LCBjZWxsKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIEhFTFBFUlNcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBmdW5jdGlvbiBnZXRSb3dJbnB1dHMocm93KSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICByb3cucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInNldHNbXVwiXScpLFxuICAgICAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJmaWVsZHNbXVwiXScpLFxuICAgICAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJhbWVuZG1lbnRzW11cIl0nKSxcbiAgICAgICAgICAgIHJvdy5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwicmVhc29uW11cIl0nKVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEVycm9yTWVzc2FnZShpbmRleCkge1xuICAgICAgICBzd2l0Y2ggKGluZGV4KSB7XG4gICAgICAgICAgICBjYXNlIDA6IFxuICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj5FbnRlciB0aGUgc2V0JztcbiAgICAgICAgICAgIGNhc2UgMTogXG4gICAgICAgICAgICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPkVudGVyIHRoZSBmaWVsZCc7XG4gICAgICAgICAgICBjYXNlIDI6IFxuICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj5FbnRlciB0aGUgYW1lbmRtZW50JztcbiAgICAgICAgICAgIGNhc2UgMzogXG4gICAgICAgICAgICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPkVudGVyIHRoZSByZWFzb24nO1xuICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuICdUaGlzIGZpZWxkIGlzIHJlcXVpcmVkJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVuc3VyZUVycm9yKGlucHV0LCBtZXNzYWdlLCByb3dJbmRleCkge1xuICAgICAgICBjb25zdCBjZWxsID0gaW5wdXQuY2xvc2VzdChcInRkXCIpO1xuXG4gICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcIm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yXCIpO1xuXG4gICAgICAgIGxldCBlcnJvciA9IGNlbGwucXVlcnlTZWxlY3RvcihcIi5uaHN1ay1lcnJvci1tZXNzYWdlXCIpO1xuXG4gICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgIGVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICBlcnJvci5jbGFzc05hbWUgPSBcIm5oc3VrLWVycm9yLW1lc3NhZ2UgbmhzdWstdS1mb250LXNpemUtMTRcIjtcbiAgICAgICAgICAgIGNlbGwuaW5zZXJ0QmVmb3JlKGVycm9yLCBpbnB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBtZXNzYWdlO1xuXG4gICAgICAgIGNvbnN0IGVycm9ySWQgPSBpbnB1dC5pZCB8fCBgcm93LSR7cm93SW5kZXh9LSR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMiwgNyl9YDtcblxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRlc2NyaWJlZGJ5XCIsIGVycm9ySWQpO1xuICAgICAgICBpbnB1dC5pZCA9IGVycm9ySWQ7XG5cbiAgICAgICAgcmV0dXJuIGVycm9ySWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRXJyb3IoaW5wdXQsIGNlbGwpIHtcbiAgICAgICAgaWYgKCFjZWxsKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZXJyb3IgPSBjZWxsLnF1ZXJ5U2VsZWN0b3IoXCIubmhzdWstZXJyb3ItbWVzc2FnZVwiKTtcblxuICAgICAgICBpZiAoZXJyb3IpIGVycm9yLnJlbW92ZSgpO1xuXG4gICAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShcIm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yXCIpO1xuXG4gICAgICAgIGlucHV0LnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJFcnJvcnMoKSB7XG4gICAgICAgIGVycm9yTGlzdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBlcnJvclN1bW1hcnkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmhzdWstZm9ybS1ncm91cC0tZXJyb3JcIilcbiAgICAgICAgICAgIC5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoXCJuaHN1ay1mb3JtLWdyb3VwLS1lcnJvclwiKSk7XG5cbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uaHN1ay1lcnJvci1tZXNzYWdlXCIpXG4gICAgICAgICAgICAuZm9yRWFjaChlbCA9PiBlbC5yZW1vdmUoKSk7XG4gICAgfVxuXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQUEsU0FBUyxpQkFBaUIsb0JBQW9CLFdBQVk7QUFFdEQsUUFBTSxZQUFZLFNBQVMsY0FBYyxvQkFBb0I7QUFDN0QsUUFBTSxZQUFZLFNBQVMsZUFBZSxjQUFjO0FBTXhELFdBQVMsa0JBQWtCO0FBQ3ZCLGNBQVUsaUJBQWlCLGFBQWEsRUFBRSxRQUFRLFVBQVE7QUFDdEQsV0FBSyxvQkFBb0IsU0FBUyxhQUFhO0FBQy9DLFdBQUssaUJBQWlCLFNBQVMsYUFBYTtBQUFBLElBQ2hELENBQUM7QUFBQSxFQUNMO0FBRUEsV0FBUyxjQUFjLEdBQUc7QUFDdEIsTUFBRSxlQUFlO0FBQ2pCLFVBQU0sTUFBTSxFQUFFLE9BQU8sUUFBUSxJQUFJO0FBQ2pDLFFBQUksT0FBTztBQUFBLEVBQ2Y7QUFFQSxrQkFBZ0I7QUFHaEIsWUFBVSxpQkFBaUIsU0FBUyxXQUFZO0FBRTVDLFVBQU0sV0FBVyxVQUFVLGlCQUFpQixJQUFJLEVBQUUsU0FBUztBQUUzRCxVQUFNLFNBQVMsU0FBUyxjQUFjLElBQUk7QUFDMUMsV0FBTyxVQUFVLElBQUksa0JBQWtCO0FBRXZDLFdBQU8sWUFBWTtBQUFBO0FBQUE7QUFBQSwrQkFHSSxRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUNBT04sUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHFDQU9KLFFBQVE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQ0FPWixRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtB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
