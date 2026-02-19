// app/assets/javascript/reportScript.js
document.addEventListener("DOMContentLoaded", function() {
  const tableBody = document.querySelector("#reportTable tbody");
  const addButton = document.getElementById("addRowButton");
  const form = document.getElementById("reportForm");
  const errorSummary = document.getElementById("errorSummary");
  const errorList = document.getElementById("errorList");
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
    const rowCount = tableBody.rows.length;
    const newRow = document.createElement("tr");
    newRow.classList.add("nhsuk-table__row");
    newRow.innerHTML = `
        <td><input class="nhsuk-input" type="text" name="sets[]" aria-label="Sets row ${rowCount + 1}"></td>
        <td><input class="nhsuk-input" type="text" name="fields[]" aria-label="Fields row ${rowCount + 1}"></td>
        <td><input class="nhsuk-input" type="text" name="amendments[]" aria-label="Amendments row ${rowCount + 1}"></td>
        <td><a href="#" class="remove-row nhsuk-link">Remove</a></td>
      `;
    tableBody.appendChild(newRow);
    bindRemoveLinks();
  });
  form.addEventListener("submit", function(e) {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    let errors = [];
    errorList.innerHTML = "";
    errorSummary.style.display = "none";
    rows.forEach((row, index) => {
      const setsInput = row.querySelector('input[name="sets[]"]');
      const fieldsInput = row.querySelector('input[name="fields[]"]');
      const amendmentsInput = row.querySelector('input[name="amendments[]"]');
      const allEmpty = [setsInput, fieldsInput, amendmentsInput].every((input) => input.value.trim() === "");
      if (allEmpty) {
        row.remove();
        return;
      }
      if (setsInput.value.trim() === "") errors.push({ input: setsInput, text: `Row ${index + 1}: Enter a value for Sets` });
      if (fieldsInput.value.trim() === "") errors.push({ input: fieldsInput, text: `Row ${index + 1}: Enter a value for Fields` });
      if (amendmentsInput.value.trim() === "") errors.push({ input: amendmentsInput, text: `Row ${index + 1}: Enter amendments` });
    });
    if (errors.length > 0) {
      e.preventDefault();
      errors.forEach((err) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = err.text;
        a.addEventListener("click", function(ev) {
          ev.preventDefault();
          err.input.focus();
        });
        li.appendChild(a);
        errorList.appendChild(li);
        err.input.classList.add("nhsuk-input--error");
      });
      errorSummary.style.display = "block";
      errorSummary.focus();
      if (errors.length > 0) errors[0].input.focus();
    }
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L3JlcG9ydFNjcmlwdC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcblxuICAgIGNvbnN0IHRhYmxlQm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXBvcnRUYWJsZSB0Ym9keScpO1xuICAgIGNvbnN0IGFkZEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRSb3dCdXR0b24nKTtcbiAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlcG9ydEZvcm0nKTtcbiAgICBjb25zdCBlcnJvclN1bW1hcnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyb3JTdW1tYXJ5Jyk7XG4gICAgY29uc3QgZXJyb3JMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yTGlzdCcpO1xuXG4gICAgLy8gUmVtb3ZlIHJvd1xuICAgIGZ1bmN0aW9uIGJpbmRSZW1vdmVMaW5rcygpIHtcbiAgICAgICAgdGFibGVCb2R5LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZW1vdmUtcm93JykuZm9yRWFjaChsaW5rID0+IHtcbiAgICAgICAgICAgIGxpbmsucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZW1vdmVIYW5kbGVyKTtcbiAgICAgICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZW1vdmVIYW5kbGVyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlSGFuZGxlcihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3Qgcm93ID0gZS50YXJnZXQuY2xvc2VzdCgndHInKTtcbiAgICAgICAgcm93LnJlbW92ZSgpO1xuICAgIH1cblxuICAgIGJpbmRSZW1vdmVMaW5rcygpO1xuXG4gICAgLy8gQWRkIG5ldyByb3dcbiAgICBhZGRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IHJvd0NvdW50ID0gdGFibGVCb2R5LnJvd3MubGVuZ3RoO1xuICAgICAgICBjb25zdCBuZXdSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuICAgICAgICBuZXdSb3cuY2xhc3NMaXN0LmFkZCgnbmhzdWstdGFibGVfX3JvdycpO1xuICAgICAgICBuZXdSb3cuaW5uZXJIVE1MID0gYFxuICAgICAgICA8dGQ+PGlucHV0IGNsYXNzPVwibmhzdWstaW5wdXRcIiB0eXBlPVwidGV4dFwiIG5hbWU9XCJzZXRzW11cIiBhcmlhLWxhYmVsPVwiU2V0cyByb3cgJHtyb3dDb3VudCArIDF9XCI+PC90ZD5cbiAgICAgICAgPHRkPjxpbnB1dCBjbGFzcz1cIm5oc3VrLWlucHV0XCIgdHlwZT1cInRleHRcIiBuYW1lPVwiZmllbGRzW11cIiBhcmlhLWxhYmVsPVwiRmllbGRzIHJvdyAke3Jvd0NvdW50ICsgMX1cIj48L3RkPlxuICAgICAgICA8dGQ+PGlucHV0IGNsYXNzPVwibmhzdWstaW5wdXRcIiB0eXBlPVwidGV4dFwiIG5hbWU9XCJhbWVuZG1lbnRzW11cIiBhcmlhLWxhYmVsPVwiQW1lbmRtZW50cyByb3cgJHtyb3dDb3VudCArIDF9XCI+PC90ZD5cbiAgICAgICAgPHRkPjxhIGhyZWY9XCIjXCIgY2xhc3M9XCJyZW1vdmUtcm93IG5oc3VrLWxpbmtcIj5SZW1vdmU8L2E+PC90ZD5cbiAgICAgIGA7XG4gICAgICAgIHRhYmxlQm9keS5hcHBlbmRDaGlsZChuZXdSb3cpO1xuICAgICAgICBiaW5kUmVtb3ZlTGlua3MoKTtcbiAgICB9KTtcblxuICAgIC8vIEZvcm0gdmFsaWRhdGlvblxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcblxuICAgICAgICBjb25zdCByb3dzID0gQXJyYXkuZnJvbSh0YWJsZUJvZHkucXVlcnlTZWxlY3RvckFsbCgndHInKSk7XG4gICAgICAgIGxldCBlcnJvcnMgPSBbXTtcbiAgICAgICAgZXJyb3JMaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgICBlcnJvclN1bW1hcnkuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgICAgICByb3dzLmZvckVhY2goKHJvdywgaW5kZXgpID0+IHtcblxuICAgICAgICAgICAgY29uc3Qgc2V0c0lucHV0ID0gcm93LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJzZXRzW11cIl0nKTtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkc0lucHV0ID0gcm93LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJmaWVsZHNbXVwiXScpO1xuICAgICAgICAgICAgY29uc3QgYW1lbmRtZW50c0lucHV0ID0gcm93LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJhbWVuZG1lbnRzW11cIl0nKTtcblxuICAgICAgICAgICAgY29uc3QgYWxsRW1wdHkgPSBbc2V0c0lucHV0LCBmaWVsZHNJbnB1dCwgYW1lbmRtZW50c0lucHV0XS5ldmVyeShpbnB1dCA9PiBpbnB1dC52YWx1ZS50cmltKCkgPT09ICcnKTtcblxuICAgICAgICAgICAgaWYgKGFsbEVtcHR5KSB7XG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGNvbXBsZXRlbHkgZW1wdHkgcm93XG4gICAgICAgICAgICAgICAgcm93LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVmFsaWRhdGUgZWFjaCBpbnB1dFxuICAgICAgICAgICAgaWYgKHNldHNJbnB1dC52YWx1ZS50cmltKCkgPT09ICcnKSBlcnJvcnMucHVzaCh7IGlucHV0OiBzZXRzSW5wdXQsIHRleHQ6IGBSb3cgJHtpbmRleCArIDF9OiBFbnRlciBhIHZhbHVlIGZvciBTZXRzYCB9KTtcbiAgICAgICAgICAgIGlmIChmaWVsZHNJbnB1dC52YWx1ZS50cmltKCkgPT09ICcnKSBlcnJvcnMucHVzaCh7IGlucHV0OiBmaWVsZHNJbnB1dCwgdGV4dDogYFJvdyAke2luZGV4ICsgMX06IEVudGVyIGEgdmFsdWUgZm9yIEZpZWxkc2AgfSk7XG4gICAgICAgICAgICBpZiAoYW1lbmRtZW50c0lucHV0LnZhbHVlLnRyaW0oKSA9PT0gJycpIGVycm9ycy5wdXNoKHsgaW5wdXQ6IGFtZW5kbWVudHNJbnB1dCwgdGV4dDogYFJvdyAke2luZGV4ICsgMX06IEVudGVyIGFtZW5kbWVudHNgIH0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAvLyBTaG93IGVycm9yIHN1bW1hcnlcbiAgICAgICAgICAgIGVycm9ycy5mb3JFYWNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICAgICAgYS5ocmVmID0gJyMnO1xuICAgICAgICAgICAgICAgIGEudGV4dENvbnRlbnQgPSBlcnIudGV4dDtcbiAgICAgICAgICAgICAgICBhLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGVyci5pbnB1dC5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKGEpO1xuICAgICAgICAgICAgICAgIGVycm9yTGlzdC5hcHBlbmRDaGlsZChsaSk7XG5cbiAgICAgICAgICAgICAgICAvLyBIaWdobGlnaHQgaW5wdXRcbiAgICAgICAgICAgICAgICBlcnIuaW5wdXQuY2xhc3NMaXN0LmFkZCgnbmhzdWstaW5wdXQtLWVycm9yJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZXJyb3JTdW1tYXJ5LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXG4gICAgICAgICAgICAvLyBGb2N1cyBlcnJvciBzdW1tYXJ5IGZpcnN0XG4gICAgICAgICAgICBlcnJvclN1bW1hcnkuZm9jdXMoKTtcblxuICAgICAgICAgICAgLy8gQXV0by1mb2N1cyBmaXJzdCBlbXB0eSBmaWVsZFxuICAgICAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSBlcnJvcnNbMF0uaW5wdXQuZm9jdXMoKTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxTQUFTLGlCQUFpQixvQkFBb0IsV0FBWTtBQUV0RCxRQUFNLFlBQVksU0FBUyxjQUFjLG9CQUFvQjtBQUM3RCxRQUFNLFlBQVksU0FBUyxlQUFlLGNBQWM7QUFDeEQsUUFBTSxPQUFPLFNBQVMsZUFBZSxZQUFZO0FBQ2pELFFBQU0sZUFBZSxTQUFTLGVBQWUsY0FBYztBQUMzRCxRQUFNLFlBQVksU0FBUyxlQUFlLFdBQVc7QUFHckQsV0FBUyxrQkFBa0I7QUFDdkIsY0FBVSxpQkFBaUIsYUFBYSxFQUFFLFFBQVEsVUFBUTtBQUN0RCxXQUFLLG9CQUFvQixTQUFTLGFBQWE7QUFDL0MsV0FBSyxpQkFBaUIsU0FBUyxhQUFhO0FBQUEsSUFDaEQsQ0FBQztBQUFBLEVBQ0w7QUFFQSxXQUFTLGNBQWMsR0FBRztBQUN0QixNQUFFLGVBQWU7QUFDakIsVUFBTSxNQUFNLEVBQUUsT0FBTyxRQUFRLElBQUk7QUFDakMsUUFBSSxPQUFPO0FBQUEsRUFDZjtBQUVBLGtCQUFnQjtBQUdoQixZQUFVLGlCQUFpQixTQUFTLFdBQVk7QUFDNUMsVUFBTSxXQUFXLFVBQVUsS0FBSztBQUNoQyxVQUFNLFNBQVMsU0FBUyxjQUFjLElBQUk7QUFDMUMsV0FBTyxVQUFVLElBQUksa0JBQWtCO0FBQ3ZDLFdBQU8sWUFBWTtBQUFBLHdGQUM2RCxXQUFXLENBQUM7QUFBQSw0RkFDUixXQUFXLENBQUM7QUFBQSxvR0FDSixXQUFXLENBQUM7QUFBQTtBQUFBO0FBR3hHLGNBQVUsWUFBWSxNQUFNO0FBQzVCLG9CQUFnQjtBQUFBLEVBQ3BCLENBQUM7QUFHRCxPQUFLLGlCQUFpQixVQUFVLFNBQVUsR0FBRztBQUV6QyxVQUFNLE9BQU8sTUFBTSxLQUFLLFVBQVUsaUJBQWlCLElBQUksQ0FBQztBQUN4RCxRQUFJLFNBQVMsQ0FBQztBQUNkLGNBQVUsWUFBWTtBQUN0QixpQkFBYSxNQUFNLFVBQVU7QUFFN0IsU0FBSyxRQUFRLENBQUMsS0FBSyxVQUFVO0FBRXpCLFlBQU0sWUFBWSxJQUFJLGNBQWMsc0JBQXNCO0FBQzFELFlBQU0sY0FBYyxJQUFJLGNBQWMsd0JBQXdCO0FBQzlELFlBQU0sa0JBQWtCLElBQUksY0FBYyw0QkFBNEI7QUFFdEUsWUFBTSxXQUFXLENBQUMsV0FBVyxhQUFhLGVBQWUsRUFBRSxNQUFNLFdBQVMsTUFBTSxNQUFNLEtBQUssTUFBTSxFQUFFO0FBRW5HLFVBQUksVUFBVTtBQUVWLFlBQUksT0FBTztBQUNYO0FBQUEsTUFDSjtBQUdBLFVBQUksVUFBVSxNQUFNLEtBQUssTUFBTSxHQUFJLFFBQU8sS0FBSyxFQUFFLE9BQU8sV0FBVyxNQUFNLE9BQU8sUUFBUSxDQUFDLDJCQUEyQixDQUFDO0FBQ3JILFVBQUksWUFBWSxNQUFNLEtBQUssTUFBTSxHQUFJLFFBQU8sS0FBSyxFQUFFLE9BQU8sYUFBYSxNQUFNLE9BQU8sUUFBUSxDQUFDLDZCQUE2QixDQUFDO0FBQzNILFVBQUksZ0JBQWdCLE1BQU0sS0FBSyxNQUFNLEdBQUksUUFBTyxLQUFLLEVBQUUsT0FBTyxpQkFBaUIsTUFBTSxPQUFPLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQztBQUFBLElBRS9ILENBQUM7QUFFRCxRQUFJLE9BQU8sU0FBUyxHQUFHO0FBQ25CLFFBQUUsZUFBZTtBQUdqQixhQUFPLFFBQVEsU0FBTztBQUNsQixjQUFNLEtBQUssU0FBUyxjQUFjLElBQUk7QUFDdEMsY0FBTSxJQUFJLFNBQVMsY0FBYyxHQUFHO0FBQ3BDLFVBQUUsT0FBTztBQUNULFVBQUUsY0FBYyxJQUFJO0FBQ3BCLFVBQUUsaUJBQWlCLFNBQVMsU0FBVSxJQUFJO0FBQ3RDLGFBQUcsZUFBZTtBQUNsQixjQUFJLE1BQU0sTUFBTTtBQUFBLFFBQ3BCLENBQUM7QUFDRCxXQUFHLFlBQVksQ0FBQztBQUNoQixrQkFBVSxZQUFZLEVBQUU7QUFHeEIsWUFBSSxNQUFNLFVBQVUsSUFBSSxvQkFBb0I7QUFBQSxNQUNoRCxDQUFDO0FBRUQsbUJBQWEsTUFBTSxVQUFVO0FBRzdCLG1CQUFhLE1BQU07QUFHbkIsVUFBSSxPQUFPLFNBQVMsRUFBRyxRQUFPLENBQUMsRUFBRSxNQUFNLE1BQU07QUFBQSxJQUNqRDtBQUFBLEVBRUosQ0FBQztBQUVMLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
