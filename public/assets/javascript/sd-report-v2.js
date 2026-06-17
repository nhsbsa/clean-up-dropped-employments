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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L3NkLXJlcG9ydC12Mi5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcblxuICAgIGNvbnN0IHRhYmxlQm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXBvcnRUYWJsZSB0Ym9keScpO1xuICAgIGNvbnN0IGFkZEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRSb3dCdXR0b24nKTtcblxuICAgIC8vIFJlbW92ZSByb3dcbiAgICBmdW5jdGlvbiBiaW5kUmVtb3ZlTGlua3MoKSB7XG4gICAgICAgIHRhYmxlQm9keS5xdWVyeVNlbGVjdG9yQWxsKCcucmVtb3ZlLXJvdycpLmZvckVhY2gobGluayA9PiB7XG4gICAgICAgICAgICBsaW5rLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVtb3ZlSGFuZGxlcik7XG4gICAgICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVtb3ZlSGFuZGxlcik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUhhbmRsZXIoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IHJvdyA9IGUudGFyZ2V0LmNsb3Nlc3QoJ3RyJyk7XG4gICAgICAgIHJvdy5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICBiaW5kUmVtb3ZlTGlua3MoKTtcblxuICAgIC8vIEFkZCBuZXcgcm93XG4gICAgYWRkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGNvbnN0IHJvd0NvdW50ID0gdGFibGVCb2R5LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RyJykubGVuZ3RoICsgMTtcblxuICAgICAgICBjb25zdCBuZXdSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuICAgICAgICBuZXdSb3cuY2xhc3NMaXN0LmFkZCgnbmhzdWstdGFibGVfX3JvdycpO1xuXG4gICAgICAgIG5ld1Jvdy5pbm5lckhUTUwgPSBgXG4gICAgICAgIDx0ZCBjbGFzcz1cIm5oc3VrLXRhYmxlX19jZWxsXCI+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJuaHN1ay1pbnB1dCBuaHN1ay1pbnB1dC0td2lkdGgtMTAgbmhzdWstdS1mb250LXNpemUtMTRcIlxuICAgICAgICAgICAgICAgICAgICBpZD1cInNldHMtJHtyb3dDb3VudH1cIlxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwic2V0c1tdXCJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIj5cbiAgICAgICAgPC90ZD5cbiAgICBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGxcIj5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm5oc3VrLWlucHV0IG5oc3VrLWlucHV0LS13aWR0aC0xMCBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiXG4gICAgICAgICAgICAgICAgICAgIGlkPVwiZmllbGRzLSR7cm93Q291bnR9XCJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cImZpZWxkc1tdXCJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIj5cbiAgICAgICAgPC90ZD5cbiAgICBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGxcIj5cbiAgICAgICAgICAgIDx0ZXh0YXJlYSByb3dzPVwiMVwiIGNsYXNzPVwibmhzdWstdGV4dGFyZWEgbmhzdWstdS1mb250LXNpemUtMTRcIlxuICAgICAgICAgICAgICAgICAgICBpZD1cImFtZW5kbWVudHMtJHtyb3dDb3VudH1cIlxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwiYW1lbmRtZW50c1tdXCI+PC90ZXh0YXJlYT5cbiAgICAgICAgPC90ZD5cbiAgICBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGwgIG5oc3VrLXUtZm9udC1zaXplLTE0XCI+XG4gICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJyZW1vdmUtcm93IG5oc3VrLWxpbmtcIj5cbiAgICAgICAgICAgIFJlbW92ZVxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPnJvdyAke3Jvd0NvdW50fTwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgICAgICA8L3RkPlxuICAgIGA7XG5cbiAgICAgICAgdGFibGVCb2R5LmFwcGVuZENoaWxkKG5ld1Jvdyk7XG4gICAgICAgIGJpbmRSZW1vdmVMaW5rcygpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVwb3J0Rm9ybVwiKTtcbiAgICBjb25zdCBlcnJvclN1bW1hcnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yU3VtbWFyeVwiKTtcbiAgICBjb25zdCBlcnJvckxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yTGlzdFwiKTtcblxuICAgIGNvbnN0IHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXBvcnRUYWJsZVwiKTtcblxuICAgIGNvbnN0IGZpZWxkcyA9IFtcInNldHNbXVwiLCBcImZpZWxkc1tdXCIsIFwiYW1lbmRtZW50c1tdXCIsIFwicmVhc29uW11cIl07XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gU1VCTUlUIFZBTElEQVRJT05cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjbGVhckVycm9ycygpO1xuXG4gICAgICAgIGxldCBlcnJvcnMgPSBbXTtcbiAgICAgICAgbGV0IGZpcnN0RXJyb3JGaWVsZCA9IG51bGw7XG5cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIC8vIERFU0NSSVBUSU9OIFZBTElEQVRJT05cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAgIGNvbnN0IHJvd3MgPSB0YWJsZS5xdWVyeVNlbGVjdG9yQWxsKFwidGJvZHkgdHJcIik7XG5cbiAgICAgICAgcm93cy5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbnB1dHMgPSBnZXRSb3dJbnB1dHMocm93KTtcblxuICAgICAgICAgICAgY29uc3Qgcm93SGFzRGF0YSA9IGlucHV0cy5zb21lKGkgPT4gaS52YWx1ZS50cmltKCkgIT09IFwiXCIpO1xuXG4gICAgICAgICAgICAvLyBpZ25vcmUgZW1wdHkgcm93cyBjb21wbGV0ZWx5XG4gICAgICAgICAgICBpZiAoIXJvd0hhc0RhdGEpIHJldHVybjtcblxuICAgICAgICAgICAgaW5wdXRzLmZvckVhY2goKGlucHV0LCBjb2xJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBnZXRFcnJvck1lc3NhZ2UoY29sSW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFpbnB1dC52YWx1ZS50cmltKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3JJZCA9IGVuc3VyZUVycm9yKGlucHV0LCBtZXNzYWdlLCByb3dJbmRleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICBgPGxpPjxhIGhyZWY9XCIjJHtlcnJvcklkfVwiPiR7bWVzc2FnZX0gKHJvdyAke3Jvd0luZGV4ICsgMX0pPC9hPjwvbGk+YFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBpbnB1dDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIC8vIFJFQVNPTiBURVhUQVJFQSBWQUxJREFUSU9OXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgICBjb25zdCByZWFzb25Hcm91cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXNzdWVSZWFzb25cIik7XG4gICAgICAgIGNvbnN0IHJlYXNvblRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpc3N1ZS1yZWFzb25cIik7XG5cbiAgICAgICAgaWYgKCFyZWFzb25UZXh0YXJlYS52YWx1ZS50cmltKCkpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+RW50ZXIgdGhlIHJlYXNvbiB3aHkgeW91IHJlcXVpcmUgYW4gdXBkYXRlIGZvciB0aGlzIHJlY29yZCc7XG5cbiAgICAgICAgICAgIC8vIGFkZCBOSFMgZXJyb3Igc3R5bGluZ1xuICAgICAgICAgICAgcmVhc29uR3JvdXAuY2xhc3NMaXN0LmFkZChcIm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yXCIpO1xuICAgICAgICAgICAgcmVhc29uVGV4dGFyZWEuY2xhc3NMaXN0LmFkZChcIm5oc3VrLXRleHRhcmVhLS1lcnJvclwiKTtcblxuICAgICAgICAgICAgLy8gY3JlYXRlIGVycm9yIG1lc3NhZ2UgaWYgaXQgZG9lc24ndCBleGlzdFxuICAgICAgICAgICAgbGV0IGVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpc3N1ZS1yZWFzb24tZXJyb3JcIik7XG5cbiAgICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBlcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgICAgIGVycm9yLmlkID0gXCJpc3N1ZS1yZWFzb24tZXJyb3JcIjtcbiAgICAgICAgICAgICAgICBlcnJvci5jbGFzc05hbWUgPSBcIm5oc3VrLWVycm9yLW1lc3NhZ2VcIjtcbiAgICAgICAgICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBtZXNzYWdlO1xuXG4gICAgICAgICAgICAgICAgcmVhc29uVGV4dGFyZWEucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZXJyb3IsIHJlYXNvblRleHRhcmVhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZW5zdXJlIGNvcnJlY3QgbWVzc2FnZSB0ZXh0XG4gICAgICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBtZXNzYWdlO1xuXG4gICAgICAgICAgICAvLyBhY2Nlc3NpYmlsaXR5XG4gICAgICAgICAgICByZWFzb25UZXh0YXJlYS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgXCJhcmlhLWRlc2NyaWJlZGJ5XCIsXG4gICAgICAgICAgICAgICAgXCJpc3N1ZS1yZWFzb24tZXJyb3JcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gYWRkIHRvIHN1bW1hcnlcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICAgICAgICAgIGA8bGk+PGEgaHJlZj1cIiNpc3N1ZS1yZWFzb25cIj5FbnRlciB0aGUgcmVhc29uIHdoeSB5b3UgcmVxdWlyZSBhbiB1cGRhdGUgZm9yIHRoaXMgcmVjb3JkPC9hPjwvbGk+YFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gZm9jdXMgZmlyc3QgaW52YWxpZCBmaWVsZFxuICAgICAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQpIHtcbiAgICAgICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSByZWFzb25UZXh0YXJlYTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgLy8gU1RBTkRBUkQgRk9STSBGSUVMRFMgVkFMSURBVElPTlxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgICAgY29uc3QgbWVtYmVyRXJyb3IgPSB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICAgICAgaW5wdXRJZDogXCJtZW1iZXJzaGlwTnVtYmVyXCIsXG4gICAgICAgICAgICBncm91cElkOiBcIm1lbWJlcnNoaXBOdW1iZXJHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJtZW1iZXJzaGlwTnVtYmVyLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkVudGVyIHRoZSBtZW1iZXIgbnVtYmVyXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgbWVtYmVyRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IG1lbWJlckVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaW5pdGlhbEVycm9yID0gdmFsaWRhdGVSZXF1aXJlZEZpZWxkKHtcbiAgICAgICAgICAgIGlucHV0SWQ6IFwibWVtYmVyRmlyc3RJbml0aWFsXCIsXG4gICAgICAgICAgICBncm91cElkOiBcIm1lbWJlckZpcnN0SW5pdGlhbEdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcIm1lbWJlckZpcnN0SW5pdGlhbC1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJFbnRlciB0aGUgbWVtYmVycyBmaXJzdCBpbml0aWFsXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgaW5pdGlhbEVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBpbml0aWFsRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdXJuYW1lRXJyb3IgPSB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICAgICAgaW5wdXRJZDogXCJtZW1iZXJTdXJuYW1lXCIsXG4gICAgICAgICAgICBncm91cElkOiBcIm1lbWJlclN1cm5hbWVHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJtZW1iZXJTdXJuYW1lLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkVudGVyIHRoZSBtZW1iZXJzIHN1cm5hbWVcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBzdXJuYW1lRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IHN1cm5hbWVFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlY29yZFR5cGVDaGFuZ2VFcnJvciA9IHZhbGlkYXRlUmFkaW9Hcm91cCh7XG4gICAgICAgICAgICBuYW1lOiBcInJlY29yZFR5cGVDaGFuZ2VcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwicmVjb3JkVHlwZUNoYW5nZUdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcInJlY29yZFR5cGVDaGFuZ2UtZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiU2VsZWN0IGEgdHlwZSBvZiBjaGFuZ2VcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIHJlY29yZFR5cGVDaGFuZ2VFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gcmVjb3JkVHlwZUNoYW5nZUVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29ycnVwdGVkRXJyb3IgPSB2YWxpZGF0ZVJhZGlvR3JvdXAoe1xuICAgICAgICAgICAgbmFtZTogXCJjb3JydXB0ZWRcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwiY29ycnVwdGVkR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwiY29ycnVwdGVkLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIlNlbGVjdCB5ZXMgaWYgeW91ciBmaWxlIGhhcyBiZWVuIGNvcnJ1cHRlZFwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgY29ycnVwdGVkRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IGNvcnJ1cHRlZEVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGF5bWVudEVycm9yID0gdmFsaWRhdGVSYWRpb0dyb3VwKHtcbiAgICAgICAgICAgIG5hbWU6IFwicGF5bWVudFwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJwYXltZW50R3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwicGF5bWVudC1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJTZWxlY3QgeWVzIGlmIHBheW1lbnQgd2lsbCBiZSBhZmZlY3RlZFwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgcGF5bWVudEVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSBwYXltZW50RXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzaXRlQXV0b0Vycm9yID0gdmFsaWRhdGVSZXF1aXJlZEZpZWxkKHtcbiAgICAgICAgICAgIGlucHV0SWQ6IFwic2l0ZUF1dG9cIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwic2l0ZUF1dG9Hcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJzaXRlQXV0by1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJFbnRlciB0aGUgc2l0ZSB5b3UgYXJlIGJhc2VkIGF0XCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgc2l0ZUF1dG9FcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gc2l0ZUF1dG9FcnJvcjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY29uc3QgZGlyZWN0b3JhdGVFcnJvciA9IHZhbGlkYXRlUmVxdWlyZWRGaWVsZCh7XG4gICAgICAgICAgICBpbnB1dElkOiBcImRpcmVjdG9yYXRlXCIsXG4gICAgICAgICAgICBncm91cElkOiBcImRpcmVjdG9yYXRlR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwiZGlyZWN0b3JhdGUtZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiRW50ZXIgeW91ciBkaXJlY3RvcmF0ZVwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIGRpcmVjdG9yYXRlRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IGRpcmVjdG9yYXRlRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGVycm9yTGlzdC5pbm5lckhUTUwgPSBlcnJvcnMuam9pbihcIlwiKTtcbiAgICAgICAgICAgIGVycm9yU3VtbWFyeS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXG4gICAgICAgICAgICBlcnJvclN1bW1hcnkuc2Nyb2xsSW50b1ZpZXcoeyBiZWhhdmlvcjogXCJzbW9vdGhcIiB9KTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybS5zdWJtaXQoKTtcbiAgICB9KTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBIRUxQRVJTXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZnVuY3Rpb24gZ2V0Um93SW5wdXRzKHJvdykge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJzZXRzW11cIl0nKSxcbiAgICAgICAgICAgIHJvdy5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwiZmllbGRzW11cIl0nKSxcbiAgICAgICAgICAgIHJvdy5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYVtuYW1lPVwiYW1lbmRtZW50c1tdXCJdJyksXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RXJyb3JNZXNzYWdlKGluZGV4KSB7XG4gICAgICAgIHN3aXRjaCAoaW5kZXgpIHtcbiAgICAgICAgICAgIGNhc2UgMDogXG4gICAgICAgICAgICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPkVudGVyIHRoZSBzZXQnO1xuICAgICAgICAgICAgY2FzZSAxOiBcbiAgICAgICAgICAgICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+RW50ZXIgdGhlIGZpZWxkJztcbiAgICAgICAgICAgIGNhc2UgMjogXG4gICAgICAgICAgICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPkVudGVyIHRoZSBhbWVuZG1lbnQnO1xuICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuICdUaGlzIGZpZWxkIGlzIHJlcXVpcmVkJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVuc3VyZUVycm9yKGlucHV0LCBtZXNzYWdlLCByb3dJbmRleCkge1xuICAgICAgICBjb25zdCBjZWxsID0gaW5wdXQuY2xvc2VzdChcInRkXCIpO1xuXG4gICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcIm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yXCIpO1xuXG4gICAgICAgIGxldCBlcnJvciA9IGNlbGwucXVlcnlTZWxlY3RvcihcIi5uaHN1ay1lcnJvci1tZXNzYWdlXCIpO1xuXG4gICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgIGVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICBlcnJvci5jbGFzc05hbWUgPSBcIm5oc3VrLWVycm9yLW1lc3NhZ2UgbmhzdWstdS1mb250LXNpemUtMTRcIjtcbiAgICAgICAgICAgIGNlbGwuaW5zZXJ0QmVmb3JlKGVycm9yLCBpbnB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBtZXNzYWdlO1xuXG4gICAgICAgIGNvbnN0IGVycm9ySWQgPSBpbnB1dC5pZCB8fCBgcm93LSR7cm93SW5kZXh9LSR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMiwgNyl9YDtcblxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRlc2NyaWJlZGJ5XCIsIGVycm9ySWQpO1xuICAgICAgICBpbnB1dC5pZCA9IGVycm9ySWQ7XG5cbiAgICAgICAgcmV0dXJuIGVycm9ySWQ7XG4gICAgfVxuXG4gICAgLy8gSGVscGVyIGZvciB0aGUgdGV4dCBmaWVsZCB2YWxpZGF0aW9uXG4gICAgZnVuY3Rpb24gdmFsaWRhdGVSZXF1aXJlZEZpZWxkKHtcbiAgICAgICAgaW5wdXRJZCxcbiAgICAgICAgZ3JvdXBJZCxcbiAgICAgICAgZXJyb3JJZCxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgZXJyb3JzXG4gICAgfSkge1xuICAgIFxuICAgICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlucHV0SWQpO1xuICAgICAgICBjb25zdCBncm91cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGdyb3VwSWQpO1xuICAgIFxuICAgICAgICBpZiAoIWlucHV0LnZhbHVlLnRyaW0oKSkge1xuICAgIFxuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID1cbiAgICAgICAgICAgICAgICBgPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj4gJHttZXNzYWdlfWA7XG4gICAgXG4gICAgICAgICAgICBncm91cC5jbGFzc0xpc3QuYWRkKFwibmhzdWstZm9ybS1ncm91cC0tZXJyb3JcIik7XG4gICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKFwibmhzdWstaW5wdXQtLWVycm9yXCIpO1xuICAgIFxuICAgICAgICAgICAgbGV0IGVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZXJyb3JJZCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZvcm1Hcm91cCA9IGlucHV0LmNsb3Nlc3QoJy5uaHN1ay1mb3JtLWdyb3VwJyk7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IGZvcm1Hcm91cD8ucXVlcnlTZWxlY3RvcignLm5oc3VrLWxhYmVsJyk7XG5cbiAgICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBlcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgICAgIGVycm9yLmlkID0gZXJyb3JJZDtcbiAgICAgICAgICAgICAgICBlcnJvci5jbGFzc05hbWUgPSBcIm5oc3VrLWVycm9yLW1lc3NhZ2VcIjtcblxuICAgICAgICAgICAgICAgIGxhYmVsLmluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJlbmQnLCBlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBlcnJvck1lc3NhZ2U7XG4gICAgXG4gICAgICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRlc2NyaWJlZGJ5XCIsIGVycm9ySWQpO1xuICAgIFxuICAgICAgICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgICAgICAgICAgYDxsaT48YSBocmVmPVwiIyR7aW5wdXRJZH1cIj4ke21lc3NhZ2V9PC9hPjwvbGk+YFxuICAgICAgICAgICAgKTtcbiAgICBcbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhlbHBlciBmb3IgdGhlIHJhZGlvIGJ1dHRvbiB2YWxpZGF0aW9uXG4gICAgZnVuY3Rpb24gdmFsaWRhdGVSYWRpb0dyb3VwKHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgZ3JvdXBJZCxcbiAgICAgICAgZXJyb3JJZCxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgZXJyb3JzXG4gICAgfSkge1xuICAgIFxuICAgICAgICBjb25zdCByYWRpb3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgYGlucHV0W25hbWU9XCIke25hbWV9XCJdYFxuICAgICAgICApO1xuICAgIFxuICAgICAgICBjb25zdCBncm91cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGdyb3VwSWQpO1xuICAgIFxuICAgICAgICBjb25zdCBjaGVja2VkID0gWy4uLnJhZGlvc10uc29tZShyYWRpbyA9PiByYWRpby5jaGVja2VkKTtcbiAgICBcbiAgICAgICAgaWYgKCFjaGVja2VkKSB7XG4gICAgXG4gICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPVxuICAgICAgICAgICAgICAgIGA8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPiAke21lc3NhZ2V9YDtcbiAgICBcbiAgICAgICAgICAgIGdyb3VwLmNsYXNzTGlzdC5hZGQoXCJuaHN1ay1mb3JtLWdyb3VwLS1lcnJvclwiKTtcbiAgICBcbiAgICAgICAgICAgIGxldCBlcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVycm9ySWQpO1xuICAgIFxuICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgIFxuICAgICAgICAgICAgICAgIGVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgXG4gICAgICAgICAgICAgICAgZXJyb3IuaWQgPSBlcnJvcklkO1xuICAgICAgICAgICAgICAgIGVycm9yLmNsYXNzTmFtZSA9IFwibmhzdWstZXJyb3ItbWVzc2FnZVwiO1xuICAgICAgICAgICAgICAgIGVycm9yLmlubmVySFRNTCA9IGVycm9yTWVzc2FnZTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkc2V0ID0gZ3JvdXAucXVlcnlTZWxlY3RvcihcIi5uaHN1ay1maWVsZHNldFwiKTtcbiAgICAgICAgICAgICAgICBjb25zdCByYWRpb3MgPSBmaWVsZHNldC5xdWVyeVNlbGVjdG9yKFwiLm5oc3VrLXJhZGlvc1wiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGZpZWxkc2V0Lmluc2VydEJlZm9yZShlcnJvciwgcmFkaW9zKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICAgICAgICAgIGA8bGk+PGEgaHJlZj1cIiMke3JhZGlvc1swXS5pZH1cIj4ke21lc3NhZ2V9PC9hPjwvbGk+YFxuICAgICAgICAgICAgKTtcbiAgICBcbiAgICAgICAgICAgIHJhZGlvc1swXS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgXCJhcmlhLWRlc2NyaWJlZGJ5XCIsXG4gICAgICAgICAgICAgICAgZXJyb3JJZFxuICAgICAgICAgICAgKTtcbiAgICBcbiAgICAgICAgICAgIHJldHVybiByYWRpb3NbMF07XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJFcnJvcnMoKSB7XG4gICAgICAgIGVycm9yTGlzdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBlcnJvclN1bW1hcnkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmhzdWstZm9ybS1ncm91cC0tZXJyb3IsIC5uaHN1ay10ZXh0YXJlYS0tZXJyb3IsIC5uaHN1ay1pbnB1dC0tZXJyb3JcIilcbiAgICAgICAgICAgIC5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoXCJuaHN1ay1mb3JtLWdyb3VwLS1lcnJvclwiLCBcIm5oc3VrLXRleHRhcmVhLS1lcnJvclwiLCBcIm5oc3VrLWlucHV0LS1lcnJvclwiKSk7XG5cbiAgICAgICAgLy8gcmVtb3ZlIHRhYmxlLWdlbmVyYXRlZCBlcnJvcnMgb25seVxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwidGQgLm5oc3VrLWVycm9yLW1lc3NhZ2VcIilcbiAgICAgICAgICAgIC5mb3JFYWNoKGVsID0+IGVsLnJlbW92ZSgpKTtcblxuICAgICAgICBbXG4gICAgICAgICAgICBcIm1lbWJlcnNoaXBOdW1iZXItZXJyb3JcIixcbiAgICAgICAgICAgIFwibWVtYmVyRmlyc3RJbml0aWFsLWVycm9yXCIsXG4gICAgICAgICAgICBcIm1lbWJlclN1cm5hbWUtZXJyb3JcIixcbiAgICAgICAgICAgIFwicmVjb3JkVHlwZUNoYW5nZS1lcnJvclwiLFxuICAgICAgICAgICAgXCJzaXRlTmFtZS1lcnJvclwiLFxuICAgICAgICAgICAgXCJkaXJlY3RvcmF0ZS1lcnJvclwiXG4gICAgICAgIF0uZm9yRWFjaChpZCA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgXG4gICAgICAgICAgICBpZiAoZWwpIHtcbiAgICAgICAgICAgICAgICBlbC5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcmVtb3ZlIHRleHRhcmVhIGVycm9yIG1lc3NhZ2UgdGV4dFxuICAgICAgICBjb25zdCByZWFzb25FcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXNzdWUtcmVhc29uLWVycm9yXCIpO1xuXG4gICAgICAgIGlmIChyZWFzb25FcnJvcikge1xuICAgICAgICByZWFzb25FcnJvci5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICB9XG4gICAgfVxuXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQUEsU0FBUyxpQkFBaUIsb0JBQW9CLFdBQVk7QUFFdEQsUUFBTSxZQUFZLFNBQVMsY0FBYyxvQkFBb0I7QUFDN0QsUUFBTSxZQUFZLFNBQVMsZUFBZSxjQUFjO0FBR3hELFdBQVMsa0JBQWtCO0FBQ3ZCLGNBQVUsaUJBQWlCLGFBQWEsRUFBRSxRQUFRLFVBQVE7QUFDdEQsV0FBSyxvQkFBb0IsU0FBUyxhQUFhO0FBQy9DLFdBQUssaUJBQWlCLFNBQVMsYUFBYTtBQUFBLElBQ2hELENBQUM7QUFBQSxFQUNMO0FBRUEsV0FBUyxjQUFjLEdBQUc7QUFDdEIsTUFBRSxlQUFlO0FBQ2pCLFVBQU0sTUFBTSxFQUFFLE9BQU8sUUFBUSxJQUFJO0FBQ2pDLFFBQUksT0FBTztBQUFBLEVBQ2Y7QUFFQSxrQkFBZ0I7QUFHaEIsWUFBVSxpQkFBaUIsU0FBUyxXQUFZO0FBRTVDLFVBQU0sV0FBVyxVQUFVLGlCQUFpQixJQUFJLEVBQUUsU0FBUztBQUUzRCxVQUFNLFNBQVMsU0FBUyxjQUFjLElBQUk7QUFDMUMsV0FBTyxVQUFVLElBQUksa0JBQWtCO0FBRXZDLFdBQU8sWUFBWTtBQUFBO0FBQUE7QUFBQSwrQkFHSSxRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUNBT04sUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHFDQU9KLFFBQVE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSx3REFPVyxRQUFRO0FBQUE7QUFBQTtBQUFBO0FBS3hELGNBQVUsWUFBWSxNQUFNO0FB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
