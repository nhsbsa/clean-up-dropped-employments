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
    const siteError = validateRequiredField({
      inputId: "siteName",
      groupId: "siteNameGroup",
      errorId: "siteName-error",
      message: "Enter the site you are based at",
      errors
    });
    if (!firstErrorField && siteError) {
      firstErrorField = siteError;
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
      if (!error) {
        error = document.createElement("span");
        error.id = errorId;
        error.className = "nhsuk-error-message";
        input.parentNode.insertBefore(error, input);
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
      "siteName-error",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L3NkLXJlcG9ydC12Mi5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcblxuICAgIGNvbnN0IHRhYmxlQm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXBvcnRUYWJsZSB0Ym9keScpO1xuICAgIGNvbnN0IGFkZEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRSb3dCdXR0b24nKTtcblxuICAgIC8vIFJlbW92ZSByb3dcbiAgICBmdW5jdGlvbiBiaW5kUmVtb3ZlTGlua3MoKSB7XG4gICAgICAgIHRhYmxlQm9keS5xdWVyeVNlbGVjdG9yQWxsKCcucmVtb3ZlLXJvdycpLmZvckVhY2gobGluayA9PiB7XG4gICAgICAgICAgICBsaW5rLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVtb3ZlSGFuZGxlcik7XG4gICAgICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVtb3ZlSGFuZGxlcik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUhhbmRsZXIoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IHJvdyA9IGUudGFyZ2V0LmNsb3Nlc3QoJ3RyJyk7XG4gICAgICAgIHJvdy5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICBiaW5kUmVtb3ZlTGlua3MoKTtcblxuICAgIC8vIEFkZCBuZXcgcm93XG4gICAgYWRkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGNvbnN0IHJvd0NvdW50ID0gdGFibGVCb2R5LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RyJykubGVuZ3RoICsgMTtcblxuICAgICAgICBjb25zdCBuZXdSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuICAgICAgICBuZXdSb3cuY2xhc3NMaXN0LmFkZCgnbmhzdWstdGFibGVfX3JvdycpO1xuXG4gICAgICAgIG5ld1Jvdy5pbm5lckhUTUwgPSBgXG4gICAgICAgIDx0ZCBjbGFzcz1cIm5oc3VrLXRhYmxlX19jZWxsXCI+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJuaHN1ay1pbnB1dCBuaHN1ay1pbnB1dC0td2lkdGgtMTAgbmhzdWstdS1mb250LXNpemUtMTRcIlxuICAgICAgICAgICAgICAgICAgICBpZD1cInNldHMtJHtyb3dDb3VudH1cIlxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwic2V0c1tdXCJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIj5cbiAgICAgICAgPC90ZD5cbiAgICBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGxcIj5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm5oc3VrLWlucHV0IG5oc3VrLWlucHV0LS13aWR0aC0xMCBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiXG4gICAgICAgICAgICAgICAgICAgIGlkPVwiZmllbGRzLSR7cm93Q291bnR9XCJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cImZpZWxkc1tdXCJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIj5cbiAgICAgICAgPC90ZD5cbiAgICBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGxcIj5cbiAgICAgICAgICAgIDx0ZXh0YXJlYSByb3dzPVwiMVwiIGNsYXNzPVwibmhzdWstdGV4dGFyZWEgbmhzdWstdS1mb250LXNpemUtMTRcIlxuICAgICAgICAgICAgICAgICAgICBpZD1cImFtZW5kbWVudHMtJHtyb3dDb3VudH1cIlxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwiYW1lbmRtZW50c1tdXCI+PC90ZXh0YXJlYT5cbiAgICAgICAgPC90ZD5cbiAgICBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGwgIG5oc3VrLXUtZm9udC1zaXplLTE0XCI+XG4gICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJyZW1vdmUtcm93IG5oc3VrLWxpbmtcIj5cbiAgICAgICAgICAgIFJlbW92ZVxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPnJvdyAke3Jvd0NvdW50fTwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgICAgICA8L3RkPlxuICAgIGA7XG5cbiAgICAgICAgdGFibGVCb2R5LmFwcGVuZENoaWxkKG5ld1Jvdyk7XG4gICAgICAgIGJpbmRSZW1vdmVMaW5rcygpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVwb3J0Rm9ybVwiKTtcbiAgICBjb25zdCBlcnJvclN1bW1hcnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yU3VtbWFyeVwiKTtcbiAgICBjb25zdCBlcnJvckxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yTGlzdFwiKTtcblxuICAgIGNvbnN0IHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXBvcnRUYWJsZVwiKTtcblxuICAgIGNvbnN0IGZpZWxkcyA9IFtcInNldHNbXVwiLCBcImZpZWxkc1tdXCIsIFwiYW1lbmRtZW50c1tdXCIsIFwicmVhc29uW11cIl07XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gU1VCTUlUIFZBTElEQVRJT05cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjbGVhckVycm9ycygpO1xuXG4gICAgICAgIGxldCBlcnJvcnMgPSBbXTtcbiAgICAgICAgbGV0IGZpcnN0RXJyb3JGaWVsZCA9IG51bGw7XG5cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIC8vIERFU0NSSVBUSU9OIFZBTElEQVRJT05cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAgIGNvbnN0IHJvd3MgPSB0YWJsZS5xdWVyeVNlbGVjdG9yQWxsKFwidGJvZHkgdHJcIik7XG5cbiAgICAgICAgcm93cy5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbnB1dHMgPSBnZXRSb3dJbnB1dHMocm93KTtcblxuICAgICAgICAgICAgY29uc3Qgcm93SGFzRGF0YSA9IGlucHV0cy5zb21lKGkgPT4gaS52YWx1ZS50cmltKCkgIT09IFwiXCIpO1xuXG4gICAgICAgICAgICAvLyBpZ25vcmUgZW1wdHkgcm93cyBjb21wbGV0ZWx5XG4gICAgICAgICAgICBpZiAoIXJvd0hhc0RhdGEpIHJldHVybjtcblxuICAgICAgICAgICAgaW5wdXRzLmZvckVhY2goKGlucHV0LCBjb2xJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBnZXRFcnJvck1lc3NhZ2UoY29sSW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFpbnB1dC52YWx1ZS50cmltKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3JJZCA9IGVuc3VyZUVycm9yKGlucHV0LCBtZXNzYWdlLCByb3dJbmRleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICBgPGxpPjxhIGhyZWY9XCIjJHtlcnJvcklkfVwiPiR7bWVzc2FnZX0gKHJvdyAke3Jvd0luZGV4ICsgMX0pPC9hPjwvbGk+YFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBpbnB1dDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIC8vIFJFQVNPTiBURVhUQVJFQSBWQUxJREFUSU9OXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgICBjb25zdCByZWFzb25Hcm91cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXNzdWVSZWFzb25cIik7XG4gICAgICAgIGNvbnN0IHJlYXNvblRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpc3N1ZS1yZWFzb25cIik7XG5cbiAgICAgICAgaWYgKCFyZWFzb25UZXh0YXJlYS52YWx1ZS50cmltKCkpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+RW50ZXIgdGhlIHJlYXNvbiB3aHkgeW91IHJlcXVpcmUgYW4gdXBkYXRlIGZvciB0aGlzIHJlY29yZCc7XG5cbiAgICAgICAgICAgIC8vIGFkZCBOSFMgZXJyb3Igc3R5bGluZ1xuICAgICAgICAgICAgcmVhc29uR3JvdXAuY2xhc3NMaXN0LmFkZChcIm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yXCIpO1xuICAgICAgICAgICAgcmVhc29uVGV4dGFyZWEuY2xhc3NMaXN0LmFkZChcIm5oc3VrLXRleHRhcmVhLS1lcnJvclwiKTtcblxuICAgICAgICAgICAgLy8gY3JlYXRlIGVycm9yIG1lc3NhZ2UgaWYgaXQgZG9lc24ndCBleGlzdFxuICAgICAgICAgICAgbGV0IGVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpc3N1ZS1yZWFzb24tZXJyb3JcIik7XG5cbiAgICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBlcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgICAgIGVycm9yLmlkID0gXCJpc3N1ZS1yZWFzb24tZXJyb3JcIjtcbiAgICAgICAgICAgICAgICBlcnJvci5jbGFzc05hbWUgPSBcIm5oc3VrLWVycm9yLW1lc3NhZ2VcIjtcbiAgICAgICAgICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBtZXNzYWdlO1xuXG4gICAgICAgICAgICAgICAgcmVhc29uVGV4dGFyZWEucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZXJyb3IsIHJlYXNvblRleHRhcmVhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZW5zdXJlIGNvcnJlY3QgbWVzc2FnZSB0ZXh0XG4gICAgICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBtZXNzYWdlO1xuXG4gICAgICAgICAgICAvLyBhY2Nlc3NpYmlsaXR5XG4gICAgICAgICAgICByZWFzb25UZXh0YXJlYS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgXCJhcmlhLWRlc2NyaWJlZGJ5XCIsXG4gICAgICAgICAgICAgICAgXCJpc3N1ZS1yZWFzb24tZXJyb3JcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gYWRkIHRvIHN1bW1hcnlcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICAgICAgICAgIGA8bGk+PGEgaHJlZj1cIiNpc3N1ZS1yZWFzb25cIj5FbnRlciB0aGUgcmVhc29uIHdoeSB5b3UgcmVxdWlyZSBhbiB1cGRhdGUgZm9yIHRoaXMgcmVjb3JkPC9hPjwvbGk+YFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gZm9jdXMgZmlyc3QgaW52YWxpZCBmaWVsZFxuICAgICAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQpIHtcbiAgICAgICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSByZWFzb25UZXh0YXJlYTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1lbWJlckVycm9yID0gdmFsaWRhdGVSZXF1aXJlZEZpZWxkKHtcbiAgICAgICAgICAgIGlucHV0SWQ6IFwibWVtYmVyc2hpcE51bWJlclwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJtZW1iZXJzaGlwTnVtYmVyR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwibWVtYmVyc2hpcE51bWJlci1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJFbnRlciB0aGUgbWVtYmVyIG51bWJlclwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIG1lbWJlckVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBtZW1iZXJFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGluaXRpYWxFcnJvciA9IHZhbGlkYXRlUmVxdWlyZWRGaWVsZCh7XG4gICAgICAgICAgICBpbnB1dElkOiBcIm1lbWJlckZpcnN0SW5pdGlhbFwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJtZW1iZXJGaXJzdEluaXRpYWxHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJtZW1iZXJGaXJzdEluaXRpYWwtZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiRW50ZXIgdGhlIG1lbWJlcnMgZmlyc3QgaW5pdGlhbFwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIGluaXRpYWxFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gaW5pdGlhbEVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3VybmFtZUVycm9yID0gdmFsaWRhdGVSZXF1aXJlZEZpZWxkKHtcbiAgICAgICAgICAgIGlucHV0SWQ6IFwibWVtYmVyU3VybmFtZVwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJtZW1iZXJTdXJuYW1lR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwibWVtYmVyU3VybmFtZS1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJFbnRlciB0aGUgbWVtYmVycyBzdXJuYW1lXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgc3VybmFtZUVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBzdXJuYW1lRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZWNvcmRUeXBlQ2hhbmdlRXJyb3IgPSB2YWxpZGF0ZVJhZGlvR3JvdXAoe1xuICAgICAgICAgICAgbmFtZTogXCJyZWNvcmRUeXBlQ2hhbmdlXCIsXG4gICAgICAgICAgICBncm91cElkOiBcInJlY29yZFR5cGVDaGFuZ2VHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJyZWNvcmRUeXBlQ2hhbmdlLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIlNlbGVjdCBhIHR5cGUgb2YgY2hhbmdlXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiByZWNvcmRUeXBlQ2hhbmdlRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IHJlY29yZFR5cGVDaGFuZ2VFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvcnJ1cHRlZEVycm9yID0gdmFsaWRhdGVSYWRpb0dyb3VwKHtcbiAgICAgICAgICAgIG5hbWU6IFwiY29ycnVwdGVkXCIsXG4gICAgICAgICAgICBncm91cElkOiBcImNvcnJ1cHRlZEdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcImNvcnJ1cHRlZC1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJTZWxlY3QgeWVzIGlmIHlvdXIgZmlsZSBoYXMgYmVlbiBjb3JydXB0ZWRcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIGNvcnJ1cHRlZEVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBjb3JydXB0ZWRFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBheW1lbnRFcnJvciA9IHZhbGlkYXRlUmFkaW9Hcm91cCh7XG4gICAgICAgICAgICBuYW1lOiBcInBheW1lbnRcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwicGF5bWVudEdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcInBheW1lbnQtZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiU2VsZWN0IHllcyBpZiBwYXltZW50IHdpbGwgYmUgYWZmZWN0ZWRcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIHBheW1lbnRFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gcGF5bWVudEVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2l0ZUVycm9yID0gdmFsaWRhdGVSZXF1aXJlZEZpZWxkKHtcbiAgICAgICAgICAgIGlucHV0SWQ6IFwic2l0ZU5hbWVcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwic2l0ZU5hbWVHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJzaXRlTmFtZS1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJFbnRlciB0aGUgc2l0ZSB5b3UgYXJlIGJhc2VkIGF0XCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgc2l0ZUVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBzaXRlRXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGRpcmVjdG9yYXRlRXJyb3IgPSB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICAgICAgaW5wdXRJZDogXCJkaXJlY3RvcmF0ZVwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJkaXJlY3RvcmF0ZUdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcImRpcmVjdG9yYXRlLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkVudGVyIHlvdXIgZGlyZWN0b3JhdGVcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBkaXJlY3RvcmF0ZUVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBkaXJlY3RvcmF0ZUVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBlcnJvckxpc3QuaW5uZXJIVE1MID0gZXJyb3JzLmpvaW4oXCJcIik7XG4gICAgICAgICAgICBlcnJvclN1bW1hcnkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcblxuICAgICAgICAgICAgZXJyb3JTdW1tYXJ5LnNjcm9sbEludG9WaWV3KHsgYmVoYXZpb3I6IFwic21vb3RoXCIgfSk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm0uc3VibWl0KCk7XG4gICAgfSk7XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gSEVMUEVSU1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGZ1bmN0aW9uIGdldFJvd0lucHV0cyhyb3cpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHJvdy5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwic2V0c1tdXCJdJyksXG4gICAgICAgICAgICByb3cucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImZpZWxkc1tdXCJdJyksXG4gICAgICAgICAgICByb3cucXVlcnlTZWxlY3RvcigndGV4dGFyZWFbbmFtZT1cImFtZW5kbWVudHNbXVwiXScpLFxuICAgICAgICBdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEVycm9yTWVzc2FnZShpbmRleCkge1xuICAgICAgICBzd2l0Y2ggKGluZGV4KSB7XG4gICAgICAgICAgICBjYXNlIDA6IFxuICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj5FbnRlciB0aGUgc2V0JztcbiAgICAgICAgICAgIGNhc2UgMTogXG4gICAgICAgICAgICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPkVudGVyIHRoZSBmaWVsZCc7XG4gICAgICAgICAgICBjYXNlIDI6IFxuICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj5FbnRlciB0aGUgYW1lbmRtZW50JztcbiAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZCc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbnN1cmVFcnJvcihpbnB1dCwgbWVzc2FnZSwgcm93SW5kZXgpIHtcbiAgICAgICAgY29uc3QgY2VsbCA9IGlucHV0LmNsb3Nlc3QoXCJ0ZFwiKTtcblxuICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJuaHN1ay1mb3JtLWdyb3VwLS1lcnJvclwiKTtcblxuICAgICAgICBsZXQgZXJyb3IgPSBjZWxsLnF1ZXJ5U2VsZWN0b3IoXCIubmhzdWstZXJyb3ItbWVzc2FnZVwiKTtcblxuICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgICBlcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgZXJyb3IuY2xhc3NOYW1lID0gXCJuaHN1ay1lcnJvci1tZXNzYWdlIG5oc3VrLXUtZm9udC1zaXplLTE0XCI7XG4gICAgICAgICAgICBjZWxsLmluc2VydEJlZm9yZShlcnJvciwgaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXJyb3IuaW5uZXJIVE1MID0gbWVzc2FnZTtcblxuICAgICAgICBjb25zdCBlcnJvcklkID0gaW5wdXQuaWQgfHwgYHJvdy0ke3Jvd0luZGV4fS0ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIsIDcpfWA7XG5cbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiYXJpYS1kZXNjcmliZWRieVwiLCBlcnJvcklkKTtcbiAgICAgICAgaW5wdXQuaWQgPSBlcnJvcklkO1xuXG4gICAgICAgIHJldHVybiBlcnJvcklkO1xuICAgIH1cblxuICAgIC8vIEhlbHBlciBmb3IgdGhlIHRleHQgZmllbGQgdmFsaWRhdGlvblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlUmVxdWlyZWRGaWVsZCh7XG4gICAgICAgIGlucHV0SWQsXG4gICAgICAgIGdyb3VwSWQsXG4gICAgICAgIGVycm9ySWQsXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIGVycm9yc1xuICAgIH0pIHtcbiAgICBcbiAgICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbnB1dElkKTtcbiAgICAgICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChncm91cElkKTtcbiAgICBcbiAgICAgICAgaWYgKCFpbnB1dC52YWx1ZS50cmltKCkpIHtcbiAgICBcbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgYDxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+ICR7bWVzc2FnZX1gO1xuICAgIFxuICAgICAgICAgICAgZ3JvdXAuY2xhc3NMaXN0LmFkZChcIm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yXCIpO1xuICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZChcIm5oc3VrLWlucHV0LS1lcnJvclwiKTtcbiAgICBcbiAgICAgICAgICAgIGxldCBlcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVycm9ySWQpO1xuICAgIFxuICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgICAgIGVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICAgICAgZXJyb3IuaWQgPSBlcnJvcklkO1xuICAgICAgICAgICAgICAgIGVycm9yLmNsYXNzTmFtZSA9IFwibmhzdWstZXJyb3ItbWVzc2FnZVwiO1xuICAgIFxuICAgICAgICAgICAgICAgIGlucHV0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVycm9yLCBpbnB1dCk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBlcnJvck1lc3NhZ2U7XG4gICAgXG4gICAgICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRlc2NyaWJlZGJ5XCIsIGVycm9ySWQpO1xuICAgIFxuICAgICAgICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgICAgICAgICAgYDxsaT48YSBocmVmPVwiIyR7aW5wdXRJZH1cIj4ke21lc3NhZ2V9PC9hPjwvbGk+YFxuICAgICAgICAgICAgKTtcbiAgICBcbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhlbHBlciBmb3IgdGhlIHJhZGlvIGJ1dHRvbiB2YWxpZGF0aW9uXG4gICAgZnVuY3Rpb24gdmFsaWRhdGVSYWRpb0dyb3VwKHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgZ3JvdXBJZCxcbiAgICAgICAgZXJyb3JJZCxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgZXJyb3JzXG4gICAgfSkge1xuICAgIFxuICAgICAgICBjb25zdCByYWRpb3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgYGlucHV0W25hbWU9XCIke25hbWV9XCJdYFxuICAgICAgICApO1xuICAgIFxuICAgICAgICBjb25zdCBncm91cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGdyb3VwSWQpO1xuICAgIFxuICAgICAgICBjb25zdCBjaGVja2VkID0gWy4uLnJhZGlvc10uc29tZShyYWRpbyA9PiByYWRpby5jaGVja2VkKTtcbiAgICBcbiAgICAgICAgaWYgKCFjaGVja2VkKSB7XG4gICAgXG4gICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPVxuICAgICAgICAgICAgICAgIGA8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPiAke21lc3NhZ2V9YDtcbiAgICBcbiAgICAgICAgICAgIGdyb3VwLmNsYXNzTGlzdC5hZGQoXCJuaHN1ay1mb3JtLWdyb3VwLS1lcnJvclwiKTtcbiAgICBcbiAgICAgICAgICAgIGxldCBlcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVycm9ySWQpO1xuICAgIFxuICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgIFxuICAgICAgICAgICAgICAgIGVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgXG4gICAgICAgICAgICAgICAgZXJyb3IuaWQgPSBlcnJvcklkO1xuICAgICAgICAgICAgICAgIGVycm9yLmNsYXNzTmFtZSA9IFwibmhzdWstZXJyb3ItbWVzc2FnZVwiO1xuICAgICAgICAgICAgICAgIGVycm9yLmlubmVySFRNTCA9IGVycm9yTWVzc2FnZTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkc2V0ID0gZ3JvdXAucXVlcnlTZWxlY3RvcihcIi5uaHN1ay1maWVsZHNldFwiKTtcbiAgICAgICAgICAgICAgICBjb25zdCByYWRpb3MgPSBmaWVsZHNldC5xdWVyeVNlbGVjdG9yKFwiLm5oc3VrLXJhZGlvc1wiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGZpZWxkc2V0Lmluc2VydEJlZm9yZShlcnJvciwgcmFkaW9zKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICAgICAgICAgIGA8bGk+PGEgaHJlZj1cIiMke3JhZGlvc1swXS5pZH1cIj4ke21lc3NhZ2V9PC9hPjwvbGk+YFxuICAgICAgICAgICAgKTtcbiAgICBcbiAgICAgICAgICAgIHJhZGlvc1swXS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgXCJhcmlhLWRlc2NyaWJlZGJ5XCIsXG4gICAgICAgICAgICAgICAgZXJyb3JJZFxuICAgICAgICAgICAgKTtcbiAgICBcbiAgICAgICAgICAgIHJldHVybiByYWRpb3NbMF07XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJFcnJvcnMoKSB7XG4gICAgICAgIGVycm9yTGlzdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBlcnJvclN1bW1hcnkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmhzdWstZm9ybS1ncm91cC0tZXJyb3IsIC5uaHN1ay10ZXh0YXJlYS0tZXJyb3IsIC5uaHN1ay1pbnB1dC0tZXJyb3JcIilcbiAgICAgICAgICAgIC5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoXCJuaHN1ay1mb3JtLWdyb3VwLS1lcnJvclwiLCBcIm5oc3VrLXRleHRhcmVhLS1lcnJvclwiLCBcIm5oc3VrLWlucHV0LS1lcnJvclwiKSk7XG5cbiAgICAgICAgLy8gcmVtb3ZlIHRhYmxlLWdlbmVyYXRlZCBlcnJvcnMgb25seVxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwidGQgLm5oc3VrLWVycm9yLW1lc3NhZ2VcIilcbiAgICAgICAgICAgIC5mb3JFYWNoKGVsID0+IGVsLnJlbW92ZSgpKTtcblxuICAgICAgICBbXG4gICAgICAgICAgICBcIm1lbWJlcnNoaXBOdW1iZXItZXJyb3JcIixcbiAgICAgICAgICAgIFwibWVtYmVyRmlyc3RJbml0aWFsLWVycm9yXCIsXG4gICAgICAgICAgICBcIm1lbWJlclN1cm5hbWUtZXJyb3JcIixcbiAgICAgICAgICAgIFwicmVjb3JkVHlwZUNoYW5nZS1lcnJvclwiLFxuICAgICAgICAgICAgXCJzaXRlTmFtZS1lcnJvclwiLFxuICAgICAgICAgICAgXCJkaXJlY3RvcmF0ZS1lcnJvclwiXG4gICAgICAgIF0uZm9yRWFjaChpZCA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgXG4gICAgICAgICAgICBpZiAoZWwpIHtcbiAgICAgICAgICAgICAgICBlbC5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcmVtb3ZlIHRleHRhcmVhIGVycm9yIG1lc3NhZ2UgdGV4dFxuICAgICAgICBjb25zdCByZWFzb25FcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXNzdWUtcmVhc29uLWVycm9yXCIpO1xuXG4gICAgICAgIGlmIChyZWFzb25FcnJvcikge1xuICAgICAgICByZWFzb25FcnJvci5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICB9XG4gICAgfVxuXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQUEsU0FBUyxpQkFBaUIsb0JBQW9CLFdBQVk7QUFFdEQsUUFBTSxZQUFZLFNBQVMsY0FBYyxv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eEM7QUFFQSxhQUFPO0FBQUEsSUFDWDtBQUFBLEVBQ0o7QUFHQSxXQUFTLG1CQUFtQjtBQUFBLElBQ3hCO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0osR0FBRztBQUVDLFVBQU0sU0FBUyxTQUFTO0FBQUEsTUFDcEIsZUFBZSxJQUFJO0FBQUEsSUFDdkI7QUFFQSxVQUFNLFFBQVEsU0FBUyxlQUFlLE9BQU87QUFFN0MsVUFBTSxVQUFVLENBQUMsR0FBRyxNQUFNLEVBQUUsS0FBSyxXQUFTLE1BQU0sT0FBTztBQUV2RCxRQUFJLENBQUMsU0FBUztBQUVWLFlBQU0sZUFDRix1REFBdUQsT0FBTztBQUVsRSxZQUFNLFVBQVUsSUFBSSx5QkFBeUI7QUFFN0MsVUFBSSxRQUFRLFNBQVMsZUFBZSxPQUFPO0FBRTNDLFVBQUksQ0FBQyxPQUFPO0FBRVIsZ0JBQVEsU0FBUyxjQUFjLE1BQU07QUFFckMsY0FBTSxLQUFLO0FBQ1gsY0FBTSxZQUFZO0FBQ2xCLGNBQU0sWUFBWTtBQUVsQixjQUFNLFdBQVcsTUFBTSxjQUFjLGlCQUFpQjtBQUN0RCxjQUFNQSxVQUFTLFNBQVMsY0FBYyxlQUFlO0FBRXJELGlCQUFTLGFBQWEsT0FBT0EsT0FBTTtBQUFBLE1BQ3ZDO0FBRUEsYUFBTztBQUFBLFFBQ0gsaUJBQWlCLE9BQU8sQ0FBQyxFQUFFLEVBQUUsS0FBSyxPQUFPO0FBQUEsTUFDN0M7QUFFQSxhQUFPLENBQUMsRUFBRTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsTUFDSjtBQUVBLGFBQU8sT0FBTyxDQUFDO0FBQUEsSUFDbkI7QUFFQSxXQUFPO0FBQUEsRUFDWDtBQUVBLFdBQVMsY0FBYztBQUNuQixjQUFVLFlBQVk7QUFDdEIsaUJBQWEsTUFBTSxVQUFVO0FBRTdCLGFBQVMsaUJBQWlCLHVFQUF1RSxFQUM1RixRQUFRLFFBQU0sR0FBRyxVQUFVLE9BQU8sMkJBQTJCLHlCQUF5QixvQkFBb0IsQ0FBQztBQUdoSCxhQUFTLGlCQUFpQix5QkFBeUIsRUFDOUMsUUFBUSxRQUFNLEdBQUcsT0FBTyxDQUFDO0FBRTlCO0FBQUEsTUFDSTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDSixFQUFFLFFBQVEsUUFBTTtBQUNaLFlBQU0sS0FBSyxTQUFTLGVBQWUsRUFBRTtBQUVyQyxVQUFJLElBQUk7QUFDSixXQUFHLE9BQU87QUFBQSxNQUNkO0FBQUEsSUFDSixDQUFDO0FBR0QsVUFBTSxjQUFjLFNBQVMsZUFBZSxvQkFBb0I7QUFFaEUsUUFBSSxhQUFhO0FBQ2pCLGtCQUFZLFlBQVk7QUFBQSxJQUN4QjtBQUFBLEVBQ0o7QUFFSixDQUFDOyIsCiAgIm5hbWVzIjogWyJyYWRpb3MiXQp9Cg==
