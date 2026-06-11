// app/assets/javascript/sd-report-v2.js
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
      row.querySelector('input[name="amendments[]"]')
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L3NkLXJlcG9ydC12Mi5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcblxuICAgIGNvbnN0IHRhYmxlQm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXBvcnRUYWJsZSB0Ym9keScpO1xuICAgIGNvbnN0IGFkZEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRSb3dCdXR0b24nKTtcblxuICAgIC8vIFJlbW92ZSByb3dcbiAgICBmdW5jdGlvbiBiaW5kUmVtb3ZlTGlua3MoKSB7XG4gICAgICAgIHRhYmxlQm9keS5xdWVyeVNlbGVjdG9yQWxsKCcucmVtb3ZlLXJvdycpLmZvckVhY2gobGluayA9PiB7XG4gICAgICAgICAgICBsaW5rLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVtb3ZlSGFuZGxlcik7XG4gICAgICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVtb3ZlSGFuZGxlcik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUhhbmRsZXIoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IHJvdyA9IGUudGFyZ2V0LmNsb3Nlc3QoJ3RyJyk7XG4gICAgICAgIHJvdy5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICBiaW5kUmVtb3ZlTGlua3MoKTtcblxuICAgIC8vIEFkZCBuZXcgcm93XG4gICAgYWRkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGNvbnN0IHJvd0NvdW50ID0gdGFibGVCb2R5LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RyJykubGVuZ3RoICsgMTtcblxuICAgICAgICBjb25zdCBuZXdSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuICAgICAgICBuZXdSb3cuY2xhc3NMaXN0LmFkZCgnbmhzdWstdGFibGVfX3JvdycpO1xuXG4gICAgICAgIG5ld1Jvdy5pbm5lckhUTUwgPSBgXG4gICAgICAgIDx0ZCBjbGFzcz1cIm5oc3VrLXRhYmxlX19jZWxsXCI+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJuaHN1ay1pbnB1dCBuaHN1ay1pbnB1dC0td2lkdGgtMTAgbmhzdWstdS1mb250LXNpemUtMTRcIlxuICAgICAgICAgICAgICAgICAgICBpZD1cInNldHMtJHtyb3dDb3VudH1cIlxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwic2V0c1tdXCJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIj5cbiAgICAgICAgPC90ZD5cbiAgICBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGxcIj5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm5oc3VrLWlucHV0IG5oc3VrLWlucHV0LS13aWR0aC0xMCBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiXG4gICAgICAgICAgICAgICAgICAgIGlkPVwiZmllbGRzLSR7cm93Q291bnR9XCJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cImZpZWxkc1tdXCJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIj5cbiAgICAgICAgPC90ZD5cbiAgICBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGxcIj5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm5oc3VrLWlucHV0IG5oc3VrLXUtZm9udC1zaXplLTE0XCJcbiAgICAgICAgICAgICAgICAgICAgaWQ9XCJhbWVuZG1lbnRzLSR7cm93Q291bnR9XCJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cImFtZW5kbWVudHNbXVwiXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCI+XG4gICAgICAgIDwvdGQ+XG4gICAgXG4gICAgICAgIDx0ZCBjbGFzcz1cIm5oc3VrLXRhYmxlX19jZWxsICBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiPlxuICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzPVwicmVtb3ZlLXJvdyBuaHN1ay1saW5rXCI+XG4gICAgICAgICAgICBSZW1vdmVcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5yb3cgJHtyb3dDb3VudH08L3NwYW4+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPC90ZD5cbiAgICBgO1xuXG4gICAgICAgIHRhYmxlQm9keS5hcHBlbmRDaGlsZChuZXdSb3cpO1xuICAgICAgICBiaW5kUmVtb3ZlTGlua3MoKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlcG9ydEZvcm1cIik7XG4gICAgY29uc3QgZXJyb3JTdW1tYXJ5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvclN1bW1hcnlcIik7XG4gICAgY29uc3QgZXJyb3JMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvckxpc3RcIik7XG5cbiAgICBjb25zdCB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVwb3J0VGFibGVcIik7XG5cbiAgICBjb25zdCBmaWVsZHMgPSBbXCJzZXRzW11cIiwgXCJmaWVsZHNbXVwiLCBcImFtZW5kbWVudHNbXVwiLCBcInJlYXNvbltdXCJdO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIFNVQk1JVCBWQUxJREFUSU9OXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgY2xlYXJFcnJvcnMoKTtcblxuICAgICAgICBsZXQgZXJyb3JzID0gW107XG4gICAgICAgIGxldCBmaXJzdEVycm9yRmllbGQgPSBudWxsO1xuXG4gICAgICAgIGNvbnN0IHJvd3MgPSB0YWJsZS5xdWVyeVNlbGVjdG9yQWxsKFwidGJvZHkgdHJcIik7XG5cbiAgICAgICAgcm93cy5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbnB1dHMgPSBnZXRSb3dJbnB1dHMocm93KTtcblxuICAgICAgICAgICAgY29uc3Qgcm93SGFzRGF0YSA9IGlucHV0cy5zb21lKGkgPT4gaS52YWx1ZS50cmltKCkgIT09IFwiXCIpO1xuXG4gICAgICAgICAgICAvLyBpZ25vcmUgZW1wdHkgcm93cyBjb21wbGV0ZWx5XG4gICAgICAgICAgICBpZiAoIXJvd0hhc0RhdGEpIHJldHVybjtcblxuICAgICAgICAgICAgaW5wdXRzLmZvckVhY2goKGlucHV0LCBjb2xJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBnZXRFcnJvck1lc3NhZ2UoY29sSW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFpbnB1dC52YWx1ZS50cmltKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3JJZCA9IGVuc3VyZUVycm9yKGlucHV0LCBtZXNzYWdlLCByb3dJbmRleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICBgPGxpPjxhIGhyZWY9XCIjJHtlcnJvcklkfVwiPiR7bWVzc2FnZX0gKHJvdyAke3Jvd0luZGV4ICsgMX0pPC9hPjwvbGk+YFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBpbnB1dDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGVycm9yTGlzdC5pbm5lckhUTUwgPSBlcnJvcnMuam9pbihcIlwiKTtcbiAgICAgICAgICAgIGVycm9yU3VtbWFyeS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXG4gICAgICAgICAgICBlcnJvclN1bW1hcnkuc2Nyb2xsSW50b1ZpZXcoeyBiZWhhdmlvcjogXCJzbW9vdGhcIiB9KTtcblxuICAgICAgICAgICAgaWYgKGZpcnN0RXJyb3JGaWVsZCkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBmaXJzdEVycm9yRmllbGQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkLnNjcm9sbEludG9WaWV3KHsgYmVoYXZpb3I6IFwic21vb3RoXCIsIGJsb2NrOiBcImNlbnRlclwiIH0pO1xuICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm0uc3VibWl0KCk7XG4gICAgfSk7XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gTElWRSBWQUxJREFUSU9OIChvbiBpbnB1dClcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgdGFibGUuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQ7XG5cbiAgICAgICAgaWYgKCFpbnB1dC5tYXRjaGVzKFwiaW5wdXRcIikpIHJldHVybjtcblxuICAgICAgICBjb25zdCBjZWxsID0gaW5wdXQuY2xvc2VzdChcInRkXCIpO1xuXG4gICAgICAgIGlmIChpbnB1dC52YWx1ZS50cmltKCkpIHtcbiAgICAgICAgICAgIHJlbW92ZUVycm9yKGlucHV0LCBjZWxsKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIEhFTFBFUlNcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBmdW5jdGlvbiBnZXRSb3dJbnB1dHMocm93KSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICByb3cucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInNldHNbXVwiXScpLFxuICAgICAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJmaWVsZHNbXVwiXScpLFxuICAgICAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJhbWVuZG1lbnRzW11cIl0nKSxcbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRFcnJvck1lc3NhZ2UoaW5kZXgpIHtcbiAgICAgICAgc3dpdGNoIChpbmRleCkge1xuICAgICAgICAgICAgY2FzZSAwOiBcbiAgICAgICAgICAgICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+RW50ZXIgdGhlIHNldCc7XG4gICAgICAgICAgICBjYXNlIDE6IFxuICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj5FbnRlciB0aGUgZmllbGQnO1xuICAgICAgICAgICAgY2FzZSAyOiBcbiAgICAgICAgICAgICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+RW50ZXIgdGhlIGFtZW5kbWVudCc7XG4gICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5zdXJlRXJyb3IoaW5wdXQsIG1lc3NhZ2UsIHJvd0luZGV4KSB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBpbnB1dC5jbG9zZXN0KFwidGRcIik7XG5cbiAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwibmhzdWstZm9ybS1ncm91cC0tZXJyb3JcIik7XG5cbiAgICAgICAgbGV0IGVycm9yID0gY2VsbC5xdWVyeVNlbGVjdG9yKFwiLm5oc3VrLWVycm9yLW1lc3NhZ2VcIik7XG5cbiAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgZXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgIGVycm9yLmNsYXNzTmFtZSA9IFwibmhzdWstZXJyb3ItbWVzc2FnZSBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiO1xuICAgICAgICAgICAgY2VsbC5pbnNlcnRCZWZvcmUoZXJyb3IsIGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVycm9yLmlubmVySFRNTCA9IG1lc3NhZ2U7XG5cbiAgICAgICAgY29uc3QgZXJyb3JJZCA9IGlucHV0LmlkIHx8IGByb3ctJHtyb3dJbmRleH0tJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyLCA3KX1gO1xuXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIiwgZXJyb3JJZCk7XG4gICAgICAgIGlucHV0LmlkID0gZXJyb3JJZDtcblxuICAgICAgICByZXR1cm4gZXJyb3JJZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVFcnJvcihpbnB1dCwgY2VsbCkge1xuICAgICAgICBpZiAoIWNlbGwpIHJldHVybjtcblxuICAgICAgICBjb25zdCBlcnJvciA9IGNlbGwucXVlcnlTZWxlY3RvcihcIi5uaHN1ay1lcnJvci1tZXNzYWdlXCIpO1xuXG4gICAgICAgIGlmIChlcnJvcikgZXJyb3IucmVtb3ZlKCk7XG5cbiAgICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwibmhzdWstZm9ybS1ncm91cC0tZXJyb3JcIik7XG5cbiAgICAgICAgaW5wdXQucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1kZXNjcmliZWRieVwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckVycm9ycygpIHtcbiAgICAgICAgZXJyb3JMaXN0LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIGVycm9yU3VtbWFyeS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uaHN1ay1mb3JtLWdyb3VwLS1lcnJvclwiKVxuICAgICAgICAgICAgLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZShcIm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yXCIpKTtcblxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5oc3VrLWVycm9yLW1lc3NhZ2VcIilcbiAgICAgICAgICAgIC5mb3JFYWNoKGVsID0+IGVsLnJlbW92ZSgpKTtcbiAgICB9XG5cbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxTQUFTLGlCQUFpQixvQkFBb0IsV0FBWTtBQUV0RCxRQUFNLFlBQVksU0FBUyxjQUFjLG9CQUFvQjtBQUM3RCxRQUFNLFlBQVksU0FBUyxlQUFlLGNBQWM7QUFHeEQsV0FBUyxrQkFBa0I7QUFDdkIsY0FBVSxpQkFBaUIsYUFBYSxFQUFFLFFBQVEsVUFBUTtBQUN0RCxXQUFLLG9CQUFvQixTQUFTLGFBQWE7QUFDL0MsV0FBSyxpQkFBaUIsU0FBUyxhQUFhO0FBQUEsSUFDaEQsQ0FBQztBQUFBLEVBQ0w7QUFFQSxXQUFTLGNBQWMsR0FBRztBQUN0QixNQUFFLGVBQWU7QUFDakIsVUFBTSxNQUFNLEVBQUUsT0FBTyxRQUFRLElBQUk7QUFDakMsUUFBSSxPQUFPO0FBQUEsRUFDZjtBQUVBLGtCQUFnQjtBQUdoQixZQUFVLGlCQUFpQixTQUFTLFdBQVk7QUFFNUMsVUFBTSxXQUFXLFVBQVUsaUJB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
