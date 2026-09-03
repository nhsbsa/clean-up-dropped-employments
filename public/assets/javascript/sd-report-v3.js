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
    removedAmendmentText.textContent = amendmentText.trim() || "Blank row";
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
                <option value="">Select a data set</option>
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
        `<li><a href="#issueReason">Enter the reason why you require an update for this record</a></li>`
      );
      if (!firstErrorField) {
        firstErrorField = reasonTextarea;
      }
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
    const contactNumberError = validateRequiredField({
      inputId: "contactNumber",
      groupId: "contactNumberGroup",
      errorId: "contactNumber-error",
      message: "Enter your contact number",
      errors
    });
    if (!firstErrorField && contactNumberError) {
      firstErrorField = contactNumberError;
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
        `<li><a href="#${groupId}">${message}</a></li>`
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
      "contactNumber-error",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L3NkLXJlcG9ydC12My5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcblxuICAgIGNvbnN0IHRhYmxlQm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXBvcnRUYWJsZSB0Ym9keScpO1xuICAgIGNvbnN0IGFkZEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRSb3dCdXR0b24nKTtcbiAgICBjb25zdCB1bmRvQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVuZG9SZW1vdmFsQ29udGFpbmVyJyk7XG4gICAgY29uc3QgdW5kb0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1bmRvUmVtb3ZhbEJ1dHRvbicpO1xuXG4gICAgbGV0IGxhc3RSZW1vdmVkUm93ID0gbnVsbDtcbiAgICBsZXQgbGFzdFJlbW92ZWRJbmRleCA9IG51bGw7XG5cbiAgICAvLyBSZW1vdmUgcm93XG4gICAgZnVuY3Rpb24gYmluZFJlbW92ZUxpbmtzKCkge1xuICAgICAgICB0YWJsZUJvZHkucXVlcnlTZWxlY3RvckFsbCgnLnJlbW92ZS1yb3cnKS5mb3JFYWNoKGxpbmsgPT4ge1xuICAgICAgICAgICAgbGluay5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHJlbW92ZUhhbmRsZXIpO1xuICAgICAgICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJlbW92ZUhhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVIYW5kbGVyKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIFxuICAgICAgICBjb25zdCByb3cgPSBlLnRhcmdldC5jbG9zZXN0KCd0cicpO1xuICAgIFxuICAgICAgICAvLyBHZXQgYW1lbmRtZW50IHRleHQgYmVmb3JlIHJlbW92aW5nIHJvd1xuICAgICAgICBjb25zdCBhbWVuZG1lbnRGaWVsZCA9IHJvdy5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYVtuYW1lPVwiYW1lbmRtZW50c1tdXCJdJyk7XG4gICAgICAgIGNvbnN0IGFtZW5kbWVudFRleHQgPSBhbWVuZG1lbnRGaWVsZCA/IGFtZW5kbWVudEZpZWxkLnZhbHVlIDogJyc7XG4gICAgXG4gICAgICAgIC8vIFN0b3JlIHJvdyBhbmQgaXRzIG9yaWdpbmFsIHBvc2l0aW9uXG4gICAgICAgIGxhc3RSZW1vdmVkUm93ID0gcm93O1xuICAgICAgICBsYXN0UmVtb3ZlZEluZGV4ID0gQXJyYXkuZnJvbSh0YWJsZUJvZHkuY2hpbGRyZW4pLmluZGV4T2Yocm93KTtcbiAgICBcbiAgICAgICAgcm93LnJlbW92ZSgpO1xuICAgIFxuICAgICAgICByZW1vdmVkQW1lbmRtZW50VGV4dC50ZXh0Q29udGVudCA9IGFtZW5kbWVudFRleHQudHJpbSgpIHx8ICdCbGFuayByb3cnO1xuICAgICAgICB1bmRvQ29udGFpbmVyLmhpZGRlbiA9IGZhbHNlO1xuICAgICAgICB1bmRvQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJ1bmRvQ29udGFpbmVyVmlzaWJsZVwiKTtcbiAgICB9XG5cbiAgICB1bmRvQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGlmICghbGFzdFJlbW92ZWRSb3cpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBjb25zdCByb3dzID0gdGFibGVCb2R5LmNoaWxkcmVuO1xuICAgIFxuICAgICAgICAvLyBQdXQgcm93IGJhY2sgaW4gaXRzIG9yaWdpbmFsIHBvc2l0aW9uXG4gICAgICAgIGlmIChsYXN0UmVtb3ZlZEluZGV4ID49IHJvd3MubGVuZ3RoKSB7XG4gICAgICAgICAgICB0YWJsZUJvZHkuYXBwZW5kQ2hpbGQobGFzdFJlbW92ZWRSb3cpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGFibGVCb2R5Lmluc2VydEJlZm9yZShsYXN0UmVtb3ZlZFJvdywgcm93c1tsYXN0UmVtb3ZlZEluZGV4XSk7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgbGFzdFJlbW92ZWRSb3cgPSBudWxsO1xuICAgICAgICBsYXN0UmVtb3ZlZEluZGV4ID0gbnVsbDtcbiAgICBcbiAgICAgICAgdW5kb0NvbnRhaW5lci5oaWRkZW4gPSB0cnVlO1xuICAgICAgICB1bmRvQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJ1bmRvQ29udGFpbmVyVmlzaWJsZVwiKTtcbiAgICBcbiAgICAgICAgYmluZFJlbW92ZUxpbmtzKCk7XG4gICAgfSk7XG5cbiAgICBiaW5kUmVtb3ZlTGlua3MoKTtcblxuICAgIC8vIEFkZCBuZXcgcm93XG4gICAgYWRkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGNvbnN0IHJvd0NvdW50ID0gdGFibGVCb2R5LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RyJykubGVuZ3RoICsgMTtcblxuICAgICAgICBjb25zdCBuZXdSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuICAgICAgICBuZXdSb3cuY2xhc3NMaXN0LmFkZCgnbmhzdWstdGFibGVfX3JvdycpO1xuXG4gICAgICAgIG5ld1Jvdy5pbm5lckhUTUwgPSBgXG4gICAgICAgIDx0ZCBjbGFzcz1cIm5oc3VrLXRhYmxlX19jZWxsXCI+XG4gICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwibmhzdWstc2VsZWN0IG5oc3VrLXUtZm9udC1zaXplLTE0XCJcbiAgICAgICAgICAgICAgICAgICAgaWQ9XCJzZXRzLSR7cm93Q291bnR9XCJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInNldHNbXVwiPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY3QgYSBkYXRhIHNldDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJTZXJ2aWNlIGhpc3RvcnlcIj5TZXJ2aWNlIGhpc3Rvcnk8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiRW1wbG95bWVudFwiPkVtcGxveW1lbnQ8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiU2VydmljZSBncm91cHNcIj5TZXJ2aWNlIGdyb3Vwczwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJDb250cyAmIFRQUFwiPkNvbnRzICYgVFBQPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkhvdXJzIGhpc3RvcnkgZGV0YWlsc1wiPkhvdXJzIGhpc3RvcnkgZGV0YWlsczwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJMaW5rZWQgZW1wbG95bWVudFwiPkxpbmtlZCBlbXBsb3ltZW50PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkJhc2ljIG1lbWJlciBkZXRhaWxzXCI+QmFzaWMgbWVtYmVyIGRldGFpbHM8L29wdGlvbj5cbiAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICA8L3RkPlxuICAgIFxuICAgICAgICA8dGQgY2xhc3M9XCJuaHN1ay10YWJsZV9fY2VsbFwiPlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwibmhzdWstaW5wdXQgbmhzdWstaW5wdXQtLXdpZHRoLTEwIG5oc3VrLXUtZm9udC1zaXplLTE0XCJcbiAgICAgICAgICAgICAgICAgICAgaWQ9XCJmaWVsZHMtJHtyb3dDb3VudH1cIlxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwiZmllbGRzW11cIlxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiPlxuICAgICAgICA8L3RkPlxuICAgIFxuICAgICAgICA8dGQgY2xhc3M9XCJuaHN1ay10YWJsZV9fY2VsbFwiPlxuICAgICAgICAgICAgPHRleHRhcmVhIHJvd3M9XCIxXCIgY2xhc3M9XCJuaHN1ay10ZXh0YXJlYSBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiXG4gICAgICAgICAgICAgICAgICAgIGlkPVwiYW1lbmRtZW50cy0ke3Jvd0NvdW50fVwiXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJhbWVuZG1lbnRzW11cIj48L3RleHRhcmVhPlxuICAgICAgICA8L3RkPlxuICAgIFxuICAgICAgICA8dGQgY2xhc3M9XCJuaHN1ay10YWJsZV9fY2VsbCAgbmhzdWstdS1mb250LXNpemUtMTRcIj5cbiAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cInJlbW92ZS1yb3cgbmhzdWstbGlua1wiPlxuICAgICAgICAgICAgUmVtb3ZlXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+cm93ICR7cm93Q291bnR9PC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgICAgIDwvdGQ+XG4gICAgYDtcblxuICAgICAgICB0YWJsZUJvZHkuYXBwZW5kQ2hpbGQobmV3Um93KTtcbiAgICAgICAgYmluZFJlbW92ZUxpbmtzKCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXBvcnRGb3JtXCIpO1xuICAgIGNvbnN0IGVycm9yU3VtbWFyeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JTdW1tYXJ5XCIpO1xuICAgIGNvbnN0IGVycm9yTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JMaXN0XCIpO1xuXG4gICAgY29uc3QgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlcG9ydFRhYmxlXCIpO1xuXG4gICAgY29uc3QgZmllbGRzID0gW1wic2V0c1tdXCIsIFwiZmllbGRzW11cIiwgXCJhbWVuZG1lbnRzW11cIiwgXCJyZWFzb25bXVwiXTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBTVUJNSVQgVkFMSURBVElPTlxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGNsZWFyRXJyb3JzKCk7XG5cbiAgICAgICAgbGV0IGVycm9ycyA9IFtdO1xuICAgICAgICBsZXQgZmlyc3RFcnJvckZpZWxkID0gbnVsbDtcblxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgLy8gREVTQ1JJUFRJT04gVkFMSURBVElPTlxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgICAgY29uc3Qgcm93cyA9IHRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0Ym9keSB0clwiKTtcblxuICAgICAgICByb3dzLmZvckVhY2goKHJvdywgcm93SW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlucHV0cyA9IGdldFJvd0lucHV0cyhyb3cpO1xuXG4gICAgICAgICAgICBjb25zdCByb3dIYXNEYXRhID0gaW5wdXRzLnNvbWUoaSA9PiBpLnZhbHVlLnRyaW0oKSAhPT0gXCJcIik7XG5cbiAgICAgICAgICAgIC8vIGlnbm9yZSBlbXB0eSByb3dzIGNvbXBsZXRlbHlcbiAgICAgICAgICAgIGlmICghcm93SGFzRGF0YSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBpbnB1dHMuZm9yRWFjaCgoaW5wdXQsIGNvbEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGdldEVycm9yTWVzc2FnZShjb2xJbmRleCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWlucHV0LnZhbHVlLnRyaW0oKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvcklkID0gZW5zdXJlRXJyb3IoaW5wdXQsIG1lc3NhZ2UsIHJvd0luZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgIGA8bGk+PGEgaHJlZj1cIiMke2Vycm9ySWR9XCI+JHttZXNzYWdlfSAocm93ICR7cm93SW5kZXggKyAxfSk8L2E+PC9saT5gXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IGlucHV0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgLy8gU1RBTkRBUkQgRk9STSBGSUVMRFMgVkFMSURBVElPTlxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgICAgY29uc3QgbWVtYmVyRXJyb3IgPSB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICAgICAgaW5wdXRJZDogXCJtZW1iZXJzaGlwTnVtYmVyXCIsXG4gICAgICAgICAgICBncm91cElkOiBcIm1lbWJlcnNoaXBOdW1iZXJHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJtZW1iZXJzaGlwTnVtYmVyLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkVudGVyIHRoZSBtZW1iZXIgbnVtYmVyXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgbWVtYmVyRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IG1lbWJlckVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaW5pdGlhbEVycm9yID0gdmFsaWRhdGVSZXF1aXJlZEZpZWxkKHtcbiAgICAgICAgICAgIGlucHV0SWQ6IFwibWVtYmVyRmlyc3RJbml0aWFsXCIsXG4gICAgICAgICAgICBncm91cElkOiBcIm1lbWJlckZpcnN0SW5pdGlhbEdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcIm1lbWJlckZpcnN0SW5pdGlhbC1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJFbnRlciB0aGUgbWVtYmVycyBmaXJzdCBpbml0aWFsXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgaW5pdGlhbEVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBpbml0aWFsRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdXJuYW1lRXJyb3IgPSB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICAgICAgaW5wdXRJZDogXCJtZW1iZXJTdXJuYW1lXCIsXG4gICAgICAgICAgICBncm91cElkOiBcIm1lbWJlclN1cm5hbWVHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJtZW1iZXJTdXJuYW1lLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkVudGVyIHRoZSBtZW1iZXJzIHN1cm5hbWVcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBzdXJuYW1lRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IHN1cm5hbWVFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlY29yZFR5cGVDaGFuZ2VFcnJvciA9IHZhbGlkYXRlUmFkaW9Hcm91cCh7XG4gICAgICAgICAgICBuYW1lOiBcInJlY29yZFR5cGVDaGFuZ2VcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwicmVjb3JkVHlwZUNoYW5nZUdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcInJlY29yZFR5cGVDaGFuZ2UtZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiU2VsZWN0IGEgdHlwZSBvZiBjaGFuZ2VcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIHJlY29yZFR5cGVDaGFuZ2VFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gcmVjb3JkVHlwZUNoYW5nZUVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29ycnVwdGVkRXJyb3IgPSB2YWxpZGF0ZVJhZGlvR3JvdXAoe1xuICAgICAgICAgICAgbmFtZTogXCJjb3JydXB0ZWRcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwiY29ycnVwdGVkR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwiY29ycnVwdGVkLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIlNlbGVjdCB5ZXMgaWYgeW91ciBmaWxlIGhhcyBiZWVuIGNvcnJ1cHRlZFwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgY29ycnVwdGVkRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IGNvcnJ1cHRlZEVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGF5bWVudEVycm9yID0gdmFsaWRhdGVSYWRpb0dyb3VwKHtcbiAgICAgICAgICAgIG5hbWU6IFwicGF5bWVudFwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJwYXltZW50R3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwicGF5bWVudC1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJTZWxlY3QgeWVzIGlmIHBheW1lbnQgd2lsbCBiZSBhZmZlY3RlZFwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgcGF5bWVudEVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBwYXltZW50RXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIC8vIFJFQVNPTiBURVhUQVJFQSBWQUxJREFUSU9OXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgICBjb25zdCByZWFzb25Hcm91cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXNzdWVSZWFzb25cIik7XG4gICAgICAgIGNvbnN0IHJlYXNvblRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpc3N1ZS1yZWFzb25cIik7XG5cbiAgICAgICAgaWYgKCFyZWFzb25UZXh0YXJlYS52YWx1ZS50cmltKCkpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+RW50ZXIgdGhlIHJlYXNvbiB3aHkgeW91IHJlcXVpcmUgYW4gdXBkYXRlIGZvciB0aGlzIHJlY29yZCc7XG5cbiAgICAgICAgICAgIC8vIGFkZCBOSFMgZXJyb3Igc3R5bGluZ1xuICAgICAgICAgICAgcmVhc29uR3JvdXAuY2xhc3NMaXN0LmFkZChcIm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yXCIpO1xuICAgICAgICAgICAgcmVhc29uVGV4dGFyZWEuY2xhc3NMaXN0LmFkZChcIm5oc3VrLXRleHRhcmVhLS1lcnJvclwiKTtcblxuICAgICAgICAgICAgLy8gY3JlYXRlIGVycm9yIG1lc3NhZ2UgaWYgaXQgZG9lc24ndCBleGlzdFxuICAgICAgICAgICAgbGV0IGVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpc3N1ZS1yZWFzb24tZXJyb3JcIik7XG5cbiAgICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBlcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgICAgIGVycm9yLmlkID0gXCJpc3N1ZS1yZWFzb24tZXJyb3JcIjtcbiAgICAgICAgICAgICAgICBlcnJvci5jbGFzc05hbWUgPSBcIm5oc3VrLWVycm9yLW1lc3NhZ2VcIjtcbiAgICAgICAgICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBtZXNzYWdlO1xuXG4gICAgICAgICAgICAgICAgcmVhc29uVGV4dGFyZWEucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZXJyb3IsIHJlYXNvblRleHRhcmVhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZW5zdXJlIGNvcnJlY3QgbWVzc2FnZSB0ZXh0XG4gICAgICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBtZXNzYWdlO1xuXG4gICAgICAgICAgICAvLyBhY2Nlc3NpYmlsaXR5XG4gICAgICAgICAgICByZWFzb25UZXh0YXJlYS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgXCJhcmlhLWRlc2NyaWJlZGJ5XCIsXG4gICAgICAgICAgICAgICAgXCJpc3N1ZS1yZWFzb24tZXJyb3JcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gYWRkIHRvIHN1bW1hcnlcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICAgICAgICAgIGA8bGk+PGEgaHJlZj1cIiNpc3N1ZVJlYXNvblwiPkVudGVyIHRoZSByZWFzb24gd2h5IHlvdSByZXF1aXJlIGFuIHVwZGF0ZSBmb3IgdGhpcyByZWNvcmQ8L2E+PC9saT5gXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyBmb2N1cyBmaXJzdCBpbnZhbGlkIGZpZWxkXG4gICAgICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCkge1xuICAgICAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IHJlYXNvblRleHRhcmVhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIC8vIEVORCBSRUFTT04gVEVYVEFSRUEgVkFMSURBVElPTlxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgICAgY29uc3Qgc2l0ZUF1dG9FcnJvciA9IHZhbGlkYXRlUmVxdWlyZWRGaWVsZCh7XG4gICAgICAgICAgICBpbnB1dElkOiBcInNpdGVBdXRvXCIsXG4gICAgICAgICAgICBncm91cElkOiBcInNpdGVBdXRvR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwic2l0ZUF1dG8tZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiRW50ZXIgdGhlIHNpdGUgeW91IGFyZSBiYXNlZCBhdFwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIHNpdGVBdXRvRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IHNpdGVBdXRvRXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGRpcmVjdG9yYXRlRXJyb3IgPSB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICAgICAgaW5wdXRJZDogXCJkaXJlY3RvcmF0ZVwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJkaXJlY3RvcmF0ZUdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcImRpcmVjdG9yYXRlLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkVudGVyIHlvdXIgZGlyZWN0b3JhdGVcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBkaXJlY3RvcmF0ZUVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBkaXJlY3RvcmF0ZUVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29udGFjdE51bWJlckVycm9yID0gdmFsaWRhdGVSZXF1aXJlZEZpZWxkKHtcbiAgICAgICAgICAgIGlucHV0SWQ6IFwiY29udGFjdE51bWJlclwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJjb250YWN0TnVtYmVyR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwiY29udGFjdE51bWJlci1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJFbnRlciB5b3VyIGNvbnRhY3QgbnVtYmVyXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgY29udGFjdE51bWJlckVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBjb250YWN0TnVtYmVyRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGVycm9yTGlzdC5pbm5lckhUTUwgPSBlcnJvcnMuam9pbihcIlwiKTtcbiAgICAgICAgICAgIGVycm9yU3VtbWFyeS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXG4gICAgICAgICAgICBlcnJvclN1bW1hcnkuc2Nyb2xsSW50b1ZpZXcoeyBiZWhhdmlvcjogXCJzbW9vdGhcIiB9KTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybS5zdWJtaXQoKTtcbiAgICB9KTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBIRUxQRVJTXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZnVuY3Rpb24gZ2V0Um93SW5wdXRzKHJvdykge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdFtuYW1lPVwic2V0c1tdXCJdJyksXG4gICAgICAgICAgICByb3cucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImZpZWxkc1tdXCJdJyksXG4gICAgICAgICAgICByb3cucXVlcnlTZWxlY3RvcigndGV4dGFyZWFbbmFtZT1cImFtZW5kbWVudHNbXVwiXScpLFxuICAgICAgICBdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEVycm9yTWVzc2FnZShpbmRleCkge1xuICAgICAgICBzd2l0Y2ggKGluZGV4KSB7XG4gICAgICAgICAgICBjYXNlIDA6IFxuICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj5FbnRlciB0aGUgc2V0JztcbiAgICAgICAgICAgIGNhc2UgMTogXG4gICAgICAgICAgICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPkVudGVyIHRoZSBmaWVsZCc7XG4gICAgICAgICAgICBjYXNlIDI6IFxuICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj5FbnRlciB0aGUgYW1lbmRtZW50JztcbiAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZCc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbnN1cmVFcnJvcihpbnB1dCwgbWVzc2FnZSwgcm93SW5kZXgpIHtcbiAgICAgICAgY29uc3QgY2VsbCA9IGlucHV0LmNsb3Nlc3QoXCJ0ZFwiKTtcblxuICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJuaHN1ay1mb3JtLWdyb3VwLS1lcnJvclwiKTtcblxuICAgICAgICBsZXQgZXJyb3IgPSBjZWxsLnF1ZXJ5U2VsZWN0b3IoXCIubmhzdWstZXJyb3ItbWVzc2FnZVwiKTtcblxuICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgICBlcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgZXJyb3IuY2xhc3NOYW1lID0gXCJuaHN1ay1lcnJvci1tZXNzYWdlIG5oc3VrLXUtZm9udC1zaXplLTE0XCI7XG4gICAgICAgICAgICBjZWxsLmluc2VydEJlZm9yZShlcnJvciwgaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXJyb3IuaW5uZXJIVE1MID0gbWVzc2FnZTtcblxuICAgICAgICBjb25zdCBlcnJvcklkID0gaW5wdXQuaWQgfHwgYHJvdy0ke3Jvd0luZGV4fS0ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIsIDcpfWA7XG5cbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiYXJpYS1kZXNjcmliZWRieVwiLCBlcnJvcklkKTtcbiAgICAgICAgaW5wdXQuaWQgPSBlcnJvcklkO1xuXG4gICAgICAgIHJldHVybiBlcnJvcklkO1xuICAgIH1cblxuICAgIC8vIEhlbHBlciBmb3IgdGhlIHRleHQgZmllbGQgdmFsaWRhdGlvblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlUmVxdWlyZWRGaWVsZCh7XG4gICAgICAgIGlucHV0SWQsXG4gICAgICAgIGdyb3VwSWQsXG4gICAgICAgIGVycm9ySWQsXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIGVycm9yc1xuICAgIH0pIHtcbiAgICBcbiAgICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbnB1dElkKTtcbiAgICAgICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChncm91cElkKTtcbiAgICBcbiAgICAgICAgaWYgKCFpbnB1dC52YWx1ZS50cmltKCkpIHtcbiAgICBcbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgYDxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+ICR7bWVzc2FnZX1gO1xuICAgIFxuICAgICAgICAgICAgZ3JvdXAuY2xhc3NMaXN0LmFkZChcIm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yXCIpO1xuICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZChcIm5oc3VrLWlucHV0LS1lcnJvclwiKTtcbiAgICBcbiAgICAgICAgICAgIGxldCBlcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVycm9ySWQpO1xuXG4gICAgICAgICAgICBjb25zdCBmb3JtR3JvdXAgPSBpbnB1dC5jbG9zZXN0KCcubmhzdWstZm9ybS1ncm91cCcpO1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSBmb3JtR3JvdXA/LnF1ZXJ5U2VsZWN0b3IoJy5uaHN1ay1sYWJlbCcpO1xuXG4gICAgICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgICAgICBlcnJvci5pZCA9IGVycm9ySWQ7XG4gICAgICAgICAgICAgICAgZXJyb3IuY2xhc3NOYW1lID0gXCJuaHN1ay1lcnJvci1tZXNzYWdlXCI7XG5cbiAgICAgICAgICAgICAgICBsYWJlbC5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyZW5kJywgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgZXJyb3IuaW5uZXJIVE1MID0gZXJyb3JNZXNzYWdlO1xuICAgIFxuICAgICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiYXJpYS1kZXNjcmliZWRieVwiLCBlcnJvcklkKTtcbiAgICBcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICAgICAgICAgIGA8bGk+PGEgaHJlZj1cIiMke2dyb3VwSWR9XCI+JHttZXNzYWdlfTwvYT48L2xpPmBcbiAgICAgICAgICAgICk7XG4gICAgXG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIZWxwZXIgZm9yIHRoZSByYWRpbyBidXR0b24gdmFsaWRhdGlvblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlUmFkaW9Hcm91cCh7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIGdyb3VwSWQsXG4gICAgICAgIGVycm9ySWQsXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIGVycm9yc1xuICAgIH0pIHtcbiAgICBcbiAgICAgICAgY29uc3QgcmFkaW9zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgIGBpbnB1dFtuYW1lPVwiJHtuYW1lfVwiXWBcbiAgICAgICAgKTtcbiAgICBcbiAgICAgICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChncm91cElkKTtcbiAgICBcbiAgICAgICAgY29uc3QgY2hlY2tlZCA9IFsuLi5yYWRpb3NdLnNvbWUocmFkaW8gPT4gcmFkaW8uY2hlY2tlZCk7XG4gICAgXG4gICAgICAgIGlmICghY2hlY2tlZCkge1xuICAgIFxuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID1cbiAgICAgICAgICAgICAgICBgPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj4gJHttZXNzYWdlfWA7XG4gICAgXG4gICAgICAgICAgICBncm91cC5jbGFzc0xpc3QuYWRkKFwibmhzdWstZm9ybS1ncm91cC0tZXJyb3JcIik7XG4gICAgXG4gICAgICAgICAgICBsZXQgZXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlcnJvcklkKTtcbiAgICBcbiAgICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICBcbiAgICAgICAgICAgICAgICBlcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIFxuICAgICAgICAgICAgICAgIGVycm9yLmlkID0gZXJyb3JJZDtcbiAgICAgICAgICAgICAgICBlcnJvci5jbGFzc05hbWUgPSBcIm5oc3VrLWVycm9yLW1lc3NhZ2VcIjtcbiAgICAgICAgICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBlcnJvck1lc3NhZ2U7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBmaWVsZHNldCA9IGdyb3VwLnF1ZXJ5U2VsZWN0b3IoXCIubmhzdWstZmllbGRzZXRcIik7XG4gICAgICAgICAgICAgICAgY29uc3QgcmFkaW9zID0gZmllbGRzZXQucXVlcnlTZWxlY3RvcihcIi5uaHN1ay1yYWRpb3NcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBmaWVsZHNldC5pbnNlcnRCZWZvcmUoZXJyb3IsIHJhZGlvcyk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgICAgICAgICBgPGxpPjxhIGhyZWY9XCIjJHtyYWRpb3NbMF0uaWR9XCI+JHttZXNzYWdlfTwvYT48L2xpPmBcbiAgICAgICAgICAgICk7XG4gICAgXG4gICAgICAgICAgICByYWRpb3NbMF0uc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgICAgIFwiYXJpYS1kZXNjcmliZWRieVwiLFxuICAgICAgICAgICAgICAgIGVycm9ySWRcbiAgICAgICAgICAgICk7XG4gICAgXG4gICAgICAgICAgICByZXR1cm4gcmFkaW9zWzBdO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyRXJyb3JzKCkge1xuICAgICAgICBlcnJvckxpc3QuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgZXJyb3JTdW1tYXJ5LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yLCAubmhzdWstdGV4dGFyZWEtLWVycm9yLCAubmhzdWstaW5wdXQtLWVycm9yXCIpXG4gICAgICAgICAgICAuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKFwibmhzdWstZm9ybS1ncm91cC0tZXJyb3JcIiwgXCJuaHN1ay10ZXh0YXJlYS0tZXJyb3JcIiwgXCJuaHN1ay1pbnB1dC0tZXJyb3JcIikpO1xuXG4gICAgICAgIC8vIHJlbW92ZSB0YWJsZS1nZW5lcmF0ZWQgZXJyb3JzIG9ubHlcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInRkIC5uaHN1ay1lcnJvci1tZXNzYWdlXCIpXG4gICAgICAgICAgICAuZm9yRWFjaChlbCA9PiBlbC5yZW1vdmUoKSk7XG5cbiAgICAgICAgW1xuICAgICAgICAgICAgXCJtZW1iZXJzaGlwTnVtYmVyLWVycm9yXCIsXG4gICAgICAgICAgICBcIm1lbWJlckZpcnN0SW5pdGlhbC1lcnJvclwiLFxuICAgICAgICAgICAgXCJtZW1iZXJTdXJuYW1lLWVycm9yXCIsXG4gICAgICAgICAgICBcInJlY29yZFR5cGVDaGFuZ2UtZXJyb3JcIixcbiAgICAgICAgICAgIFwic2l0ZUF1dG8tZXJyb3JcIixcbiAgICAgICAgICAgIFwicGF5bWVudC1lcnJvclwiLFxuICAgICAgICAgICAgXCJjb250YWN0TnVtYmVyLWVycm9yXCIsXG4gICAgICAgICAgICBcImRpcmVjdG9yYXRlLWVycm9yXCJcbiAgICAgICAgXS5mb3JFYWNoKGlkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICBcbiAgICAgICAgICAgIGlmIChlbCkge1xuICAgICAgICAgICAgICAgIGVsLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyByZW1vdmUgdGV4dGFyZWEgZXJyb3IgbWVzc2FnZSB0ZXh0XG4gICAgICAgIGNvbnN0IHJlYXNvbkVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpc3N1ZS1yZWFzb24tZXJyb3JcIik7XG5cbiAgICAgICAgaWYgKHJlYXNvbkVycm9yKSB7XG4gICAgICAgIHJlYXNvbkVycm9yLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxTQUFTLGlCQUFpQixvQkFBb0IsV0FBWTtBQUV0RCxRQUFNLFlBQVksU0FBUyxjQUFjLG9CQUFvQjtBQUM3RCxRQUFNLFlBQVksU0FBUyxlQUFlLGNBQWM7QUFDeEQsUUFBTSxnQkFBZ0IsU0FBUyxjQUFjLHVCQUF1QjtBQUNwRSxRQUFNLGFBQWEsU0FBUyxlQUFlLG1CQUFtQjtBQUU5RCxNQUFJLGlCQUFpQjtBQUNyQixNQUFJLG1CQUFtQjtBQUd2QixXQUFTLGtCQUFrQjtBQUN2QixjQUFVLGlCQUFpQixhQUFhLEVBQUUsUUFBUSxVQUFRO0FBQ3RELFdBQUssb0JBQW9CLFNBQVMsYUFBYTtBQUMvQyxXQUFLLGlCQUFpQixTQUFTLGFBQWE7QUFBQSxJQUNoRCxDQUFDO0FBQUEsRUFDTDtBQUVBLFdBQVMsY0FBYyxHQUFHO0FBQ3RCLE1BQUUsZUFBZTtBQUVqQixVQUFNLE1BQU0sRUFBRSxPQUFPLFFBQVEsSUFBSTtBQUdqQyxVQUFNLGlCQUFpQixJQUFJLGNBQWMsK0JBQStCO0FBQ3hFLFVBQU0sZ0JBQWdCLGlCQUFpQixlQUFlLFFBQVE7QUFHOUQscUJBQWlCO0FBQ2pCLHVCQUFtQixNQUFNLEtBQUssVUFBVSxRQUFRLEVBQUUsUUFBUSxHQUFHO0FBRTdELFFBQUksT0FBTztBQUVYLHlCQUFxQixjQUFjLGNBQWMsS0FBSyxLQUFLO0FBQzNELGtCQUFjLFNBQVM7QUFDdkIsa0JBQWMsVUFBVSxJQUFJLHNCQUFzQjtBQUFBLEVBQ3REO0FBRUEsYUFBVyxpQkFBaUIsU0FBUyxXQUFZO0FBRTdDLFFBQUksQ0FBQyxnQkFBZ0I7QUFDakI7QUFBQSxJQUNKO0FBRUEsVUFBTSxPQUFPLFVBQVU7QUFHdkIsUUFBSSxvQkFBb0IsS0FBSyxRQUFRO0FBQ2pDLGdCQUFVLFlBQVksY0FBYztBQUFBLElBQ3hDLE9BQU87QUFDSCxnQkFBVSxhQUFhLGdCQUFnQixLQUFLLGdCQUFnQixDQUFDO0FBQUEsSUFDakU7QUFFQSxxQkFBaUI7QUFDakIsdUJBQW1CO0FBRW5CLGtCQUFjLFNBQVM7QUFDdkIsa0JBQWMsVUFBVSxPQUFPLHNCQUFzQjtBQUVyRCxvQkFBZ0I7QUFBQSxFQUNwQixDQUFDO0FBRUQsa0JBQWdCO0FBR2hCLFlBQVUsaUJBQWlCLFNBQVMsV0FBWTtBQUU1QyxVQUFNLFdBQVcsVUFBVSxpQkFBaUIsSUFBSSxFQUFFLFNBQVM7QUFFM0QsVUFBTSxTQUFTLFNBQVMsY0FBYyxJQUFJO0FBQzFDLFdBQU8sVUFBVSxJQUFJLGtCQUFrQjtBQUV2QyxXQUFPLFlBQVk7QUFBQTtBQUFBO0FBQUEsK0JBR0ksUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQ0FlTixRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEscUNBT0osUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHdEQU9XLFFBQVE7QUFBQTtBQUFBO0FBQUE7QUFLeEQsY0FBVSxZQUFZLE1BQU07QUFDNUIsb0JBQWdCO0FBQUEsRUFDcEIsQ0FBQztBQUVELFFBQU0sT0FBTyxTQUFTLGVBQWUsWUFBWTtBQUNqRCxRQUFNLGVBQWUsU0FBUyxlQUFlLGNBQWM7QUFDM0QsUUFBTSxZQUFZLFNBQVMsZUFBZSxXQUFXO0FBRXJELFFBQU0sUUFBUSxTQUFTLGVBQWUsYUFBYTtBQUVuRCxRQUFNLFNBQVMsQ0FBQyxVQUFVLFlBQVksZ0JBQWdCLFVBQVU7QUFLaEUsT0FBSyxpQkFBaUIsVUFBVSxTQUFVLEdBQUc7QUFDekMsTUFBRSxlQUFlO0FBRWpCLGdCQUFZO0FBRVosUUFBSSxTQUFTLENBQUM7QUFDZCxRQUFJLGtCQUFrQjtBQU90QixVQUFNLE9BQU8sTUFBTSxpQkFBaUIsVUFBVTtBQUU5QyxTQUFLLFFBQVEsQ0FBQyxLQUFLLGFBQWE7QUFDNUIsWUFBTSxTQUFTLGFBQWEsR0FBRztBQUUvQixZQUFNLGFBQWEsT0FBTyxLQUFLLE9BQUssRUFBRSxNQUFNLEtBQUssTUFBTSxFQUFFO0FBR3pELFVBQUksQ0FBQyxXQUFZO0FBRWpCLGFBQU8sUUFBUSxDQUFDLE9BQU8sYUFBYTtBQUNoQyxjQUFNLFVBQVUsZ0JBQWdCLFFBQVE7QUFFeEMsWUFBSSxDQUFDLE1BQU0sTUFBTSxLQUFLLEdBQUc7QUFDckIsZ0JBQU0sVUFBVSxZQUFZLE9BQU8sU0FBUyxRQUFRO0FBRXBELGlCQUFPO0FBQUEsWUFDSCxpQkFBaUIsT0FBTyxLQUFLLE9BQU8sU0FBUyxXQUFXLENBQUM7QUFBQSxVQUM3RDtBQUVBLGNBQUksQ0FBQyxpQkFBaUI7QUFDbEIsOEJBQWtCO0FBQUEsVUFDdEI7QUFBQSxRQUNKO0FBQUEsTUFDSixDQUFDO0FBQUEsSUFDTCxDQUFDO0FBTUQsVUFBTSxjQUFjLHNCQUFzQjtBQUFBLE1BQ3RDLFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxNQUNUO0FBQUEsSUFDSixDQUFDO0FBRUQsUUFBSSxDQUFDLG1CQUFtQixhQUFhO0FBQ2pDLHdCQUFrQjtBQUFBLElBQ3RCO0FBRUEsVUFBTSxlQUFlLHNCQUFzQjtBQUFBLE1BQ3ZDLFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxNQUNUO0FBQUEsSUFDSixDQUFDO0FBRUQsUUFBSSxDQUFDLG1CQUFtQixjQUFjO0FBQ2xDLHdCQUFrQjtBQUFBLElBQ3RCO0FBRUEsVUFBTSxlQUFlLHNCQUFzQjtBQUFBLE1BQ3ZDLFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxNQUNUO0FBQUEsSUFDSixDQUFDO0FBRUQsUUFBSSxDQUFDLG1CQUFtQixjQUFjO0FBQ2xDLHdCQUFrQjtBQUFBLElBQ3RCO0FBRUEsVUFBTSx3QkFBd0IsbUJBQW1CO0FBQUEsTUFDN0MsTUFBTTtBQUFBLE1BQ04sU0FBUztBQUFBLE1BQ1QsU0FBUztBQUFBLE1BQ1QsU0FBUztBQUFBLE1BQ1Q7QUFBQSxJQUNKLENBQUM7QUFFRCxRQUFJLENBQUMsbUJBQW1CLHVCQUF1QjtBQUMzQyx3QkFBa0I7QUFBQSxJQUN0QjtBQUVBLFVBQU0saUJBQWlCLG1CQUFtQjtBQUFBLE1BQ3RDLE1BQU07QUFBQSxNQUNOLFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxNQUNUO0FBQUEsSUFDSixDQUFDO0FBRUQsUUFBSSxDQUFDLG1CQUFtQixnQkFBZ0I7QUFDcEMsd0JBQWtCO0FBQUEsSUFDdEI7QUFFQSxVQUFNLGVBQWUsbUJBQW1CO0FBQUEsTUFDcEMsTUFBTTtBQUFBLE1BQ04sU0FBUztBQUFBLE1BQ1QsU0FBUztBQUFBLE1BQ1QsU0FBUztBQUFBLE1BQ1Q7QUFBQSxJQUNKLENBQUM7QUFFRCxRQUFJLENBQUMsbUJBQW1CLGNBQWM7QUFDbEMsd0JBQWtCO0FBQUEsSUFDdEI7QUFNQSxVQUFNLGNBQWMsU0FBUyxlQUFlLGFBQWE7QUFDekQsVUFBTSxpQkFBaUIsU0FBUyxlQUFlLGNBQWM7QUFFN0QsUUFBSSxDQUFDLGVBQWUsTUFBTSxLQUFLLEdBQUc7QUFFOUIsWUFBTSxVQUNGO0FBR0osa0JBQVksVUFBVSxJQUFJLHlCQUF5QjtBQUNuRCxxQkFBZSxVQUFVLElBQUksdUJBQXVCO0FBR3BELFVBQUksUUFBUSxTQUFTLGVBQWUsb0JBQW9CO0FBRXhELFVBQUksQ0FBQyxPQUFPO0FBQ1IsZ0JBQVEsU0FBUyxjQUFjLE1BQU07QUFDckMsY0FBTSxLQUFLO0FBQ1gsY0FBTSxZQUFZO0FBQ2xCLGNBQU0sWUFBWTtBQUVsQix1QkFBZSxXQUFXLGFBQWEsT0FBTyxjQUFjO0FBQUEsTUFDaEU7QUFHQSxZQUFNLFlBQVk7QUFHbEIscUJBQWU7QUFBQSxRQUNYO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFHQSxhQUFPO0FBQUEsUUFDSDtBQUFBLE1BQ0o7QUFHQSxVQUFJLENBQUMsaUJBQWlCO0FBQ2xCLDBCQUFrQjtBQUFBLE1BQ3RCO0FBQUEsSUFDSjtBQU1BLFVBQU0sZ0JBQWdCLHNCQUFzQjtBQUFBLE1BQ3hDLFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxNQUNUO0FBQUEsSUFDSixDQUFDO0FBRUQsUUFBSSxDQUFDLG1CQUFtQixlQUFlO0FBQ25DLHdCQUFrQjtBQUFBLElBQ3RCO0FBRUEsVUFBTSxtQkFBbUIsc0JBQXNCO0FBQUEsTUFDM0MsU0FBUztBQUFBLE1BQ1QsU0FBUztBQUFBLE1BQ1QsU0FBUztBQUFBLE1BQ1QsU0FBUztBQUFBLE1BQ1Q7QUFBQSxJQUNKLENBQUM7QUFFRCxRQUFJLENBQUMsbUJBQW1CLGtCQUFrQjtBQUN0Qyx3QkFBa0I7QUFBQSxJQUN0QjtBQUVBLFVBQU0scUJBQXFCLHNCQUFzQjtBQUFBLE1BQzdDLFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxNQUNUO0FBQUEsSUFDSixDQUFDO0FBRUQsUUFBSSxDQUFDLG1CQUFtQixvQkFBb0I7QUFDeEMsd0JBQWtCO0FBQUEsSUFDdEI7QUFFQSxRQUFJLE9BQU8sU0FBUyxHQUFHO0FBQ25CLGdCQUFVLFlBQVksT0FBTyxLQUFLLEVBQUU7QUFDcEMsbUJBQWEsTUFBTSxVQUFVO0FBRTdCLG1CQUFhLGVBQWUsRUFBRSxVQUFVLFNBQVMsQ0FBQztBQUVsRDtBQUFBLElBQ0o7QUFFQSxTQUFLLE9BQU87QUFBQSxFQUNoQixDQUFDO0FBTUQsV0FBUyxhQUFhLEtBQUs7QUFDdkIsV0FBTztBQUFBLE1BQ0gsSUFBSSxjQUFjLHVCQUF1QjtBQUFBLE1BQ3pDLElBQUksY0FBYyx3QkFBd0I7QUFBQSxNQUMxQyxJQUFJLGNBQWMsK0JBQStCO0FBQUEsSUFDckQ7QUFBQSxFQUNKO0FBRUEsV0FBUyxnQkFBZ0IsT0FBTztBQUM1QixZQUFRLE9BQU87QUFBQSxNQUNYLEtBQUs7QUFDRCxlQUFPO0FBQUEsTUFDWCxLQUFLO0FBQ0QsZUFBTztBQUFBLE1BQ1gsS0FBSztBQUNELGVBQU87QUFBQSxNQUNYO0FBQVMsZUFBTztBQUFBLElBQ3BCO0FBQUEsRUFDSjtBQUVBLFdBQVMsWUFBWSxPQUFPLFNBQVMsVUFBVTtBQUMzQyxVQUFNLE9BQU8sTUFBTSxRQUFRLElBQUk7QUFFL0IsU0FBSyxVQUFVLElBQUkseUJBQXlCO0FBRTVDLFFBQUksUUFBUSxLQUFLLGNBQWMsc0JBQXNCO0FBRXJELFFBQUksQ0FBQyxPQUFPO0FBQ1IsY0FBUSxTQUFTLGNBQWMsTUFBTTtBQUNyQyxZQUFNLFlBQVk7QUFDbEIsV0FBSyxhQUFhLE9BQU8sS0FBSztBQUFBLElBQ2xDO0FBRUEsVUFBTSxZQUFZO0FBRWxCLFVBQU0sVUFBVSxNQUFNLE1BQU0sT0FBTyxRQUFRLElBQUksS0FBSyxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUVyRixVQUFNLGFBQWEsb0JBQW9CLE9BQU87QUFDOUMsVUFBTSxLQUFLO0FBRVgsV0FBTztBQUFBLEVBQ1g7QUFHQSxXQUFTLHNCQUFzQjtBQUFBLElBQzNCO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0osR0FBRztBQUVDLFVBQU0sUUFBUSxTQUFTLGVBQWUsT0FBTztBQUM3QyxVQUFNLFFBQVEsU0FBUyxlQUFlLE9BQU87QUFFN0MsUUFBSSxDQUFDLE1BQU0sTUFBTSxLQUFLLEdBQUc7QUFFckIsWUFBTSxlQUNGLHVEQUF1RCxPQUFPO0FBRWxFLFlBQU0sVUFBVSxJQUFJLHlCQUF5QjtBQUM3QyxZQUFNLFVBQVUsSUFBSSxvQkFBb0I7QUFFeEMsVUFBSSxRQUFRLFNBQVMsZUFBZSxPQUFPO0FBRTNDLFlBQU0sWUFBWSxNQUFNLFFBQVEsbUJBQW1CO0FBQ25ELFlBQU0sUUFBUSx1Q0FBVyxjQUFjO0FBRXZDLFVBQUksQ0FBQyxPQUFPO0FBQ1IsZ0JBQVEsU0FBUyxjQUFjLE1BQU07QUFDckMsY0FBTSxLQUFLO0FBQ1gsY0FBTSxZQUFZO0FBRWxCLGNBQU0sc0JBQXNCLFlBQVksS0FBSztBQUFBLE1BQ2pEO0FBRUEsWUFBTSxZQUFZO0FBRWxCLFlBQU0sYUFBYSxvQkFBb0IsT0FBTztBQUU5QyxhQUFPO0FBQUEsUUFDSCxpQkFBaUIsT0FBTyxLQUFLLE9BQU87QUFBQSxNQUN4QztBQUVBLGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDSjtBQUdBLFdBQVMsbUJBQW1CO0FBQUEsSUFDeEI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDSixHQUFHO0FBRUMsVUFBTSxTQUFTLFNBQVM7QUFBQSxNQUNwQixlQUFlLElBQUk7QUFBQSxJQUN2QjtBQUVBLFVBQU0sUUFBUSxTQUFTLGVBQWUsT0FBTztBQUU3QyxVQUFNLFVBQVUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxLQUFLLFdBQVMsTUFBTSxPQUFPO0FBRXZELFFBQUksQ0FBQyxTQUFTO0FBRVYsWUFBTSxlQUNGLHVEQUF1RCxPQUFPO0FBRWxFLFlBQU0sVUFBVSxJQUFJLHlCQUF5QjtBQUU3QyxVQUFJLFFBQVEsU0FBUyxlQUFlLE9BQU87QUFFM0MsVUFBSSxDQUFDLE9BQU87QUFFUixnQkFBUSxTQUFTLGNBQWMsTUFBTTtBQUVyQyxjQUFNLEtBQUs7QUFDWCxjQUFNLFlBQVk7QUFDbEIsY0FBTSxZQUFZO0FBRWxCLGNBQU0sV0FBVyxNQUFNLGNBQWMsaUJBQWlCO0FBQ3RELGNBQU1BLFVBQVMsU0FBUyxjQUFjLGVBQWU7QUFFckQsaUJBQVMsYUFBYSxPQUFPQSxPQUFNO0FBQUEsTUFDdkM7QUFFQSxhQUFPO0FBQUEsUUFDSCxpQkFBaUIsT0FBTyxDQUFDLEVBQUUsRUFBRSxLQUFLLE9BQU87QUFBQSxNQUM3QztBQUVBLGFBQU8sQ0FBQyxFQUFFO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBRUEsYUFBTyxPQUFPLENBQUM7QUFBQSxJQUNuQjtBQUVBLFdBQU87QUFBQSxFQUNYO0FBRUEsV0FBUyxjQUFjO0FBQ25CLGNBQVUsWUFBWTtBQUN0QixpQkFBYSxNQUFNLFVBQVU7QUFFN0IsYUFBUyxpQkFBaUIsdUVBQXVFLEVBQzVGLFFBQVEsUUFBTSxHQUFHLFVBQVUsT0FBTywyQkFBMkIseUJBQXlCLG9CQUFvQixDQUFDO0FBR2hILGFBQVMsaUJBQWlCLHlCQUF5QixFQUM5QyxRQUFRLFFBQU0sR0FBRyxPQUFPLENBQUM7QUFFOUI7QUFBQSxNQUNJO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0osRUFBRSxRQUFRLFFBQU07QUFDWixZQUFNLEtBQUssU0FBUyxlQUFlLEVBQUU7QUFFckMsVUFBSSxJQUFJO0FBQ0osV0FBRyxPQUFPO0FBQUEsTUFDZDtBQUFBLElBQ0osQ0FBQztBQUdELFVBQU0sY0FBYyxTQUFTLGVBQWUsb0JBQW9CO0FBRWhFLFFBQUksYUFBYTtBQUNqQixrQkFBWSxZQUFZO0FBQUEsSUFDeEI7QUFBQSxFQUNKO0FBRUosQ0FBQzsiLAogICJuYW1lcyI6IFsicmFkaW9zIl0KfQo=
