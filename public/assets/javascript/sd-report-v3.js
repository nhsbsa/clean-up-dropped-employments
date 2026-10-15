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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L3NkLXJlcG9ydC12My5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcblxuICAgIGNvbnN0IGRhdGFTZXREaWFsb2dzID0ge1xuICAgICAgICAnU2VydmljZSBoaXN0b3J5JzogJ3NlcnZpY2UtaGlzdG9yeS1kaWFsb2cnLFxuICAgICAgICAnRW1wbG95bWVudCc6ICdlbXBsb3ltZW50LWRpYWxvZycsXG4gICAgICAgICdTZXJ2aWNlIGdyb3Vwcyc6ICdzZXJ2aWNlLWdyb3Vwcy1kaWFsb2cnLFxuICAgICAgICAnQ29udHMgJiBUUFAnOiAnY29udHMtdHBwLWRpYWxvZycsXG4gICAgICAgICdIb3VycyBoaXN0b3J5IGRldGFpbHMnOiAnaG91cnMtaGlzdG9yeS1kaWFsb2cnLFxuICAgICAgICAnTGlua2VkIGVtcGxveW1lbnQnOiAnbGlua2VkLWVtcGxveW1lbnQtZGlhbG9nJyxcbiAgICAgICAgJ0Jhc2ljIG1lbWJlciBkZXRhaWxzJzogJ2Jhc2ljLW1lbWJlci1kZXRhaWxzLWRpYWxvZydcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlRGF0YVNldFZpZXdGb3JSb3cocm93KSB7XG4gICAgICAgIGNvbnN0IHNldFNlbGVjdCA9IHJvdy5xdWVyeVNlbGVjdG9yKCdzZWxlY3RbbmFtZT1cInNldHNbXVwiXScpO1xuICAgICAgICBjb25zdCBkYXRhU2V0VmlldyA9IHJvdy5xdWVyeVNlbGVjdG9yKCcudmlldy1kYXRhLXNldCcpO1xuICAgICAgICBjb25zdCBkYXRhU2V0QnV0dG9uID0gcm93LnF1ZXJ5U2VsZWN0b3IoJy52aWV3LWRhdGEtc2V0LWJ1dHRvbicpO1xuXG4gICAgICAgIGlmICghc2V0U2VsZWN0IHx8ICFkYXRhU2V0VmlldyB8fCAhZGF0YVNldEJ1dHRvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGlhbG9nSWQgPSBkYXRhU2V0RGlhbG9nc1tzZXRTZWxlY3QudmFsdWVdO1xuXG4gICAgICAgIGRhdGFTZXRWaWV3LmhpZGRlbiA9ICFkaWFsb2dJZDtcbiAgICAgICAgZGF0YVNldEJ1dHRvbi5kYXRhc2V0LmRpYWxvZ0lkID0gZGlhbG9nSWQgfHwgJyc7XG4gICAgICAgIGRhdGFTZXRCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgYFZpZXcgJHtzZXRTZWxlY3QudmFsdWV9IGRhdGEgc2V0YCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlQWxsRGF0YVNldFZpZXdzKCkge1xuICAgICAgICB0YWJsZUJvZHkucXVlcnlTZWxlY3RvckFsbCgndHInKS5mb3JFYWNoKHVwZGF0ZURhdGFTZXRWaWV3Rm9yUm93KTtcbiAgICB9XG5cbiAgICBjb25zdCB0YWJsZUJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVwb3J0VGFibGUgdGJvZHknKTtcbiAgICBjb25zdCBhZGRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkUm93QnV0dG9uJyk7XG4gICAgY29uc3QgdW5kb0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51bmRvUmVtb3ZhbENvbnRhaW5lcicpO1xuICAgIGNvbnN0IHVuZG9CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndW5kb1JlbW92YWxCdXR0b24nKTtcblxuICAgIGxldCBsYXN0UmVtb3ZlZFJvdyA9IG51bGw7XG4gICAgbGV0IGxhc3RSZW1vdmVkSW5kZXggPSBudWxsO1xuXG4gICAgLy8gUmVtb3ZlIHJvd1xuICAgIGZ1bmN0aW9uIGJpbmRSZW1vdmVMaW5rcygpIHtcbiAgICAgICAgdGFibGVCb2R5LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZW1vdmUtcm93JykuZm9yRWFjaChsaW5rID0+IHtcbiAgICAgICAgICAgIGxpbmsucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZW1vdmVIYW5kbGVyKTtcbiAgICAgICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZW1vdmVIYW5kbGVyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGFibGVCb2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCdzZWxlY3RbbmFtZT1cInNldHNbXVwiXScpKSB7XG4gICAgICAgICAgICB1cGRhdGVEYXRhU2V0Vmlld0ZvclJvdyhlLnRhcmdldC5jbG9zZXN0KCd0cicpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGFibGVCb2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc3QgZGF0YVNldEJ1dHRvbiA9IGUudGFyZ2V0LmNsb3Nlc3QoJy52aWV3LWRhdGEtc2V0LWJ1dHRvbicpO1xuXG4gICAgICAgIGlmICghZGF0YVNldEJ1dHRvbiB8fCAhdGFibGVCb2R5LmNvbnRhaW5zKGRhdGFTZXRCdXR0b24pKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG9wZW5EaWFsb2coXG4gICAgICAgICAgICBkYXRhU2V0QnV0dG9uLmRhdGFzZXQuZGlhbG9nSWQsXG4gICAgICAgICAgICBkYXRhU2V0QnV0dG9uLFxuICAgICAgICAgICAgYCR7ZGF0YVNldEJ1dHRvbi5kYXRhc2V0LmRpYWxvZ0lkfS1sYWJlbGBcbiAgICAgICAgKTtcbiAgICB9KTtcblxuICAgIHVwZGF0ZUFsbERhdGFTZXRWaWV3cygpO1xuXG4gICAgZnVuY3Rpb24gcmVtb3ZlSGFuZGxlcihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBcbiAgICAgICAgY29uc3Qgcm93ID0gZS50YXJnZXQuY2xvc2VzdCgndHInKTtcbiAgICBcbiAgICAgICAgLy8gR2V0IGFtZW5kbWVudCB0ZXh0IGJlZm9yZSByZW1vdmluZyByb3dcbiAgICAgICAgY29uc3QgYW1lbmRtZW50RmllbGQgPSByb3cucXVlcnlTZWxlY3RvcigndGV4dGFyZWFbbmFtZT1cImFtZW5kbWVudHNbXVwiXScpO1xuICAgICAgICBjb25zdCBhbWVuZG1lbnRUZXh0ID0gYW1lbmRtZW50RmllbGQgPyBhbWVuZG1lbnRGaWVsZC52YWx1ZSA6ICcnO1xuXG4gICAgICAgIGNvbnN0IGhhc0NvbnRlbnQgPSBBcnJheS5mcm9tKHJvdy5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCwgc2VsZWN0LCB0ZXh0YXJlYScpKVxuICAgICAgICAgICAgLnNvbWUoZmllbGQgPT4gZmllbGQudmFsdWUudHJpbSgpICE9PSAnJyk7XG5cbiAgICAgICAgLy8gQmxhbmsgcm93cyBhcmUgZGVsZXRlZCB3aXRob3V0IG9mZmVyaW5nIHVuZG9cbiAgICAgICAgaWYgKCFoYXNDb250ZW50KSB7XG4gICAgICAgICAgICByb3cucmVtb3ZlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgLy8gU3RvcmUgcm93IGFuZCBpdHMgb3JpZ2luYWwgcG9zaXRpb25cbiAgICAgICAgbGFzdFJlbW92ZWRSb3cgPSByb3c7XG4gICAgICAgIGxhc3RSZW1vdmVkSW5kZXggPSBBcnJheS5mcm9tKHRhYmxlQm9keS5jaGlsZHJlbikuaW5kZXhPZihyb3cpO1xuICAgIFxuICAgICAgICByb3cucmVtb3ZlKCk7XG4gICAgXG4gICAgICAgIHJlbW92ZWRBbWVuZG1lbnRUZXh0LnRleHRDb250ZW50ID0gYW1lbmRtZW50VGV4dC50cmltKCkgfHwgJ0JsYW5rIHJvdyc7XG4gICAgICAgIHVuZG9Db250YWluZXIuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIHVuZG9Db250YWluZXIuY2xhc3NMaXN0LmFkZChcInVuZG9Db250YWluZXJWaXNpYmxlXCIpO1xuICAgIH1cblxuICAgIHVuZG9CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaWYgKCFsYXN0UmVtb3ZlZFJvdykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGNvbnN0IHJvd3MgPSB0YWJsZUJvZHkuY2hpbGRyZW47XG4gICAgXG4gICAgICAgIC8vIFB1dCByb3cgYmFjayBpbiBpdHMgb3JpZ2luYWwgcG9zaXRpb25cbiAgICAgICAgaWYgKGxhc3RSZW1vdmVkSW5kZXggPj0gcm93cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRhYmxlQm9keS5hcHBlbmRDaGlsZChsYXN0UmVtb3ZlZFJvdyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YWJsZUJvZHkuaW5zZXJ0QmVmb3JlKGxhc3RSZW1vdmVkUm93LCByb3dzW2xhc3RSZW1vdmVkSW5kZXhdKTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBsYXN0UmVtb3ZlZFJvdyA9IG51bGw7XG4gICAgICAgIGxhc3RSZW1vdmVkSW5kZXggPSBudWxsO1xuICAgIFxuICAgICAgICB1bmRvQ29udGFpbmVyLmhpZGRlbiA9IHRydWU7XG4gICAgICAgIHVuZG9Db250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcInVuZG9Db250YWluZXJWaXNpYmxlXCIpO1xuICAgIFxuICAgICAgICBiaW5kUmVtb3ZlTGlua3MoKTtcbiAgICB9KTtcblxuICAgIGJpbmRSZW1vdmVMaW5rcygpO1xuXG4gICAgLy8gQWRkIG5ldyByb3dcbiAgICBhZGRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgY29uc3Qgcm93Q291bnQgPSB0YWJsZUJvZHkucXVlcnlTZWxlY3RvckFsbCgndHInKS5sZW5ndGggKyAxO1xuXG4gICAgICAgIGNvbnN0IG5ld1JvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG4gICAgICAgIG5ld1Jvdy5jbGFzc0xpc3QuYWRkKCduaHN1ay10YWJsZV9fcm93Jyk7XG5cbiAgICAgICAgbmV3Um93LmlubmVySFRNTCA9IGBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGxcIj5cbiAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJuaHN1ay1zZWxlY3QgbmhzdWstdS1mb250LXNpemUtMTRcIlxuICAgICAgICAgICAgICAgICAgICBpZD1cInNldHMtJHtyb3dDb3VudH1cIlxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwic2V0c1tdXCI+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlNlbGVjdCBhIGRhdGEgc2V0PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlNlcnZpY2UgaGlzdG9yeVwiPlNlcnZpY2UgaGlzdG9yeTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJFbXBsb3ltZW50XCI+RW1wbG95bWVudDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJTZXJ2aWNlIGdyb3Vwc1wiPlNlcnZpY2UgZ3JvdXBzPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkNvbnRzICYgVFBQXCI+Q29udHMgJiBUUFA8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiSG91cnMgaGlzdG9yeSBkZXRhaWxzXCI+SG91cnMgaGlzdG9yeSBkZXRhaWxzPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkxpbmtlZCBlbXBsb3ltZW50XCI+TGlua2VkIGVtcGxveW1lbnQ8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiQmFzaWMgbWVtYmVyIGRldGFpbHNcIj5CYXNpYyBtZW1iZXIgZGV0YWlsczwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidmlldy1kYXRhLXNldFwiIGhpZGRlbj5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzPVwibmhzdWstbGluayBuaHN1ay11LWZvbnQtc2l6ZS0xNCB2aWV3LWRhdGEtc2V0LWJ1dHRvblwiPlZpZXcgZGF0YSBzZXQ8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC90ZD5cbiAgICBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGxcIj5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm5oc3VrLWlucHV0IG5oc3VrLWlucHV0LS13aWR0aC0xMCBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiXG4gICAgICAgICAgICAgICAgICAgIGlkPVwiZmllbGRzLSR7cm93Q291bnR9XCJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cImZpZWxkc1tdXCJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIj5cbiAgICAgICAgPC90ZD5cbiAgICBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGxcIj5cbiAgICAgICAgICAgIDx0ZXh0YXJlYSByb3dzPVwiMVwiIGNsYXNzPVwibmhzdWstdGV4dGFyZWEgbmhzdWstdS1mb250LXNpemUtMTRcIlxuICAgICAgICAgICAgICAgICAgICBpZD1cImFtZW5kbWVudHMtJHtyb3dDb3VudH1cIlxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwiYW1lbmRtZW50c1tdXCI+PC90ZXh0YXJlYT5cbiAgICAgICAgPC90ZD5cbiAgICBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGwgIG5oc3VrLXUtZm9udC1zaXplLTE0XCI+XG4gICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJyZW1vdmUtcm93IG5oc3VrLWxpbmtcIj5cbiAgICAgICAgICAgIFJlbW92ZVxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPnJvdyAke3Jvd0NvdW50fTwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgICAgICA8L3RkPlxuICAgIGA7XG5cbiAgICAgICAgdGFibGVCb2R5LmFwcGVuZENoaWxkKG5ld1Jvdyk7XG4gICAgICAgIHVwZGF0ZURhdGFTZXRWaWV3Rm9yUm93KG5ld1Jvdyk7XG4gICAgICAgIGJpbmRSZW1vdmVMaW5rcygpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVwb3J0Rm9ybVwiKTtcbiAgICBjb25zdCBlcnJvclN1bW1hcnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yU3VtbWFyeVwiKTtcbiAgICBjb25zdCBlcnJvckxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yTGlzdFwiKTtcblxuICAgIGNvbnN0IHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXBvcnRUYWJsZVwiKTtcblxuICAgIGNvbnN0IGZpZWxkcyA9IFtcInNldHNbXVwiLCBcImZpZWxkc1tdXCIsIFwiYW1lbmRtZW50c1tdXCIsIFwicmVhc29uW11cIl07XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gU1VCTUlUIFZBTElEQVRJT05cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjbGVhckVycm9ycygpO1xuXG4gICAgICAgIGxldCBlcnJvcnMgPSBbXTtcbiAgICAgICAgbGV0IGZpcnN0RXJyb3JGaWVsZCA9IG51bGw7XG5cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIC8vIERFU0NSSVBUSU9OIFZBTElEQVRJT05cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAgIGNvbnN0IHJvd3MgPSB0YWJsZS5xdWVyeVNlbGVjdG9yQWxsKFwidGJvZHkgdHJcIik7XG5cbiAgICAgICAgcm93cy5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbnB1dHMgPSBnZXRSb3dJbnB1dHMocm93KTtcblxuICAgICAgICAgICAgY29uc3Qgcm93SGFzRGF0YSA9IGlucHV0cy5zb21lKGkgPT4gaS52YWx1ZS50cmltKCkgIT09IFwiXCIpO1xuXG4gICAgICAgICAgICAvLyBpZ25vcmUgZW1wdHkgcm93cyBjb21wbGV0ZWx5XG4gICAgICAgICAgICBpZiAoIXJvd0hhc0RhdGEpIHJldHVybjtcblxuICAgICAgICAgICAgaW5wdXRzLmZvckVhY2goKGlucHV0LCBjb2xJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBnZXRFcnJvck1lc3NhZ2UoY29sSW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFpbnB1dC52YWx1ZS50cmltKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3JJZCA9IGVuc3VyZUVycm9yKGlucHV0LCBtZXNzYWdlLCByb3dJbmRleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICBgPGxpPjxhIGhyZWY9XCIjJHtlcnJvcklkfVwiPiR7bWVzc2FnZX0gKHJvdyAke3Jvd0luZGV4ICsgMX0pPC9hPjwvbGk+YFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBpbnB1dDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIC8vIFNUQU5EQVJEIEZPUk0gRklFTERTIFZBTElEQVRJT05cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAgIGNvbnN0IHJlY29yZFR5cGVDaGFuZ2VFcnJvciA9IHZhbGlkYXRlUmFkaW9Hcm91cCh7XG4gICAgICAgICAgICBuYW1lOiBcInJlY29yZFR5cGVDaGFuZ2VcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwicmVjb3JkVHlwZUNoYW5nZUdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcInJlY29yZFR5cGVDaGFuZ2UtZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiU2VsZWN0IGEgdHlwZSBvZiBjaGFuZ2VcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIHJlY29yZFR5cGVDaGFuZ2VFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gcmVjb3JkVHlwZUNoYW5nZUVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29ycnVwdGVkRXJyb3IgPSB2YWxpZGF0ZVJhZGlvR3JvdXAoe1xuICAgICAgICAgICAgbmFtZTogXCJjb3JydXB0ZWRcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwiY29ycnVwdGVkR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwiY29ycnVwdGVkLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIlNlbGVjdCB5ZXMgaWYgeW91ciBmaWxlIGhhcyBiZWVuIGNvcnJ1cHRlZFwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgY29ycnVwdGVkRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IGNvcnJ1cHRlZEVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGF5bWVudEVycm9yID0gdmFsaWRhdGVSYWRpb0dyb3VwKHtcbiAgICAgICAgICAgIG5hbWU6IFwicGF5bWVudFwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJwYXltZW50R3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwicGF5bWVudC1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJTZWxlY3QgeWVzIGlmIHBheW1lbnQgd2lsbCBiZSBhZmZlY3RlZFwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgcGF5bWVudEVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBwYXltZW50RXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIC8vIFJFQVNPTiBURVhUQVJFQSBWQUxJREFUSU9OXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgICBjb25zdCByZWFzb25Hcm91cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXNzdWVSZWFzb25cIik7XG4gICAgICAgIGNvbnN0IHJlYXNvblRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpc3N1ZS1yZWFzb25cIik7XG5cbiAgICAgICAgaWYgKCFyZWFzb25UZXh0YXJlYS52YWx1ZS50cmltKCkpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+RW50ZXIgdGhlIHJlYXNvbiB3aHkgeW91IHJlcXVpcmUgYW4gdXBkYXRlIGZvciB0aGlzIHJlY29yZCc7XG5cbiAgICAgICAgICAgIC8vIGFkZCBOSFMgZXJyb3Igc3R5bGluZ1xuICAgICAgICAgICAgcmVhc29uR3JvdXAuY2xhc3NMaXN0LmFkZChcIm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yXCIpO1xuICAgICAgICAgICAgcmVhc29uVGV4dGFyZWEuY2xhc3NMaXN0LmFkZChcIm5oc3VrLXRleHRhcmVhLS1lcnJvclwiKTtcblxuICAgICAgICAgICAgLy8gY3JlYXRlIGVycm9yIG1lc3NhZ2UgaWYgaXQgZG9lc24ndCBleGlzdFxuICAgICAgICAgICAgbGV0IGVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpc3N1ZS1yZWFzb24tZXJyb3JcIik7XG5cbiAgICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBlcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgICAgIGVycm9yLmlkID0gXCJpc3N1ZS1yZWFzb24tZXJyb3JcIjtcbiAgICAgICAgICAgICAgICBlcnJvci5jbGFzc05hbWUgPSBcIm5oc3VrLWVycm9yLW1lc3NhZ2VcIjtcbiAgICAgICAgICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBtZXNzYWdlO1xuXG4gICAgICAgICAgICAgICAgcmVhc29uVGV4dGFyZWEucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZXJyb3IsIHJlYXNvblRleHRhcmVhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZW5zdXJlIGNvcnJlY3QgbWVzc2FnZSB0ZXh0XG4gICAgICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBtZXNzYWdlO1xuXG4gICAgICAgICAgICAvLyBhY2Nlc3NpYmlsaXR5XG4gICAgICAgICAgICByZWFzb25UZXh0YXJlYS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgXCJhcmlhLWRlc2NyaWJlZGJ5XCIsXG4gICAgICAgICAgICAgICAgXCJpc3N1ZS1yZWFzb24tZXJyb3JcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gYWRkIHRvIHN1bW1hcnlcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICAgICAgICAgIGA8bGk+PGEgaHJlZj1cIiNpc3N1ZVJlYXNvblwiPkVudGVyIHRoZSByZWFzb24gd2h5IHlvdSByZXF1aXJlIGFuIHVwZGF0ZSBmb3IgdGhpcyByZWNvcmQ8L2E+PC9saT5gXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyBmb2N1cyBmaXJzdCBpbnZhbGlkIGZpZWxkXG4gICAgICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCkge1xuICAgICAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IHJlYXNvblRleHRhcmVhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIC8vIEVORCBSRUFTT04gVEVYVEFSRUEgVkFMSURBVElPTlxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgICAgY29uc3Qgc2l0ZUF1dG9FcnJvciA9IHZhbGlkYXRlUmVxdWlyZWRGaWVsZCh7XG4gICAgICAgICAgICBpbnB1dElkOiBcInNpdGVBdXRvXCIsXG4gICAgICAgICAgICBncm91cElkOiBcInNpdGVBdXRvR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwic2l0ZUF1dG8tZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiRW50ZXIgdGhlIHNpdGUgeW91IGFyZSBiYXNlZCBhdFwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIHNpdGVBdXRvRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IHNpdGVBdXRvRXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGRpcmVjdG9yYXRlRXJyb3IgPSB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICAgICAgaW5wdXRJZDogXCJkaXJlY3RvcmF0ZVwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJkaXJlY3RvcmF0ZUdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcImRpcmVjdG9yYXRlLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkVudGVyIHlvdXIgZGlyZWN0b3JhdGVcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBkaXJlY3RvcmF0ZUVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBkaXJlY3RvcmF0ZUVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBlcnJvckxpc3QuaW5uZXJIVE1MID0gZXJyb3JzLmpvaW4oXCJcIik7XG4gICAgICAgICAgICBlcnJvclN1bW1hcnkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcblxuICAgICAgICAgICAgZXJyb3JTdW1tYXJ5LnNjcm9sbEludG9WaWV3KHsgYmVoYXZpb3I6IFwic21vb3RoXCIgfSk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm0uc3VibWl0KCk7XG4gICAgfSk7XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gSEVMUEVSU1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGZ1bmN0aW9uIGdldFJvd0lucHV0cyhyb3cpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHJvdy5xdWVyeVNlbGVjdG9yKCdzZWxlY3RbbmFtZT1cInNldHNbXVwiXScpLFxuICAgICAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJmaWVsZHNbXVwiXScpLFxuICAgICAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhW25hbWU9XCJhbWVuZG1lbnRzW11cIl0nKSxcbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRFcnJvck1lc3NhZ2UoaW5kZXgpIHtcbiAgICAgICAgc3dpdGNoIChpbmRleCkge1xuICAgICAgICAgICAgY2FzZSAwOiBcbiAgICAgICAgICAgICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+RW50ZXIgdGhlIHNldCc7XG4gICAgICAgICAgICBjYXNlIDE6IFxuICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj5FbnRlciB0aGUgZmllbGQnO1xuICAgICAgICAgICAgY2FzZSAyOiBcbiAgICAgICAgICAgICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+RW50ZXIgdGhlIGFtZW5kbWVudCc7XG4gICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5zdXJlRXJyb3IoaW5wdXQsIG1lc3NhZ2UsIHJvd0luZGV4KSB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBpbnB1dC5jbG9zZXN0KFwidGRcIik7XG5cbiAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwibmhzdWstZm9ybS1ncm91cC0tZXJyb3JcIik7XG5cbiAgICAgICAgbGV0IGVycm9yID0gY2VsbC5xdWVyeVNlbGVjdG9yKFwiLm5oc3VrLWVycm9yLW1lc3NhZ2VcIik7XG5cbiAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgZXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgIGVycm9yLmNsYXNzTmFtZSA9IFwibmhzdWstZXJyb3ItbWVzc2FnZSBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiO1xuICAgICAgICAgICAgY2VsbC5pbnNlcnRCZWZvcmUoZXJyb3IsIGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVycm9yLmlubmVySFRNTCA9IG1lc3NhZ2U7XG5cbiAgICAgICAgY29uc3QgZXJyb3JJZCA9IGlucHV0LmlkIHx8IGByb3ctJHtyb3dJbmRleH0tJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyLCA3KX1gO1xuXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIiwgZXJyb3JJZCk7XG4gICAgICAgIGlucHV0LmlkID0gZXJyb3JJZDtcblxuICAgICAgICByZXR1cm4gZXJyb3JJZDtcbiAgICB9XG5cbiAgICAvLyBIZWxwZXIgZm9yIHRoZSB0ZXh0IGZpZWxkIHZhbGlkYXRpb25cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICBpbnB1dElkLFxuICAgICAgICBncm91cElkLFxuICAgICAgICBlcnJvcklkLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBlcnJvcnNcbiAgICB9KSB7XG4gICAgXG4gICAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW5wdXRJZCk7XG4gICAgICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZ3JvdXBJZCk7XG4gICAgXG4gICAgICAgIGlmICghaW5wdXQudmFsdWUudHJpbSgpKSB7XG4gICAgXG4gICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPVxuICAgICAgICAgICAgICAgIGA8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPiAke21lc3NhZ2V9YDtcbiAgICBcbiAgICAgICAgICAgIGdyb3VwLmNsYXNzTGlzdC5hZGQoXCJuaHN1ay1mb3JtLWdyb3VwLS1lcnJvclwiKTtcbiAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoXCJuaHN1ay1pbnB1dC0tZXJyb3JcIik7XG4gICAgXG4gICAgICAgICAgICBsZXQgZXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlcnJvcklkKTtcblxuICAgICAgICAgICAgY29uc3QgZm9ybUdyb3VwID0gaW5wdXQuY2xvc2VzdCgnLm5oc3VrLWZvcm0tZ3JvdXAnKTtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gZm9ybUdyb3VwPy5xdWVyeVNlbGVjdG9yKCcubmhzdWstbGFiZWwnKTtcblxuICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgICAgIGVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICAgICAgZXJyb3IuaWQgPSBlcnJvcklkO1xuICAgICAgICAgICAgICAgIGVycm9yLmNsYXNzTmFtZSA9IFwibmhzdWstZXJyb3ItbWVzc2FnZVwiO1xuXG4gICAgICAgICAgICAgICAgbGFiZWwuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdhZnRlcmVuZCcsIGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGVycm9yLmlubmVySFRNTCA9IGVycm9yTWVzc2FnZTtcbiAgICBcbiAgICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIiwgZXJyb3JJZCk7XG4gICAgXG4gICAgICAgICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgICAgICAgICBgPGxpPjxhIGhyZWY9XCIjJHtncm91cElkfVwiPiR7bWVzc2FnZX08L2E+PC9saT5gXG4gICAgICAgICAgICApO1xuICAgIFxuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGVscGVyIGZvciB0aGUgcmFkaW8gYnV0dG9uIHZhbGlkYXRpb25cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZVJhZGlvR3JvdXAoe1xuICAgICAgICBuYW1lLFxuICAgICAgICBncm91cElkLFxuICAgICAgICBlcnJvcklkLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBlcnJvcnNcbiAgICB9KSB7XG4gICAgXG4gICAgICAgIGNvbnN0IHJhZGlvcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICBgaW5wdXRbbmFtZT1cIiR7bmFtZX1cIl1gXG4gICAgICAgICk7XG4gICAgXG4gICAgICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZ3JvdXBJZCk7XG4gICAgXG4gICAgICAgIGNvbnN0IGNoZWNrZWQgPSBbLi4ucmFkaW9zXS5zb21lKHJhZGlvID0+IHJhZGlvLmNoZWNrZWQpO1xuICAgIFxuICAgICAgICBpZiAoIWNoZWNrZWQpIHtcbiAgICBcbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgYDxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+ICR7bWVzc2FnZX1gO1xuICAgIFxuICAgICAgICAgICAgZ3JvdXAuY2xhc3NMaXN0LmFkZChcIm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yXCIpO1xuICAgIFxuICAgICAgICAgICAgbGV0IGVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZXJyb3JJZCk7XG4gICAgXG4gICAgICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgXG4gICAgICAgICAgICAgICAgZXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICBcbiAgICAgICAgICAgICAgICBlcnJvci5pZCA9IGVycm9ySWQ7XG4gICAgICAgICAgICAgICAgZXJyb3IuY2xhc3NOYW1lID0gXCJuaHN1ay1lcnJvci1tZXNzYWdlXCI7XG4gICAgICAgICAgICAgICAgZXJyb3IuaW5uZXJIVE1MID0gZXJyb3JNZXNzYWdlO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZmllbGRzZXQgPSBncm91cC5xdWVyeVNlbGVjdG9yKFwiLm5oc3VrLWZpZWxkc2V0XCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJhZGlvcyA9IGZpZWxkc2V0LnF1ZXJ5U2VsZWN0b3IoXCIubmhzdWstcmFkaW9zXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZmllbGRzZXQuaW5zZXJ0QmVmb3JlKGVycm9yLCByYWRpb3MpO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgICAgICAgICAgYDxsaT48YSBocmVmPVwiIyR7cmFkaW9zWzBdLmlkfVwiPiR7bWVzc2FnZX08L2E+PC9saT5gXG4gICAgICAgICAgICApO1xuICAgIFxuICAgICAgICAgICAgcmFkaW9zWzBdLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgICAgICBcImFyaWEtZGVzY3JpYmVkYnlcIixcbiAgICAgICAgICAgICAgICBlcnJvcklkXG4gICAgICAgICAgICApO1xuICAgIFxuICAgICAgICAgICAgcmV0dXJuIHJhZGlvc1swXTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckVycm9ycygpIHtcbiAgICAgICAgZXJyb3JMaXN0LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIGVycm9yU3VtbWFyeS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uaHN1ay1mb3JtLWdyb3VwLS1lcnJvciwgLm5oc3VrLXRleHRhcmVhLS1lcnJvciwgLm5oc3VrLWlucHV0LS1lcnJvclwiKVxuICAgICAgICAgICAgLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZShcIm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yXCIsIFwibmhzdWstdGV4dGFyZWEtLWVycm9yXCIsIFwibmhzdWstaW5wdXQtLWVycm9yXCIpKTtcblxuICAgICAgICAvLyByZW1vdmUgdGFibGUtZ2VuZXJhdGVkIGVycm9ycyBvbmx5XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ZCAubmhzdWstZXJyb3ItbWVzc2FnZVwiKVxuICAgICAgICAgICAgLmZvckVhY2goZWwgPT4gZWwucmVtb3ZlKCkpO1xuXG4gICAgICAgIFtcbiAgICAgICAgICAgIFwicmVjb3JkVHlwZUNoYW5nZS1lcnJvclwiLFxuICAgICAgICAgICAgXCJzaXRlQXV0by1lcnJvclwiLFxuICAgICAgICAgICAgXCJwYXltZW50LWVycm9yXCIsXG4gICAgICAgICAgICBcImRpcmVjdG9yYXRlLWVycm9yXCJcbiAgICAgICAgXS5mb3JFYWNoKGlkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICBcbiAgICAgICAgICAgIGlmIChlbCkge1xuICAgICAgICAgICAgICAgIGVsLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyByZW1vdmUgdGV4dGFyZWEgZXJyb3IgbWVzc2FnZSB0ZXh0XG4gICAgICAgIGNvbnN0IHJlYXNvbkVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpc3N1ZS1yZWFzb24tZXJyb3JcIik7XG5cbiAgICAgICAgaWYgKHJlYXNvbkVycm9yKSB7XG4gICAgICAgIHJlYXNvbkVycm9yLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxTQUFTLGlCQUFpQixvQkFBb0IsV0FBWTtBQUV0RCxRQUFNLGlCQUFpQjtBQUFBLElBQ25CLG1CQUFtQjtBQUFBLElBQ25CLGNBQWM7QUFBQSxJQUNkLGtCQUFrQjtBQUFBLElBQ2xCLGVBQWU7QUFBQSxJQUNmLHlCQUF5QjtBQUFBLElBQ3pCLHFCQUFxQjtBQUFBLElBQ3JCLHdCQUF3QjtB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
