var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// app/assets/javascript/copy.js
document.addEventListener("DOMContentLoaded", function() {
  const copyButton = document.getElementById("copyIssueDetailsButton");
  const table = document.getElementById("reportTable");
  const status = document.getElementById("copyIssueDetailsStatus");
  if (!copyButton || !table || !status) {
    return;
  }
  function getTableText(tableElement) {
    const rows = Array.from(tableElement.querySelectorAll("tr"));
    return rows.map((row) => Array.from(row.querySelectorAll("th, td")).map((cell) => cell.textContent.replace(/\s+/g, " ").trim()).join("	")).filter((line) => line.length > 0).join("\n");
  }
  function getStyledTableHtml(tableElement) {
    const clone = tableElement.cloneNode(true);
    clone.removeAttribute("id");
    clone.style.borderCollapse = "collapse";
    clone.style.width = "100%";
    clone.style.fontFamily = "Arial, sans-serif";
    clone.style.fontSize = "14px";
    const caption = clone.querySelector("caption");
    if (caption) {
      caption.className = "";
      caption.style.captionSide = "top";
      caption.style.textAlign = "left";
      caption.style.fontWeight = "700";
      caption.style.marginBottom = "8px";
    }
    clone.querySelectorAll("th, td").forEach((cell) => {
      cell.style.border = "1px solid #d8dde0";
      cell.style.padding = "8px";
      cell.style.textAlign = "left";
      cell.style.verticalAlign = "top";
    });
    clone.querySelectorAll("th").forEach((headerCell) => {
      headerCell.style.backgroundColor = "#f0f4f5";
      headerCell.style.fontWeight = "700";
    });
    return clone.outerHTML;
  }
  copyButton.addEventListener("click", function() {
    return __async(this, null, function* () {
      const tableText = getTableText(table);
      const tableHtml = getStyledTableHtml(table);
      if (!tableText) {
        status.textContent = "No issue details available to copy.";
        return;
      }
      try {
        if (navigator.clipboard && window.ClipboardItem) {
          const clipboardItem = new ClipboardItem({
            "text/html": new Blob([tableHtml], { type: "text/html" }),
            "text/plain": new Blob([tableText], { type: "text/plain" })
          });
          yield navigator.clipboard.write([clipboardItem]);
        } else {
          yield navigator.clipboard.writeText(tableText);
        }
        status.textContent = "Issue details copied.";
      } catch (error) {
        const fallback = document.createElement("textarea");
        fallback.value = tableText;
        fallback.setAttribute("readonly", "");
        fallback.style.position = "absolute";
        fallback.style.left = "-9999px";
        document.body.appendChild(fallback);
        fallback.select();
        try {
          document.execCommand("copy");
          status.textContent = "Issue details copied.";
        } catch (copyError) {
          status.textContent = "Unable to copy issue details.";
        }
        document.body.removeChild(fallback);
      }
    });
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L2NvcHkuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIlxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBjb3B5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvcHlJc3N1ZURldGFpbHNCdXR0b24nKTtcbiAgICBjb25zdCB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXBvcnRUYWJsZScpO1xuICAgIGNvbnN0IHN0YXR1cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb3B5SXNzdWVEZXRhaWxzU3RhdHVzJyk7XG5cbiAgICBpZiAoIWNvcHlCdXR0b24gfHwgIXRhYmxlIHx8ICFzdGF0dXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFRhYmxlVGV4dCh0YWJsZUVsZW1lbnQpIHtcbiAgICAgICAgY29uc3Qgcm93cyA9IEFycmF5LmZyb20odGFibGVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RyJykpO1xuXG4gICAgICAgIHJldHVybiByb3dzXG4gICAgICAgICAgICAubWFwKChyb3cpID0+IEFycmF5LmZyb20ocm93LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RoLCB0ZCcpKVxuICAgICAgICAgICAgICAgIC5tYXAoKGNlbGwpID0+IGNlbGwudGV4dENvbnRlbnQucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRyaW0oKSlcbiAgICAgICAgICAgICAgICAuam9pbignXFx0JykpXG4gICAgICAgICAgICAuZmlsdGVyKChsaW5lKSA9PiBsaW5lLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAuam9pbignXFxuJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U3R5bGVkVGFibGVIdG1sKHRhYmxlRWxlbWVudCkge1xuICAgICAgICBjb25zdCBjbG9uZSA9IHRhYmxlRWxlbWVudC5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgICAgICAgY2xvbmUucmVtb3ZlQXR0cmlidXRlKCdpZCcpO1xuICAgICAgICBjbG9uZS5zdHlsZS5ib3JkZXJDb2xsYXBzZSA9ICdjb2xsYXBzZSc7XG4gICAgICAgIGNsb25lLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgICBjbG9uZS5zdHlsZS5mb250RmFtaWx5ID0gJ0FyaWFsLCBzYW5zLXNlcmlmJztcbiAgICAgICAgY2xvbmUuc3R5bGUuZm9udFNpemUgPSAnMTRweCc7XG5cbiAgICAgICAgY29uc3QgY2FwdGlvbiA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoJ2NhcHRpb24nKTtcbiAgICAgICAgaWYgKGNhcHRpb24pIHtcbiAgICAgICAgICAgIGNhcHRpb24uY2xhc3NOYW1lID0gJyc7XG4gICAgICAgICAgICBjYXB0aW9uLnN0eWxlLmNhcHRpb25TaWRlID0gJ3RvcCc7XG4gICAgICAgICAgICBjYXB0aW9uLnN0eWxlLnRleHRBbGlnbiA9ICdsZWZ0JztcbiAgICAgICAgICAgIGNhcHRpb24uc3R5bGUuZm9udFdlaWdodCA9ICc3MDAnO1xuICAgICAgICAgICAgY2FwdGlvbi5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnOHB4JztcbiAgICAgICAgfVxuXG4gICAgICAgIGNsb25lLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RoLCB0ZCcpLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgICAgICAgIGNlbGwuc3R5bGUuYm9yZGVyID0gJzFweCBzb2xpZCAjZDhkZGUwJztcbiAgICAgICAgICAgIGNlbGwuc3R5bGUucGFkZGluZyA9ICc4cHgnO1xuICAgICAgICAgICAgY2VsbC5zdHlsZS50ZXh0QWxpZ24gPSAnbGVmdCc7XG4gICAgICAgICAgICBjZWxsLnN0eWxlLnZlcnRpY2FsQWxpZ24gPSAndG9wJztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY2xvbmUucXVlcnlTZWxlY3RvckFsbCgndGgnKS5mb3JFYWNoKChoZWFkZXJDZWxsKSA9PiB7XG4gICAgICAgICAgICBoZWFkZXJDZWxsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZjBmNGY1JztcbiAgICAgICAgICAgIGhlYWRlckNlbGwuc3R5bGUuZm9udFdlaWdodCA9ICc3MDAnO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gY2xvbmUub3V0ZXJIVE1MO1xuICAgIH1cblxuICAgIGNvcHlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IHRhYmxlVGV4dCA9IGdldFRhYmxlVGV4dCh0YWJsZSk7XG4gICAgICAgIGNvbnN0IHRhYmxlSHRtbCA9IGdldFN0eWxlZFRhYmxlSHRtbCh0YWJsZSk7XG5cbiAgICAgICAgaWYgKCF0YWJsZVRleHQpIHtcbiAgICAgICAgICAgIHN0YXR1cy50ZXh0Q29udGVudCA9ICdObyBpc3N1ZSBkZXRhaWxzIGF2YWlsYWJsZSB0byBjb3B5Lic7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKG5hdmlnYXRvci5jbGlwYm9hcmQgJiYgd2luZG93LkNsaXBib2FyZEl0ZW0pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjbGlwYm9hcmRJdGVtID0gbmV3IENsaXBib2FyZEl0ZW0oe1xuICAgICAgICAgICAgICAgICAgICAndGV4dC9odG1sJzogbmV3IEJsb2IoW3RhYmxlSHRtbF0sIHsgdHlwZTogJ3RleHQvaHRtbCcgfSksXG4gICAgICAgICAgICAgICAgICAgICd0ZXh0L3BsYWluJzogbmV3IEJsb2IoW3RhYmxlVGV4dF0sIHsgdHlwZTogJ3RleHQvcGxhaW4nIH0pXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlKFtjbGlwYm9hcmRJdGVtXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRhYmxlVGV4dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN0YXR1cy50ZXh0Q29udGVudCA9ICdJc3N1ZSBkZXRhaWxzIGNvcGllZC4nO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc3QgZmFsbGJhY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICAgICAgICAgICAgZmFsbGJhY2sudmFsdWUgPSB0YWJsZVRleHQ7XG4gICAgICAgICAgICBmYWxsYmFjay5zZXRBdHRyaWJ1dGUoJ3JlYWRvbmx5JywgJycpO1xuICAgICAgICAgICAgZmFsbGJhY2suc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgZmFsbGJhY2suc3R5bGUubGVmdCA9ICctOTk5OXB4JztcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmYWxsYmFjayk7XG4gICAgICAgICAgICBmYWxsYmFjay5zZWxlY3QoKTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xuICAgICAgICAgICAgICAgIHN0YXR1cy50ZXh0Q29udGVudCA9ICdJc3N1ZSBkZXRhaWxzIGNvcGllZC4nO1xuICAgICAgICAgICAgfSBjYXRjaCAoY29weUVycm9yKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzLnRleHRDb250ZW50ID0gJ1VuYWJsZSB0byBjb3B5IGlzc3VlIGRldGFpbHMuJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChmYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLFNBQVMsaUJBQWlCLG9CQUFvQixXQUFZO0FB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
