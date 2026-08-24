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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L3NkLXJlcG9ydC12My5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcblxuICAgIGNvbnN0IHRhYmxlQm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXBvcnRUYWJsZSB0Ym9keScpO1xuICAgIGNvbnN0IGFkZEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRSb3dCdXR0b24nKTtcbiAgICBjb25zdCB1bmRvQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVuZG9SZW1vdmFsQ29udGFpbmVyJyk7XG4gICAgY29uc3QgdW5kb0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1bmRvUmVtb3ZhbEJ1dHRvbicpO1xuXG4gICAgbGV0IGxhc3RSZW1vdmVkUm93ID0gbnVsbDtcbiAgICBsZXQgbGFzdFJlbW92ZWRJbmRleCA9IG51bGw7XG5cbiAgICAvLyBSZW1vdmUgcm93XG4gICAgZnVuY3Rpb24gYmluZFJlbW92ZUxpbmtzKCkge1xuICAgICAgICB0YWJsZUJvZHkucXVlcnlTZWxlY3RvckFsbCgnLnJlbW92ZS1yb3cnKS5mb3JFYWNoKGxpbmsgPT4ge1xuICAgICAgICAgICAgbGluay5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHJlbW92ZUhhbmRsZXIpO1xuICAgICAgICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJlbW92ZUhhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVIYW5kbGVyKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIFxuICAgICAgICBjb25zdCByb3cgPSBlLnRhcmdldC5jbG9zZXN0KCd0cicpO1xuICAgIFxuICAgICAgICAvLyBHZXQgYW1lbmRtZW50IHRleHQgYmVmb3JlIHJlbW92aW5nIHJvd1xuICAgICAgICBjb25zdCBhbWVuZG1lbnRGaWVsZCA9IHJvdy5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYVtuYW1lPVwiYW1lbmRtZW50c1tdXCJdJyk7XG4gICAgICAgIGNvbnN0IGFtZW5kbWVudFRleHQgPSBhbWVuZG1lbnRGaWVsZCA/IGFtZW5kbWVudEZpZWxkLnZhbHVlIDogJyc7XG4gICAgXG4gICAgICAgIC8vIFN0b3JlIHJvdyBhbmQgaXRzIG9yaWdpbmFsIHBvc2l0aW9uXG4gICAgICAgIGxhc3RSZW1vdmVkUm93ID0gcm93O1xuICAgICAgICBsYXN0UmVtb3ZlZEluZGV4ID0gQXJyYXkuZnJvbSh0YWJsZUJvZHkuY2hpbGRyZW4pLmluZGV4T2Yocm93KTtcbiAgICBcbiAgICAgICAgcm93LnJlbW92ZSgpO1xuICAgIFxuICAgICAgICByZW1vdmVkQW1lbmRtZW50VGV4dC50ZXh0Q29udGVudCA9IGFtZW5kbWVudFRleHQ7XG4gICAgICAgIHVuZG9Db250YWluZXIuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIHVuZG9Db250YWluZXIuY2xhc3NMaXN0LmFkZChcInVuZG9Db250YWluZXJWaXNpYmxlXCIpO1xuICAgIH1cblxuICAgIHVuZG9CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaWYgKCFsYXN0UmVtb3ZlZFJvdykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGNvbnN0IHJvd3MgPSB0YWJsZUJvZHkuY2hpbGRyZW47XG4gICAgXG4gICAgICAgIC8vIFB1dCByb3cgYmFjayBpbiBpdHMgb3JpZ2luYWwgcG9zaXRpb25cbiAgICAgICAgaWYgKGxhc3RSZW1vdmVkSW5kZXggPj0gcm93cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRhYmxlQm9keS5hcHBlbmRDaGlsZChsYXN0UmVtb3ZlZFJvdyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YWJsZUJvZHkuaW5zZXJ0QmVmb3JlKGxhc3RSZW1vdmVkUm93LCByb3dzW2xhc3RSZW1vdmVkSW5kZXhdKTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBsYXN0UmVtb3ZlZFJvdyA9IG51bGw7XG4gICAgICAgIGxhc3RSZW1vdmVkSW5kZXggPSBudWxsO1xuICAgIFxuICAgICAgICB1bmRvQ29udGFpbmVyLmhpZGRlbiA9IHRydWU7XG4gICAgICAgIHVuZG9Db250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcInVuZG9Db250YWluZXJWaXNpYmxlXCIpO1xuICAgIFxuICAgICAgICBiaW5kUmVtb3ZlTGlua3MoKTtcbiAgICB9KTtcblxuICAgIGJpbmRSZW1vdmVMaW5rcygpO1xuXG4gICAgLy8gQWRkIG5ldyByb3dcbiAgICBhZGRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgY29uc3Qgcm93Q291bnQgPSB0YWJsZUJvZHkucXVlcnlTZWxlY3RvckFsbCgndHInKS5sZW5ndGggKyAxO1xuXG4gICAgICAgIGNvbnN0IG5ld1JvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG4gICAgICAgIG5ld1Jvdy5jbGFzc0xpc3QuYWRkKCduaHN1ay10YWJsZV9fcm93Jyk7XG5cbiAgICAgICAgbmV3Um93LmlubmVySFRNTCA9IGBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGxcIj5cbiAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJuaHN1ay1zZWxlY3QgbmhzdWstdS1mb250LXNpemUtMTRcIlxuICAgICAgICAgICAgICAgICAgICBpZD1cInNldHMtJHtyb3dDb3VudH1cIlxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwic2V0c1tdXCI+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlNlbGVjdCBhIGRhdGEgc2V0PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlNlcnZpY2UgaGlzdG9yeVwiPlNlcnZpY2UgaGlzdG9yeTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJFbXBsb3ltZW50XCI+RW1wbG95bWVudDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJTZXJ2aWNlIGdyb3Vwc1wiPlNlcnZpY2UgZ3JvdXBzPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkNvbnRzICYgVFBQXCI+Q29udHMgJiBUUFA8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiSG91cnMgaGlzdG9yeSBkZXRhaWxzXCI+SG91cnMgaGlzdG9yeSBkZXRhaWxzPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkxpbmtlZCBlbXBsb3ltZW50XCI+TGlua2VkIGVtcGxveW1lbnQ8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiQmFzaWMgbWVtYmVyIGRldGFpbHNcIj5CYXNpYyBtZW1iZXIgZGV0YWlsczwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgIDwvdGQ+XG4gICAgXG4gICAgICAgIDx0ZCBjbGFzcz1cIm5oc3VrLXRhYmxlX19jZWxsXCI+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJuaHN1ay1pbnB1dCBuaHN1ay1pbnB1dC0td2lkdGgtMTAgbmhzdWstdS1mb250LXNpemUtMTRcIlxuICAgICAgICAgICAgICAgICAgICBpZD1cImZpZWxkcy0ke3Jvd0NvdW50fVwiXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJmaWVsZHNbXVwiXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCI+XG4gICAgICAgIDwvdGQ+XG4gICAgXG4gICAgICAgIDx0ZCBjbGFzcz1cIm5oc3VrLXRhYmxlX19jZWxsXCI+XG4gICAgICAgICAgICA8dGV4dGFyZWEgcm93cz1cIjFcIiBjbGFzcz1cIm5oc3VrLXRleHRhcmVhIG5oc3VrLXUtZm9udC1zaXplLTE0XCJcbiAgICAgICAgICAgICAgICAgICAgaWQ9XCJhbWVuZG1lbnRzLSR7cm93Q291bnR9XCJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cImFtZW5kbWVudHNbXVwiPjwvdGV4dGFyZWE+XG4gICAgICAgIDwvdGQ+XG4gICAgXG4gICAgICAgIDx0ZCBjbGFzcz1cIm5oc3VrLXRhYmxlX19jZWxsICBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiPlxuICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzPVwicmVtb3ZlLXJvdyBuaHN1ay1saW5rXCI+XG4gICAgICAgICAgICBSZW1vdmVcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5yb3cgJHtyb3dDb3VudH08L3NwYW4+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPC90ZD5cbiAgICBgO1xuXG4gICAgICAgIHRhYmxlQm9keS5hcHBlbmRDaGlsZChuZXdSb3cpO1xuICAgICAgICBiaW5kUmVtb3ZlTGlua3MoKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlcG9ydEZvcm1cIik7XG4gICAgY29uc3QgZXJyb3JTdW1tYXJ5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvclN1bW1hcnlcIik7XG4gICAgY29uc3QgZXJyb3JMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvckxpc3RcIik7XG5cbiAgICBjb25zdCB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVwb3J0VGFibGVcIik7XG5cbiAgICBjb25zdCBmaWVsZHMgPSBbXCJzZXRzW11cIiwgXCJmaWVsZHNbXVwiLCBcImFtZW5kbWVudHNbXVwiLCBcInJlYXNvbltdXCJdO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIFNVQk1JVCBWQUxJREFUSU9OXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgY2xlYXJFcnJvcnMoKTtcblxuICAgICAgICBsZXQgZXJyb3JzID0gW107XG4gICAgICAgIGxldCBmaXJzdEVycm9yRmllbGQgPSBudWxsO1xuXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAvLyBERVNDUklQVElPTiBWQUxJREFUSU9OXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgICBjb25zdCByb3dzID0gdGFibGUucXVlcnlTZWxlY3RvckFsbChcInRib2R5IHRyXCIpO1xuXG4gICAgICAgIHJvd3MuZm9yRWFjaCgocm93LCByb3dJbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5wdXRzID0gZ2V0Um93SW5wdXRzKHJvdyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJvd0hhc0RhdGEgPSBpbnB1dHMuc29tZShpID0+IGkudmFsdWUudHJpbSgpICE9PSBcIlwiKTtcblxuICAgICAgICAgICAgLy8gaWdub3JlIGVtcHR5IHJvd3MgY29tcGxldGVseVxuICAgICAgICAgICAgaWYgKCFyb3dIYXNEYXRhKSByZXR1cm47XG5cbiAgICAgICAgICAgIGlucHV0cy5mb3JFYWNoKChpbnB1dCwgY29sSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gZ2V0RXJyb3JNZXNzYWdlKGNvbEluZGV4KTtcblxuICAgICAgICAgICAgICAgIGlmICghaW5wdXQudmFsdWUudHJpbSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9ySWQgPSBlbnN1cmVFcnJvcihpbnB1dCwgbWVzc2FnZSwgcm93SW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgYDxsaT48YSBocmVmPVwiIyR7ZXJyb3JJZH1cIj4ke21lc3NhZ2V9IChyb3cgJHtyb3dJbmRleCArIDF9KTwvYT48L2xpPmBcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gaW5wdXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAvLyBSRUFTT04gVEVYVEFSRUEgVkFMSURBVElPTlxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgICAgY29uc3QgcmVhc29uR3JvdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlzc3VlUmVhc29uXCIpO1xuICAgICAgICBjb25zdCByZWFzb25UZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXNzdWUtcmVhc29uXCIpO1xuXG4gICAgICAgIGlmICghcmVhc29uVGV4dGFyZWEudmFsdWUudHJpbSgpKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPVxuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPkVudGVyIHRoZSByZWFzb24gd2h5IHlvdSByZXF1aXJlIGFuIHVwZGF0ZSBmb3IgdGhpcyByZWNvcmQnO1xuXG4gICAgICAgICAgICAvLyBhZGQgTkhTIGVycm9yIHN0eWxpbmdcbiAgICAgICAgICAgIHJlYXNvbkdyb3VwLmNsYXNzTGlzdC5hZGQoXCJuaHN1ay1mb3JtLWdyb3VwLS1lcnJvclwiKTtcbiAgICAgICAgICAgIHJlYXNvblRleHRhcmVhLmNsYXNzTGlzdC5hZGQoXCJuaHN1ay10ZXh0YXJlYS0tZXJyb3JcIik7XG5cbiAgICAgICAgICAgIC8vIGNyZWF0ZSBlcnJvciBtZXNzYWdlIGlmIGl0IGRvZXNuJ3QgZXhpc3RcbiAgICAgICAgICAgIGxldCBlcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXNzdWUtcmVhc29uLWVycm9yXCIpO1xuXG4gICAgICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgICAgICBlcnJvci5pZCA9IFwiaXNzdWUtcmVhc29uLWVycm9yXCI7XG4gICAgICAgICAgICAgICAgZXJyb3IuY2xhc3NOYW1lID0gXCJuaHN1ay1lcnJvci1tZXNzYWdlXCI7XG4gICAgICAgICAgICAgICAgZXJyb3IuaW5uZXJIVE1MID0gbWVzc2FnZTtcblxuICAgICAgICAgICAgICAgIHJlYXNvblRleHRhcmVhLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVycm9yLCByZWFzb25UZXh0YXJlYSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGVuc3VyZSBjb3JyZWN0IG1lc3NhZ2UgdGV4dFxuICAgICAgICAgICAgZXJyb3IuaW5uZXJIVE1MID0gbWVzc2FnZTtcblxuICAgICAgICAgICAgLy8gYWNjZXNzaWJpbGl0eVxuICAgICAgICAgICAgcmVhc29uVGV4dGFyZWEuc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgICAgIFwiYXJpYS1kZXNjcmliZWRieVwiLFxuICAgICAgICAgICAgICAgIFwiaXNzdWUtcmVhc29uLWVycm9yXCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIGFkZCB0byBzdW1tYXJ5XG4gICAgICAgICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgICAgICAgICBgPGxpPjxhIGhyZWY9XCIjaXNzdWUtcmVhc29uXCI+RW50ZXIgdGhlIHJlYXNvbiB3aHkgeW91IHJlcXVpcmUgYW4gdXBkYXRlIGZvciB0aGlzIHJlY29yZDwvYT48L2xpPmBcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIGZvY3VzIGZpcnN0IGludmFsaWQgZmllbGRcbiAgICAgICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkKSB7XG4gICAgICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gcmVhc29uVGV4dGFyZWE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIC8vIFNUQU5EQVJEIEZPUk0gRklFTERTIFZBTElEQVRJT05cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAgIGNvbnN0IG1lbWJlckVycm9yID0gdmFsaWRhdGVSZXF1aXJlZEZpZWxkKHtcbiAgICAgICAgICAgIGlucHV0SWQ6IFwibWVtYmVyc2hpcE51bWJlclwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJtZW1iZXJzaGlwTnVtYmVyR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwibWVtYmVyc2hpcE51bWJlci1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJFbnRlciB0aGUgbWVtYmVyIG51bWJlclwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIG1lbWJlckVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBtZW1iZXJFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGluaXRpYWxFcnJvciA9IHZhbGlkYXRlUmVxdWlyZWRGaWVsZCh7XG4gICAgICAgICAgICBpbnB1dElkOiBcIm1lbWJlckZpcnN0SW5pdGlhbFwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJtZW1iZXJGaXJzdEluaXRpYWxHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJtZW1iZXJGaXJzdEluaXRpYWwtZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiRW50ZXIgdGhlIG1lbWJlcnMgZmlyc3QgaW5pdGlhbFwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIGluaXRpYWxFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gaW5pdGlhbEVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3VybmFtZUVycm9yID0gdmFsaWRhdGVSZXF1aXJlZEZpZWxkKHtcbiAgICAgICAgICAgIGlucHV0SWQ6IFwibWVtYmVyU3VybmFtZVwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJtZW1iZXJTdXJuYW1lR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwibWVtYmVyU3VybmFtZS1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJFbnRlciB0aGUgbWVtYmVycyBzdXJuYW1lXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgc3VybmFtZUVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBzdXJuYW1lRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZWNvcmRUeXBlQ2hhbmdlRXJyb3IgPSB2YWxpZGF0ZVJhZGlvR3JvdXAoe1xuICAgICAgICAgICAgbmFtZTogXCJyZWNvcmRUeXBlQ2hhbmdlXCIsXG4gICAgICAgICAgICBncm91cElkOiBcInJlY29yZFR5cGVDaGFuZ2VHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJyZWNvcmRUeXBlQ2hhbmdlLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIlNlbGVjdCBhIHR5cGUgb2YgY2hhbmdlXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiByZWNvcmRUeXBlQ2hhbmdlRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IHJlY29yZFR5cGVDaGFuZ2VFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvcnJ1cHRlZEVycm9yID0gdmFsaWRhdGVSYWRpb0dyb3VwKHtcbiAgICAgICAgICAgIG5hbWU6IFwiY29ycnVwdGVkXCIsXG4gICAgICAgICAgICBncm91cElkOiBcImNvcnJ1cHRlZEdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcImNvcnJ1cHRlZC1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJTZWxlY3QgeWVzIGlmIHlvdXIgZmlsZSBoYXMgYmVlbiBjb3JydXB0ZWRcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIGNvcnJ1cHRlZEVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBjb3JydXB0ZWRFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBheW1lbnRFcnJvciA9IHZhbGlkYXRlUmFkaW9Hcm91cCh7XG4gICAgICAgICAgICBuYW1lOiBcInBheW1lbnRcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwicGF5bWVudEdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcInBheW1lbnQtZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiU2VsZWN0IHllcyBpZiBwYXltZW50IHdpbGwgYmUgYWZmZWN0ZWRcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIHBheW1lbnRFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gcGF5bWVudEVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2l0ZUF1dG9FcnJvciA9IHZhbGlkYXRlUmVxdWlyZWRGaWVsZCh7XG4gICAgICAgICAgICBpbnB1dElkOiBcInNpdGVBdXRvXCIsXG4gICAgICAgICAgICBncm91cElkOiBcInNpdGVBdXRvR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwic2l0ZUF1dG8tZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiRW50ZXIgdGhlIHNpdGUgeW91IGFyZSBiYXNlZCBhdFwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIHNpdGVBdXRvRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IHNpdGVBdXRvRXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGRpcmVjdG9yYXRlRXJyb3IgPSB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICAgICAgaW5wdXRJZDogXCJkaXJlY3RvcmF0ZVwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJkaXJlY3RvcmF0ZUdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcImRpcmVjdG9yYXRlLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkVudGVyIHlvdXIgZGlyZWN0b3JhdGVcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBkaXJlY3RvcmF0ZUVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBkaXJlY3RvcmF0ZUVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29udGFjdE51bWJlckVycm9yID0gdmFsaWRhdGVSZXF1aXJlZEZpZWxkKHtcbiAgICAgICAgICAgIGlucHV0SWQ6IFwiY29udGFjdE51bWJlclwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJjb250YWN0TnVtYmVyR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwiY29udGFjdE51bWJlci1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJFbnRlciB5b3VyIGNvbnRhY3QgbnVtYmVyXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgY29udGFjdE51bWJlckVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBjb250YWN0TnVtYmVyRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGVycm9yTGlzdC5pbm5lckhUTUwgPSBlcnJvcnMuam9pbihcIlwiKTtcbiAgICAgICAgICAgIGVycm9yU3VtbWFyeS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXG4gICAgICAgICAgICBlcnJvclN1bW1hcnkuc2Nyb2xsSW50b1ZpZXcoeyBiZWhhdmlvcjogXCJzbW9vdGhcIiB9KTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybS5zdWJtaXQoKTtcbiAgICB9KTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBIRUxQRVJTXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZnVuY3Rpb24gZ2V0Um93SW5wdXRzKHJvdykge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdFtuYW1lPVwic2V0c1tdXCJdJyksXG4gICAgICAgICAgICByb3cucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImZpZWxkc1tdXCJdJyksXG4gICAgICAgICAgICByb3cucXVlcnlTZWxlY3RvcigndGV4dGFyZWFbbmFtZT1cImFtZW5kbWVudHNbXVwiXScpLFxuICAgICAgICBdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEVycm9yTWVzc2FnZShpbmRleCkge1xuICAgICAgICBzd2l0Y2ggKGluZGV4KSB7XG4gICAgICAgICAgICBjYXNlIDA6IFxuICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj5FbnRlciB0aGUgc2V0JztcbiAgICAgICAgICAgIGNhc2UgMTogXG4gICAgICAgICAgICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPkVudGVyIHRoZSBmaWVsZCc7XG4gICAgICAgICAgICBjYXNlIDI6IFxuICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj5FbnRlciB0aGUgYW1lbmRtZW50JztcbiAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZCc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbnN1cmVFcnJvcihpbnB1dCwgbWVzc2FnZSwgcm93SW5kZXgpIHtcbiAgICAgICAgY29uc3QgY2VsbCA9IGlucHV0LmNsb3Nlc3QoXCJ0ZFwiKTtcblxuICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJuaHN1ay1mb3JtLWdyb3VwLS1lcnJvclwiKTtcblxuICAgICAgICBsZXQgZXJyb3IgPSBjZWxsLnF1ZXJ5U2VsZWN0b3IoXCIubmhzdWstZXJyb3ItbWVzc2FnZVwiKTtcblxuICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgICBlcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgZXJyb3IuY2xhc3NOYW1lID0gXCJuaHN1ay1lcnJvci1tZXNzYWdlIG5oc3VrLXUtZm9udC1zaXplLTE0XCI7XG4gICAgICAgICAgICBjZWxsLmluc2VydEJlZm9yZShlcnJvciwgaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXJyb3IuaW5uZXJIVE1MID0gbWVzc2FnZTtcblxuICAgICAgICBjb25zdCBlcnJvcklkID0gaW5wdXQuaWQgfHwgYHJvdy0ke3Jvd0luZGV4fS0ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIsIDcpfWA7XG5cbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiYXJpYS1kZXNjcmliZWRieVwiLCBlcnJvcklkKTtcbiAgICAgICAgaW5wdXQuaWQgPSBlcnJvcklkO1xuXG4gICAgICAgIHJldHVybiBlcnJvcklkO1xuICAgIH1cblxuICAgIC8vIEhlbHBlciBmb3IgdGhlIHRleHQgZmllbGQgdmFsaWRhdGlvblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlUmVxdWlyZWRGaWVsZCh7XG4gICAgICAgIGlucHV0SWQsXG4gICAgICAgIGdyb3VwSWQsXG4gICAgICAgIGVycm9ySWQsXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIGVycm9yc1xuICAgIH0pIHtcbiAgICBcbiAgICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbnB1dElkKTtcbiAgICAgICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChncm91cElkKTtcbiAgICBcbiAgICAgICAgaWYgKCFpbnB1dC52YWx1ZS50cmltKCkpIHtcbiAgICBcbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgYDxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+ICR7bWVzc2FnZX1gO1xuICAgIFxuICAgICAgICAgICAgZ3JvdXAuY2xhc3NMaXN0LmFkZChcIm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yXCIpO1xuICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZChcIm5oc3VrLWlucHV0LS1lcnJvclwiKTtcbiAgICBcbiAgICAgICAgICAgIGxldCBlcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVycm9ySWQpO1xuXG4gICAgICAgICAgICBjb25zdCBmb3JtR3JvdXAgPSBpbnB1dC5jbG9zZXN0KCcubmhzdWstZm9ybS1ncm91cCcpO1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSBmb3JtR3JvdXA/LnF1ZXJ5U2VsZWN0b3IoJy5uaHN1ay1sYWJlbCcpO1xuXG4gICAgICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgICAgICBlcnJvci5pZCA9IGVycm9ySWQ7XG4gICAgICAgICAgICAgICAgZXJyb3IuY2xhc3NOYW1lID0gXCJuaHN1ay1lcnJvci1tZXNzYWdlXCI7XG5cbiAgICAgICAgICAgICAgICBsYWJlbC5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyZW5kJywgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgZXJyb3IuaW5uZXJIVE1MID0gZXJyb3JNZXNzYWdlO1xuICAgIFxuICAgICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiYXJpYS1kZXNjcmliZWRieVwiLCBlcnJvcklkKTtcbiAgICBcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICAgICAgICAgIGA8bGk+PGEgaHJlZj1cIiMke2lucHV0SWR9XCI+JHttZXNzYWdlfTwvYT48L2xpPmBcbiAgICAgICAgICAgICk7XG4gICAgXG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIZWxwZXIgZm9yIHRoZSByYWRpbyBidXR0b24gdmFsaWRhdGlvblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlUmFkaW9Hcm91cCh7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIGdyb3VwSWQsXG4gICAgICAgIGVycm9ySWQsXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIGVycm9yc1xuICAgIH0pIHtcbiAgICBcbiAgICAgICAgY29uc3QgcmFkaW9zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgIGBpbnB1dFtuYW1lPVwiJHtuYW1lfVwiXWBcbiAgICAgICAgKTtcbiAgICBcbiAgICAgICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChncm91cElkKTtcbiAgICBcbiAgICAgICAgY29uc3QgY2hlY2tlZCA9IFsuLi5yYWRpb3NdLnNvbWUocmFkaW8gPT4gcmFkaW8uY2hlY2tlZCk7XG4gICAgXG4gICAgICAgIGlmICghY2hlY2tlZCkge1xuICAgIFxuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID1cbiAgICAgICAgICAgICAgICBgPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj4gJHttZXNzYWdlfWA7XG4gICAgXG4gICAgICAgICAgICBncm91cC5jbGFzc0xpc3QuYWRkKFwibmhzdWstZm9ybS1ncm91cC0tZXJyb3JcIik7XG4gICAgXG4gICAgICAgICAgICBsZXQgZXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlcnJvcklkKTtcbiAgICBcbiAgICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICBcbiAgICAgICAgICAgICAgICBlcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIFxuICAgICAgICAgICAgICAgIGVycm9yLmlkID0gZXJyb3JJZDtcbiAgICAgICAgICAgICAgICBlcnJvci5jbGFzc05hbWUgPSBcIm5oc3VrLWVycm9yLW1lc3NhZ2VcIjtcbiAgICAgICAgICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBlcnJvck1lc3NhZ2U7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBmaWVsZHNldCA9IGdyb3VwLnF1ZXJ5U2VsZWN0b3IoXCIubmhzdWstZmllbGRzZXRcIik7XG4gICAgICAgICAgICAgICAgY29uc3QgcmFkaW9zID0gZmllbGRzZXQucXVlcnlTZWxlY3RvcihcIi5uaHN1ay1yYWRpb3NcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBmaWVsZHNldC5pbnNlcnRCZWZvcmUoZXJyb3IsIHJhZGlvcyk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgICAgICAgICBgPGxpPjxhIGhyZWY9XCIjJHtyYWRpb3NbMF0uaWR9XCI+JHttZXNzYWdlfTwvYT48L2xpPmBcbiAgICAgICAgICAgICk7XG4gICAgXG4gICAgICAgICAgICByYWRpb3NbMF0uc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgICAgIFwiYXJpYS1kZXNjcmliZWRieVwiLFxuICAgICAgICAgICAgICAgIGVycm9ySWRcbiAgICAgICAgICAgICk7XG4gICAgXG4gICAgICAgICAgICByZXR1cm4gcmFkaW9zWzBdO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyRXJyb3JzKCkge1xuICAgICAgICBlcnJvckxpc3QuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgZXJyb3JTdW1tYXJ5LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yLCAubmhzdWstdGV4dGFyZWEtLWVycm9yLCAubmhzdWstaW5wdXQtLWVycm9yXCIpXG4gICAgICAgICAgICAuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKFwibmhzdWstZm9ybS1ncm91cC0tZXJyb3JcIiwgXCJuaHN1ay10ZXh0YXJlYS0tZXJyb3JcIiwgXCJuaHN1ay1pbnB1dC0tZXJyb3JcIikpO1xuXG4gICAgICAgIC8vIHJlbW92ZSB0YWJsZS1nZW5lcmF0ZWQgZXJyb3JzIG9ubHlcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInRkIC5uaHN1ay1lcnJvci1tZXNzYWdlXCIpXG4gICAgICAgICAgICAuZm9yRWFjaChlbCA9PiBlbC5yZW1vdmUoKSk7XG5cbiAgICAgICAgW1xuICAgICAgICAgICAgXCJtZW1iZXJzaGlwTnVtYmVyLWVycm9yXCIsXG4gICAgICAgICAgICBcIm1lbWJlckZpcnN0SW5pdGlhbC1lcnJvclwiLFxuICAgICAgICAgICAgXCJtZW1iZXJTdXJuYW1lLWVycm9yXCIsXG4gICAgICAgICAgICBcInJlY29yZFR5cGVDaGFuZ2UtZXJyb3JcIixcbiAgICAgICAgICAgIFwic2l0ZUF1dG8tZXJyb3JcIixcbiAgICAgICAgICAgIFwicGF5bWVudC1lcnJvclwiLFxuICAgICAgICAgICAgXCJjb250YWN0TnVtYmVyLWVycm9yXCIsXG4gICAgICAgICAgICBcImRpcmVjdG9yYXRlLWVycm9yXCJcbiAgICAgICAgXS5mb3JFYWNoKGlkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICBcbiAgICAgICAgICAgIGlmIChlbCkge1xuICAgICAgICAgICAgICAgIGVsLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyByZW1vdmUgdGV4dGFyZWEgZXJyb3IgbWVzc2FnZSB0ZXh0XG4gICAgICAgIGNvbnN0IHJlYXNvbkVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpc3N1ZS1yZWFzb24tZXJyb3JcIik7XG5cbiAgICAgICAgaWYgKHJlYXNvbkVycm9yKSB7XG4gICAgICAgIHJlYXNvbkVycm9yLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxTQUFTLGlCQUFpQixv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
