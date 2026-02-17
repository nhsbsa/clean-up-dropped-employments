// app/assets/javascript/sortable.js
(function() {
  function parseValue(value, type) {
    value = value.trim();
    if (type === "number") return parseFloat(value) || 0;
    if (type === "date") {
      if (!value) return 0;
      const parts = value.split("/");
      return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
    }
    return value.toLowerCase();
  }
  function clearSortStates(headers) {
    headers.forEach((h) => h.setAttribute("aria-sort", "none"));
  }
  function sortTable(table, columnIndex, type, direction) {
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    rows.sort((a, b) => {
      const aText = a.children[columnIndex].innerText;
      const bText = b.children[columnIndex].innerText;
      const aVal = parseValue(aText, type);
      const bVal = parseValue(bText, type);
      return direction === "asc" ? aVal - bVal : bVal - aVal;
    });
    rows.forEach((row) => tbody.appendChild(row));
  }
  document.querySelectorAll("table .sortable").forEach((header) => {
    header.addEventListener("click", function() {
      const table = header.closest("table");
      const headers = table.querySelectorAll(".sortable");
      const columnIndex = Array.from(header.parentNode.children).indexOf(header);
      const type = header.dataset.sortType;
      const currentSort = header.getAttribute("aria-sort");
      const newDirection = currentSort === "ascending" ? "descending" : "ascending";
      clearSortStates(headers);
      header.setAttribute("aria-sort", newDirection);
      sortTable(table, columnIndex, type, newDirection === "ascending" ? "asc" : "desc");
    });
    header.addEventListener("keypress", function(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        header.click();
      }
    });
  });
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L3NvcnRhYmxlLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlLCB0eXBlKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS50cmltKCk7XG4gICAgaWYgKHR5cGUgPT09IFwibnVtYmVyXCIpIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSB8fCAwO1xuICAgIGlmICh0eXBlID09PSBcImRhdGVcIikge1xuICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuIDA7XG4gICAgICBjb25zdCBwYXJ0cyA9IHZhbHVlLnNwbGl0KFwiL1wiKTtcbiAgICAgIHJldHVybiBuZXcgRGF0ZShwYXJ0c1syXSwgcGFydHNbMV0gLSAxLCBwYXJ0c1swXSkuZ2V0VGltZSgpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFyU29ydFN0YXRlcyhoZWFkZXJzKSB7XG4gICAgaGVhZGVycy5mb3JFYWNoKGggPT4gaC5zZXRBdHRyaWJ1dGUoXCJhcmlhLXNvcnRcIixcIm5vbmVcIikpO1xuICB9XG5cbiAgZnVuY3Rpb24gc29ydFRhYmxlKHRhYmxlLCBjb2x1bW5JbmRleCwgdHlwZSwgZGlyZWN0aW9uKSB7XG4gICAgY29uc3QgdGJvZHkgPSB0YWJsZS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIik7XG4gICAgY29uc3Qgcm93cyA9IEFycmF5LmZyb20odGJvZHkucXVlcnlTZWxlY3RvckFsbChcInRyXCIpKTtcblxuICAgIHJvd3Muc29ydCgoYSwgYikgPT4ge1xuICAgICAgY29uc3QgYVRleHQgPSBhLmNoaWxkcmVuW2NvbHVtbkluZGV4XS5pbm5lclRleHQ7XG4gICAgICBjb25zdCBiVGV4dCA9IGIuY2hpbGRyZW5bY29sdW1uSW5kZXhdLmlubmVyVGV4dDtcblxuICAgICAgY29uc3QgYVZhbCA9IHBhcnNlVmFsdWUoYVRleHQsIHR5cGUpO1xuICAgICAgY29uc3QgYlZhbCA9IHBhcnNlVmFsdWUoYlRleHQsIHR5cGUpO1xuXG4gICAgICByZXR1cm4gZGlyZWN0aW9uID09PSBcImFzY1wiID8gYVZhbCAtIGJWYWwgOiBiVmFsIC0gYVZhbDtcbiAgICB9KTtcblxuICAgIHJvd3MuZm9yRWFjaChyb3cgPT4gdGJvZHkuYXBwZW5kQ2hpbGQocm93KSk7XG4gIH1cblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwidGFibGUgLnNvcnRhYmxlXCIpLmZvckVhY2goaGVhZGVyID0+IHtcbiAgICBoZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IHRhYmxlID0gaGVhZGVyLmNsb3Nlc3QoXCJ0YWJsZVwiKTtcbiAgICAgIGNvbnN0IGhlYWRlcnMgPSB0YWJsZS5xdWVyeVNlbGVjdG9yQWxsKFwiLnNvcnRhYmxlXCIpO1xuICAgICAgY29uc3QgY29sdW1uSW5kZXggPSBBcnJheS5mcm9tKGhlYWRlci5wYXJlbnROb2RlLmNoaWxkcmVuKS5pbmRleE9mKGhlYWRlcik7XG4gICAgICBjb25zdCB0eXBlID0gaGVhZGVyLmRhdGFzZXQuc29ydFR5cGU7XG4gICAgICBjb25zdCBjdXJyZW50U29ydCA9IGhlYWRlci5nZXRBdHRyaWJ1dGUoXCJhcmlhLXNvcnRcIik7XG5cbiAgICAgIGNvbnN0IG5ld0RpcmVjdGlvbiA9IGN1cnJlbnRTb3J0ID09PSBcImFzY2VuZGluZ1wiID8gXCJkZXNjZW5kaW5nXCIgOiBcImFzY2VuZGluZ1wiO1xuXG4gICAgICBjbGVhclNvcnRTdGF0ZXMoaGVhZGVycyk7XG4gICAgICBoZWFkZXIuc2V0QXR0cmlidXRlKFwiYXJpYS1zb3J0XCIsIG5ld0RpcmVjdGlvbik7XG5cbiAgICAgIHNvcnRUYWJsZSh0YWJsZSwgY29sdW1uSW5kZXgsIHR5cGUsIG5ld0RpcmVjdGlvbiA9PT0gXCJhc2NlbmRpbmdcIiA/IFwiYXNjXCIgOiBcImRlc2NcIik7XG4gICAgfSk7XG5cbiAgICBoZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoZS5rZXkgPT09IFwiRW50ZXJcIiB8fCBlLmtleSA9PT0gXCIgXCIpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBoZWFkZXIuY2xpY2soKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59KSgpOyJdLAogICJtYXBwaW5ncyI6ICI7Q0FBQyxXQUFZO0FBQ1gsV0FBUyxXQUFXLE9BQU8sTUFBTTtBQUMvQixZQUFRLE1BQU0sS0FBSztBQUNuQixRQUFJLFNBQVMsU0FBVSxRQUFPLFdBQVcsS0FBSyxLQUFLO0FBQ25ELFFBQUksU0FBUyxRQUFRO0FBQ25CLFVBQUksQ0FBQyxNQUFPLFFBQU87QUFDbkIsWUFBTSxRQUFRLE1BQU0sTUFBTSxHQUFHO0FBQzdCLGFBQU8sSUFBSSxLQUFLLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsRUFBRSxRQUFRO0FBQUEsSUFDNUQ7QUFDQSxXQUFPLE1BQU0sWUFBWTtBQUFBLEVBQzNCO0FBRUEsV0FBUyxnQkFBZ0IsU0FBUztBQUNoQyxZQUFRLFFBQVEsT0FBSyxFQUFFLGFBQWEsYUFBWSxNQUFNLENBQUM7QUFBQSxFQUN6RDtBQUVBLFdBQVMsVUFBVSxPQUFPLGFBQWEsTUFBTSxXQUFXO0FBQ3RELFVBQU0sUUFBUSxNQUFNLGNBQWMsT0FBTztBQUN6QyxVQUFNLE9BQU8sTUFBTSxLQUFLLE1BQU0saUJBQWlCLElBQUksQ0FBQztBQUVwRCxTQUFLLEtBQUssQ0FBQyxHQUFHLE1BQU07QUFDbEIsWUFBTSxRQUFRLEVBQUUsU0FBUyxXQUFXLEVBQUU7QUFDdEMsWUFBTSxRQUFRLEVBQUUsU0FBUyxXQUFXLEVBQUU7QUFFdEMsWUFBTSxPQUFPLFdBQVcsT0FBTyxJQUFJO0FBQ25DLFlBQU0sT0FBTyxXQUFXLE9BQU8sSUFBSTtBQUVuQyxhQUFPLGNBQWMsUUFBUSxPQUFPLE9BQU8sT0FBTztBQUFBLElBQ3BELENBQUM7QUFFRCxTQUFLLFFBQVEsU0FBTyxNQUFNLFlBQVksR0FBRyxDQUFDO0FBQUEsRUFDNUM7QUFFQSxXQUFTLGlCQUFpQixpQkFBaUIsRUFBRSxRQUFRLFlBQVU7QUFDN0QsV0FBTyxpQkFBaUIsU0FBUyxXQUFZO0FBQzNDLFlBQU0sUUFBUSxPQUFPLFFBQVEsT0FBTztBQUNwQyxZQUFNLFVBQVUsTUFBTSxpQkFBaUIsV0FBVztBQUNsRCxZQUFNLGNBQWMsTUFBTSxLQUFLLE9BQU8sV0FBVyxRQUFRLEVBQUUsUUFBUSxNQUFNO0FBQ3pFLFlBQU0sT0FBTyxPQUFPLFFBQVE7QUFDNUIsWUFBTSxjQUFjLE9BQU8sYUFBYSxXQUFXO0FBRW5ELFlBQU0sZUFBZSxnQkFBZ0IsY0FBYyxlQUFlO0FBRWxFLHNCQUFnQixPQUFPO0FBQ3ZCLGFBQU8sYUFBYSxhQUFhLFlBQVk7QUFFN0MsZ0JBQVUsT0FBTyxhQUFhLE1BQU0saUJBQWlCLGNBQWMsUUFBUSxNQUFNO0FBQUEsSUFDbkYsQ0FBQztBQUVELFdBQU8saUJBQWlCLFlBQVksU0FBVSxHQUFHO0FBQy9DLFVBQUksRUFBRSxRQUFRLFdBQVcsRUFBRSxRQUFRLEtBQUs7QUFDdEMsVUFBRSxlQUFlO0FBQ2pCLGVBQU8sTUFBTTtBQUFBLE1BQ2Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNILENBQUM7QUFDSCxHQUFHOyIsCiAgIm5hbWVzIjogW10KfQo=
