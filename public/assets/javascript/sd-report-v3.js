// app/assets/javascript/sd-report-v3.js
document.addEventListener("DOMContentLoaded", function() {
  const tableBody = document.querySelector("#reportTable tbody");
  const addButton = document.getElementById("addRowButton");
  const undoContainer = document.querySelector(".undoRemovalContainer");
  const undoButton = document.getElementById("undoRemovalButton");
  let lastRemovedRow = null;
  let lastRemovedIndex = null;
  function bindRemoveLinks() {
    tableBody.querySelectorAll(".remove-row").forEach((link) => {
      link.removeEventListener("click", removeHandler);
      link.addEventListener("click", removeHandler);
    });
  }
  function removeHandler(e) {
    e.preventDefault();
    const row = e.target.closest("tr");
    const amendmentField = row.querySelector('textarea[name="amendments[]"]');
    const amendmentText = amendmentField ? amendmentField.value : "";
    lastRemovedRow = row;
    lastRemovedIndex = Array.from(tableBody.children).indexOf(row);
    row.remove();
    removedAmendmentText.textContent = amendmentText;
    undoContainer.hidden = false;
    undoContainer.classList.add("undoContainerVisible");
  }
  undoButton.addEventListener("click", function() {
    if (!lastRemovedRow) {
      return;
    }
    const rows = tableBody.children;
    if (lastRemovedIndex >= rows.length) {
      tableBody.appendChild(lastRemovedRow);
    } else {
      tableBody.insertBefore(lastRemovedRow, rows[lastRemovedIndex]);
    }
    lastRemovedRow = null;
    lastRemovedIndex = null;
    undoContainer.hidden = true;
    undoContainer.classList.remove("undoContainerVisible");
    bindRemoveLinks();
  });
  bindRemoveLinks();
  addButton.addEventListener("click", function() {
    const rowCount = tableBody.querySelectorAll("tr").length + 1;
    const newRow = document.createElement("tr");
    newRow.classList.add("nhsuk-table__row");
    newRow.innerHTML = `
        <td class="nhsuk-table__cell">
            <select class="nhsuk-select nhsuk-u-font-size-14"
                    id="sets-${rowCount}"
                    name="sets[]">
                <option value="">Select a set</option>
                <option value="Service history">Service history</option>
                <option value="Employment">Employment</option>
                <option value="Service groups">Service groups</option>
                <option value="Conts & TPP">Conts & TPP</option>
                <option value="Hours history details">Hours history details</option>
                <option value="Linked employment">Linked employment</option>
                <option value="Basic member details">Basic member details</option>
            </select>
        </td>
    
        <td class="nhsuk-table__cell">
            <input class="nhsuk-input nhsuk-input--width-10 nhsuk-u-font-size-14"
                    id="fields-${rowCount}"
                    name="fields[]"
                    type="text">
        </td>
    
        <td class="nhsuk-table__cell">
            <textarea rows="1" class="nhsuk-textarea nhsuk-u-font-size-14"
                    id="amendments-${rowCount}"
                    name="amendments[]"></textarea>
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
    const reasonGroup = document.getElementById("issueReason");
    const reasonTextarea = document.getElementById("issue-reason");
    if (!reasonTextarea.value.trim()) {
      const message = '<span class="nhsuk-u-visually-hidden">Error:</span>Enter the reason why you require an update for this record';
      reasonGroup.classList.add("nhsuk-form-group--error");
      reasonTextarea.classList.add("nhsuk-textarea--error");
      let error = document.getElementById("issue-reason-error");
      if (!error) {
        error = document.createElement("span");
        error.id = "issue-reason-error";
        error.className = "nhsuk-error-message";
        error.innerHTML = message;
        reasonTextarea.parentNode.insertBefore(error, reasonTextarea);
      }
      error.innerHTML = message;
      reasonTextarea.setAttribute(
        "aria-describedby",
        "issue-reason-error"
      );
      errors.push(
        `<li><a href="#issue-reason">Enter the reason why you require an update for this record</a></li>`
      );
      if (!firstErrorField) {
        firstErrorField = reasonTextarea;
      }
    }
    const memberError = validateRequiredField({
      inputId: "membershipNumber",
      groupId: "membershipNumberGroup",
      errorId: "membershipNumber-error",
      message: "Enter the member number",
      errors
    });
    if (!firstErrorField && memberError) {
      firstErrorField = memberError;
    }
    const initialError = validateRequiredField({
      inputId: "memberFirstInitial",
      groupId: "memberFirstInitialGroup",
      errorId: "memberFirstInitial-error",
      message: "Enter the members first initial",
      errors
    });
    if (!firstErrorField && initialError) {
      firstErrorField = initialError;
    }
    const surnameError = validateRequiredField({
      inputId: "memberSurname",
      groupId: "memberSurnameGroup",
      errorId: "memberSurname-error",
      message: "Enter the members surname",
      errors
    });
    if (!firstErrorField && surnameError) {
      firstErrorField = surnameError;
    }
    const recordTypeChangeError = validateRadioGroup({
      name: "recordTypeChange",
      groupId: "recordTypeChangeGroup",
      errorId: "recordTypeChange-error",
      message: "Select a type of change",
      errors
    });
    if (!firstErrorField && recordTypeChangeError) {
      firstErrorField = recordTypeChangeError;
    }
    const corruptedError = validateRadioGroup({
      name: "corrupted",
      groupId: "corruptedGroup",
      errorId: "corrupted-error",
      message: "Select yes if your file has been corrupted",
      errors
    });
    if (!firstErrorField && corruptedError) {
      firstErrorField = corruptedError;
    }
    const paymentError = validateRadioGroup({
      name: "payment",
      groupId: "paymentGroup",
      errorId: "payment-error",
      message: "Select yes if payment will be affected",
      errors
    });
    if (!firstErrorField && paymentError) {
      firstErrorField = paymentError;
    }
    const siteAutoError = validateRequiredField({
      inputId: "siteAuto",
      groupId: "siteAutoGroup",
      errorId: "siteAuto-error",
      message: "Enter the site you are based at",
      errors
    });
    if (!firstErrorField && siteAutoError) {
      firstErrorField = siteAutoError;
    }
    const directorateError = validateRequiredField({
      inputId: "directorate",
      groupId: "directorateGroup",
      errorId: "directorate-error",
      message: "Enter your directorate",
      errors
    });
    if (!firstErrorField && directorateError) {
      firstErrorField = directorateError;
    }
    if (errors.length > 0) {
      errorList.innerHTML = errors.join("");
      errorSummary.style.display = "block";
      errorSummary.scrollIntoView({ behavior: "smooth" });
      return;
    }
    form.submit();
  });
  function getRowInputs(row) {
    return [
      row.querySelector('select[name="sets[]"]'),
      row.querySelector('input[name="fields[]"]'),
      row.querySelector('textarea[name="amendments[]"]')
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
  function validateRequiredField({
    inputId,
    groupId,
    errorId,
    message,
    errors
  }) {
    const input = document.getElementById(inputId);
    const group = document.getElementById(groupId);
    if (!input.value.trim()) {
      const errorMessage = `<span class="nhsuk-u-visually-hidden">Error:</span> ${message}`;
      group.classList.add("nhsuk-form-group--error");
      input.classList.add("nhsuk-input--error");
      let error = document.getElementById(errorId);
      const formGroup = input.closest(".nhsuk-form-group");
      const label = formGroup == null ? void 0 : formGroup.querySelector(".nhsuk-label");
      if (!error) {
        error = document.createElement("span");
        error.id = errorId;
        error.className = "nhsuk-error-message";
        label.insertAdjacentElement("afterend", error);
      }
      error.innerHTML = errorMessage;
      input.setAttribute("aria-describedby", errorId);
      errors.push(
        `<li><a href="#${inputId}">${message}</a></li>`
      );
      return input;
    }
  }
  function validateRadioGroup({
    name,
    groupId,
    errorId,
    message,
    errors
  }) {
    const radios = document.querySelectorAll(
      `input[name="${name}"]`
    );
    const group = document.getElementById(groupId);
    const checked = [...radios].some((radio) => radio.checked);
    if (!checked) {
      const errorMessage = `<span class="nhsuk-u-visually-hidden">Error:</span> ${message}`;
      group.classList.add("nhsuk-form-group--error");
      let error = document.getElementById(errorId);
      if (!error) {
        error = document.createElement("span");
        error.id = errorId;
        error.className = "nhsuk-error-message";
        error.innerHTML = errorMessage;
        const fieldset = group.querySelector(".nhsuk-fieldset");
        const radios2 = fieldset.querySelector(".nhsuk-radios");
        fieldset.insertBefore(error, radios2);
      }
      errors.push(
        `<li><a href="#${radios[0].id}">${message}</a></li>`
      );
      radios[0].setAttribute(
        "aria-describedby",
        errorId
      );
      return radios[0];
    }
    return null;
  }
  function clearErrors() {
    errorList.innerHTML = "";
    errorSummary.style.display = "none";
    document.querySelectorAll(".nhsuk-form-group--error, .nhsuk-textarea--error, .nhsuk-input--error").forEach((el) => el.classList.remove("nhsuk-form-group--error", "nhsuk-textarea--error", "nhsuk-input--error"));
    document.querySelectorAll("td .nhsuk-error-message").forEach((el) => el.remove());
    [
      "membershipNumber-error",
      "memberFirstInitial-error",
      "memberSurname-error",
      "recordTypeChange-error",
      "siteAuto-error",
      "payment-error",
      "directorate-error"
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.remove();
      }
    });
    const reasonError = document.getElementById("issue-reason-error");
    if (reasonError) {
      reasonError.innerHTML = "";
    }
  }
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L3NkLXJlcG9ydC12My5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcblxuICAgIGNvbnN0IHRhYmxlQm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXBvcnRUYWJsZSB0Ym9keScpO1xuICAgIGNvbnN0IGFkZEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRSb3dCdXR0b24nKTtcbiAgICBjb25zdCB1bmRvQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVuZG9SZW1vdmFsQ29udGFpbmVyJyk7XG4gICAgY29uc3QgdW5kb0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1bmRvUmVtb3ZhbEJ1dHRvbicpO1xuXG4gICAgbGV0IGxhc3RSZW1vdmVkUm93ID0gbnVsbDtcbiAgICBsZXQgbGFzdFJlbW92ZWRJbmRleCA9IG51bGw7XG5cbiAgICAvLyBSZW1vdmUgcm93XG4gICAgZnVuY3Rpb24gYmluZFJlbW92ZUxpbmtzKCkge1xuICAgICAgICB0YWJsZUJvZHkucXVlcnlTZWxlY3RvckFsbCgnLnJlbW92ZS1yb3cnKS5mb3JFYWNoKGxpbmsgPT4ge1xuICAgICAgICAgICAgbGluay5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHJlbW92ZUhhbmRsZXIpO1xuICAgICAgICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJlbW92ZUhhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVIYW5kbGVyKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIFxuICAgICAgICBjb25zdCByb3cgPSBlLnRhcmdldC5jbG9zZXN0KCd0cicpO1xuICAgIFxuICAgICAgICAvLyBHZXQgYW1lbmRtZW50IHRleHQgYmVmb3JlIHJlbW92aW5nIHJvd1xuICAgICAgICBjb25zdCBhbWVuZG1lbnRGaWVsZCA9IHJvdy5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYVtuYW1lPVwiYW1lbmRtZW50c1tdXCJdJyk7XG4gICAgICAgIGNvbnN0IGFtZW5kbWVudFRleHQgPSBhbWVuZG1lbnRGaWVsZCA/IGFtZW5kbWVudEZpZWxkLnZhbHVlIDogJyc7XG4gICAgXG4gICAgICAgIC8vIFN0b3JlIHJvdyBhbmQgaXRzIG9yaWdpbmFsIHBvc2l0aW9uXG4gICAgICAgIGxhc3RSZW1vdmVkUm93ID0gcm93O1xuICAgICAgICBsYXN0UmVtb3ZlZEluZGV4ID0gQXJyYXkuZnJvbSh0YWJsZUJvZHkuY2hpbGRyZW4pLmluZGV4T2Yocm93KTtcbiAgICBcbiAgICAgICAgcm93LnJlbW92ZSgpO1xuICAgIFxuICAgICAgICByZW1vdmVkQW1lbmRtZW50VGV4dC50ZXh0Q29udGVudCA9IGFtZW5kbWVudFRleHQ7XG4gICAgICAgIHVuZG9Db250YWluZXIuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIHVuZG9Db250YWluZXIuY2xhc3NMaXN0LmFkZChcInVuZG9Db250YWluZXJWaXNpYmxlXCIpO1xuICAgIH1cblxuICAgIHVuZG9CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaWYgKCFsYXN0UmVtb3ZlZFJvdykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGNvbnN0IHJvd3MgPSB0YWJsZUJvZHkuY2hpbGRyZW47XG4gICAgXG4gICAgICAgIC8vIFB1dCByb3cgYmFjayBpbiBpdHMgb3JpZ2luYWwgcG9zaXRpb25cbiAgICAgICAgaWYgKGxhc3RSZW1vdmVkSW5kZXggPj0gcm93cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRhYmxlQm9keS5hcHBlbmRDaGlsZChsYXN0UmVtb3ZlZFJvdyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YWJsZUJvZHkuaW5zZXJ0QmVmb3JlKGxhc3RSZW1vdmVkUm93LCByb3dzW2xhc3RSZW1vdmVkSW5kZXhdKTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBsYXN0UmVtb3ZlZFJvdyA9IG51bGw7XG4gICAgICAgIGxhc3RSZW1vdmVkSW5kZXggPSBudWxsO1xuICAgIFxuICAgICAgICB1bmRvQ29udGFpbmVyLmhpZGRlbiA9IHRydWU7XG4gICAgICAgIHVuZG9Db250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcInVuZG9Db250YWluZXJWaXNpYmxlXCIpO1xuICAgIFxuICAgICAgICBiaW5kUmVtb3ZlTGlua3MoKTtcbiAgICB9KTtcblxuICAgIGJpbmRSZW1vdmVMaW5rcygpO1xuXG4gICAgLy8gQWRkIG5ldyByb3dcbiAgICBhZGRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgY29uc3Qgcm93Q291bnQgPSB0YWJsZUJvZHkucXVlcnlTZWxlY3RvckFsbCgndHInKS5sZW5ndGggKyAxO1xuXG4gICAgICAgIGNvbnN0IG5ld1JvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG4gICAgICAgIG5ld1Jvdy5jbGFzc0xpc3QuYWRkKCduaHN1ay10YWJsZV9fcm93Jyk7XG5cbiAgICAgICAgbmV3Um93LmlubmVySFRNTCA9IGBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGxcIj5cbiAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJuaHN1ay1zZWxlY3QgbmhzdWstdS1mb250LXNpemUtMTRcIlxuICAgICAgICAgICAgICAgICAgICBpZD1cInNldHMtJHtyb3dDb3VudH1cIlxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwic2V0c1tdXCI+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlNlbGVjdCBhIHNldDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJTZXJ2aWNlIGhpc3RvcnlcIj5TZXJ2aWNlIGhpc3Rvcnk8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiRW1wbG95bWVudFwiPkVtcGxveW1lbnQ8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiU2VydmljZSBncm91cHNcIj5TZXJ2aWNlIGdyb3Vwczwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJDb250cyAmIFRQUFwiPkNvbnRzICYgVFBQPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkhvdXJzIGhpc3RvcnkgZGV0YWlsc1wiPkhvdXJzIGhpc3RvcnkgZGV0YWlsczwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJMaW5rZWQgZW1wbG95bWVudFwiPkxpbmtlZCBlbXBsb3ltZW50PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkJhc2ljIG1lbWJlciBkZXRhaWxzXCI+QmFzaWMgbWVtYmVyIGRldGFpbHM8L29wdGlvbj5cbiAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICA8L3RkPlxuICAgIFxuICAgICAgICA8dGQgY2xhc3M9XCJuaHN1ay10YWJsZV9fY2VsbFwiPlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwibmhzdWstaW5wdXQgbmhzdWstaW5wdXQtLXdpZHRoLTEwIG5oc3VrLXUtZm9udC1zaXplLTE0XCJcbiAgICAgICAgICAgICAgICAgICAgaWQ9XCJmaWVsZHMtJHtyb3dDb3VudH1cIlxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwiZmllbGRzW11cIlxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiPlxuICAgICAgICA8L3RkPlxuICAgIFxuICAgICAgICA8dGQgY2xhc3M9XCJuaHN1ay10YWJsZV9fY2VsbFwiPlxuICAgICAgICAgICAgPHRleHRhcmVhIHJvd3M9XCIxXCIgY2xhc3M9XCJuaHN1ay10ZXh0YXJlYSBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiXG4gICAgICAgICAgICAgICAgICAgIGlkPVwiYW1lbmRtZW50cy0ke3Jvd0NvdW50fVwiXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJhbWVuZG1lbnRzW11cIj48L3RleHRhcmVhPlxuICAgICAgICA8L3RkPlxuICAgIFxuICAgICAgICA8dGQgY2xhc3M9XCJuaHN1ay10YWJsZV9fY2VsbCAgbmhzdWstdS1mb250LXNpemUtMTRcIj5cbiAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cInJlbW92ZS1yb3cgbmhzdWstbGlua1wiPlxuICAgICAgICAgICAgUmVtb3ZlXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+cm93ICR7cm93Q291bnR9PC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgICAgIDwvdGQ+XG4gICAgYDtcblxuICAgICAgICB0YWJsZUJvZHkuYXBwZW5kQ2hpbGQobmV3Um93KTtcbiAgICAgICAgYmluZFJlbW92ZUxpbmtzKCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXBvcnRGb3JtXCIpO1xuICAgIGNvbnN0IGVycm9yU3VtbWFyeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JTdW1tYXJ5XCIpO1xuICAgIGNvbnN0IGVycm9yTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JMaXN0XCIpO1xuXG4gICAgY29uc3QgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlcG9ydFRhYmxlXCIpO1xuXG4gICAgY29uc3QgZmllbGRzID0gW1wic2V0c1tdXCIsIFwiZmllbGRzW11cIiwgXCJhbWVuZG1lbnRzW11cIiwgXCJyZWFzb25bXVwiXTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBTVUJNSVQgVkFMSURBVElPTlxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGNsZWFyRXJyb3JzKCk7XG5cbiAgICAgICAgbGV0IGVycm9ycyA9IFtdO1xuICAgICAgICBsZXQgZmlyc3RFcnJvckZpZWxkID0gbnVsbDtcblxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgLy8gREVTQ1JJUFRJT04gVkFMSURBVElPTlxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgICAgY29uc3Qgcm93cyA9IHRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0Ym9keSB0clwiKTtcblxuICAgICAgICByb3dzLmZvckVhY2goKHJvdywgcm93SW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlucHV0cyA9IGdldFJvd0lucHV0cyhyb3cpO1xuXG4gICAgICAgICAgICBjb25zdCByb3dIYXNEYXRhID0gaW5wdXRzLnNvbWUoaSA9PiBpLnZhbHVlLnRyaW0oKSAhPT0gXCJcIik7XG5cbiAgICAgICAgICAgIC8vIGlnbm9yZSBlbXB0eSByb3dzIGNvbXBsZXRlbHlcbiAgICAgICAgICAgIGlmICghcm93SGFzRGF0YSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBpbnB1dHMuZm9yRWFjaCgoaW5wdXQsIGNvbEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGdldEVycm9yTWVzc2FnZShjb2xJbmRleCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWlucHV0LnZhbHVlLnRyaW0oKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvcklkID0gZW5zdXJlRXJyb3IoaW5wdXQsIG1lc3NhZ2UsIHJvd0luZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgIGA8bGk+PGEgaHJlZj1cIiMke2Vycm9ySWR9XCI+JHttZXNzYWdlfSAocm93ICR7cm93SW5kZXggKyAxfSk8L2E+PC9saT5gXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IGlucHV0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgLy8gUkVBU09OIFRFWFRBUkVBIFZBTElEQVRJT05cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAgIGNvbnN0IHJlYXNvbkdyb3VwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpc3N1ZVJlYXNvblwiKTtcbiAgICAgICAgY29uc3QgcmVhc29uVGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlzc3VlLXJlYXNvblwiKTtcblxuICAgICAgICBpZiAoIXJlYXNvblRleHRhcmVhLnZhbHVlLnRyaW0oKSkge1xuXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID1cbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj5FbnRlciB0aGUgcmVhc29uIHdoeSB5b3UgcmVxdWlyZSBhbiB1cGRhdGUgZm9yIHRoaXMgcmVjb3JkJztcblxuICAgICAgICAgICAgLy8gYWRkIE5IUyBlcnJvciBzdHlsaW5nXG4gICAgICAgICAgICByZWFzb25Hcm91cC5jbGFzc0xpc3QuYWRkKFwibmhzdWstZm9ybS1ncm91cC0tZXJyb3JcIik7XG4gICAgICAgICAgICByZWFzb25UZXh0YXJlYS5jbGFzc0xpc3QuYWRkKFwibmhzdWstdGV4dGFyZWEtLWVycm9yXCIpO1xuXG4gICAgICAgICAgICAvLyBjcmVhdGUgZXJyb3IgbWVzc2FnZSBpZiBpdCBkb2Vzbid0IGV4aXN0XG4gICAgICAgICAgICBsZXQgZXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlzc3VlLXJlYXNvbi1lcnJvclwiKTtcblxuICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgICAgIGVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICAgICAgZXJyb3IuaWQgPSBcImlzc3VlLXJlYXNvbi1lcnJvclwiO1xuICAgICAgICAgICAgICAgIGVycm9yLmNsYXNzTmFtZSA9IFwibmhzdWstZXJyb3ItbWVzc2FnZVwiO1xuICAgICAgICAgICAgICAgIGVycm9yLmlubmVySFRNTCA9IG1lc3NhZ2U7XG5cbiAgICAgICAgICAgICAgICByZWFzb25UZXh0YXJlYS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlcnJvciwgcmVhc29uVGV4dGFyZWEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBlbnN1cmUgY29ycmVjdCBtZXNzYWdlIHRleHRcbiAgICAgICAgICAgIGVycm9yLmlubmVySFRNTCA9IG1lc3NhZ2U7XG5cbiAgICAgICAgICAgIC8vIGFjY2Vzc2liaWxpdHlcbiAgICAgICAgICAgIHJlYXNvblRleHRhcmVhLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgICAgICBcImFyaWEtZGVzY3JpYmVkYnlcIixcbiAgICAgICAgICAgICAgICBcImlzc3VlLXJlYXNvbi1lcnJvclwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyBhZGQgdG8gc3VtbWFyeVxuICAgICAgICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgICAgICAgICAgYDxsaT48YSBocmVmPVwiI2lzc3VlLXJlYXNvblwiPkVudGVyIHRoZSByZWFzb24gd2h5IHlvdSByZXF1aXJlIGFuIHVwZGF0ZSBmb3IgdGhpcyByZWNvcmQ8L2E+PC9saT5gXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyBmb2N1cyBmaXJzdCBpbnZhbGlkIGZpZWxkXG4gICAgICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCkge1xuICAgICAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IHJlYXNvblRleHRhcmVhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAvLyBTVEFOREFSRCBGT1JNIEZJRUxEUyBWQUxJREFUSU9OXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgICBjb25zdCBtZW1iZXJFcnJvciA9IHZhbGlkYXRlUmVxdWlyZWRGaWVsZCh7XG4gICAgICAgICAgICBpbnB1dElkOiBcIm1lbWJlcnNoaXBOdW1iZXJcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwibWVtYmVyc2hpcE51bWJlckdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcIm1lbWJlcnNoaXBOdW1iZXItZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiRW50ZXIgdGhlIG1lbWJlciBudW1iZXJcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBtZW1iZXJFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gbWVtYmVyRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbml0aWFsRXJyb3IgPSB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICAgICAgaW5wdXRJZDogXCJtZW1iZXJGaXJzdEluaXRpYWxcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwibWVtYmVyRmlyc3RJbml0aWFsR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwibWVtYmVyRmlyc3RJbml0aWFsLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkVudGVyIHRoZSBtZW1iZXJzIGZpcnN0IGluaXRpYWxcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBpbml0aWFsRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IGluaXRpYWxFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN1cm5hbWVFcnJvciA9IHZhbGlkYXRlUmVxdWlyZWRGaWVsZCh7XG4gICAgICAgICAgICBpbnB1dElkOiBcIm1lbWJlclN1cm5hbWVcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwibWVtYmVyU3VybmFtZUdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcIm1lbWJlclN1cm5hbWUtZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiRW50ZXIgdGhlIG1lbWJlcnMgc3VybmFtZVwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIHN1cm5hbWVFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gc3VybmFtZUVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVjb3JkVHlwZUNoYW5nZUVycm9yID0gdmFsaWRhdGVSYWRpb0dyb3VwKHtcbiAgICAgICAgICAgIG5hbWU6IFwicmVjb3JkVHlwZUNoYW5nZVwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJyZWNvcmRUeXBlQ2hhbmdlR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwicmVjb3JkVHlwZUNoYW5nZS1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJTZWxlY3QgYSB0eXBlIG9mIGNoYW5nZVwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgcmVjb3JkVHlwZUNoYW5nZUVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSByZWNvcmRUeXBlQ2hhbmdlRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb3JydXB0ZWRFcnJvciA9IHZhbGlkYXRlUmFkaW9Hcm91cCh7XG4gICAgICAgICAgICBuYW1lOiBcImNvcnJ1cHRlZFwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJjb3JydXB0ZWRHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJjb3JydXB0ZWQtZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiU2VsZWN0IHllcyBpZiB5b3VyIGZpbGUgaGFzIGJlZW4gY29ycnVwdGVkXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBjb3JydXB0ZWRFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gY29ycnVwdGVkRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYXltZW50RXJyb3IgPSB2YWxpZGF0ZVJhZGlvR3JvdXAoe1xuICAgICAgICAgICAgbmFtZTogXCJwYXltZW50XCIsXG4gICAgICAgICAgICBncm91cElkOiBcInBheW1lbnRHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJwYXltZW50LWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIlNlbGVjdCB5ZXMgaWYgcGF5bWVudCB3aWxsIGJlIGFmZmVjdGVkXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBwYXltZW50RXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IHBheW1lbnRFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNpdGVBdXRvRXJyb3IgPSB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICAgICAgaW5wdXRJZDogXCJzaXRlQXV0b1wiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJzaXRlQXV0b0dyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcInNpdGVBdXRvLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkVudGVyIHRoZSBzaXRlIHlvdSBhcmUgYmFzZWQgYXRcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBzaXRlQXV0b0Vycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBzaXRlQXV0b0Vycm9yO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zdCBkaXJlY3RvcmF0ZUVycm9yID0gdmFsaWRhdGVSZXF1aXJlZEZpZWxkKHtcbiAgICAgICAgICAgIGlucHV0SWQ6IFwiZGlyZWN0b3JhdGVcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwiZGlyZWN0b3JhdGVHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJkaXJlY3RvcmF0ZS1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJFbnRlciB5b3VyIGRpcmVjdG9yYXRlXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgZGlyZWN0b3JhdGVFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gZGlyZWN0b3JhdGVFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZXJyb3JMaXN0LmlubmVySFRNTCA9IGVycm9ycy5qb2luKFwiXCIpO1xuICAgICAgICAgICAgZXJyb3JTdW1tYXJ5LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cbiAgICAgICAgICAgIGVycm9yU3VtbWFyeS5zY3JvbGxJbnRvVmlldyh7IGJlaGF2aW9yOiBcInNtb290aFwiIH0pO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtLnN1Ym1pdCgpO1xuICAgIH0pO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIEhFTFBFUlNcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBmdW5jdGlvbiBnZXRSb3dJbnB1dHMocm93KSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICByb3cucXVlcnlTZWxlY3Rvcignc2VsZWN0W25hbWU9XCJzZXRzW11cIl0nKSxcbiAgICAgICAgICAgIHJvdy5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwiZmllbGRzW11cIl0nKSxcbiAgICAgICAgICAgIHJvdy5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYVtuYW1lPVwiYW1lbmRtZW50c1tdXCJdJyksXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RXJyb3JNZXNzYWdlKGluZGV4KSB7XG4gICAgICAgIHN3aXRjaCAoaW5kZXgpIHtcbiAgICAgICAgICAgIGNhc2UgMDogXG4gICAgICAgICAgICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPkVudGVyIHRoZSBzZXQnO1xuICAgICAgICAgICAgY2FzZSAxOiBcbiAgICAgICAgICAgICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+RW50ZXIgdGhlIGZpZWxkJztcbiAgICAgICAgICAgIGNhc2UgMjogXG4gICAgICAgICAgICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPkVudGVyIHRoZSBhbWVuZG1lbnQnO1xuICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuICdUaGlzIGZpZWxkIGlzIHJlcXVpcmVkJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVuc3VyZUVycm9yKGlucHV0LCBtZXNzYWdlLCByb3dJbmRleCkge1xuICAgICAgICBjb25zdCBjZWxsID0gaW5wdXQuY2xvc2VzdChcInRkXCIpO1xuXG4gICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcIm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yXCIpO1xuXG4gICAgICAgIGxldCBlcnJvciA9IGNlbGwucXVlcnlTZWxlY3RvcihcIi5uaHN1ay1lcnJvci1tZXNzYWdlXCIpO1xuXG4gICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgIGVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICBlcnJvci5jbGFzc05hbWUgPSBcIm5oc3VrLWVycm9yLW1lc3NhZ2UgbmhzdWstdS1mb250LXNpemUtMTRcIjtcbiAgICAgICAgICAgIGNlbGwuaW5zZXJ0QmVmb3JlKGVycm9yLCBpbnB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBtZXNzYWdlO1xuXG4gICAgICAgIGNvbnN0IGVycm9ySWQgPSBpbnB1dC5pZCB8fCBgcm93LSR7cm93SW5kZXh9LSR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMiwgNyl9YDtcblxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRlc2NyaWJlZGJ5XCIsIGVycm9ySWQpO1xuICAgICAgICBpbnB1dC5pZCA9IGVycm9ySWQ7XG5cbiAgICAgICAgcmV0dXJuIGVycm9ySWQ7XG4gICAgfVxuXG4gICAgLy8gSGVscGVyIGZvciB0aGUgdGV4dCBmaWVsZCB2YWxpZGF0aW9uXG4gICAgZnVuY3Rpb24gdmFsaWRhdGVSZXF1aXJlZEZpZWxkKHtcbiAgICAgICAgaW5wdXRJZCxcbiAgICAgICAgZ3JvdXBJZCxcbiAgICAgICAgZXJyb3JJZCxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgZXJyb3JzXG4gICAgfSkge1xuICAgIFxuICAgICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlucHV0SWQpO1xuICAgICAgICBjb25zdCBncm91cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGdyb3VwSWQpO1xuICAgIFxuICAgICAgICBpZiAoIWlucHV0LnZhbHVlLnRyaW0oKSkge1xuICAgIFxuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID1cbiAgICAgICAgICAgICAgICBgPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj4gJHttZXNzYWdlfWA7XG4gICAgXG4gICAgICAgICAgICBncm91cC5jbGFzc0xpc3QuYWRkKFwibmhzdWstZm9ybS1ncm91cC0tZXJyb3JcIik7XG4gICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKFwibmhzdWstaW5wdXQtLWVycm9yXCIpO1xuICAgIFxuICAgICAgICAgICAgbGV0IGVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZXJyb3JJZCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZvcm1Hcm91cCA9IGlucHV0LmNsb3Nlc3QoJy5uaHN1ay1mb3JtLWdyb3VwJyk7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IGZvcm1Hcm91cD8ucXVlcnlTZWxlY3RvcignLm5oc3VrLWxhYmVsJyk7XG5cbiAgICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBlcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgICAgIGVycm9yLmlkID0gZXJyb3JJZDtcbiAgICAgICAgICAgICAgICBlcnJvci5jbGFzc05hbWUgPSBcIm5oc3VrLWVycm9yLW1lc3NhZ2VcIjtcblxuICAgICAgICAgICAgICAgIGxhYmVsLmluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJlbmQnLCBlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBlcnJvck1lc3NhZ2U7XG4gICAgXG4gICAgICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRlc2NyaWJlZGJ5XCIsIGVycm9ySWQpO1xuICAgIFxuICAgICAgICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgICAgICAgICAgYDxsaT48YSBocmVmPVwiIyR7aW5wdXRJZH1cIj4ke21lc3NhZ2V9PC9hPjwvbGk+YFxuICAgICAgICAgICAgKTtcbiAgICBcbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhlbHBlciBmb3IgdGhlIHJhZGlvIGJ1dHRvbiB2YWxpZGF0aW9uXG4gICAgZnVuY3Rpb24gdmFsaWRhdGVSYWRpb0dyb3VwKHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgZ3JvdXBJZCxcbiAgICAgICAgZXJyb3JJZCxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgZXJyb3JzXG4gICAgfSkge1xuICAgIFxuICAgICAgICBjb25zdCByYWRpb3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgYGlucHV0W25hbWU9XCIke25hbWV9XCJdYFxuICAgICAgICApO1xuICAgIFxuICAgICAgICBjb25zdCBncm91cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGdyb3VwSWQpO1xuICAgIFxuICAgICAgICBjb25zdCBjaGVja2VkID0gWy4uLnJhZGlvc10uc29tZShyYWRpbyA9PiByYWRpby5jaGVja2VkKTtcbiAgICBcbiAgICAgICAgaWYgKCFjaGVja2VkKSB7XG4gICAgXG4gICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPVxuICAgICAgICAgICAgICAgIGA8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPiAke21lc3NhZ2V9YDtcbiAgICBcbiAgICAgICAgICAgIGdyb3VwLmNsYXNzTGlzdC5hZGQoXCJuaHN1ay1mb3JtLWdyb3VwLS1lcnJvclwiKTtcbiAgICBcbiAgICAgICAgICAgIGxldCBlcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVycm9ySWQpO1xuICAgIFxuICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgIFxuICAgICAgICAgICAgICAgIGVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgXG4gICAgICAgICAgICAgICAgZXJyb3IuaWQgPSBlcnJvcklkO1xuICAgICAgICAgICAgICAgIGVycm9yLmNsYXNzTmFtZSA9IFwibmhzdWstZXJyb3ItbWVzc2FnZVwiO1xuICAgICAgICAgICAgICAgIGVycm9yLmlubmVySFRNTCA9IGVycm9yTWVzc2FnZTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkc2V0ID0gZ3JvdXAucXVlcnlTZWxlY3RvcihcIi5uaHN1ay1maWVsZHNldFwiKTtcbiAgICAgICAgICAgICAgICBjb25zdCByYWRpb3MgPSBmaWVsZHNldC5xdWVyeVNlbGVjdG9yKFwiLm5oc3VrLXJhZGlvc1wiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGZpZWxkc2V0Lmluc2VydEJlZm9yZShlcnJvciwgcmFkaW9zKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICAgICAgICAgIGA8bGk+PGEgaHJlZj1cIiMke3JhZGlvc1swXS5pZH1cIj4ke21lc3NhZ2V9PC9hPjwvbGk+YFxuICAgICAgICAgICAgKTtcbiAgICBcbiAgICAgICAgICAgIHJhZGlvc1swXS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgXCJhcmlhLWRlc2NyaWJlZGJ5XCIsXG4gICAgICAgICAgICAgICAgZXJyb3JJZFxuICAgICAgICAgICAgKTtcbiAgICBcbiAgICAgICAgICAgIHJldHVybiByYWRpb3NbMF07XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJFcnJvcnMoKSB7XG4gICAgICAgIGVycm9yTGlzdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBlcnJvclN1bW1hcnkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmhzdWstZm9ybS1ncm91cC0tZXJyb3IsIC5uaHN1ay10ZXh0YXJlYS0tZXJyb3IsIC5uaHN1ay1pbnB1dC0tZXJyb3JcIilcbiAgICAgICAgICAgIC5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoXCJuaHN1ay1mb3JtLWdyb3VwLS1lcnJvclwiLCBcIm5oc3VrLXRleHRhcmVhLS1lcnJvclwiLCBcIm5oc3VrLWlucHV0LS1lcnJvclwiKSk7XG5cbiAgICAgICAgLy8gcmVtb3ZlIHRhYmxlLWdlbmVyYXRlZCBlcnJvcnMgb25seVxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwidGQgLm5oc3VrLWVycm9yLW1lc3NhZ2VcIilcbiAgICAgICAgICAgIC5mb3JFYWNoKGVsID0+IGVsLnJlbW92ZSgpKTtcblxuICAgICAgICBbXG4gICAgICAgICAgICBcIm1lbWJlcnNoaXBOdW1iZXItZXJyb3JcIixcbiAgICAgICAgICAgIFwibWVtYmVyRmlyc3RJbml0aWFsLWVycm9yXCIsXG4gICAgICAgICAgICBcIm1lbWJlclN1cm5hbWUtZXJyb3JcIixcbiAgICAgICAgICAgIFwicmVjb3JkVHlwZUNoYW5nZS1lcnJvclwiLFxuICAgICAgICAgICAgXCJzaXRlQXV0by1lcnJvclwiLFxuICAgICAgICAgICAgXCJwYXltZW50LWVycm9yXCIsXG4gICAgICAgICAgICBcImRpcmVjdG9yYXRlLWVycm9yXCJcbiAgICAgICAgXS5mb3JFYWNoKGlkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICBcbiAgICAgICAgICAgIGlmIChlbCkge1xuICAgICAgICAgICAgICAgIGVsLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyByZW1vdmUgdGV4dGFyZWEgZXJyb3IgbWVzc2FnZSB0ZXh0XG4gICAgICAgIGNvbnN0IHJlYXNvbkVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpc3N1ZS1yZWFzb24tZXJyb3JcIik7XG5cbiAgICAgICAgaWYgKHJlYXNvbkVycm9yKSB7XG4gICAgICAgIHJlYXNvbkVycm9yLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxTQUFTLGlCQUFpQixvQkFBb0IsV0FBWTtBQUV0RCxRQUFNLFlBQVksU0FBUyxjQUFjLG9CQUFvQjtBQUM3RCxRQUFNLFlBQVksU0FBUyxlQUFlLGNBQWM7QUFDeEQsUUFBTSxnQkFBZ0IsU0FBUyxjQUFjLHVCQUF1QjtBQUNwRSxRQUFNLGFBQWEsU0FBUyxlQUFlLG1CQUFtQjtBQUU5RCxNQUFJLGlCQUFpQjtBQUNyQixNQUFJLG1CQUFtQjtBQUd2QixXQUFTLGtCQUFrQjtBQUN2QixjQUFVLGlCQUFpQixhQUFhLEVBQUUsUUFBUSxVQUFRO0FBQ3RELFdBQUssb0JBQW9CLFNBQVMsYUFBYTtBQUMvQyxXQUFLLGlCQUFpQixTQUFTLGFBQWE7QUFBQSxJQUNoRCxDQUFDO0FBQUEsRUFDTDtBQUVBLFdBQVMsY0FBYyxHQUFHO0FBQ3RCLE1BQUUsZUFBZTtBQUVqQixVQUFNLE1BQU0sRUFBRSxPQUFPLFFBQVEsSUFBSTtBQUdqQyxVQUFNLGlCQUFpQixJQUFJLGNBQWMsK0JBQStCO0FBQ3hFLFVBQU0sZ0JBQWdCLGlC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
