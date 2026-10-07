// app/assets/javascript/sd-report-v3.js
document.addEventListener("DOMContentLoaded", function() {
  const dataSetDialogs = {
    "Service history": "service-history-dialog",
    "Employment": "employment-dialog",
    "Service groups": "service-groups-dialog",
    "Conts & TPP": "conts-tpp-dialog",
    "Hours history details": "hours-history-dialog",
    "Linked employment": "linked-employment-dialog",
    "Basic member details": "basic-member-details-dialog"
  };
  function updateDataSetViewForRow(row) {
    const setSelect = row.querySelector('select[name="sets[]"]');
    const dataSetView = row.querySelector(".view-data-set");
    const dataSetButton = row.querySelector(".view-data-set-button");
    if (!setSelect || !dataSetView || !dataSetButton) {
      return;
    }
    const dialogId = dataSetDialogs[setSelect.value];
    dataSetView.hidden = !dialogId;
    dataSetButton.dataset.dialogId = dialogId || "";
    dataSetButton.setAttribute("aria-label", `View ${setSelect.value} data set`);
  }
  function updateAllDataSetViews() {
    tableBody.querySelectorAll("tr").forEach(updateDataSetViewForRow);
  }
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
  tableBody.addEventListener("change", function(e) {
    if (e.target.matches('select[name="sets[]"]')) {
      updateDataSetViewForRow(e.target.closest("tr"));
    }
  });
  tableBody.addEventListener("click", function(e) {
    const dataSetButton = e.target.closest(".view-data-set-button");
    if (!dataSetButton || !tableBody.contains(dataSetButton)) {
      return;
    }
    e.preventDefault();
    openDialog(
      dataSetButton.dataset.dialogId,
      dataSetButton,
      `${dataSetButton.dataset.dialogId}-label`
    );
  });
  updateAllDataSetViews();
  function removeHandler(e) {
    e.preventDefault();
    const row = e.target.closest("tr");
    const amendmentField = row.querySelector('textarea[name="amendments[]"]');
    const amendmentText = amendmentField ? amendmentField.value : "";
    const hasContent = Array.from(row.querySelectorAll("input, select, textarea")).some((field) => field.value.trim() !== "");
    if (!hasContent) {
      row.remove();
      return;
    }
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
            <div class="view-data-set" hidden>
                <a href="#" class="nhsuk-link nhsuk-u-font-size-14 view-data-set-button">View data set</a>
            </div>
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
    updateDataSetViewForRow(newRow);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L3NkLXJlcG9ydC12My5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcblxuICAgIGNvbnN0IGRhdGFTZXREaWFsb2dzID0ge1xuICAgICAgICAnU2VydmljZSBoaXN0b3J5JzogJ3NlcnZpY2UtaGlzdG9yeS1kaWFsb2cnLFxuICAgICAgICAnRW1wbG95bWVudCc6ICdlbXBsb3ltZW50LWRpYWxvZycsXG4gICAgICAgICdTZXJ2aWNlIGdyb3Vwcyc6ICdzZXJ2aWNlLWdyb3Vwcy1kaWFsb2cnLFxuICAgICAgICAnQ29udHMgJiBUUFAnOiAnY29udHMtdHBwLWRpYWxvZycsXG4gICAgICAgICdIb3VycyBoaXN0b3J5IGRldGFpbHMnOiAnaG91cnMtaGlzdG9yeS1kaWFsb2cnLFxuICAgICAgICAnTGlua2VkIGVtcGxveW1lbnQnOiAnbGlua2VkLWVtcGxveW1lbnQtZGlhbG9nJyxcbiAgICAgICAgJ0Jhc2ljIG1lbWJlciBkZXRhaWxzJzogJ2Jhc2ljLW1lbWJlci1kZXRhaWxzLWRpYWxvZydcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlRGF0YVNldFZpZXdGb3JSb3cocm93KSB7XG4gICAgICAgIGNvbnN0IHNldFNlbGVjdCA9IHJvdy5xdWVyeVNlbGVjdG9yKCdzZWxlY3RbbmFtZT1cInNldHNbXVwiXScpO1xuICAgICAgICBjb25zdCBkYXRhU2V0VmlldyA9IHJvdy5xdWVyeVNlbGVjdG9yKCcudmlldy1kYXRhLXNldCcpO1xuICAgICAgICBjb25zdCBkYXRhU2V0QnV0dG9uID0gcm93LnF1ZXJ5U2VsZWN0b3IoJy52aWV3LWRhdGEtc2V0LWJ1dHRvbicpO1xuXG4gICAgICAgIGlmICghc2V0U2VsZWN0IHx8ICFkYXRhU2V0VmlldyB8fCAhZGF0YVNldEJ1dHRvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGlhbG9nSWQgPSBkYXRhU2V0RGlhbG9nc1tzZXRTZWxlY3QudmFsdWVdO1xuXG4gICAgICAgIGRhdGFTZXRWaWV3LmhpZGRlbiA9ICFkaWFsb2dJZDtcbiAgICAgICAgZGF0YVNldEJ1dHRvbi5kYXRhc2V0LmRpYWxvZ0lkID0gZGlhbG9nSWQgfHwgJyc7XG4gICAgICAgIGRhdGFTZXRCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgYFZpZXcgJHtzZXRTZWxlY3QudmFsdWV9IGRhdGEgc2V0YCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlQWxsRGF0YVNldFZpZXdzKCkge1xuICAgICAgICB0YWJsZUJvZHkucXVlcnlTZWxlY3RvckFsbCgndHInKS5mb3JFYWNoKHVwZGF0ZURhdGFTZXRWaWV3Rm9yUm93KTtcbiAgICB9XG5cbiAgICBjb25zdCB0YWJsZUJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVwb3J0VGFibGUgdGJvZHknKTtcbiAgICBjb25zdCBhZGRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkUm93QnV0dG9uJyk7XG4gICAgY29uc3QgdW5kb0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51bmRvUmVtb3ZhbENvbnRhaW5lcicpO1xuICAgIGNvbnN0IHVuZG9CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndW5kb1JlbW92YWxCdXR0b24nKTtcblxuICAgIGxldCBsYXN0UmVtb3ZlZFJvdyA9IG51bGw7XG4gICAgbGV0IGxhc3RSZW1vdmVkSW5kZXggPSBudWxsO1xuXG4gICAgLy8gUmVtb3ZlIHJvd1xuICAgIGZ1bmN0aW9uIGJpbmRSZW1vdmVMaW5rcygpIHtcbiAgICAgICAgdGFibGVCb2R5LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZW1vdmUtcm93JykuZm9yRWFjaChsaW5rID0+IHtcbiAgICAgICAgICAgIGxpbmsucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZW1vdmVIYW5kbGVyKTtcbiAgICAgICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZW1vdmVIYW5kbGVyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGFibGVCb2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCdzZWxlY3RbbmFtZT1cInNldHNbXVwiXScpKSB7XG4gICAgICAgICAgICB1cGRhdGVEYXRhU2V0Vmlld0ZvclJvdyhlLnRhcmdldC5jbG9zZXN0KCd0cicpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGFibGVCb2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc3QgZGF0YVNldEJ1dHRvbiA9IGUudGFyZ2V0LmNsb3Nlc3QoJy52aWV3LWRhdGEtc2V0LWJ1dHRvbicpO1xuXG4gICAgICAgIGlmICghZGF0YVNldEJ1dHRvbiB8fCAhdGFibGVCb2R5LmNvbnRhaW5zKGRhdGFTZXRCdXR0b24pKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG9wZW5EaWFsb2coXG4gICAgICAgICAgICBkYXRhU2V0QnV0dG9uLmRhdGFzZXQuZGlhbG9nSWQsXG4gICAgICAgICAgICBkYXRhU2V0QnV0dG9uLFxuICAgICAgICAgICAgYCR7ZGF0YVNldEJ1dHRvbi5kYXRhc2V0LmRpYWxvZ0lkfS1sYWJlbGBcbiAgICAgICAgKTtcbiAgICB9KTtcblxuICAgIHVwZGF0ZUFsbERhdGFTZXRWaWV3cygpO1xuXG4gICAgZnVuY3Rpb24gcmVtb3ZlSGFuZGxlcihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBcbiAgICAgICAgY29uc3Qgcm93ID0gZS50YXJnZXQuY2xvc2VzdCgndHInKTtcbiAgICBcbiAgICAgICAgLy8gR2V0IGFtZW5kbWVudCB0ZXh0IGJlZm9yZSByZW1vdmluZyByb3dcbiAgICAgICAgY29uc3QgYW1lbmRtZW50RmllbGQgPSByb3cucXVlcnlTZWxlY3RvcigndGV4dGFyZWFbbmFtZT1cImFtZW5kbWVudHNbXVwiXScpO1xuICAgICAgICBjb25zdCBhbWVuZG1lbnRUZXh0ID0gYW1lbmRtZW50RmllbGQgPyBhbWVuZG1lbnRGaWVsZC52YWx1ZSA6ICcnO1xuXG4gICAgICAgIGNvbnN0IGhhc0NvbnRlbnQgPSBBcnJheS5mcm9tKHJvdy5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCwgc2VsZWN0LCB0ZXh0YXJlYScpKVxuICAgICAgICAgICAgLnNvbWUoZmllbGQgPT4gZmllbGQudmFsdWUudHJpbSgpICE9PSAnJyk7XG5cbiAgICAgICAgLy8gQmxhbmsgcm93cyBhcmUgZGVsZXRlZCB3aXRob3V0IG9mZmVyaW5nIHVuZG9cbiAgICAgICAgaWYgKCFoYXNDb250ZW50KSB7XG4gICAgICAgICAgICByb3cucmVtb3ZlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgLy8gU3RvcmUgcm93IGFuZCBpdHMgb3JpZ2luYWwgcG9zaXRpb25cbiAgICAgICAgbGFzdFJlbW92ZWRSb3cgPSByb3c7XG4gICAgICAgIGxhc3RSZW1vdmVkSW5kZXggPSBBcnJheS5mcm9tKHRhYmxlQm9keS5jaGlsZHJlbikuaW5kZXhPZihyb3cpO1xuICAgIFxuICAgICAgICByb3cucmVtb3ZlKCk7XG4gICAgXG4gICAgICAgIHJlbW92ZWRBbWVuZG1lbnRUZXh0LnRleHRDb250ZW50ID0gYW1lbmRtZW50VGV4dC50cmltKCkgfHwgJ0JsYW5rIHJvdyc7XG4gICAgICAgIHVuZG9Db250YWluZXIuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIHVuZG9Db250YWluZXIuY2xhc3NMaXN0LmFkZChcInVuZG9Db250YWluZXJWaXNpYmxlXCIpO1xuICAgIH1cblxuICAgIHVuZG9CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaWYgKCFsYXN0UmVtb3ZlZFJvdykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGNvbnN0IHJvd3MgPSB0YWJsZUJvZHkuY2hpbGRyZW47XG4gICAgXG4gICAgICAgIC8vIFB1dCByb3cgYmFjayBpbiBpdHMgb3JpZ2luYWwgcG9zaXRpb25cbiAgICAgICAgaWYgKGxhc3RSZW1vdmVkSW5kZXggPj0gcm93cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRhYmxlQm9keS5hcHBlbmRDaGlsZChsYXN0UmVtb3ZlZFJvdyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YWJsZUJvZHkuaW5zZXJ0QmVmb3JlKGxhc3RSZW1vdmVkUm93LCByb3dzW2xhc3RSZW1vdmVkSW5kZXhdKTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBsYXN0UmVtb3ZlZFJvdyA9IG51bGw7XG4gICAgICAgIGxhc3RSZW1vdmVkSW5kZXggPSBudWxsO1xuICAgIFxuICAgICAgICB1bmRvQ29udGFpbmVyLmhpZGRlbiA9IHRydWU7XG4gICAgICAgIHVuZG9Db250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcInVuZG9Db250YWluZXJWaXNpYmxlXCIpO1xuICAgIFxuICAgICAgICBiaW5kUmVtb3ZlTGlua3MoKTtcbiAgICB9KTtcblxuICAgIGJpbmRSZW1vdmVMaW5rcygpO1xuXG4gICAgLy8gQWRkIG5ldyByb3dcbiAgICBhZGRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgY29uc3Qgcm93Q291bnQgPSB0YWJsZUJvZHkucXVlcnlTZWxlY3RvckFsbCgndHInKS5sZW5ndGggKyAxO1xuXG4gICAgICAgIGNvbnN0IG5ld1JvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG4gICAgICAgIG5ld1Jvdy5jbGFzc0xpc3QuYWRkKCduaHN1ay10YWJsZV9fcm93Jyk7XG5cbiAgICAgICAgbmV3Um93LmlubmVySFRNTCA9IGBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGxcIj5cbiAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJuaHN1ay1zZWxlY3QgbmhzdWstdS1mb250LXNpemUtMTRcIlxuICAgICAgICAgICAgICAgICAgICBpZD1cInNldHMtJHtyb3dDb3VudH1cIlxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwic2V0c1tdXCI+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlNlbGVjdCBhIGRhdGEgc2V0PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlNlcnZpY2UgaGlzdG9yeVwiPlNlcnZpY2UgaGlzdG9yeTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJFbXBsb3ltZW50XCI+RW1wbG95bWVudDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJTZXJ2aWNlIGdyb3Vwc1wiPlNlcnZpY2UgZ3JvdXBzPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkNvbnRzICYgVFBQXCI+Q29udHMgJiBUUFA8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiSG91cnMgaGlzdG9yeSBkZXRhaWxzXCI+SG91cnMgaGlzdG9yeSBkZXRhaWxzPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkxpbmtlZCBlbXBsb3ltZW50XCI+TGlua2VkIGVtcGxveW1lbnQ8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiQmFzaWMgbWVtYmVyIGRldGFpbHNcIj5CYXNpYyBtZW1iZXIgZGV0YWlsczwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidmlldy1kYXRhLXNldFwiIGhpZGRlbj5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzPVwibmhzdWstbGluayBuaHN1ay11LWZvbnQtc2l6ZS0xNCB2aWV3LWRhdGEtc2V0LWJ1dHRvblwiPlZpZXcgZGF0YSBzZXQ8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC90ZD5cbiAgICBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGxcIj5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm5oc3VrLWlucHV0IG5oc3VrLWlucHV0LS13aWR0aC0xMCBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiXG4gICAgICAgICAgICAgICAgICAgIGlkPVwiZmllbGRzLSR7cm93Q291bnR9XCJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cImZpZWxkc1tdXCJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIj5cbiAgICAgICAgPC90ZD5cbiAgICBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGxcIj5cbiAgICAgICAgICAgIDx0ZXh0YXJlYSByb3dzPVwiMVwiIGNsYXNzPVwibmhzdWstdGV4dGFyZWEgbmhzdWstdS1mb250LXNpemUtMTRcIlxuICAgICAgICAgICAgICAgICAgICBpZD1cImFtZW5kbWVudHMtJHtyb3dDb3VudH1cIlxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwiYW1lbmRtZW50c1tdXCI+PC90ZXh0YXJlYT5cbiAgICAgICAgPC90ZD5cbiAgICBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGwgIG5oc3VrLXUtZm9udC1zaXplLTE0XCI+XG4gICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJyZW1vdmUtcm93IG5oc3VrLWxpbmtcIj5cbiAgICAgICAgICAgIFJlbW92ZVxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPnJvdyAke3Jvd0NvdW50fTwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgICAgICA8L3RkPlxuICAgIGA7XG5cbiAgICAgICAgdGFibGVCb2R5LmFwcGVuZENoaWxkKG5ld1Jvdyk7XG4gICAgICAgIHVwZGF0ZURhdGFTZXRWaWV3Rm9yUm93KG5ld1Jvdyk7XG4gICAgICAgIGJpbmRSZW1vdmVMaW5rcygpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVwb3J0Rm9ybVwiKTtcbiAgICBjb25zdCBlcnJvclN1bW1hcnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yU3VtbWFyeVwiKTtcbiAgICBjb25zdCBlcnJvckxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yTGlzdFwiKTtcblxuICAgIGNvbnN0IHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXBvcnRUYWJsZVwiKTtcblxuICAgIGNvbnN0IGZpZWxkcyA9IFtcInNldHNbXVwiLCBcImZpZWxkc1tdXCIsIFwiYW1lbmRtZW50c1tdXCIsIFwicmVhc29uW11cIl07XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gU1VCTUlUIFZBTElEQVRJT05cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjbGVhckVycm9ycygpO1xuXG4gICAgICAgIGxldCBlcnJvcnMgPSBbXTtcbiAgICAgICAgbGV0IGZpcnN0RXJyb3JGaWVsZCA9IG51bGw7XG5cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIC8vIERFU0NSSVBUSU9OIFZBTElEQVRJT05cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAgIGNvbnN0IHJvd3MgPSB0YWJsZS5xdWVyeVNlbGVjdG9yQWxsKFwidGJvZHkgdHJcIik7XG5cbiAgICAgICAgcm93cy5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbnB1dHMgPSBnZXRSb3dJbnB1dHMocm93KTtcblxuICAgICAgICAgICAgY29uc3Qgcm93SGFzRGF0YSA9IGlucHV0cy5zb21lKGkgPT4gaS52YWx1ZS50cmltKCkgIT09IFwiXCIpO1xuXG4gICAgICAgICAgICAvLyBpZ25vcmUgZW1wdHkgcm93cyBjb21wbGV0ZWx5XG4gICAgICAgICAgICBpZiAoIXJvd0hhc0RhdGEpIHJldHVybjtcblxuICAgICAgICAgICAgaW5wdXRzLmZvckVhY2goKGlucHV0LCBjb2xJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBnZXRFcnJvck1lc3NhZ2UoY29sSW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFpbnB1dC52YWx1ZS50cmltKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3JJZCA9IGVuc3VyZUVycm9yKGlucHV0LCBtZXNzYWdlLCByb3dJbmRleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICBgPGxpPjxhIGhyZWY9XCIjJHtlcnJvcklkfVwiPiR7bWVzc2FnZX0gKHJvdyAke3Jvd0luZGV4ICsgMX0pPC9hPjwvbGk+YFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBpbnB1dDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIC8vIFNUQU5EQVJEIEZPUk0gRklFTERTIFZBTElEQVRJT05cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAgIGNvbnN0IG1lbWJlckVycm9yID0gdmFsaWRhdGVSZXF1aXJlZEZpZWxkKHtcbiAgICAgICAgICAgIGlucHV0SWQ6IFwibWVtYmVyc2hpcE51bWJlclwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJtZW1iZXJzaGlwTnVtYmVyR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwibWVtYmVyc2hpcE51bWJlci1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJFbnRlciB0aGUgbWVtYmVyIG51bWJlclwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIG1lbWJlckVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBtZW1iZXJFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGluaXRpYWxFcnJvciA9IHZhbGlkYXRlUmVxdWlyZWRGaWVsZCh7XG4gICAgICAgICAgICBpbnB1dElkOiBcIm1lbWJlckZpcnN0SW5pdGlhbFwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJtZW1iZXJGaXJzdEluaXRpYWxHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJtZW1iZXJGaXJzdEluaXRpYWwtZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiRW50ZXIgdGhlIG1lbWJlcnMgZmlyc3QgaW5pdGlhbFwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIGluaXRpYWxFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gaW5pdGlhbEVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3VybmFtZUVycm9yID0gdmFsaWRhdGVSZXF1aXJlZEZpZWxkKHtcbiAgICAgICAgICAgIGlucHV0SWQ6IFwibWVtYmVyU3VybmFtZVwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJtZW1iZXJTdXJuYW1lR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwibWVtYmVyU3VybmFtZS1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJFbnRlciB0aGUgbWVtYmVycyBzdXJuYW1lXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgc3VybmFtZUVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBzdXJuYW1lRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZWNvcmRUeXBlQ2hhbmdlRXJyb3IgPSB2YWxpZGF0ZVJhZGlvR3JvdXAoe1xuICAgICAgICAgICAgbmFtZTogXCJyZWNvcmRUeXBlQ2hhbmdlXCIsXG4gICAgICAgICAgICBncm91cElkOiBcInJlY29yZFR5cGVDaGFuZ2VHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJyZWNvcmRUeXBlQ2hhbmdlLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIlNlbGVjdCBhIHR5cGUgb2YgY2hhbmdlXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiByZWNvcmRUeXBlQ2hhbmdlRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IHJlY29yZFR5cGVDaGFuZ2VFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvcnJ1cHRlZEVycm9yID0gdmFsaWRhdGVSYWRpb0dyb3VwKHtcbiAgICAgICAgICAgIG5hbWU6IFwiY29ycnVwdGVkXCIsXG4gICAgICAgICAgICBncm91cElkOiBcImNvcnJ1cHRlZEdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcImNvcnJ1cHRlZC1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJTZWxlY3QgeWVzIGlmIHlvdXIgZmlsZSBoYXMgYmVlbiBjb3JydXB0ZWRcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIGNvcnJ1cHRlZEVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBjb3JydXB0ZWRFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBheW1lbnRFcnJvciA9IHZhbGlkYXRlUmFkaW9Hcm91cCh7XG4gICAgICAgICAgICBuYW1lOiBcInBheW1lbnRcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwicGF5bWVudEdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcInBheW1lbnQtZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiU2VsZWN0IHllcyBpZiBwYXltZW50IHdpbGwgYmUgYWZmZWN0ZWRcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIHBheW1lbnRFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gcGF5bWVudEVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAvLyBSRUFTT04gVEVYVEFSRUEgVkFMSURBVElPTlxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgICAgY29uc3QgcmVhc29uR3JvdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlzc3VlUmVhc29uXCIpO1xuICAgICAgICBjb25zdCByZWFzb25UZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXNzdWUtcmVhc29uXCIpO1xuXG4gICAgICAgIGlmICghcmVhc29uVGV4dGFyZWEudmFsdWUudHJpbSgpKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPVxuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPkVudGVyIHRoZSByZWFzb24gd2h5IHlvdSByZXF1aXJlIGFuIHVwZGF0ZSBmb3IgdGhpcyByZWNvcmQnO1xuXG4gICAgICAgICAgICAvLyBhZGQgTkhTIGVycm9yIHN0eWxpbmdcbiAgICAgICAgICAgIHJlYXNvbkdyb3VwLmNsYXNzTGlzdC5hZGQoXCJuaHN1ay1mb3JtLWdyb3VwLS1lcnJvclwiKTtcbiAgICAgICAgICAgIHJlYXNvblRleHRhcmVhLmNsYXNzTGlzdC5hZGQoXCJuaHN1ay10ZXh0YXJlYS0tZXJyb3JcIik7XG5cbiAgICAgICAgICAgIC8vIGNyZWF0ZSBlcnJvciBtZXNzYWdlIGlmIGl0IGRvZXNuJ3QgZXhpc3RcbiAgICAgICAgICAgIGxldCBlcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXNzdWUtcmVhc29uLWVycm9yXCIpO1xuXG4gICAgICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgICAgICBlcnJvci5pZCA9IFwiaXNzdWUtcmVhc29uLWVycm9yXCI7XG4gICAgICAgICAgICAgICAgZXJyb3IuY2xhc3NOYW1lID0gXCJuaHN1ay1lcnJvci1tZXNzYWdlXCI7XG4gICAgICAgICAgICAgICAgZXJyb3IuaW5uZXJIVE1MID0gbWVzc2FnZTtcblxuICAgICAgICAgICAgICAgIHJlYXNvblRleHRhcmVhLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVycm9yLCByZWFzb25UZXh0YXJlYSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGVuc3VyZSBjb3JyZWN0IG1lc3NhZ2UgdGV4dFxuICAgICAgICAgICAgZXJyb3IuaW5uZXJIVE1MID0gbWVzc2FnZTtcblxuICAgICAgICAgICAgLy8gYWNjZXNzaWJpbGl0eVxuICAgICAgICAgICAgcmVhc29uVGV4dGFyZWEuc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgICAgIFwiYXJpYS1kZXNjcmliZWRieVwiLFxuICAgICAgICAgICAgICAgIFwiaXNzdWUtcmVhc29uLWVycm9yXCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIGFkZCB0byBzdW1tYXJ5XG4gICAgICAgICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgICAgICAgICBgPGxpPjxhIGhyZWY9XCIjaXNzdWVSZWFzb25cIj5FbnRlciB0aGUgcmVhc29uIHdoeSB5b3UgcmVxdWlyZSBhbiB1cGRhdGUgZm9yIHRoaXMgcmVjb3JkPC9hPjwvbGk+YFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gZm9jdXMgZmlyc3QgaW52YWxpZCBmaWVsZFxuICAgICAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQpIHtcbiAgICAgICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSByZWFzb25UZXh0YXJlYTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAvLyBFTkQgUkVBU09OIFRFWFRBUkVBIFZBTElEQVRJT05cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAgIGNvbnN0IHNpdGVBdXRvRXJyb3IgPSB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICAgICAgaW5wdXRJZDogXCJzaXRlQXV0b1wiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJzaXRlQXV0b0dyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcInNpdGVBdXRvLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkVudGVyIHRoZSBzaXRlIHlvdSBhcmUgYmFzZWQgYXRcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBzaXRlQXV0b0Vycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBzaXRlQXV0b0Vycm9yO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zdCBkaXJlY3RvcmF0ZUVycm9yID0gdmFsaWRhdGVSZXF1aXJlZEZpZWxkKHtcbiAgICAgICAgICAgIGlucHV0SWQ6IFwiZGlyZWN0b3JhdGVcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwiZGlyZWN0b3JhdGVHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJkaXJlY3RvcmF0ZS1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJFbnRlciB5b3VyIGRpcmVjdG9yYXRlXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgZGlyZWN0b3JhdGVFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gZGlyZWN0b3JhdGVFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbnRhY3ROdW1iZXJFcnJvciA9IHZhbGlkYXRlUmVxdWlyZWRGaWVsZCh7XG4gICAgICAgICAgICBpbnB1dElkOiBcImNvbnRhY3ROdW1iZXJcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwiY29udGFjdE51bWJlckdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcImNvbnRhY3ROdW1iZXItZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiRW50ZXIgeW91ciBjb250YWN0IG51bWJlclwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIGNvbnRhY3ROdW1iZXJFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gY29udGFjdE51bWJlckVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBlcnJvckxpc3QuaW5uZXJIVE1MID0gZXJyb3JzLmpvaW4oXCJcIik7XG4gICAgICAgICAgICBlcnJvclN1bW1hcnkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcblxuICAgICAgICAgICAgZXJyb3JTdW1tYXJ5LnNjcm9sbEludG9WaWV3KHsgYmVoYXZpb3I6IFwic21vb3RoXCIgfSk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm0uc3VibWl0KCk7XG4gICAgfSk7XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gSEVMUEVSU1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGZ1bmN0aW9uIGdldFJvd0lucHV0cyhyb3cpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHJvdy5xdWVyeVNlbGVjdG9yKCdzZWxlY3RbbmFtZT1cInNldHNbXVwiXScpLFxuICAgICAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJmaWVsZHNbXVwiXScpLFxuICAgICAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhW25hbWU9XCJhbWVuZG1lbnRzW11cIl0nKSxcbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRFcnJvck1lc3NhZ2UoaW5kZXgpIHtcbiAgICAgICAgc3dpdGNoIChpbmRleCkge1xuICAgICAgICAgICAgY2FzZSAwOiBcbiAgICAgICAgICAgICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+RW50ZXIgdGhlIHNldCc7XG4gICAgICAgICAgICBjYXNlIDE6IFxuICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj5FbnRlciB0aGUgZmllbGQnO1xuICAgICAgICAgICAgY2FzZSAyOiBcbiAgICAgICAgICAgICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+RW50ZXIgdGhlIGFtZW5kbWVudCc7XG4gICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5zdXJlRXJyb3IoaW5wdXQsIG1lc3NhZ2UsIHJvd0luZGV4KSB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBpbnB1dC5jbG9zZXN0KFwidGRcIik7XG5cbiAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwibmhzdWstZm9ybS1ncm91cC0tZXJyb3JcIik7XG5cbiAgICAgICAgbGV0IGVycm9yID0gY2VsbC5xdWVyeVNlbGVjdG9yKFwiLm5oc3VrLWVycm9yLW1lc3NhZ2VcIik7XG5cbiAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgZXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgIGVycm9yLmNsYXNzTmFtZSA9IFwibmhzdWstZXJyb3ItbWVzc2FnZSBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiO1xuICAgICAgICAgICAgY2VsbC5pbnNlcnRCZWZvcmUoZXJyb3IsIGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVycm9yLmlubmVySFRNTCA9IG1lc3NhZ2U7XG5cbiAgICAgICAgY29uc3QgZXJyb3JJZCA9IGlucHV0LmlkIHx8IGByb3ctJHtyb3dJbmRleH0tJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyLCA3KX1gO1xuXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIiwgZXJyb3JJZCk7XG4gICAgICAgIGlucHV0LmlkID0gZXJyb3JJZDtcblxuICAgICAgICByZXR1cm4gZXJyb3JJZDtcbiAgICB9XG5cbiAgICAvLyBIZWxwZXIgZm9yIHRoZSB0ZXh0IGZpZWxkIHZhbGlkYXRpb25cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICBpbnB1dElkLFxuICAgICAgICBncm91cElkLFxuICAgICAgICBlcnJvcklkLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBlcnJvcnNcbiAgICB9KSB7XG4gICAgXG4gICAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW5wdXRJZCk7XG4gICAgICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZ3JvdXBJZCk7XG4gICAgXG4gICAgICAgIGlmICghaW5wdXQudmFsdWUudHJpbSgpKSB7XG4gICAgXG4gICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPVxuICAgICAgICAgICAgICAgIGA8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPiAke21lc3NhZ2V9YDtcbiAgICBcbiAgICAgICAgICAgIGdyb3VwLmNsYXNzTGlzdC5hZGQoXCJuaHN1ay1mb3JtLWdyb3VwLS1lcnJvclwiKTtcbiAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoXCJuaHN1ay1pbnB1dC0tZXJyb3JcIik7XG4gICAgXG4gICAgICAgICAgICBsZXQgZXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlcnJvcklkKTtcblxuICAgICAgICAgICAgY29uc3QgZm9ybUdyb3VwID0gaW5wdXQuY2xvc2VzdCgnLm5oc3VrLWZvcm0tZ3JvdXAnKTtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gZm9ybUdyb3VwPy5xdWVyeVNlbGVjdG9yKCcubmhzdWstbGFiZWwnKTtcblxuICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgICAgIGVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICAgICAgZXJyb3IuaWQgPSBlcnJvcklkO1xuICAgICAgICAgICAgICAgIGVycm9yLmNsYXNzTmFtZSA9IFwibmhzdWstZXJyb3ItbWVzc2FnZVwiO1xuXG4gICAgICAgICAgICAgICAgbGFiZWwuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdhZnRlcmVuZCcsIGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGVycm9yLmlubmVySFRNTCA9IGVycm9yTWVzc2FnZTtcbiAgICBcbiAgICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIiwgZXJyb3JJZCk7XG4gICAgXG4gICAgICAgICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgICAgICAgICBgPGxpPjxhIGhyZWY9XCIjJHtncm91cElkfVwiPiR7bWVzc2FnZX08L2E+PC9saT5gXG4gICAgICAgICAgICApO1xuICAgIFxuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGVscGVyIGZvciB0aGUgcmFkaW8gYnV0dG9uIHZhbGlkYXRpb25cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZVJhZGlvR3JvdXAoe1xuICAgICAgICBuYW1lLFxuICAgICAgICBncm91cElkLFxuICAgICAgICBlcnJvcklkLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBlcnJvcnNcbiAgICB9KSB7XG4gICAgXG4gICAgICAgIGNvbnN0IHJhZGlvcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICBgaW5wdXRbbmFtZT1cIiR7bmFtZX1cIl1gXG4gICAgICAgICk7XG4gICAgXG4gICAgICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZ3JvdXBJZCk7XG4gICAgXG4gICAgICAgIGNvbnN0IGNoZWNrZWQgPSBbLi4ucmFkaW9zXS5zb21lKHJhZGlvID0+IHJhZGlvLmNoZWNrZWQpO1xuICAgIFxuICAgICAgICBpZiAoIWNoZWNrZWQpIHtcbiAgICBcbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgYDxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+ICR7bWVzc2FnZX1gO1xuICAgIFxuICAgICAgICAgICAgZ3JvdXAuY2xhc3NMaXN0LmFkZChcIm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yXCIpO1xuICAgIFxuICAgICAgICAgICAgbGV0IGVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZXJyb3JJZCk7XG4gICAgXG4gICAgICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgXG4gICAgICAgICAgICAgICAgZXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICBcbiAgICAgICAgICAgICAgICBlcnJvci5pZCA9IGVycm9ySWQ7XG4gICAgICAgICAgICAgICAgZXJyb3IuY2xhc3NOYW1lID0gXCJuaHN1ay1lcnJvci1tZXNzYWdlXCI7XG4gICAgICAgICAgICAgICAgZXJyb3IuaW5uZXJIVE1MID0gZXJyb3JNZXNzYWdlO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZmllbGRzZXQgPSBncm91cC5xdWVyeVNlbGVjdG9yKFwiLm5oc3VrLWZpZWxkc2V0XCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJhZGlvcyA9IGZpZWxkc2V0LnF1ZXJ5U2VsZWN0b3IoXCIubmhzdWstcmFkaW9zXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZmllbGRzZXQuaW5zZXJ0QmVmb3JlKGVycm9yLCByYWRpb3MpO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgICAgICAgICAgYDxsaT48YSBocmVmPVwiIyR7cmFkaW9zWzBdLmlkfVwiPiR7bWVzc2FnZX08L2E+PC9saT5gXG4gICAgICAgICAgICApO1xuICAgIFxuICAgICAgICAgICAgcmFkaW9zWzBdLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgICAgICBcImFyaWEtZGVzY3JpYmVkYnlcIixcbiAgICAgICAgICAgICAgICBlcnJvcklkXG4gICAgICAgICAgICApO1xuICAgIFxuICAgICAgICAgICAgcmV0dXJuIHJhZGlvc1swXTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckVycm9ycygpIHtcbiAgICAgICAgZXJyb3JMaXN0LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIGVycm9yU3VtbWFyeS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uaHN1ay1mb3JtLWdyb3VwLS1lcnJvciwgLm5oc3VrLXRleHRhcmVhLS1lcnJvciwgLm5oc3VrLWlucHV0LS1lcnJvclwiKVxuICAgICAgICAgICAgLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZShcIm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yXCIsIFwibmhzdWstdGV4dGFyZWEtLWVycm9yXCIsIFwibmhzdWstaW5wdXQtLWVycm9yXCIpKTtcblxuICAgICAgICAvLyByZW1vdmUgdGFibGUtZ2VuZXJhdGVkIGVycm9ycyBvbmx5XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ZCAubmhzdWstZXJyb3ItbWVzc2FnZVwiKVxuICAgICAgICAgICAgLmZvckVhY2goZWwgPT4gZWwucmVtb3ZlKCkpO1xuXG4gICAgICAgIFtcbiAgICAgICAgICAgIFwibWVtYmVyc2hpcE51bWJlci1lcnJvclwiLFxuICAgICAgICAgICAgXCJtZW1iZXJGaXJzdEluaXRpYWwtZXJyb3JcIixcbiAgICAgICAgICAgIFwibWVtYmVyU3VybmFtZS1lcnJvclwiLFxuICAgICAgICAgICAgXCJyZWNvcmRUeXBlQ2hhbmdlLWVycm9yXCIsXG4gICAgICAgICAgICBcInNpdGVBdXRvLWVycm9yXCIsXG4gICAgICAgICAgICBcInBheW1lbnQtZXJyb3JcIixcbiAgICAgICAgICAgIFwiY29udGFjdE51bWJlci1lcnJvclwiLFxuICAgICAgICAgICAgXCJkaXJlY3RvcmF0ZS1lcnJvclwiXG4gICAgICAgIF0uZm9yRWFjaChpZCA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgXG4gICAgICAgICAgICBpZiAoZWwpIHtcbiAgICAgICAgICAgICAgICBlbC5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcmVtb3ZlIHRleHRhcmVhIGVycm9yIG1lc3NhZ2UgdGV4dFxuICAgICAgICBjb25zdCByZWFzb25FcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXNzdWUtcmVhc29uLWVycm9yXCIpO1xuXG4gICAgICAgIGlmIChyZWFzb25FcnJvcikge1xuICAgICAgICByZWFzb25FcnJvci5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICB9XG4gICAgfVxuXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQUEsU0FBUyxpQkFBaUIsb0JBQW9CLFdBQVk7QUFFdEQsUUFBTSxpQkFBaUI7QUFBQSxJQUNuQixtQkFBbUI7QUFBQSxJQUNuQixjQUFjO0FBQUEsSUFDZCxrQkFBa0I7QUFBQSxJQUNsQixlQUFlO0FBQUEsSUFDZix5QkFBeUI7QUFBQSxJQUN6QixxQkFBcUI7QUFBQSxJQUNyQix3QkFBd0I7QUFBQSxFQUM1QjtBQUVBLFdBQVMsd0JBQXdCLEtBQUs7QUFDbEMsVUFBTSxZQUFZLElBQUksY0FBYyx1QkFBdUI7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
