// app/assets/javascript/sd-report-v2.js
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
      row.querySelector('input[name="sets[]"]'),
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L3NkLXJlcG9ydC12Mi5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcblxuICAgIGNvbnN0IHRhYmxlQm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXBvcnRUYWJsZSB0Ym9keScpO1xuICAgIGNvbnN0IGFkZEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRSb3dCdXR0b24nKTtcbiAgICBjb25zdCB1bmRvQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVuZG9SZW1vdmFsQ29udGFpbmVyJyk7XG4gICAgY29uc3QgdW5kb0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1bmRvUmVtb3ZhbEJ1dHRvbicpO1xuXG4gICAgbGV0IGxhc3RSZW1vdmVkUm93ID0gbnVsbDtcbiAgICBsZXQgbGFzdFJlbW92ZWRJbmRleCA9IG51bGw7XG5cbiAgICAvLyBSZW1vdmUgcm93XG4gICAgZnVuY3Rpb24gYmluZFJlbW92ZUxpbmtzKCkge1xuICAgICAgICB0YWJsZUJvZHkucXVlcnlTZWxlY3RvckFsbCgnLnJlbW92ZS1yb3cnKS5mb3JFYWNoKGxpbmsgPT4ge1xuICAgICAgICAgICAgbGluay5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHJlbW92ZUhhbmRsZXIpO1xuICAgICAgICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJlbW92ZUhhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVIYW5kbGVyKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIFxuICAgICAgICBjb25zdCByb3cgPSBlLnRhcmdldC5jbG9zZXN0KCd0cicpO1xuICAgIFxuICAgICAgICAvLyBHZXQgYW1lbmRtZW50IHRleHQgYmVmb3JlIHJlbW92aW5nIHJvd1xuICAgICAgICBjb25zdCBhbWVuZG1lbnRGaWVsZCA9IHJvdy5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYVtuYW1lPVwiYW1lbmRtZW50c1tdXCJdJyk7XG4gICAgICAgIGNvbnN0IGFtZW5kbWVudFRleHQgPSBhbWVuZG1lbnRGaWVsZCA/IGFtZW5kbWVudEZpZWxkLnZhbHVlIDogJyc7XG4gICAgXG4gICAgICAgIC8vIFN0b3JlIHJvdyBhbmQgaXRzIG9yaWdpbmFsIHBvc2l0aW9uXG4gICAgICAgIGxhc3RSZW1vdmVkUm93ID0gcm93O1xuICAgICAgICBsYXN0UmVtb3ZlZEluZGV4ID0gQXJyYXkuZnJvbSh0YWJsZUJvZHkuY2hpbGRyZW4pLmluZGV4T2Yocm93KTtcbiAgICBcbiAgICAgICAgcm93LnJlbW92ZSgpO1xuICAgIFxuICAgICAgICByZW1vdmVkQW1lbmRtZW50VGV4dC50ZXh0Q29udGVudCA9IGFtZW5kbWVudFRleHQ7XG4gICAgICAgIHVuZG9Db250YWluZXIuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIHVuZG9Db250YWluZXIuY2xhc3NMaXN0LmFkZChcInVuZG9Db250YWluZXJWaXNpYmxlXCIpO1xuICAgIH1cblxuICAgIHVuZG9CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaWYgKCFsYXN0UmVtb3ZlZFJvdykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGNvbnN0IHJvd3MgPSB0YWJsZUJvZHkuY2hpbGRyZW47XG4gICAgXG4gICAgICAgIC8vIFB1dCByb3cgYmFjayBpbiBpdHMgb3JpZ2luYWwgcG9zaXRpb25cbiAgICAgICAgaWYgKGxhc3RSZW1vdmVkSW5kZXggPj0gcm93cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRhYmxlQm9keS5hcHBlbmRDaGlsZChsYXN0UmVtb3ZlZFJvdyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YWJsZUJvZHkuaW5zZXJ0QmVmb3JlKGxhc3RSZW1vdmVkUm93LCByb3dzW2xhc3RSZW1vdmVkSW5kZXhdKTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBsYXN0UmVtb3ZlZFJvdyA9IG51bGw7XG4gICAgICAgIGxhc3RSZW1vdmVkSW5kZXggPSBudWxsO1xuICAgIFxuICAgICAgICB1bmRvQ29udGFpbmVyLmhpZGRlbiA9IHRydWU7XG4gICAgICAgIHVuZG9Db250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcInVuZG9Db250YWluZXJWaXNpYmxlXCIpO1xuICAgIFxuICAgICAgICBiaW5kUmVtb3ZlTGlua3MoKTtcbiAgICB9KTtcblxuICAgIGJpbmRSZW1vdmVMaW5rcygpO1xuXG4gICAgLy8gQWRkIG5ldyByb3dcbiAgICBhZGRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgY29uc3Qgcm93Q291bnQgPSB0YWJsZUJvZHkucXVlcnlTZWxlY3RvckFsbCgndHInKS5sZW5ndGggKyAxO1xuXG4gICAgICAgIGNvbnN0IG5ld1JvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG4gICAgICAgIG5ld1Jvdy5jbGFzc0xpc3QuYWRkKCduaHN1ay10YWJsZV9fcm93Jyk7XG5cbiAgICAgICAgbmV3Um93LmlubmVySFRNTCA9IGBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGxcIj5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm5oc3VrLWlucHV0IG5oc3VrLWlucHV0LS13aWR0aC0xMCBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiXG4gICAgICAgICAgICAgICAgICAgIGlkPVwic2V0cy0ke3Jvd0NvdW50fVwiXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJzZXRzW11cIlxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiPlxuICAgICAgICA8L3RkPlxuICAgIFxuICAgICAgICA8dGQgY2xhc3M9XCJuaHN1ay10YWJsZV9fY2VsbFwiPlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwibmhzdWstaW5wdXQgbmhzdWstaW5wdXQtLXdpZHRoLTEwIG5oc3VrLXUtZm9udC1zaXplLTE0XCJcbiAgICAgICAgICAgICAgICAgICAgaWQ9XCJmaWVsZHMtJHtyb3dDb3VudH1cIlxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwiZmllbGRzW11cIlxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiPlxuICAgICAgICA8L3RkPlxuICAgIFxuICAgICAgICA8dGQgY2xhc3M9XCJuaHN1ay10YWJsZV9fY2VsbFwiPlxuICAgICAgICAgICAgPHRleHRhcmVhIHJvd3M9XCIxXCIgY2xhc3M9XCJuaHN1ay10ZXh0YXJlYSBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiXG4gICAgICAgICAgICAgICAgICAgIGlkPVwiYW1lbmRtZW50cy0ke3Jvd0NvdW50fVwiXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJhbWVuZG1lbnRzW11cIj48L3RleHRhcmVhPlxuICAgICAgICA8L3RkPlxuICAgIFxuICAgICAgICA8dGQgY2xhc3M9XCJuaHN1ay10YWJsZV9fY2VsbCAgbmhzdWstdS1mb250LXNpemUtMTRcIj5cbiAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cInJlbW92ZS1yb3cgbmhzdWstbGlua1wiPlxuICAgICAgICAgICAgUmVtb3ZlXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+cm93ICR7cm93Q291bnR9PC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgICAgIDwvdGQ+XG4gICAgYDtcblxuICAgICAgICB0YWJsZUJvZHkuYXBwZW5kQ2hpbGQobmV3Um93KTtcbiAgICAgICAgYmluZFJlbW92ZUxpbmtzKCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXBvcnRGb3JtXCIpO1xuICAgIGNvbnN0IGVycm9yU3VtbWFyeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JTdW1tYXJ5XCIpO1xuICAgIGNvbnN0IGVycm9yTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JMaXN0XCIpO1xuXG4gICAgY29uc3QgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlcG9ydFRhYmxlXCIpO1xuXG4gICAgY29uc3QgZmllbGRzID0gW1wic2V0c1tdXCIsIFwiZmllbGRzW11cIiwgXCJhbWVuZG1lbnRzW11cIiwgXCJyZWFzb25bXVwiXTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBTVUJNSVQgVkFMSURBVElPTlxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGNsZWFyRXJyb3JzKCk7XG5cbiAgICAgICAgbGV0IGVycm9ycyA9IFtdO1xuICAgICAgICBsZXQgZmlyc3RFcnJvckZpZWxkID0gbnVsbDtcblxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgLy8gREVTQ1JJUFRJT04gVkFMSURBVElPTlxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgICAgY29uc3Qgcm93cyA9IHRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0Ym9keSB0clwiKTtcblxuICAgICAgICByb3dzLmZvckVhY2goKHJvdywgcm93SW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlucHV0cyA9IGdldFJvd0lucHV0cyhyb3cpO1xuXG4gICAgICAgICAgICBjb25zdCByb3dIYXNEYXRhID0gaW5wdXRzLnNvbWUoaSA9PiBpLnZhbHVlLnRyaW0oKSAhPT0gXCJcIik7XG5cbiAgICAgICAgICAgIC8vIGlnbm9yZSBlbXB0eSByb3dzIGNvbXBsZXRlbHlcbiAgICAgICAgICAgIGlmICghcm93SGFzRGF0YSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBpbnB1dHMuZm9yRWFjaCgoaW5wdXQsIGNvbEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGdldEVycm9yTWVzc2FnZShjb2xJbmRleCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWlucHV0LnZhbHVlLnRyaW0oKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvcklkID0gZW5zdXJlRXJyb3IoaW5wdXQsIG1lc3NhZ2UsIHJvd0luZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgIGA8bGk+PGEgaHJlZj1cIiMke2Vycm9ySWR9XCI+JHttZXNzYWdlfSAocm93ICR7cm93SW5kZXggKyAxfSk8L2E+PC9saT5gXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IGlucHV0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgLy8gUkVBU09OIFRFWFRBUkVBIFZBTElEQVRJT05cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAgIGNvbnN0IHJlYXNvbkdyb3VwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpc3N1ZVJlYXNvblwiKTtcbiAgICAgICAgY29uc3QgcmVhc29uVGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlzc3VlLXJlYXNvblwiKTtcblxuICAgICAgICBpZiAoIXJlYXNvblRleHRhcmVhLnZhbHVlLnRyaW0oKSkge1xuXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID1cbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj5FbnRlciB0aGUgcmVhc29uIHdoeSB5b3UgcmVxdWlyZSBhbiB1cGRhdGUgZm9yIHRoaXMgcmVjb3JkJztcblxuICAgICAgICAgICAgLy8gYWRkIE5IUyBlcnJvciBzdHlsaW5nXG4gICAgICAgICAgICByZWFzb25Hcm91cC5jbGFzc0xpc3QuYWRkKFwibmhzdWstZm9ybS1ncm91cC0tZXJyb3JcIik7XG4gICAgICAgICAgICByZWFzb25UZXh0YXJlYS5jbGFzc0xpc3QuYWRkKFwibmhzdWstdGV4dGFyZWEtLWVycm9yXCIpO1xuXG4gICAgICAgICAgICAvLyBjcmVhdGUgZXJyb3IgbWVzc2FnZSBpZiBpdCBkb2Vzbid0IGV4aXN0XG4gICAgICAgICAgICBsZXQgZXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlzc3VlLXJlYXNvbi1lcnJvclwiKTtcblxuICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgICAgIGVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICAgICAgZXJyb3IuaWQgPSBcImlzc3VlLXJlYXNvbi1lcnJvclwiO1xuICAgICAgICAgICAgICAgIGVycm9yLmNsYXNzTmFtZSA9IFwibmhzdWstZXJyb3ItbWVzc2FnZVwiO1xuICAgICAgICAgICAgICAgIGVycm9yLmlubmVySFRNTCA9IG1lc3NhZ2U7XG5cbiAgICAgICAgICAgICAgICByZWFzb25UZXh0YXJlYS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlcnJvciwgcmVhc29uVGV4dGFyZWEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBlbnN1cmUgY29ycmVjdCBtZXNzYWdlIHRleHRcbiAgICAgICAgICAgIGVycm9yLmlubmVySFRNTCA9IG1lc3NhZ2U7XG5cbiAgICAgICAgICAgIC8vIGFjY2Vzc2liaWxpdHlcbiAgICAgICAgICAgIHJlYXNvblRleHRhcmVhLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgICAgICBcImFyaWEtZGVzY3JpYmVkYnlcIixcbiAgICAgICAgICAgICAgICBcImlzc3VlLXJlYXNvbi1lcnJvclwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyBhZGQgdG8gc3VtbWFyeVxuICAgICAgICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgICAgICAgICAgYDxsaT48YSBocmVmPVwiI2lzc3VlLXJlYXNvblwiPkVudGVyIHRoZSByZWFzb24gd2h5IHlvdSByZXF1aXJlIGFuIHVwZGF0ZSBmb3IgdGhpcyByZWNvcmQ8L2E+PC9saT5gXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyBmb2N1cyBmaXJzdCBpbnZhbGlkIGZpZWxkXG4gICAgICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCkge1xuICAgICAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IHJlYXNvblRleHRhcmVhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAvLyBTVEFOREFSRCBGT1JNIEZJRUxEUyBWQUxJREFUSU9OXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgICBjb25zdCBtZW1iZXJFcnJvciA9IHZhbGlkYXRlUmVxdWlyZWRGaWVsZCh7XG4gICAgICAgICAgICBpbnB1dElkOiBcIm1lbWJlcnNoaXBOdW1iZXJcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwibWVtYmVyc2hpcE51bWJlckdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcIm1lbWJlcnNoaXBOdW1iZXItZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiRW50ZXIgdGhlIG1lbWJlciBudW1iZXJcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBtZW1iZXJFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gbWVtYmVyRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbml0aWFsRXJyb3IgPSB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICAgICAgaW5wdXRJZDogXCJtZW1iZXJGaXJzdEluaXRpYWxcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwibWVtYmVyRmlyc3RJbml0aWFsR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwibWVtYmVyRmlyc3RJbml0aWFsLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkVudGVyIHRoZSBtZW1iZXJzIGZpcnN0IGluaXRpYWxcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBpbml0aWFsRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IGluaXRpYWxFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN1cm5hbWVFcnJvciA9IHZhbGlkYXRlUmVxdWlyZWRGaWVsZCh7XG4gICAgICAgICAgICBpbnB1dElkOiBcIm1lbWJlclN1cm5hbWVcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwibWVtYmVyU3VybmFtZUdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcIm1lbWJlclN1cm5hbWUtZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiRW50ZXIgdGhlIG1lbWJlcnMgc3VybmFtZVwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIHN1cm5hbWVFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gc3VybmFtZUVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVjb3JkVHlwZUNoYW5nZUVycm9yID0gdmFsaWRhdGVSYWRpb0dyb3VwKHtcbiAgICAgICAgICAgIG5hbWU6IFwicmVjb3JkVHlwZUNoYW5nZVwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJyZWNvcmRUeXBlQ2hhbmdlR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwicmVjb3JkVHlwZUNoYW5nZS1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJTZWxlY3QgYSB0eXBlIG9mIGNoYW5nZVwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgcmVjb3JkVHlwZUNoYW5nZUVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSByZWNvcmRUeXBlQ2hhbmdlRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb3JydXB0ZWRFcnJvciA9IHZhbGlkYXRlUmFkaW9Hcm91cCh7XG4gICAgICAgICAgICBuYW1lOiBcImNvcnJ1cHRlZFwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJjb3JydXB0ZWRHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJjb3JydXB0ZWQtZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiU2VsZWN0IHllcyBpZiB5b3VyIGZpbGUgaGFzIGJlZW4gY29ycnVwdGVkXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBjb3JydXB0ZWRFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gY29ycnVwdGVkRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYXltZW50RXJyb3IgPSB2YWxpZGF0ZVJhZGlvR3JvdXAoe1xuICAgICAgICAgICAgbmFtZTogXCJwYXltZW50XCIsXG4gICAgICAgICAgICBncm91cElkOiBcInBheW1lbnRHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJwYXltZW50LWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIlNlbGVjdCB5ZXMgaWYgcGF5bWVudCB3aWxsIGJlIGFmZmVjdGVkXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBwYXltZW50RXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IHBheW1lbnRFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNpdGVBdXRvRXJyb3IgPSB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICAgICAgaW5wdXRJZDogXCJzaXRlQXV0b1wiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJzaXRlQXV0b0dyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcInNpdGVBdXRvLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkVudGVyIHRoZSBzaXRlIHlvdSBhcmUgYmFzZWQgYXRcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBzaXRlQXV0b0Vycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBzaXRlQXV0b0Vycm9yO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zdCBkaXJlY3RvcmF0ZUVycm9yID0gdmFsaWRhdGVSZXF1aXJlZEZpZWxkKHtcbiAgICAgICAgICAgIGlucHV0SWQ6IFwiZGlyZWN0b3JhdGVcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwiZGlyZWN0b3JhdGVHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJkaXJlY3RvcmF0ZS1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJFbnRlciB5b3VyIGRpcmVjdG9yYXRlXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgZGlyZWN0b3JhdGVFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gZGlyZWN0b3JhdGVFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZXJyb3JMaXN0LmlubmVySFRNTCA9IGVycm9ycy5qb2luKFwiXCIpO1xuICAgICAgICAgICAgZXJyb3JTdW1tYXJ5LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cbiAgICAgICAgICAgIGVycm9yU3VtbWFyeS5zY3JvbGxJbnRvVmlldyh7IGJlaGF2aW9yOiBcInNtb290aFwiIH0pO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtLnN1Ym1pdCgpO1xuICAgIH0pO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIEhFTFBFUlNcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBmdW5jdGlvbiBnZXRSb3dJbnB1dHMocm93KSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICByb3cucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInNldHNbXVwiXScpLFxuICAgICAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJmaWVsZHNbXVwiXScpLFxuICAgICAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhW25hbWU9XCJhbWVuZG1lbnRzW11cIl0nKSxcbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRFcnJvck1lc3NhZ2UoaW5kZXgpIHtcbiAgICAgICAgc3dpdGNoIChpbmRleCkge1xuICAgICAgICAgICAgY2FzZSAwOiBcbiAgICAgICAgICAgICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+RW50ZXIgdGhlIHNldCc7XG4gICAgICAgICAgICBjYXNlIDE6IFxuICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj5FbnRlciB0aGUgZmllbGQnO1xuICAgICAgICAgICAgY2FzZSAyOiBcbiAgICAgICAgICAgICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+RW50ZXIgdGhlIGFtZW5kbWVudCc7XG4gICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5zdXJlRXJyb3IoaW5wdXQsIG1lc3NhZ2UsIHJvd0luZGV4KSB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBpbnB1dC5jbG9zZXN0KFwidGRcIik7XG5cbiAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwibmhzdWstZm9ybS1ncm91cC0tZXJyb3JcIik7XG5cbiAgICAgICAgbGV0IGVycm9yID0gY2VsbC5xdWVyeVNlbGVjdG9yKFwiLm5oc3VrLWVycm9yLW1lc3NhZ2VcIik7XG5cbiAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgZXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgIGVycm9yLmNsYXNzTmFtZSA9IFwibmhzdWstZXJyb3ItbWVzc2FnZSBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiO1xuICAgICAgICAgICAgY2VsbC5pbnNlcnRCZWZvcmUoZXJyb3IsIGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVycm9yLmlubmVySFRNTCA9IG1lc3NhZ2U7XG5cbiAgICAgICAgY29uc3QgZXJyb3JJZCA9IGlucHV0LmlkIHx8IGByb3ctJHtyb3dJbmRleH0tJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyLCA3KX1gO1xuXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIiwgZXJyb3JJZCk7XG4gICAgICAgIGlucHV0LmlkID0gZXJyb3JJZDtcblxuICAgICAgICByZXR1cm4gZXJyb3JJZDtcbiAgICB9XG5cbiAgICAvLyBIZWxwZXIgZm9yIHRoZSB0ZXh0IGZpZWxkIHZhbGlkYXRpb25cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICBpbnB1dElkLFxuICAgICAgICBncm91cElkLFxuICAgICAgICBlcnJvcklkLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBlcnJvcnNcbiAgICB9KSB7XG4gICAgXG4gICAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW5wdXRJZCk7XG4gICAgICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZ3JvdXBJZCk7XG4gICAgXG4gICAgICAgIGlmICghaW5wdXQudmFsdWUudHJpbSgpKSB7XG4gICAgXG4gICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPVxuICAgICAgICAgICAgICAgIGA8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPiAke21lc3NhZ2V9YDtcbiAgICBcbiAgICAgICAgICAgIGdyb3VwLmNsYXNzTGlzdC5hZGQoXCJuaHN1ay1mb3JtLWdyb3VwLS1lcnJvclwiKTtcbiAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoXCJuaHN1ay1pbnB1dC0tZXJyb3JcIik7XG4gICAgXG4gICAgICAgICAgICBsZXQgZXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlcnJvcklkKTtcblxuICAgICAgICAgICAgY29uc3QgZm9ybUdyb3VwID0gaW5wdXQuY2xvc2VzdCgnLm5oc3VrLWZvcm0tZ3JvdXAnKTtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gZm9ybUdyb3VwPy5xdWVyeVNlbGVjdG9yKCcubmhzdWstbGFiZWwnKTtcblxuICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgICAgIGVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICAgICAgZXJyb3IuaWQgPSBlcnJvcklkO1xuICAgICAgICAgICAgICAgIGVycm9yLmNsYXNzTmFtZSA9IFwibmhzdWstZXJyb3ItbWVzc2FnZVwiO1xuXG4gICAgICAgICAgICAgICAgbGFiZWwuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdhZnRlcmVuZCcsIGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGVycm9yLmlubmVySFRNTCA9IGVycm9yTWVzc2FnZTtcbiAgICBcbiAgICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIiwgZXJyb3JJZCk7XG4gICAgXG4gICAgICAgICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgICAgICAgICBgPGxpPjxhIGhyZWY9XCIjJHtpbnB1dElkfVwiPiR7bWVzc2FnZX08L2E+PC9saT5gXG4gICAgICAgICAgICApO1xuICAgIFxuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGVscGVyIGZvciB0aGUgcmFkaW8gYnV0dG9uIHZhbGlkYXRpb25cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZVJhZGlvR3JvdXAoe1xuICAgICAgICBuYW1lLFxuICAgICAgICBncm91cElkLFxuICAgICAgICBlcnJvcklkLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBlcnJvcnNcbiAgICB9KSB7XG4gICAgXG4gICAgICAgIGNvbnN0IHJhZGlvcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICBgaW5wdXRbbmFtZT1cIiR7bmFtZX1cIl1gXG4gICAgICAgICk7XG4gICAgXG4gICAgICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZ3JvdXBJZCk7XG4gICAgXG4gICAgICAgIGNvbnN0IGNoZWNrZWQgPSBbLi4ucmFkaW9zXS5zb21lKHJhZGlvID0+IHJhZGlvLmNoZWNrZWQpO1xuICAgIFxuICAgICAgICBpZiAoIWNoZWNrZWQpIHtcbiAgICBcbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgYDxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+ICR7bWVzc2FnZX1gO1xuICAgIFxuICAgICAgICAgICAgZ3JvdXAuY2xhc3NMaXN0LmFkZChcIm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yXCIpO1xuICAgIFxuICAgICAgICAgICAgbGV0IGVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZXJyb3JJZCk7XG4gICAgXG4gICAgICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgXG4gICAgICAgICAgICAgICAgZXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICBcbiAgICAgICAgICAgICAgICBlcnJvci5pZCA9IGVycm9ySWQ7XG4gICAgICAgICAgICAgICAgZXJyb3IuY2xhc3NOYW1lID0gXCJuaHN1ay1lcnJvci1tZXNzYWdlXCI7XG4gICAgICAgICAgICAgICAgZXJyb3IuaW5uZXJIVE1MID0gZXJyb3JNZXNzYWdlO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZmllbGRzZXQgPSBncm91cC5xdWVyeVNlbGVjdG9yKFwiLm5oc3VrLWZpZWxkc2V0XCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJhZGlvcyA9IGZpZWxkc2V0LnF1ZXJ5U2VsZWN0b3IoXCIubmhzdWstcmFkaW9zXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZmllbGRzZXQuaW5zZXJ0QmVmb3JlKGVycm9yLCByYWRpb3MpO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgICAgICAgICAgYDxsaT48YSBocmVmPVwiIyR7cmFkaW9zWzBdLmlkfVwiPiR7bWVzc2FnZX08L2E+PC9saT5gXG4gICAgICAgICAgICApO1xuICAgIFxuICAgICAgICAgICAgcmFkaW9zWzBdLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgICAgICBcImFyaWEtZGVzY3JpYmVkYnlcIixcbiAgICAgICAgICAgICAgICBlcnJvcklkXG4gICAgICAgICAgICApO1xuICAgIFxuICAgICAgICAgICAgcmV0dXJuIHJhZGlvc1swXTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckVycm9ycygpIHtcbiAgICAgICAgZXJyb3JMaXN0LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIGVycm9yU3VtbWFyeS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uaHN1ay1mb3JtLWdyb3VwLS1lcnJvciwgLm5oc3VrLXRleHRhcmVhLS1lcnJvciwgLm5oc3VrLWlucHV0LS1lcnJvclwiKVxuICAgICAgICAgICAgLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZShcIm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yXCIsIFwibmhzdWstdGV4dGFyZWEtLWVycm9yXCIsIFwibmhzdWstaW5wdXQtLWVycm9yXCIpKTtcblxuICAgICAgICAvLyByZW1vdmUgdGFibGUtZ2VuZXJhdGVkIGVycm9ycyBvbmx5XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ZCAubmhzdWstZXJyb3ItbWVzc2FnZVwiKVxuICAgICAgICAgICAgLmZvckVhY2goZWwgPT4gZWwucmVtb3ZlKCkpO1xuXG4gICAgICAgIFtcbiAgICAgICAgICAgIFwibWVtYmVyc2hpcE51bWJlci1lcnJvclwiLFxuICAgICAgICAgICAgXCJtZW1iZXJGaXJzdEluaXRpYWwtZXJyb3JcIixcbiAgICAgICAgICAgIFwibWVtYmVyU3VybmFtZS1lcnJvclwiLFxuICAgICAgICAgICAgXCJyZWNvcmRUeXBlQ2hhbmdlLWVycm9yXCIsXG4gICAgICAgICAgICBcInNpdGVBdXRvLWVycm9yXCIsXG4gICAgICAgICAgICBcImRpcmVjdG9yYXRlLWVycm9yXCJcbiAgICAgICAgXS5mb3JFYWNoKGlkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICBcbiAgICAgICAgICAgIGlmIChlbCkge1xuICAgICAgICAgICAgICAgIGVsLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyByZW1vdmUgdGV4dGFyZWEgZXJyb3IgbWVzc2FnZSB0ZXh0XG4gICAgICAgIGNvbnN0IHJlYXNvbkVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpc3N1ZS1yZWFzb24tZXJyb3JcIik7XG5cbiAgICAgICAgaWYgKHJlYXNvbkVycm9yKSB7XG4gICAgICAgIHJlYXNvbkVycm9yLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxTQUFTLGlCQUFpQixvQkFBb0IsV0FBWTtBQUV0RCxRQUFNLFlBQVksU0FBUyxjQUFjLG9CQUFvQjtBQUM3RCxRQUFNLFlBQVksU0FBUyxlQUFlLGNBQWM7QUFDeEQsUUFBTSxnQkFBZ0IsU0FBUyxjQUFjLHVCQUF1QjtBQUNwRSxRQUFNLGFBQWEsU0FBUyxlQUFlLG1CQUFt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
