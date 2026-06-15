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
            <input class="nhsuk-input nhsuk-u-font-size-14"
                    id="amendments-${rowCount}"
                    name="amendments[]"
                    type="text">
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
      row.querySelector('input[name="amendments[]"]')
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L3NkLXJlcG9ydC12Mi5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcblxuICAgIGNvbnN0IHRhYmxlQm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXBvcnRUYWJsZSB0Ym9keScpO1xuICAgIGNvbnN0IGFkZEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRSb3dCdXR0b24nKTtcblxuICAgIC8vIFJlbW92ZSByb3dcbiAgICBmdW5jdGlvbiBiaW5kUmVtb3ZlTGlua3MoKSB7XG4gICAgICAgIHRhYmxlQm9keS5xdWVyeVNlbGVjdG9yQWxsKCcucmVtb3ZlLXJvdycpLmZvckVhY2gobGluayA9PiB7XG4gICAgICAgICAgICBsaW5rLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVtb3ZlSGFuZGxlcik7XG4gICAgICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVtb3ZlSGFuZGxlcik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUhhbmRsZXIoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IHJvdyA9IGUudGFyZ2V0LmNsb3Nlc3QoJ3RyJyk7XG4gICAgICAgIHJvdy5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICBiaW5kUmVtb3ZlTGlua3MoKTtcblxuICAgIC8vIEFkZCBuZXcgcm93XG4gICAgYWRkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGNvbnN0IHJvd0NvdW50ID0gdGFibGVCb2R5LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RyJykubGVuZ3RoICsgMTtcblxuICAgICAgICBjb25zdCBuZXdSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuICAgICAgICBuZXdSb3cuY2xhc3NMaXN0LmFkZCgnbmhzdWstdGFibGVfX3JvdycpO1xuXG4gICAgICAgIG5ld1Jvdy5pbm5lckhUTUwgPSBgXG4gICAgICAgIDx0ZCBjbGFzcz1cIm5oc3VrLXRhYmxlX19jZWxsXCI+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJuaHN1ay1pbnB1dCBuaHN1ay1pbnB1dC0td2lkdGgtMTAgbmhzdWstdS1mb250LXNpemUtMTRcIlxuICAgICAgICAgICAgICAgICAgICBpZD1cInNldHMtJHtyb3dDb3VudH1cIlxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwic2V0c1tdXCJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIj5cbiAgICAgICAgPC90ZD5cbiAgICBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGxcIj5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm5oc3VrLWlucHV0IG5oc3VrLWlucHV0LS13aWR0aC0xMCBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiXG4gICAgICAgICAgICAgICAgICAgIGlkPVwiZmllbGRzLSR7cm93Q291bnR9XCJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cImZpZWxkc1tdXCJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIj5cbiAgICAgICAgPC90ZD5cbiAgICBcbiAgICAgICAgPHRkIGNsYXNzPVwibmhzdWstdGFibGVfX2NlbGxcIj5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cIm5oc3VrLWlucHV0IG5oc3VrLXUtZm9udC1zaXplLTE0XCJcbiAgICAgICAgICAgICAgICAgICAgaWQ9XCJhbWVuZG1lbnRzLSR7cm93Q291bnR9XCJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cImFtZW5kbWVudHNbXVwiXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCI+XG4gICAgICAgIDwvdGQ+XG4gICAgXG4gICAgICAgIDx0ZCBjbGFzcz1cIm5oc3VrLXRhYmxlX19jZWxsICBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiPlxuICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzPVwicmVtb3ZlLXJvdyBuaHN1ay1saW5rXCI+XG4gICAgICAgICAgICBSZW1vdmVcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5yb3cgJHtyb3dDb3VudH08L3NwYW4+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPC90ZD5cbiAgICBgO1xuXG4gICAgICAgIHRhYmxlQm9keS5hcHBlbmRDaGlsZChuZXdSb3cpO1xuICAgICAgICBiaW5kUmVtb3ZlTGlua3MoKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlcG9ydEZvcm1cIik7XG4gICAgY29uc3QgZXJyb3JTdW1tYXJ5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvclN1bW1hcnlcIik7XG4gICAgY29uc3QgZXJyb3JMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvckxpc3RcIik7XG5cbiAgICBjb25zdCB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVwb3J0VGFibGVcIik7XG5cbiAgICBjb25zdCBmaWVsZHMgPSBbXCJzZXRzW11cIiwgXCJmaWVsZHNbXVwiLCBcImFtZW5kbWVudHNbXVwiLCBcInJlYXNvbltdXCJdO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIFNVQk1JVCBWQUxJREFUSU9OXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgY2xlYXJFcnJvcnMoKTtcblxuICAgICAgICBsZXQgZXJyb3JzID0gW107XG4gICAgICAgIGxldCBmaXJzdEVycm9yRmllbGQgPSBudWxsO1xuXG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAvLyBERVNDUklQVElPTiBWQUxJREFUSU9OXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgICBjb25zdCByb3dzID0gdGFibGUucXVlcnlTZWxlY3RvckFsbChcInRib2R5IHRyXCIpO1xuXG4gICAgICAgIHJvd3MuZm9yRWFjaCgocm93LCByb3dJbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5wdXRzID0gZ2V0Um93SW5wdXRzKHJvdyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJvd0hhc0RhdGEgPSBpbnB1dHMuc29tZShpID0+IGkudmFsdWUudHJpbSgpICE9PSBcIlwiKTtcblxuICAgICAgICAgICAgLy8gaWdub3JlIGVtcHR5IHJvd3MgY29tcGxldGVseVxuICAgICAgICAgICAgaWYgKCFyb3dIYXNEYXRhKSByZXR1cm47XG5cbiAgICAgICAgICAgIGlucHV0cy5mb3JFYWNoKChpbnB1dCwgY29sSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gZ2V0RXJyb3JNZXNzYWdlKGNvbEluZGV4KTtcblxuICAgICAgICAgICAgICAgIGlmICghaW5wdXQudmFsdWUudHJpbSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9ySWQgPSBlbnN1cmVFcnJvcihpbnB1dCwgbWVzc2FnZSwgcm93SW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgYDxsaT48YSBocmVmPVwiIyR7ZXJyb3JJZH1cIj4ke21lc3NhZ2V9IChyb3cgJHtyb3dJbmRleCArIDF9KTwvYT48L2xpPmBcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gaW5wdXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAvLyBSRUFTT04gVEVYVEFSRUEgVkFMSURBVElPTlxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgICAgY29uc3QgcmVhc29uR3JvdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlzc3VlUmVhc29uXCIpO1xuICAgICAgICBjb25zdCByZWFzb25UZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXNzdWUtcmVhc29uXCIpO1xuXG4gICAgICAgIGlmICghcmVhc29uVGV4dGFyZWEudmFsdWUudHJpbSgpKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPVxuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPkVudGVyIHRoZSByZWFzb24gd2h5IHlvdSByZXF1aXJlIGFuIHVwZGF0ZSBmb3IgdGhpcyByZWNvcmQnO1xuXG4gICAgICAgICAgICAvLyBhZGQgTkhTIGVycm9yIHN0eWxpbmdcbiAgICAgICAgICAgIHJlYXNvbkdyb3VwLmNsYXNzTGlzdC5hZGQoXCJuaHN1ay1mb3JtLWdyb3VwLS1lcnJvclwiKTtcbiAgICAgICAgICAgIHJlYXNvblRleHRhcmVhLmNsYXNzTGlzdC5hZGQoXCJuaHN1ay10ZXh0YXJlYS0tZXJyb3JcIik7XG5cbiAgICAgICAgICAgIC8vIGNyZWF0ZSBlcnJvciBtZXNzYWdlIGlmIGl0IGRvZXNuJ3QgZXhpc3RcbiAgICAgICAgICAgIGxldCBlcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXNzdWUtcmVhc29uLWVycm9yXCIpO1xuXG4gICAgICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgICAgICBlcnJvci5pZCA9IFwiaXNzdWUtcmVhc29uLWVycm9yXCI7XG4gICAgICAgICAgICAgICAgZXJyb3IuY2xhc3NOYW1lID0gXCJuaHN1ay1lcnJvci1tZXNzYWdlXCI7XG4gICAgICAgICAgICAgICAgZXJyb3IuaW5uZXJIVE1MID0gbWVzc2FnZTtcblxuICAgICAgICAgICAgICAgIHJlYXNvblRleHRhcmVhLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVycm9yLCByZWFzb25UZXh0YXJlYSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGVuc3VyZSBjb3JyZWN0IG1lc3NhZ2UgdGV4dFxuICAgICAgICAgICAgZXJyb3IuaW5uZXJIVE1MID0gbWVzc2FnZTtcblxuICAgICAgICAgICAgLy8gYWNjZXNzaWJpbGl0eVxuICAgICAgICAgICAgcmVhc29uVGV4dGFyZWEuc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgICAgIFwiYXJpYS1kZXNjcmliZWRieVwiLFxuICAgICAgICAgICAgICAgIFwiaXNzdWUtcmVhc29uLWVycm9yXCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIGFkZCB0byBzdW1tYXJ5XG4gICAgICAgICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgICAgICAgICBgPGxpPjxhIGhyZWY9XCIjaXNzdWUtcmVhc29uXCI+RW50ZXIgdGhlIHJlYXNvbiB3aHkgeW91IHJlcXVpcmUgYW4gdXBkYXRlIGZvciB0aGlzIHJlY29yZDwvYT48L2xpPmBcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIGZvY3VzIGZpcnN0IGludmFsaWQgZmllbGRcbiAgICAgICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkKSB7XG4gICAgICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gcmVhc29uVGV4dGFyZWE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtZW1iZXJFcnJvciA9IHZhbGlkYXRlUmVxdWlyZWRGaWVsZCh7XG4gICAgICAgICAgICBpbnB1dElkOiBcIm1lbWJlcnNoaXBOdW1iZXJcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwibWVtYmVyc2hpcE51bWJlckdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcIm1lbWJlcnNoaXBOdW1iZXItZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiRW50ZXIgdGhlIG1lbWJlciBudW1iZXJcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBtZW1iZXJFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gbWVtYmVyRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbml0aWFsRXJyb3IgPSB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICAgICAgaW5wdXRJZDogXCJtZW1iZXJGaXJzdEluaXRpYWxcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwibWVtYmVyRmlyc3RJbml0aWFsR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwibWVtYmVyRmlyc3RJbml0aWFsLWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkVudGVyIHRoZSBtZW1iZXJzIGZpcnN0IGluaXRpYWxcIixcbiAgICAgICAgICAgIGVycm9yc1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBpbml0aWFsRXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IGluaXRpYWxFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN1cm5hbWVFcnJvciA9IHZhbGlkYXRlUmVxdWlyZWRGaWVsZCh7XG4gICAgICAgICAgICBpbnB1dElkOiBcIm1lbWJlclN1cm5hbWVcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwibWVtYmVyU3VybmFtZUdyb3VwXCIsXG4gICAgICAgICAgICBlcnJvcklkOiBcIm1lbWJlclN1cm5hbWUtZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiRW50ZXIgdGhlIG1lbWJlcnMgc3VybmFtZVwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIHN1cm5hbWVFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gc3VybmFtZUVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVjb3JkVHlwZUNoYW5nZUVycm9yID0gdmFsaWRhdGVSYWRpb0dyb3VwKHtcbiAgICAgICAgICAgIG5hbWU6IFwicmVjb3JkVHlwZUNoYW5nZVwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJyZWNvcmRUeXBlQ2hhbmdlR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwicmVjb3JkVHlwZUNoYW5nZS1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJTZWxlY3QgYSB0eXBlIG9mIGNoYW5nZVwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgcmVjb3JkVHlwZUNoYW5nZUVycm9yKSB7XG4gICAgICAgICAgICBmaXJzdEVycm9yRmllbGQgPSByZWNvcmRUeXBlQ2hhbmdlRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb3JydXB0ZWRFcnJvciA9IHZhbGlkYXRlUmFkaW9Hcm91cCh7XG4gICAgICAgICAgICBuYW1lOiBcImNvcnJ1cHRlZFwiLFxuICAgICAgICAgICAgZ3JvdXBJZDogXCJjb3JydXB0ZWRHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJjb3JydXB0ZWQtZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiU2VsZWN0IHllcyBpZiB5b3VyIGZpbGUgaGFzIGJlZW4gY29ycnVwdGVkXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBjb3JydXB0ZWRFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gY29ycnVwdGVkRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYXltZW50RXJyb3IgPSB2YWxpZGF0ZVJhZGlvR3JvdXAoe1xuICAgICAgICAgICAgbmFtZTogXCJwYXltZW50XCIsXG4gICAgICAgICAgICBncm91cElkOiBcInBheW1lbnRHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJwYXltZW50LWVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIlNlbGVjdCB5ZXMgaWYgcGF5bWVudCB3aWxsIGJlIGFmZmVjdGVkXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWZpcnN0RXJyb3JGaWVsZCAmJiBwYXltZW50RXJyb3IpIHtcbiAgICAgICAgICAgIGZpcnN0RXJyb3JGaWVsZCA9IHBheW1lbnRFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNpdGVFcnJvciA9IHZhbGlkYXRlUmVxdWlyZWRGaWVsZCh7XG4gICAgICAgICAgICBpbnB1dElkOiBcInNpdGVOYW1lXCIsXG4gICAgICAgICAgICBncm91cElkOiBcInNpdGVOYW1lR3JvdXBcIixcbiAgICAgICAgICAgIGVycm9ySWQ6IFwic2l0ZU5hbWUtZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiRW50ZXIgdGhlIHNpdGUgeW91IGFyZSBiYXNlZCBhdFwiLFxuICAgICAgICAgICAgZXJyb3JzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghZmlyc3RFcnJvckZpZWxkICYmIHNpdGVFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gc2l0ZUVycm9yO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zdCBkaXJlY3RvcmF0ZUVycm9yID0gdmFsaWRhdGVSZXF1aXJlZEZpZWxkKHtcbiAgICAgICAgICAgIGlucHV0SWQ6IFwiZGlyZWN0b3JhdGVcIixcbiAgICAgICAgICAgIGdyb3VwSWQ6IFwiZGlyZWN0b3JhdGVHcm91cFwiLFxuICAgICAgICAgICAgZXJyb3JJZDogXCJkaXJlY3RvcmF0ZS1lcnJvclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJFbnRlciB5b3VyIGRpcmVjdG9yYXRlXCIsXG4gICAgICAgICAgICBlcnJvcnNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFmaXJzdEVycm9yRmllbGQgJiYgZGlyZWN0b3JhdGVFcnJvcikge1xuICAgICAgICAgICAgZmlyc3RFcnJvckZpZWxkID0gZGlyZWN0b3JhdGVFcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZXJyb3JMaXN0LmlubmVySFRNTCA9IGVycm9ycy5qb2luKFwiXCIpO1xuICAgICAgICAgICAgZXJyb3JTdW1tYXJ5LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cbiAgICAgICAgICAgIGVycm9yU3VtbWFyeS5zY3JvbGxJbnRvVmlldyh7IGJlaGF2aW9yOiBcInNtb290aFwiIH0pO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtLnN1Ym1pdCgpO1xuICAgIH0pO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIEhFTFBFUlNcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBmdW5jdGlvbiBnZXRSb3dJbnB1dHMocm93KSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICByb3cucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInNldHNbXVwiXScpLFxuICAgICAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJmaWVsZHNbXVwiXScpLFxuICAgICAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJhbWVuZG1lbnRzW11cIl0nKSxcbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRFcnJvck1lc3NhZ2UoaW5kZXgpIHtcbiAgICAgICAgc3dpdGNoIChpbmRleCkge1xuICAgICAgICAgICAgY2FzZSAwOiBcbiAgICAgICAgICAgICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+RW50ZXIgdGhlIHNldCc7XG4gICAgICAgICAgICBjYXNlIDE6IFxuICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj5FbnRlciB0aGUgZmllbGQnO1xuICAgICAgICAgICAgY2FzZSAyOiBcbiAgICAgICAgICAgICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwibmhzdWstdS12aXN1YWxseS1oaWRkZW5cIj5FcnJvcjo8L3NwYW4+RW50ZXIgdGhlIGFtZW5kbWVudCc7XG4gICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5zdXJlRXJyb3IoaW5wdXQsIG1lc3NhZ2UsIHJvd0luZGV4KSB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBpbnB1dC5jbG9zZXN0KFwidGRcIik7XG5cbiAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwibmhzdWstZm9ybS1ncm91cC0tZXJyb3JcIik7XG5cbiAgICAgICAgbGV0IGVycm9yID0gY2VsbC5xdWVyeVNlbGVjdG9yKFwiLm5oc3VrLWVycm9yLW1lc3NhZ2VcIik7XG5cbiAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgZXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgIGVycm9yLmNsYXNzTmFtZSA9IFwibmhzdWstZXJyb3ItbWVzc2FnZSBuaHN1ay11LWZvbnQtc2l6ZS0xNFwiO1xuICAgICAgICAgICAgY2VsbC5pbnNlcnRCZWZvcmUoZXJyb3IsIGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVycm9yLmlubmVySFRNTCA9IG1lc3NhZ2U7XG5cbiAgICAgICAgY29uc3QgZXJyb3JJZCA9IGlucHV0LmlkIHx8IGByb3ctJHtyb3dJbmRleH0tJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyLCA3KX1gO1xuXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImFyaWEtZGVzY3JpYmVkYnlcIiwgZXJyb3JJZCk7XG4gICAgICAgIGlucHV0LmlkID0gZXJyb3JJZDtcblxuICAgICAgICByZXR1cm4gZXJyb3JJZDtcbiAgICB9XG5cbiAgICAvLyBIZWxwZXIgZm9yIHRoZSB0ZXh0IGZpZWxkIHZhbGlkYXRpb25cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZVJlcXVpcmVkRmllbGQoe1xuICAgICAgICBpbnB1dElkLFxuICAgICAgICBncm91cElkLFxuICAgICAgICBlcnJvcklkLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBlcnJvcnNcbiAgICB9KSB7XG4gICAgXG4gICAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW5wdXRJZCk7XG4gICAgICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZ3JvdXBJZCk7XG4gICAgXG4gICAgICAgIGlmICghaW5wdXQudmFsdWUudHJpbSgpKSB7XG4gICAgXG4gICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPVxuICAgICAgICAgICAgICAgIGA8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPiAke21lc3NhZ2V9YDtcbiAgICBcbiAgICAgICAgICAgIGdyb3VwLmNsYXNzTGlzdC5hZGQoXCJuaHN1ay1mb3JtLWdyb3VwLS1lcnJvclwiKTtcbiAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoXCJuaHN1ay1pbnB1dC0tZXJyb3JcIik7XG4gICAgXG4gICAgICAgICAgICBsZXQgZXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlcnJvcklkKTtcbiAgICBcbiAgICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBlcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgICAgIGVycm9yLmlkID0gZXJyb3JJZDtcbiAgICAgICAgICAgICAgICBlcnJvci5jbGFzc05hbWUgPSBcIm5oc3VrLWVycm9yLW1lc3NhZ2VcIjtcbiAgICBcbiAgICAgICAgICAgICAgICBpbnB1dC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlcnJvciwgaW5wdXQpO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgZXJyb3IuaW5uZXJIVE1MID0gZXJyb3JNZXNzYWdlO1xuICAgIFxuICAgICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiYXJpYS1kZXNjcmliZWRieVwiLCBlcnJvcklkKTtcbiAgICBcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICAgICAgICAgIGA8bGk+PGEgaHJlZj1cIiMke2lucHV0SWR9XCI+JHttZXNzYWdlfTwvYT48L2xpPmBcbiAgICAgICAgICAgICk7XG4gICAgXG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIZWxwZXIgZm9yIHRoZSByYWRpbyBidXR0b24gdmFsaWRhdGlvblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlUmFkaW9Hcm91cCh7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIGdyb3VwSWQsXG4gICAgICAgIGVycm9ySWQsXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIGVycm9yc1xuICAgIH0pIHtcbiAgICBcbiAgICAgICAgY29uc3QgcmFkaW9zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgIGBpbnB1dFtuYW1lPVwiJHtuYW1lfVwiXWBcbiAgICAgICAgKTtcbiAgICBcbiAgICAgICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChncm91cElkKTtcbiAgICBcbiAgICAgICAgY29uc3QgY2hlY2tlZCA9IFsuLi5yYWRpb3NdLnNvbWUocmFkaW8gPT4gcmFkaW8uY2hlY2tlZCk7XG4gICAgXG4gICAgICAgIGlmICghY2hlY2tlZCkge1xuICAgIFxuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID1cbiAgICAgICAgICAgICAgICBgPHNwYW4gY2xhc3M9XCJuaHN1ay11LXZpc3VhbGx5LWhpZGRlblwiPkVycm9yOjwvc3Bhbj4gJHttZXNzYWdlfWA7XG4gICAgXG4gICAgICAgICAgICBncm91cC5jbGFzc0xpc3QuYWRkKFwibmhzdWstZm9ybS1ncm91cC0tZXJyb3JcIik7XG4gICAgXG4gICAgICAgICAgICBsZXQgZXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlcnJvcklkKTtcbiAgICBcbiAgICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICBcbiAgICAgICAgICAgICAgICBlcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIFxuICAgICAgICAgICAgICAgIGVycm9yLmlkID0gZXJyb3JJZDtcbiAgICAgICAgICAgICAgICBlcnJvci5jbGFzc05hbWUgPSBcIm5oc3VrLWVycm9yLW1lc3NhZ2VcIjtcbiAgICAgICAgICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBlcnJvck1lc3NhZ2U7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBmaWVsZHNldCA9IGdyb3VwLnF1ZXJ5U2VsZWN0b3IoXCIubmhzdWstZmllbGRzZXRcIik7XG4gICAgICAgICAgICAgICAgY29uc3QgcmFkaW9zID0gZmllbGRzZXQucXVlcnlTZWxlY3RvcihcIi5uaHN1ay1yYWRpb3NcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBmaWVsZHNldC5pbnNlcnRCZWZvcmUoZXJyb3IsIHJhZGlvcyk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgICAgICAgICBgPGxpPjxhIGhyZWY9XCIjJHtyYWRpb3NbMF0uaWR9XCI+JHttZXNzYWdlfTwvYT48L2xpPmBcbiAgICAgICAgICAgICk7XG4gICAgXG4gICAgICAgICAgICByYWRpb3NbMF0uc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgICAgIFwiYXJpYS1kZXNjcmliZWRieVwiLFxuICAgICAgICAgICAgICAgIGVycm9ySWRcbiAgICAgICAgICAgICk7XG4gICAgXG4gICAgICAgICAgICByZXR1cm4gcmFkaW9zWzBdO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyRXJyb3JzKCkge1xuICAgICAgICBlcnJvckxpc3QuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgZXJyb3JTdW1tYXJ5LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5oc3VrLWZvcm0tZ3JvdXAtLWVycm9yLCAubmhzdWstdGV4dGFyZWEtLWVycm9yLCAubmhzdWstaW5wdXQtLWVycm9yXCIpXG4gICAgICAgICAgICAuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKFwibmhzdWstZm9ybS1ncm91cC0tZXJyb3JcIiwgXCJuaHN1ay10ZXh0YXJlYS0tZXJyb3JcIiwgXCJuaHN1ay1pbnB1dC0tZXJyb3JcIikpO1xuXG4gICAgICAgIC8vIHJlbW92ZSB0YWJsZS1nZW5lcmF0ZWQgZXJyb3JzIG9ubHlcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInRkIC5uaHN1ay1lcnJvci1tZXNzYWdlXCIpXG4gICAgICAgICAgICAuZm9yRWFjaChlbCA9PiBlbC5yZW1vdmUoKSk7XG5cbiAgICAgICAgW1xuICAgICAgICAgICAgXCJtZW1iZXJzaGlwTnVtYmVyLWVycm9yXCIsXG4gICAgICAgICAgICBcIm1lbWJlckZpcnN0SW5pdGlhbC1lcnJvclwiLFxuICAgICAgICAgICAgXCJtZW1iZXJTdXJuYW1lLWVycm9yXCIsXG4gICAgICAgICAgICBcInJlY29yZFR5cGVDaGFuZ2UtZXJyb3JcIixcbiAgICAgICAgICAgIFwic2l0ZU5hbWUtZXJyb3JcIixcbiAgICAgICAgICAgIFwiZGlyZWN0b3JhdGUtZXJyb3JcIlxuICAgICAgICBdLmZvckVhY2goaWQgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgIFxuICAgICAgICAgICAgaWYgKGVsKSB7XG4gICAgICAgICAgICAgICAgZWwucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHJlbW92ZSB0ZXh0YXJlYSBlcnJvciBtZXNzYWdlIHRleHRcbiAgICAgICAgY29uc3QgcmVhc29uRXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlzc3VlLXJlYXNvbi1lcnJvclwiKTtcblxuICAgICAgICBpZiAocmVhc29uRXJyb3IpIHtcbiAgICAgICAgcmVhc29uRXJyb3IuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgfVxuICAgIH1cblxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUFBLFNBQVMsaUJBQWlCLG9CQUFvQixXQUFZO0FBRXRELFFBQU0sWUFBWSxTQUFTLGNB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
