// app/assets/javascript/sd-report.js
document.addEventListener("DOMContentLoaded", function() {
  const tableBody = document.querySelector("#reportTable tbody");
  const addButton = document.getElementById("addRowButton");
  const form = document.getElementById("reportForm");
  const errorSummary = document.getElementById("errorSummary");
  const errorList = document.getElementById("errorList");
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
        <div class="nhsuk-form-group">
            <label class="nhsuk-label nhsuk-u-visually-hidden" for="sets-${rowCount}">
            Sets row ${rowCount}
            </label>
            <input class="nhsuk-input nhsuk-input--width-10 nhsuk-u-font-size-14"
                    id="sets-${rowCount}"
                    name="sets[]"
                    type="text">
        </div>
        </td>
    
        <td class="nhsuk-table__cell">
        <div class="nhsuk-form-group">
            <label class="nhsuk-label nhsuk-u-visually-hidden" for="fields-${rowCount}">
            Fields row ${rowCount}
            </label>
            <input class="nhsuk-input nhsuk-input--width-10 nhsuk-u-font-size-14"
                    id="fields-${rowCount}"
                    name="fields[]"
                    type="text">
        </div>
        </td>
    
        <td class="nhsuk-table__cell">
        <div class="nhsuk-form-group">
            <label class="nhsuk-label nhsuk-u-visually-hidden" for="amendments-${rowCount}">
            Amendments row ${rowCount}
            </label>
            <input class="nhsuk-input nhsuk-u-font-size-14"
                    id="amendments-${rowCount}"
                    name="amendments[]"
                    type="text">
        </div>
        </td>
    
        <td class="nhsuk-table__cell">
        <div class="nhsuk-form-group">
        <label class="nhsuk-label nhsuk-u-visually-hidden" for="amendments-${rowCount}">
            Reason row ${rowCount}
        </label>
        <input class="nhsuk-input nhsuk-u-font-size-14"
                id="reason-${rowCount}"
                name="reason[]"
                type="text">
        </div>
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
  function validateField(input, message, errorsArray) {
    if (input.value.trim() === "") {
      const formGroup = input.closest(".nhsuk-form-group");
      formGroup.classList.add("nhsuk-form-group--error");
      input.classList.add("nhsuk-input--error");
      const errorId = input.id + "-error";
      const errorMessage = document.createElement("span");
      errorMessage.className = "nhsuk-error-message  nhsuk-u-font-size-14";
      errorMessage.id = errorId;
      errorMessage.innerHTML = '<span class="nhsuk-u-visually-hidden">Error:</span> ' + message;
      formGroup.insertBefore(errorMessage, input);
      input.setAttribute("aria-describedby", errorId);
      errorsArray.push({
        input,
        summaryText: message
      });
    }
  }
  form.addEventListener("submit", function(e) {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    let errors = [];
    errorList.innerHTML = "";
    errorSummary.style.display = "none";
    tableBody.querySelectorAll(".nhsuk-form-group").forEach((group) => {
      group.classList.remove("nhsuk-form-group--error");
      const errorMessage = group.querySelector(".nhsuk-error-message");
      if (errorMessage) errorMessage.remove();
      const input = group.querySelector("input");
      input.classList.remove("nhsuk-input--error");
      input.removeAttribute("aria-describedby");
    });
    rows.forEach((row, index) => {
      const setsInput = row.querySelector('input[name="sets[]"]');
      const fieldsInput = row.querySelector('input[name="fields[]"]');
      const amendmentsInput = row.querySelector('input[name="amendments[]"]');
      const allEmpty = [setsInput, fieldsInput, amendmentsInput].every((input) => input.value.trim() === "");
      if (allEmpty) {
        row.remove();
        return;
      }
      validateField(setsInput, "Enter the sets", errors);
      validateField(fieldsInput, "Enter the fields", errors);
      validateField(amendmentsInput, "Enter amendments", errors);
    });
    if (errors.length > 0) {
      e.preventDefault();
      errors.forEach((err) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = "#" + err.input.id;
        a.textContent = err.summaryText;
        li.appendChild(a);
        errorList.appendChild(li);
      });
      errorSummary.style.display = "block";
      errorSummary.focus();
    }
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L3NkLXJlcG9ydC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcblxuICAgIGNvbnN0IHRhYmxlQm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXBvcnRUYWJsZSB0Ym9keScpO1xuICAgIGNvbnN0IGFkZEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRSb3dCdXR0b24nKTtcbiAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlcG9ydEZvcm0nKTtcbiAgICBjb25zdCBlcnJvclN1bW1hcnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyb3JTdW1tYXJ5Jyk7XG4gICAgY29uc3QgZXJyb3JMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yTGlzdCcpO1xuXG4gICAgLy8gUmVtb3ZlIHJvd1xuICAgIGZ1bmN0aW9uIGJpbmRSZW1vdmVMaW5rcygpIHtcbiAgICAgICAgdGFibGVCb2R5LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZW1vdmUtcm93JykuZm9yRWFjaChsaW5rID0+IHtcbiAgICAgICAgICAgIGxpbmsucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZW1vdmVIYW5kbGVyKTtcbiAgICAgICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZW1vdmVIYW5kbGVyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlSGFuZGxlcihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3Qgcm93ID0gZS50YXJnZXQuY2xvc2VzdCgndHInKTtcbiAgICAgICAgcm93LnJlbW92ZSgpO1xuICAgIH1cblxuICAgIGJpbmRSZW1vdmVMaW5rcygpO1xuXG4gICAgLy8gQWRkIG5ldyByb3dcbiAgICBhZGRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgY29uc3Qgcm93Q291bnQgPSB0YWJsZUJvZHkucXVlcnlTZWxlY3RvckFsbCgndHInKS5sZW5ndGggKyAxO1xuXG4gICAgICAgIGNvbnN0IG5ld1JvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG4gICAgICAgIG5ld1Jvdy5jbGFzc0xpc3QuYWRkKCduaHN1ay10YWJsZV9fcm93Jyk7XG5cbiAgICAgICAgbmV3Um93LmlubmVySFRNTCA9IGBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGxcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5oc3VrLWZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cIm5oc3VrLWxhYmVsIG5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCIgZm9yPVwic2V0cy0ke3Jvd0NvdW50fVwiPlxuICAgICAgICAgICAgU2V0cyByb3cgJHtyb3dDb3VudH1cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJuaHN1ay1pbnB1dCBuaHN1ay1pbnB1dC0td2lkdGgtMTAgbmhzdWstdS1mb250LXNpemUtMTRcIlxuICAgICAgICAgICAgICAgICAgICBpZD1cInNldHMtJHtyb3dDb3VudH1cIlxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwic2V0c1tdXCJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvdGQ+XG4gICAgXG4gICAgICAgIDx0ZCBjbGFzcz1cIm5oc3VrLXRhYmxlX19jZWxsXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJuaHN1ay1mb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJuaHN1ay1sYWJlbCBuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiIGZvcj1cImZpZWxkcy0ke3Jvd0NvdW50fVwiPlxuICAgICAgICAgICAgRmllbGRzIHJvdyAke3Jvd0NvdW50fVxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm5oc3VrLWlucHV0IG5oc3VrLWlucHV0LS13aWR0aC0xMCBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiXG4gICAgICAgICAgICAgICAgICAgIGlkPVwiZmllbGRzLSR7cm93Q291bnR9XCJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cImZpZWxkc1tdXCJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvdGQ+XG4gICAgXG4gICAgICAgIDx0ZCBjbGFzcz1cIm5oc3VrLXRhYmxlX19jZWxsXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJuaHN1ay1mb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJuaHN1ay1sYWJlbCBuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiIGZvcj1cImFtZW5kbWVudHMtJHtyb3dDb3VudH1cIj5cbiAgICAgICAgICAgIEFtZW5kbWVudHMgcm93ICR7cm93Q291bnR9XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwibmhzdWstaW5wdXQgbmhzdWstdS1mb250LXNpemUtMTRcIlxuICAgICAgICAgICAgICAgICAgICBpZD1cImFtZW5kbWVudHMtJHtyb3dDb3VudH1cIlxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwiYW1lbmRtZW50c1tdXCJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvdGQ+XG4gICAgXG4gICAgICAgIDx0ZCBjbGFzcz1cIm5oc3VrLXRhYmxlX19jZWxsXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJuaHN1ay1mb3JtLWdyb3VwXCI+XG4gICAgICAgIDxsYWJlbCBjbGFzcz1cIm5oc3VrLWxhYmVsIG5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCIgZm9yPVwiYW1lbmRtZW50cy0ke3Jvd0NvdW50fVwiPlxuICAgICAgICAgICAgUmVhc29uIHJvdyAke3Jvd0NvdW50fVxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8aW5wdXQgY2xhc3M9XCJuaHN1ay1pbnB1dCBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiXG4gICAgICAgICAgICAgICAgaWQ9XCJyZWFzb24tJHtyb3dDb3VudH1cIlxuICAgICAgICAgICAgICAgIG5hbWU9XCJyZWFzb25bXVwiXG4gICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvdGQ+XG4gICAgXG4gICAgICAgIDx0ZCBjbGFzcz1cIm5oc3VrLXRhYmxlX19jZWxsICBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiPlxuICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzPVwicmVtb3ZlLXJvdyBuaHN1ay1saW5rXCI+XG4gICAgICAgICAgICBSZW1vdmVcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5yb3cgJHtyb3dDb3VudH08L3NwYW4+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPC90ZD5cbiAgICBgO1xuXG4gICAgICAgIHRhYmxlQm9keS5hcHBlbmRDaGlsZChuZXdSb3cpO1xuICAgICAgICBiaW5kUmVtb3ZlTGlua3MoKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlRmllbGQoaW5wdXQsIG1lc3NhZ2UsIGVycm9yc0FycmF5KSB7XG5cbiAgICAgICAgaWYgKGlucHV0LnZhbHVlLnRyaW0oKSA9PT0gJycpIHtcblxuICAgICAgICAgICAgY29uc3QgZm9ybUdyb3VwID0gaW5wdXQuY2xvc2VzdCgnLm5oc3VrLWZvcm0tZ3JvdXAnKTtcblxuICAgICAgICAgICAgZm9ybUdyb3VwLmNsYXNzTGlzdC5hZGQoJ25oc3VrLWZvcm0tZ3JvdXAtLWVycm9yJyk7XG4gICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCduaHN1ay1pbnB1dC0tZXJyb3InKTtcblxuICAgICAgICAgICAgY29uc3QgZXJyb3JJZCA9IGlucHV0LmlkICsgXCItZXJyb3JcIjtcblxuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlLmNsYXNzTmFtZSA9IFwibmhzdWstZXJyb3ItbWVzc2FnZSAgbmhzdWstdS1mb250LXNpemUtMTRcIjtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZS5pZCA9IGVycm9ySWQ7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2UuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj4gJyArIG1lc3NhZ2U7XG5cbiAgICAgICAgICAgIGZvcm1Hcm91cC5pbnNlcnRCZWZvcmUoZXJyb3JNZXNzYWdlLCBpbnB1dCk7XG5cbiAgICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIGVycm9ySWQpO1xuXG4gICAgICAgICAgICBlcnJvcnNBcnJheS5wdXNoKHtcbiAgICAgICAgICAgICAgICBpbnB1dDogaW5wdXQsXG4gICAgICAgICAgICAgICAgc3VtbWFyeVRleHQ6IG1lc3NhZ2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuICAgIC8vIEZvcm0gdmFsaWRhdGlvblxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcblxuICAgICAgICBjb25zdCByb3dzID0gQXJyYXkuZnJvbSh0YWJsZUJvZHkucXVlcnlTZWxlY3RvckFsbCgndHInKSk7XG4gICAgICAgIGxldCBlcnJvcnMgPSBbXTtcblxuICAgICAgICBlcnJvckxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGVycm9yU3VtbWFyeS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgICAgIC8vIENsZWFyIHByZXZpb3VzIGVycm9yc1xuICAgICAgICB0YWJsZUJvZHkucXVlcnlTZWxlY3RvckFsbCgnLm5oc3VrLWZvcm0tZ3JvdXAnKS5mb3JFYWNoKGdyb3VwID0+IHtcbiAgICAgICAgICAgIGdyb3VwLmNsYXNzTGlzdC5yZW1vdmUoJ25oc3VrLWZvcm0tZ3JvdXAtLWVycm9yJyk7XG5cbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGdyb3VwLnF1ZXJ5U2VsZWN0b3IoJy5uaHN1ay1lcnJvci1tZXNzYWdlJyk7XG4gICAgICAgICAgICBpZiAoZXJyb3JNZXNzYWdlKSBlcnJvck1lc3NhZ2UucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gZ3JvdXAucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcbiAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ25oc3VrLWlucHV0LS1lcnJvcicpO1xuICAgICAgICAgICAgaW5wdXQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJvd3MuZm9yRWFjaCgocm93LCBpbmRleCkgPT4ge1xuXG4gICAgICAgICAgICBjb25zdCBzZXRzSW5wdXQgPSByb3cucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInNldHNbXVwiXScpO1xuICAgICAgICAgICAgY29uc3QgZmllbGRzSW5wdXQgPSByb3cucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImZpZWxkc1tdXCJdJyk7XG4gICAgICAgICAgICBjb25zdCBhbWVuZG1lbnRzSW5wdXQgPSByb3cucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImFtZW5kbWVudHNbXVwiXScpO1xuXG4gICAgICAgICAgICBjb25zdCBhbGxFbXB0eSA9IFtzZXRzSW5wdXQsIGZpZWxkc0lucHV0LCBhbWVuZG1lbnRzSW5wdXRdXG4gICAgICAgICAgICAgICAgLmV2ZXJ5KGlucHV0ID0+IGlucHV0LnZhbHVlLnRyaW0oKSA9PT0gJycpO1xuXG4gICAgICAgICAgICBpZiAoYWxsRW1wdHkpIHtcbiAgICAgICAgICAgICAgICByb3cucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YWxpZGF0ZUZpZWxkKHNldHNJbnB1dCwgXCJFbnRlciB0aGUgc2V0c1wiLCBlcnJvcnMpO1xuICAgICAgICAgICAgdmFsaWRhdGVGaWVsZChmaWVsZHNJbnB1dCwgXCJFbnRlciB0aGUgZmllbGRzXCIsIGVycm9ycyk7XG4gICAgICAgICAgICB2YWxpZGF0ZUZpZWxkKGFtZW5kbWVudHNJbnB1dCwgXCJFbnRlciBhbWVuZG1lbnRzXCIsIGVycm9ycyk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGVycm9ycy5mb3JFYWNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICAgICAgYS5ocmVmID0gXCIjXCIgKyBlcnIuaW5wdXQuaWQ7XG4gICAgICAgICAgICAgICAgYS50ZXh0Q29udGVudCA9IGVyci5zdW1tYXJ5VGV4dDtcbiAgICAgICAgICAgICAgICBsaS5hcHBlbmRDaGlsZChhKTtcbiAgICAgICAgICAgICAgICBlcnJvckxpc3QuYXBwZW5kQ2hpbGQobGkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGVycm9yU3VtbWFyeS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIGVycm9yU3VtbWFyeS5mb2N1cygpO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQUEsU0FBUyxpQkFBaUIsb0JBQW9CLFdBQVk7QUFFdEQsUUFBTSxZQUFZLFNBQVMsY0FBYyxvQkFBb0I7QUFDN0QsUUFBTSxZQUFZLFNBQVMsZUFBZSxjQUFjO0FBQ3hELFFBQU0sT0FBTyxTQUFTLGVBQWUsWUFBWTtBQUNqRCxRQUFNLGVBQWUsU0FBUyxlQUFlLGNBQWM7QUFDM0QsUUFBTSxZQUFZLFNBQVMsZUFBZSxXQUFXO0FBR3JELFdBQVMsa0JBQWtCO0FBQ3ZCLGNBQVUsaUJBQWlCLGFBQWEsRUFBRSxRQUFRLFVBQVE7QUFDdEQsV0FBSyxvQkFBb0IsU0FBUyxhQUFhO0FBQy9DLFdBQUssaUJBQWlCLFNBQVMsYUFBYTtBQUFBLElBQ2hELENBQUM7QUFBQSxFQUNMO0FBRUEsV0FBUyxjQUFjLEdBQUc7QUFDdEIsTUFBRSxlQUFlO0FBQ2pCLFVBQU0sTUFBTSxFQUFFLE9BQU8sUUFBUSxJQUFJO0FBQ2pDLFFBQUksT0FBTztBQUFBLEVBQ2Y7QUFFQSxrQkFBZ0I7QUFHaEIsWUFBVSxpQkFBaUIsU0FBUyxXQUFZO0FBRTVDLFVBQU0sV0FBVyxVQUFVLGlCQUFpQixJQUFJLEVBQUUsU0FBUztBQUUzRCxVQUFNLFNBQVMsU0FBUyxjQUFjLElBQUk7QUFDMUMsV0FBTyxVQUFVLElBQUksa0JBQWtCO0FBRXZDLFdBQU8sWUFBWTtBQUFBO0FBQUE7QUFBQSwyRUFHZ0QsUUFBUTtBQUFBLHVCQUM1RCxRQUFRO0FBQUE7QUFBQTtBQUFBLCtCQUdBLFFBQVE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDZFQVFzQyxRQUFRO0FBQUEseUJBQzVELFFBQVE7QUFBQTtBQUFBO0FBQUEsaUNBR0EsUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUZBUXdDLFFBQVE7QUFBQSw2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
