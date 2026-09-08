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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L3NkLXJlcG9ydC12My5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcblxuICAgIGNvbnN0IGRhdGFTZXREaWFsb2dzID0ge1xuICAgICAgICAnU2VydmljZSBoaXN0b3J5JzogJ3NlcnZpY2UtaGlzdG9yeS1kaWFsb2cnLFxuICAgICAgICAnRW1wbG95bWVudCc6ICdlbXBsb3ltZW50LWRpYWxvZycsXG4gICAgICAgICdTZXJ2aWNlIGdyb3Vwcyc6ICdzZXJ2aWNlLWdyb3Vwcy1kaWFsb2cnLFxuICAgICAgICAnQ29udHMgJiBUUFAnOiAnY29udHMtdHBwLWRpYWxvZycsXG4gICAgICAgICdIb3VycyBoaXN0b3J5IGRldGFpbHMnOiAnaG91cnMtaGlzdG9yeS1kaWFsb2cnLFxuICAgICAgICAnTGlua2VkIGVtcGxveW1lbnQnOiAnbGlua2VkLWVtcGxveW1lbnQtZGlhbG9nJyxcbiAgICAgICAgJ0Jhc2ljIG1lbWJlciBkZXRhaWxzJzogJ2Jhc2ljLW1lbWJlci1kZXRhaWxzLWRpYWxvZydcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlRGF0YVNldFZpZXdGb3JSb3cocm93KSB7XG4gICAgICAgIGNvbnN0IHNldFNlbGVjdCA9IHJvdy5xdWVyeVNlbGVjdG9yKCdzZWxlY3RbbmFtZT1cInNldHNbXVwiXScpO1xuICAgICAgICBjb25zdCBkYXRhU2V0VmlldyA9IHJvdy5xdWVyeVNlbGVjdG9yKCcudmlldy1kYXRhLXNldCcpO1xuICAgICAgICBjb25zdCBkYXRhU2V0QnV0dG9uID0gcm93LnF1ZXJ5U2VsZWN0b3IoJy52aWV3LWRhdGEtc2V0LWJ1dHRvbicpO1xuXG4gICAgICAgIGlmICghc2V0U2VsZWN0IHx8ICFkYXRhU2V0VmlldyB8fCAhZGF0YVNldEJ1dHRvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGlhbG9nSWQgPSBkYXRhU2V0RGlhbG9nc1tzZXRTZWxlY3QudmFsdWVdO1xuXG4gICAgICAgIGRhdGFTZXRWaWV3LmhpZGRlbiA9ICFkaWFsb2dJZDtcbiAgICAgICAgZGF0YVNldEJ1dHRvbi5kYXRhc2V0LmRpYWxvZ0lkID0gZGlhbG9nSWQgfHwgJyc7XG4gICAgICAgIGRhdGFTZXRCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgYFZpZXcgJHtzZXRTZWxlY3QudmFsdWV9IGRhdGEgc2V0YCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlQWxsRGF0YVNldFZpZXdzKCkge1xuICAgICAgICB0YWJsZUJvZHkucXVlcnlTZWxlY3RvckFsbCgndHInKS5mb3JFYWNoKHVwZGF0ZURhdGFTZXRWaWV3Rm9yUm93KTtcbiAgICB9XG5cbiAgICBjb25zdCB0YWJsZUJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVwb3J0VGFibGUgdGJvZHknKTtcbiAgICBjb25zdCBhZGRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkUm93QnV0dG9uJyk7XG4gICAgY29uc3QgdW5kb0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51bmRvUmVtb3ZhbENvbnRhaW5lcicpO1xuICAgIGNvbnN0IHVuZG9CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndW5kb1JlbW92YWxCdXR0b24nKTtcblxuICAgIGxldCBsYXN0UmVtb3ZlZFJvdyA9IG51bGw7XG4gICAgbGV0IGxhc3RSZW1vdmVkSW5kZXggPSBudWxsO1xuXG4gICAgLy8gUmVtb3ZlIHJvd1xuICAgIGZ1bmN0aW9uIGJpbmRSZW1vdmVMaW5rcygpIHtcbiAgICAgICAgdGFibGVCb2R5LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZW1vdmUtcm93JykuZm9yRWFjaChsaW5rID0+IHtcbiAgICAgICAgICAgIGxpbmsucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZW1vdmVIYW5kbGVyKTtcbiAgICAgICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZW1vdmVIYW5kbGVyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGFibGVCb2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCdzZWxlY3RbbmFtZT1cInNldHNbXVwiXScpKSB7XG4gICAgICAgICAgICB1cGRhdGVEYXRhU2V0Vmlld0ZvclJvdyhlLnRhcmdldC5jbG9zZXN0KCd0cicpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGFibGVCb2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc3QgZGF0YVNldEJ1dHRvbiA9IGUudGFyZ2V0LmNsb3Nlc3QoJy52aWV3LWRhdGEtc2V0LWJ1dHRvbicpO1xuXG4gICAgICAgIGlmICghZGF0YVNldEJ1dHRvbiB8fCAhdGFibGVCb2R5LmNvbnRhaW5zKGRhdGFTZXRCdXR0b24pKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG9wZW5EaWFsb2coXG4gICAgICAgICAgICBkYXRhU2V0QnV0dG9uLmRhdGFzZXQuZGlhbG9nSWQsXG4gICAgICAgICAgICBkYXRhU2V0QnV0dG9uLFxuICAgICAgICAgICAgYCR7ZGF0YVNldEJ1dHRvbi5kYXRhc2V0LmRpYWxvZ0lkfS1sYWJlbGBcbiAgICAgICAgKTtcbiAgICB9KTtcblxuICAgIHVwZGF0ZUFsbERhdGFTZXRWaWV3cygpO1xuXG4gICAgZnVuY3Rpb24gcmVtb3ZlSGFuZGxlcihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBcbiAgICAgICAgY29uc3Qgcm93ID0gZS50YXJnZXQuY2xvc2VzdCgndHInKTtcbiAgICBcbiAgICAgICAgLy8gR2V0IGFtZW5kbWVudCB0ZXh0IGJlZm9yZSByZW1vdmluZyByb3dcbiAgICAgICAgY29uc3QgYW1lbmRtZW50RmllbGQgPSByb3cucXVlcnlTZWxlY3RvcigndGV4dGFyZWFbbmFtZT1cImFtZW5kbWVudHNbXVwiXScpO1xuICAgICAgICBjb25zdCBhbWVuZG1lbnRUZXh0ID0gYW1lbmRtZW50RmllbGQgPyBhbWVuZG1lbnRGaWVsZC52YWx1ZSA6ICcnO1xuICAgIFxuICAgICAgICAvLyBTdG9yZSByb3cgYW5kIGl0cyBvcmlnaW5hbCBwb3NpdGlvblxuICAgICAgICBsYXN0UmVtb3ZlZFJvdyA9IHJvdztcbiAgICAgICAgbGFzdFJlbW92ZWRJbmRleCA9IEFycmF5LmZyb20odGFibGVCb2R5LmNoaWxkcmVuKS5pbmRleE9mKHJvdyk7XG4gICAgXG4gICAgICAgIHJvdy5yZW1vdmUoKTtcbiAgICBcbiAgICAgICAgcmVtb3ZlZEFtZW5kbWVudFRleHQudGV4dENvbnRlbnQgPSBhbWVuZG1lbnRUZXh0LnRyaW0oKSB8fCAnQmxhbmsgcm93JztcbiAgICAgICAgdW5kb0NvbnRhaW5lci5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgdW5kb0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwidW5kb0NvbnRhaW5lclZpc2libGVcIik7XG4gICAgfVxuXG4gICAgdW5kb0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpZiAoIWxhc3RSZW1vdmVkUm93KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgY29uc3Qgcm93cyA9IHRhYmxlQm9keS5jaGlsZHJlbjtcbiAgICBcbiAgICAgICAgLy8gUHV0IHJvdyBiYWNrIGluIGl0cyBvcmlnaW5hbCBwb3NpdGlvblxuICAgICAgICBpZiAobGFzdFJlbW92ZWRJbmRleCA+PSByb3dzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGFibGVCb2R5LmFwcGVuZENoaWxkKGxhc3RSZW1vdmVkUm93KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhYmxlQm9keS5pbnNlcnRCZWZvcmUobGFzdFJlbW92ZWRSb3csIHJvd3NbbGFzdFJlbW92ZWRJbmRleF0pO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGxhc3RSZW1vdmVkUm93ID0gbnVsbDtcbiAgICAgICAgbGFzdFJlbW92ZWRJbmRleCA9IG51bGw7XG4gICAgXG4gICAgICAgIHVuZG9Db250YWluZXIuaGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgdW5kb0NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwidW5kb0NvbnRhaW5lclZpc2libGVcIik7XG4gICAgXG4gICAgICAgIGJpbmRSZW1vdmVMaW5rcygpO1xuICAgIH0pO1xuXG4gICAgYmluZFJlbW92ZUxpbmtzKCk7XG5cbiAgICAvLyBBZGQgbmV3IHJvd1xuICAgIGFkZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBjb25zdCByb3dDb3VudCA9IHRhYmxlQm9keS5xdWVyeVNlbGVjdG9yQWxsKCd0cicpLmxlbmd0aCArIDE7XG5cbiAgICAgICAgY29uc3QgbmV3Um93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcbiAgICAgICAgbmV3Um93LmNsYXNzTGlzdC5hZGQoJ25oc3VrLXRhYmxlX19yb3cnKTtcblxuICAgICAgICBuZXdSb3cuaW5uZXJIVE1MID0gYFxuICAgICAgICA8dGQgY2xhc3M9XCJuaHN1ay10YWJsZV9fY2VsbFwiPlxuICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cIm5oc3VrLXNlbGVjdCBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiXG4gICAgICAgICAgICAgICAgICAgIGlkPVwic2V0cy0ke3Jvd0NvdW50fVwiXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJzZXRzW11cIj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+U2VsZWN0IGEgZGF0YSBzZXQ8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiU2VydmljZSBoaXN0b3J5XCI+U2VydmljZSBoaXN0b3J5PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkVtcGxveW1lbnRcIj5FbXBsb3ltZW50PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlNlcnZpY2UgZ3JvdXBzXCI+U2VydmljZSBncm91cHM8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiQ29udHMgJiBUUFBcIj5Db250cyAmIFRQUDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJIb3VycyBoaXN0b3J5IGRldGFpbHNcIj5Ib3VycyBoaXN0b3J5IGRldGFpbHM8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiTGlua2VkIGVtcGxveW1lbnRcIj5MaW5rZWQgZW1wbG95bWVudDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJCYXNpYyBtZW1iZXIgZGV0YWlsc1wiPkJhc2ljIG1lbWJlciBkZXRhaWxzPC9vcHRpb24+XG4gICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ2aWV3LWRhdGEtc2V0XCIgaGlkZGVuPlxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJuaHN1ay1saW5rIG5oc3VrLXUtZm9udC1zaXplLTE0IHZpZXctZGF0YS1zZXQtYnV0dG9uXCI+VmlldyBkYXRhIHNldDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3RkPlxuICAgIFxuICAgICAgICA8dGQgY2xhc3M9XCJuaHN1ay10YWJsZV9fY2VsbFwiPlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwibmhzdWstaW5wdXQgbmhzdWstaW5wdXQtLXdpZHRoLTEwIG5oc3VrLXUtZm9udC1zaXplLTE0XCJcbiAgICAgICAgICAgICAgICAgICAgaWQ9XCJmaWVsZHMtJHtyb3dDb3VudH1cIlxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwiZmllbGRzW11cIlxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiPlxuICAgICAgICA8L3RkPlxuICAgIFxuICAgICAgICA8dGQgY2xhc3M9XCJuaHN1ay10YWJsZV9fY2VsbFwiPlxuICAgICAgICAgICAgPHRleHRhcmVhIHJvd3M9XCIxXCIgY2xhc3M9XCJuaHN1ay10ZXh0YXJlYSBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiXG4gICAgICAgICAgICAgICAgICAgIGlkPVwiYW1lbmRtZW50cy0ke3Jvd0NvdW50fVwiXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJhbWVuZG1lbnRzW11cIj48L3RleHRhcmVhPlxuICAgICAgICA8L3RkPlxuICAgIFxuICAgICAgICA8dGQgY2xhc3M9XCJuaHN1ay10YWJsZV9fY2VsbCAgbmhzdWstdS1mb250LXNpemUtMTRcIj5cbiAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cInJlbW92ZS1yb3cgbmhzdWstbGlua1wiPlxuICAgICAgICAgICAgUmVtb3ZlXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+cm93ICR7cm93Q291bnR9PC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgICAgIDwvdGQ+XG4gICAgYDtcblxuICAgICAgICB0YWJsZUJvZHkuYXBwZW5kQ2hpbGQobmV3Um93KTtcbiAgICAgICAgdXBkYXRlRGF0YVNldFZpZXdGb3JSb3cobmV3Um93KTtcbiAgICAgICAgYmluZFJlbW92ZUxpbmtzKCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXBvcnRGb3JtXCIpO1xuICAgIGNvbnN0IGVycm9yU3VtbWFyeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JTdW1tYXJ5XCIpO1xuICAgIGNvbnN0IGVycm9yTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JMaXN0XCIpO1xuXG4gICAgY29uc3QgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlcG9ydFRhYmxlXCIpO1xuXG4gICAgY29uc3QgZmllbGRzID0gW1wic2V0c1tdXCIsIFwiZmllbGRzW11cIiwgXCJhbWVuZG1lbnRzW11cIiwgXCJyZWFzb25bXVwiXTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBTVUJNSVQgVkFMSURBVElPTlxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGNsZWFyRXJyb3JzKCk7XG5cbiAgICAgICAgbGV0IGVycm9ycyA9IFtdO1xuICAgICAgICBsZXQgZmlyc3RFcnJvckZpZWxkID0gbnVsbDtcblxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgLy8gREVTQ1JJUFRJT04gVkFMSURBVElPTlxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgICAgY29uc3Qgcm93cyA9IHRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0Ym9keSB0clwiKTtcblxuICAgICAgICByb3dzLmZvckVhY2goKHJvdywgcm93SW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlucHV0cyA9IGdldFJvd0lucHV0cyhyb3cpO1xuXG4gICAgICAgICAgICBjb25zdCByb3dIYXNEYXRhID0gaW5wdXRzLnNvbWUoaSA9PiBpLnZhbHVlLnRyaW0oKSAhPT0gXCJcIik7XG5cbiAgICAgICAgICAgIC8vIGlnbm9yZSBlbXB0eSByb3dzIGNvbXBsZXRlbHlcbiAgICAgICAgICAgIGlmICghcm93SGFzRGF0YSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBpbnB1dHMuZm9yRWFjaCgoaW5wdXQsIGNvbEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGdldEVycm9yTWVzc2FnZShjb2xJbmRleCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWlucHV0LnZhbHVlLnRyaW0oKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvcklkID0gZW5zdXJlRXJyb3IoaW5wdXQsIG1lc3NhZ2UsIHJvd0luZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgIGA8bGk+PGEgaHJlZj1cIiMke2Vycm9ySWR9XCI+JHttZXNzYWdlfSAocm93ICR7cm93SW5kZXggKyAxfSk8L2E+PC9saT5gXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IGlucHV0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgLy8gU1RBTkRBUkQgRk9STSBGSUVMRFMgVkFMSURBVElPTlxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgICAgY29uc3QgbWVtYmVyRXJyb3IgPSB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICAgICAgaW5wdXRJZDogXCJtZW1iZXJzaGlwTnVtYmVyXCIsXG4gICAgICAgICAgICBncm91cElkOiBcIm1lbWJlcnNoaXBOdW1iZXJHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJtZW1iZXJzaGlwTnVtYmVyLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkVudGVyIHRoZSBtZW1iZXIgbnVtYmVyXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgbWVtYmVyRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IG1lbWJlckVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaW5pdGlhbEVycm9yID0gdmFsaWRhdGVSZXF1aXJlZEZpZWxkKHtcbiAgICAgICAgICAgIGlucHV0SWQ6IFwibWVtYmVyRmlyc3RJbml0aWFsXCIsXG4gICAgICAgICAgICBncm91cElkOiBcIm1lbWJlckZpcnN0SW5pdGlhbEdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcIm1lbWJlckZpcnN0SW5pdGlhbC1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJFbnRlciB0aGUgbWVtYmVycyBmaXJzdCBpbml0aWFsXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgaW5pdGlhbEVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBpbml0aWFsRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdXJuYW1lRXJyb3IgPSB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICAgICAgaW5wdXRJZDogXCJtZW1iZXJTdXJuYW1lXCIsXG4gICAgICAgICAgICBncm91cElkOiBcIm1lbWJlclN1cm5hbWVHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJtZW1iZXJTdXJuYW1lLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkVudGVyIHRoZSBtZW1iZXJzIHN1cm5hbWVcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBzdXJuYW1lRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IHN1cm5hbWVFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlY29yZFR5cGVDaGFuZ2VFcnJvciA9IHZhbGlkYXRlUmFkaW9Hcm91cCh7XG4gICAgICAgICAgICBuYW1lOiBcInJlY29yZFR5cGVDaGFuZ2VcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwicmVjb3JkVHlwZUNoYW5nZUdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcInJlY29yZFR5cGVDaGFuZ2UtZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiU2VsZWN0IGEgdHlwZSBvZiBjaGFuZ2VcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIHJlY29yZFR5cGVDaGFuZ2VFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gcmVjb3JkVHlwZUNoYW5nZUVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29ycnVwdGVkRXJyb3IgPSB2YWxpZGF0ZVJhZGlvR3JvdXAoe1xuICAgICAgICAgICAgbmFtZTogXCJjb3JydXB0ZWRcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwiY29ycnVwdGVkR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwiY29ycnVwdGVkLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIlNlbGVjdCB5ZXMgaWYgeW91ciBmaWxlIGhhcyBiZWVuIGNvcnJ1cHRlZFwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgY29ycnVwdGVkRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IGNvcnJ1cHRlZEVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGF5bWVudEVycm9yID0gdmFsaWRhdGVSYWRpb0dyb3VwKHtcbiAgICAgICAgICAgIG5hbWU6IFwicGF5bWVudFwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJwYXltZW50R3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwicGF5bWVudC1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJTZWxlY3QgeWVzIGlmIHBheW1lbnQgd2lsbCBiZSBhZmZlY3RlZFwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgcGF5bWVudEVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBwYXltZW50RXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIC8vIFJFQVNPTiBURVhUQVJFQSBWQUxJREFUSU9OXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgICBjb25zdCByZWFzb25Hcm91cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXNzdWVSZWFzb25cIik7XG4gICAgICAgIGNvbnN0IHJlYXNvblRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpc3N1ZS1yZWFzb25cIik7XG5cbiAgICAgICAgaWYgKCFyZWFzb25UZXh0YXJlYS52YWx1ZS50cmltKCkpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+RW50ZXIgdGhlIHJlYXNvbiB3aHkgeW91IHJlcXVpcmUgYW4gdXBkYXRlIGZvciB0aGlzIHJlY29yZCc7XG5cbiAgICAgICAgICAgIC8vIGFkZCBOSFMgZXJyb3Igc3R5bGluZ1xuICAgICAgICAgICAgcmVhc29uR3JvdXAuY2xhc3NMaXN0LmFkZChcIm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yXCIpO1xuICAgICAgICAgICAgcmVhc29uVGV4dGFyZWEuY2xhc3NMaXN0LmFkZChcIm5oc3VrLXRleHRhcmVhLS1lcnJvclwiKTtcblxuICAgICAgICAgICAgLy8gY3JlYXRlIGVycm9yIG1lc3NhZ2UgaWYgaXQgZG9lc24ndCBleGlzdFxuICAgICAgICAgICAgbGV0IGVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpc3N1ZS1yZWFzb24tZXJyb3JcIik7XG5cbiAgICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBlcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgICAgIGVycm9yLmlkID0gXCJpc3N1ZS1yZWFzb24tZXJyb3JcIjtcbiAgICAgICAgICAgICAgICBlcnJvci5jbGFzc05hbWUgPSBcIm5oc3VrLWVycm9yLW1lc3NhZ2VcIjtcbiAgICAgICAgICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBtZXNzYWdlO1xuXG4gICAgICAgICAgICAgICAgcmVhc29uVGV4dGFyZWEucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZXJyb3IsIHJlYXNvblRleHRhcmVhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZW5zdXJlIGNvcnJlY3QgbWVzc2FnZSB0ZXh0XG4gICAgICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBtZXNzYWdlO1xuXG4gICAgICAgICAgICAvLyBhY2Nlc3NpYmlsaXR5XG4gICAgICAgICAgICByZWFzb25UZXh0YXJlYS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgXCJhcmlhLWRlc2NyaWJlZGJ5XCIsXG4gICAgICAgICAgICAgICAgXCJpc3N1ZS1yZWFzb24tZXJyb3JcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gYWRkIHRvIHN1bW1hcnlcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICAgICAgICAgIGA8bGk+PGEgaHJlZj1cIiNpc3N1ZVJlYXNvblwiPkVudGVyIHRoZSByZWFzb24gd2h5IHlvdSByZXF1aXJlIGFuIHVwZGF0ZSBmb3IgdGhpcyByZWNvcmQ8L2E+PC9saT5gXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyBmb2N1cyBmaXJzdCBpbnZhbGlkIGZpZWxkXG4gICAgICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCkge1xuICAgICAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IHJlYXNvblRleHRhcmVhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIC8vIEVORCBSRUFTT04gVEVYVEFSRUEgVkFMSURBVElPTlxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgICAgY29uc3Qgc2l0ZUF1dG9FcnJvciA9IHZhbGlkYXRlUmVxdWlyZWRGaWVsZCh7XG4gICAgICAgICAgICBpbnB1dElkOiBcInNpdGVBdXRvXCIsXG4gICAgICAgICAgICBncm91cElkOiBcInNpdGVBdXRvR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwic2l0ZUF1dG8tZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiRW50ZXIgdGhlIHNpdGUgeW91IGFyZSBiYXNlZCBhdFwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIHNpdGVBdXRvRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IHNpdGVBdXRvRXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGRpcmVjdG9yYXRlRXJyb3IgPSB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICAgICAgaW5wdXRJZDogXCJkaXJlY3RvcmF0ZVwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJkaXJlY3RvcmF0ZUdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcImRpcmVjdG9yYXRlLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkVudGVyIHlvdXIgZGlyZWN0b3JhdGVcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBkaXJlY3RvcmF0ZUVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBkaXJlY3RvcmF0ZUVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29udGFjdE51bWJlckVycm9yID0gdmFsaWRhdGVSZXF1aXJlZEZpZWxkKHtcbiAgICAgICAgICAgIGlucHV0SWQ6IFwiY29udGFjdE51bWJlclwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJjb250YWN0TnVtYmVyR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwiY29udGFjdE51bWJlci1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJFbnRlciB5b3VyIGNvbnRhY3QgbnVtYmVyXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgY29udGFjdE51bWJlckVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBjb250YWN0TnVtYmVyRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGVycm9yTGlzdC5pbm5lckhUTUwgPSBlcnJvcnMuam9pbihcIlwiKTtcbiAgICAgICAgICAgIGVycm9yU3VtbWFyeS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXG4gICAgICAgICAgICBlcnJvclN1bW1hcnkuc2Nyb2xsSW50b1ZpZXcoeyBiZWhhdmlvcjogXCJzbW9vdGhcIiB9KTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybS5zdWJtaXQoKTtcbiAgICB9KTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBIRUxQRVJTXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZnVuY3Rpb24gZ2V0Um93SW5wdXRzKHJvdykge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdFtuYW1lPVwic2V0c1tdXCJdJyksXG4gICAgICAgICAgICByb3cucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImZpZWxkc1tdXCJdJyksXG4gICAgICAgICAgICByb3cucXVlcnlTZWxlY3RvcigndGV4dGFyZWFbbmFtZT1cImFtZW5kbWVudHNbXVwiXScpLFxuICAgICAgICBdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEVycm9yTWVzc2FnZShpbmRleCkge1xuICAgICAgICBzd2l0Y2ggKGluZGV4KSB7XG4gICAgICAgICAgICBjYXNlIDA6IFxuICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj5FbnRlciB0aGUgc2V0JztcbiAgICAgICAgICAgIGNhc2UgMTogXG4gICAgICAgICAgICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPkVudGVyIHRoZSBmaWVsZCc7XG4gICAgICAgICAgICBjYXNlIDI6IFxuICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj5FbnRlciB0aGUgYW1lbmRtZW50JztcbiAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZCc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbnN1cmVFcnJvcihpbnB1dCwgbWVzc2FnZSwgcm93SW5kZXgpIHtcbiAgICAgICAgY29uc3QgY2VsbCA9IGlucHV0LmNsb3Nlc3QoXCJ0ZFwiKTtcblxuICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJuaHN1ay1mb3JtLWdyb3VwLS1lcnJvclwiKTtcblxuICAgICAgICBsZXQgZXJyb3IgPSBjZWxsLnF1ZXJ5U2VsZWN0b3IoXCIubmhzdWstZXJyb3ItbWVzc2FnZVwiKTtcblxuICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgICBlcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgZXJyb3IuY2xhc3NOYW1lID0gXCJuaHN1ay1lcnJvci1tZXNzYWdlIG5oc3VrLXUtZm9udC1zaXplLTE0XCI7XG4gICAgICAgICAgICBjZWxsLmluc2VydEJlZm9yZShlcnJvciwgaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXJyb3IuaW5uZXJIVE1MID0gbWVzc2FnZTtcblxuICAgICAgICBjb25zdCBlcnJvcklkID0gaW5wdXQuaWQgfHwgYHJvdy0ke3Jvd0luZGV4fS0ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIsIDcpfWA7XG5cbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiYXJpYS1kZXNjcmliZWRieVwiLCBlcnJvcklkKTtcbiAgICAgICAgaW5wdXQuaWQgPSBlcnJvcklkO1xuXG4gICAgICAgIHJldHVybiBlcnJvcklkO1xuICAgIH1cblxuICAgIC8vIEhlbHBlciBmb3IgdGhlIHRleHQgZmllbGQgdmFsaWRhdGlvblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlUmVxdWlyZWRGaWVsZCh7XG4gICAgICAgIGlucHV0SWQsXG4gICAgICAgIGdyb3VwSWQsXG4gICAgICAgIGVycm9ySWQsXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIGVycm9yc1xuICAgIH0pIHtcbiAgICBcbiAgICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbnB1dElkKTtcbiAgICAgICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChncm91cElkKTtcbiAgICBcbiAgICAgICAgaWYgKCFpbnB1dC52YWx1ZS50cmltKCkpIHtcbiAgICBcbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgYDxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+ICR7bWVzc2FnZX1gO1xuICAgIFxuICAgICAgICAgICAgZ3JvdXAuY2xhc3NMaXN0LmFkZChcIm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yXCIpO1xuICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZChcIm5oc3VrLWlucHV0LS1lcnJvclwiKTtcbiAgICBcbiAgICAgICAgICAgIGxldCBlcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVycm9ySWQpO1xuXG4gICAgICAgICAgICBjb25zdCBmb3JtR3JvdXAgPSBpbnB1dC5jbG9zZXN0KCcubmhzdWstZm9ybS1ncm91cCcpO1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSBmb3JtR3JvdXA/LnF1ZXJ5U2VsZWN0b3IoJy5uaHN1ay1sYWJlbCcpO1xuXG4gICAgICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgICAgICBlcnJvci5pZCA9IGVycm9ySWQ7XG4gICAgICAgICAgICAgICAgZXJyb3IuY2xhc3NOYW1lID0gXCJuaHN1ay1lcnJvci1tZXNzYWdlXCI7XG5cbiAgICAgICAgICAgICAgICBsYWJlbC5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyZW5kJywgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgZXJyb3IuaW5uZXJIVE1MID0gZXJyb3JNZXNzYWdlO1xuICAgIFxuICAgICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiYXJpYS1kZXNjcmliZWRieVwiLCBlcnJvcklkKTtcbiAgICBcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICAgICAgICAgIGA8bGk+PGEgaHJlZj1cIiMke2dyb3VwSWR9XCI+JHttZXNzYWdlfTwvYT48L2xpPmBcbiAgICAgICAgICAgICk7XG4gICAgXG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIZWxwZXIgZm9yIHRoZSByYWRpbyBidXR0b24gdmFsaWRhdGlvblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlUmFkaW9Hcm91cCh7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIGdyb3VwSWQsXG4gICAgICAgIGVycm9ySWQsXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIGVycm9yc1xuICAgIH0pIHtcbiAgICBcbiAgICAgICAgY29uc3QgcmFkaW9zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgIGBpbnB1dFtuYW1lPVwiJHtuYW1lfVwiXWBcbiAgICAgICAgKTtcbiAgICBcbiAgICAgICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChncm91cElkKTtcbiAgICBcbiAgICAgICAgY29uc3QgY2hlY2tlZCA9IFsuLi5yYWRpb3NdLnNvbWUocmFkaW8gPT4gcmFkaW8uY2hlY2tlZCk7XG4gICAgXG4gICAgICAgIGlmICghY2hlY2tlZCkge1xuICAgIFxuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID1cbiAgICAgICAgICAgICAgICBgPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj4gJHttZXNzYWdlfWA7XG4gICAgXG4gICAgICAgICAgICBncm91cC5jbGFzc0xpc3QuYWRkKFwibmhzdWstZm9ybS1ncm91cC0tZXJyb3JcIik7XG4gICAgXG4gICAgICAgICAgICBsZXQgZXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlcnJvcklkKTtcbiAgICBcbiAgICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICBcbiAgICAgICAgICAgICAgICBlcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIFxuICAgICAgICAgICAgICAgIGVycm9yLmlkID0gZXJyb3JJZDtcbiAgICAgICAgICAgICAgICBlcnJvci5jbGFzc05hbWUgPSBcIm5oc3VrLWVycm9yLW1lc3NhZ2VcIjtcbiAgICAgICAgICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBlcnJvck1lc3NhZ2U7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBmaWVsZHNldCA9IGdyb3VwLnF1ZXJ5U2VsZWN0b3IoXCIubmhzdWstZmllbGRzZXRcIik7XG4gICAgICAgICAgICAgICAgY29uc3QgcmFkaW9zID0gZmllbGRzZXQucXVlcnlTZWxlY3RvcihcIi5uaHN1ay1yYWRpb3NcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBmaWVsZHNldC5pbnNlcnRCZWZvcmUoZXJyb3IsIHJhZGlvcyk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgICAgICAgICBgPGxpPjxhIGhyZWY9XCIjJHtyYWRpb3NbMF0uaWR9XCI+JHttZXNzYWdlfTwvYT48L2xpPmBcbiAgICAgICAgICAgICk7XG4gICAgXG4gICAgICAgICAgICByYWRpb3NbMF0uc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgICAgIFwiYXJpYS1kZXNjcmliZWRieVwiLFxuICAgICAgICAgICAgICAgIGVycm9ySWRcbiAgICAgICAgICAgICk7XG4gICAgXG4gICAgICAgICAgICByZXR1cm4gcmFkaW9zWzBdO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyRXJyb3JzKCkge1xuICAgICAgICBlcnJvckxpc3QuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgZXJyb3JTdW1tYXJ5LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yLCAubmhzdWstdGV4dGFyZWEtLWVycm9yLCAubmhzdWstaW5wdXQtLWVycm9yXCIpXG4gICAgICAgICAgICAuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKFwibmhzdWstZm9ybS1ncm91cC0tZXJyb3JcIiwgXCJuaHN1ay10ZXh0YXJlYS0tZXJyb3JcIiwgXCJuaHN1ay1pbnB1dC0tZXJyb3JcIikpO1xuXG4gICAgICAgIC8vIHJlbW92ZSB0YWJsZS1nZW5lcmF0ZWQgZXJyb3JzIG9ubHlcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInRkIC5uaHN1ay1lcnJvci1tZXNzYWdlXCIpXG4gICAgICAgICAgICAuZm9yRWFjaChlbCA9PiBlbC5yZW1vdmUoKSk7XG5cbiAgICAgICAgW1xuICAgICAgICAgICAgXCJtZW1iZXJzaGlwTnVtYmVyLWVycm9yXCIsXG4gICAgICAgICAgICBcIm1lbWJlckZpcnN0SW5pdGlhbC1lcnJvclwiLFxuICAgICAgICAgICAgXCJtZW1iZXJTdXJuYW1lLWVycm9yXCIsXG4gICAgICAgICAgICBcInJlY29yZFR5cGVDaGFuZ2UtZXJyb3JcIixcbiAgICAgICAgICAgIFwic2l0ZUF1dG8tZXJyb3JcIixcbiAgICAgICAgICAgIFwicGF5bWVudC1lcnJvclwiLFxuICAgICAgICAgICAgXCJjb250YWN0TnVtYmVyLWVycm9yXCIsXG4gICAgICAgICAgICBcImRpcmVjdG9yYXRlLWVycm9yXCJcbiAgICAgICAgXS5mb3JFYWNoKGlkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICBcbiAgICAgICAgICAgIGlmIChlbCkge1xuICAgICAgICAgICAgICAgIGVsLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyByZW1vdmUgdGV4dGFyZWEgZXJyb3IgbWVzc2FnZSB0ZXh0XG4gICAgICAgIGNvbnN0IHJlYXNvbkVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpc3N1ZS1yZWFzb24tZXJyb3JcIik7XG5cbiAgICAgICAgaWYgKHJlYXNvbkVycm9yKSB7XG4gICAgICAgIHJlYXNvbkVycm9yLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxTQUFTLGlCQUFpQixvQkFBb0IsV0FBWTtBQUV0RCxRQUFNLGlCQUFpQjtBQUFBLElBQ25CLG1CQUFtQjtBQUFBLElBQ25CLGNBQWM7QUFBQSxJQUNkLGtCQUFrQjtBQUFBLElBQ2xCLGVBQWU7QUFBQSxJQUNmLHlCQUF5QjtBQUFBLElBQ3pCLHFCQUFxQjtBQUFBLElBQ3JCLHdCQUF3QjtBQUFBLEVBQzVCO0FBRUEsV0FBUyx3QkFBd0IsS0FBSztBQUNsQyxVQUFNLFlBQVksSUFBSSxjQUFjLHVCQUF1QjtBQUMzRCxVQUFNLGNBQWMsSUFBSSxjQUFjLGdCQUFnQjtBQUN0RCxVQUFNLGdCQUFnQixJQUFJLGNBQWMsdUJBQXVCO0FBRS9ELFFBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLGVBQWU7QUFDOUM7QUFBQSxJQUNKO0FBRUEsVUFBTSxXQUFXLGVBQWUsVUFBVSxLQUFLO0FBRS9DLGdCQUFZLFNBQVMsQ0FBQztBQUN0QixrQkFBYyxRQUFRLFdBQVcsWUFBWTtBQUM3QyxrQkFBYyxhQUFhLGNBQWMsUUFBUSxVQUFVLEtBQUssV0FBVztBQUFBLEVBQy9FO0FBRUEsV0FBUyx3QkFBd0I7QUFDN0IsY0FBVSxpQkFBaUIs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
