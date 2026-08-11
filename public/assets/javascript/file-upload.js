// app/assets/javascript/file-upload.js
document.addEventListener("DOMContentLoaded", function() {
  const fileInput = document.getElementById("documents");
  const dropzone = document.getElementById("documents-dropzone");
  const fileUploadContainer = document.getElementById("file-upload-container");
  const documentsError = document.getElementById("documents-error");
  const uploadedFileNamesInput = document.getElementById("uploaded-file-names");
  const uploadedFilesContainer = document.getElementById("uploaded-files-container");
  const fileListContainer = document.getElementById("uploaded-files");
  const liveRegion = document.getElementById("documents-live-region");
  const allowedExtensions = /* @__PURE__ */ new Set(["jpg", "jpeg", "bmp", "png", "pdf"]);
  const maxFileBytes = 2 * 1024 * 1024;
  let selectedFiles = [];
  function fileKey(file) {
    return `${file.name}-${file.size}-${file.lastModified}`;
  }
  function humanReadableSize(bytes) {
    if (bytes < 1024) {
      return `${bytes} bytes`;
    }
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${Math.round(kb)} KB`;
    }
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  }
  function fileTypeLabel(file) {
    const extParts = file.name.split(".");
    const extension = extParts.length > 1 ? extParts.pop().toUpperCase() : "FILE";
    return `${extension}, ${humanReadableSize(file.size)}`;
  }
  function isAllowedType(file) {
    const extParts = file.name.split(".");
    if (extParts.length < 2) {
      return false;
    }
    const extension = extParts.pop().toLowerCase();
    return allowedExtensions.has(extension);
  }
  function clearUploadError() {
    documentsError.style.display = "none";
    documentsError.innerHTML = "";
    fileUploadContainer.classList.remove("nhsuk-form-group--error");
    fileInput.classList.remove("nhsuk-file-upload--error");
    fileInput.removeAttribute("aria-describedby");
  }
  function showUploadError(invalidTypeFiles, oversizedFiles) {
    const messages = [];
    if (invalidTypeFiles.length > 0) {
      messages.push(`Unsupported file type: ${invalidTypeFiles.join(", ")}. Use JPG, JPEG, BMP, PNG or PDF.`);
    }
    if (oversizedFiles.length > 0) {
      messages.push(`File too large: ${oversizedFiles.join(", ")}. Each file must be 2MB or smaller.`);
    }
    documentsError.innerHTML = `<span class="nhsuk-u-visually-hidden">Error:</span> ${messages.join(" ")}`;
    documentsError.style.display = "block";
    fileUploadContainer.classList.add("nhsuk-form-group--error");
    fileInput.classList.add("nhsuk-file-upload--error");
    fileInput.setAttribute("aria-describedby", "documents-error");
  }
  function syncInputFiles() {
    const dataTransfer = new DataTransfer();
    selectedFiles.forEach((file) => dataTransfer.items.add(file));
    fileInput.files = dataTransfer.files;
    if (uploadedFileNamesInput) {
      uploadedFileNamesInput.value = JSON.stringify(selectedFiles.map((file) => file.name));
    }
  }
  function renderFiles() {
    fileListContainer.innerHTML = "";
    if (selectedFiles.length === 0) {
      uploadedFilesContainer.style.display = "none";
      liveRegion.textContent = "No files uploaded";
      return;
    }
    uploadedFilesContainer.style.display = "block";
    selectedFiles.forEach((file, index) => {
      const row = document.createElement("div");
      row.className = "nhsuk-summary-list__row";
      const value = document.createElement("dd");
      value.className = "nhsuk-summary-list__value";
      value.innerHTML = `
                        <strong style="color:#007f3b; display:inline-flex; align-items:center; gap:6px;">
                            <svg fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="20" width="20" aria-hidden="true">
                                <path d="M25,6.2L8.7,23.2L0,14.1l4-4.2l4.7,4.9L21,2L25,6.2z"></path>
                            </svg>
                            ${file.name} (${fileTypeLabel(file)}) successfully uploaded
                        </strong>
                    `;
      const actions = document.createElement("dd");
      actions.className = "nhsuk-summary-list__actions";
      const deleteLink = document.createElement("a");
      deleteLink.href = "#";
      deleteLink.className = "nhsuk-link";
      deleteLink.textContent = "Delete";
      deleteLink.setAttribute("data-delete-index", String(index));
      deleteLink.setAttribute("aria-label", `Delete ${file.name}`);
      deleteLink.addEventListener("click", function(event) {
        event.preventDefault();
        selectedFiles = selectedFiles.filter((_, fileIndex) => fileIndex !== index);
        syncInputFiles();
        renderFiles();
      });
      actions.appendChild(deleteLink);
      row.appendChild(value);
      row.appendChild(actions);
      fileListContainer.appendChild(row);
    });
    liveRegion.textContent = `${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"} uploaded`;
  }
  function addFiles(files) {
    const existingKeys = new Set(selectedFiles.map(fileKey));
    const invalidTypeFiles = [];
    const oversizedFiles = [];
    files.forEach((file) => {
      if (!isAllowedType(file)) {
        invalidTypeFiles.push(file.name);
        return;
      }
      if (file.size > maxFileBytes) {
        oversizedFiles.push(file.name);
        return;
      }
      const key = fileKey(file);
      if (!existingKeys.has(key)) {
        selectedFiles.push(file);
        existingKeys.add(key);
      }
    });
    if (invalidTypeFiles.length > 0 || oversizedFiles.length > 0) {
      showUploadError(invalidTypeFiles, oversizedFiles);
    } else {
      clearUploadError();
    }
    syncInputFiles();
    renderFiles();
  }
  fileInput.addEventListener("change", function() {
    addFiles(Array.from(fileInput.files));
  });
  dropzone.addEventListener("dragover", function(event) {
    event.preventDefault();
    dropzone.style.background = "#6f777b";
  });
  dropzone.addEventListener("dragleave", function() {
    dropzone.style.background = "#f0f4f5";
  });
  dropzone.addEventListener("drop", function(event) {
    event.preventDefault();
    dropzone.style.background = "#f0f4f5";
    if (event.dataTransfer && event.dataTransfer.files) {
      addFiles(Array.from(event.dataTransfer.files));
    }
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L2ZpbGUtdXBsb2FkLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGZpbGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkb2N1bWVudHMnKTtcbiAgICBjb25zdCBkcm9wem9uZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkb2N1bWVudHMtZHJvcHpvbmUnKTtcbiAgICBjb25zdCBmaWxlVXBsb2FkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGUtdXBsb2FkLWNvbnRhaW5lcicpO1xuICAgIGNvbnN0IGRvY3VtZW50c0Vycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RvY3VtZW50cy1lcnJvcicpO1xuICAgIGNvbnN0IHVwbG9hZGVkRmlsZU5hbWVzSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXBsb2FkZWQtZmlsZS1uYW1lcycpO1xuICAgIGNvbnN0IHVwbG9hZGVkRmlsZXNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXBsb2FkZWQtZmlsZXMtY29udGFpbmVyJyk7XG4gICAgY29uc3QgZmlsZUxpc3RDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXBsb2FkZWQtZmlsZXMnKTtcbiAgICBjb25zdCBsaXZlUmVnaW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RvY3VtZW50cy1saXZlLXJlZ2lvbicpO1xuICAgIGNvbnN0IGFsbG93ZWRFeHRlbnNpb25zID0gbmV3IFNldChbJ2pwZycsICdqcGVnJywgJ2JtcCcsICdwbmcnLCAncGRmJ10pO1xuICAgIGNvbnN0IG1heEZpbGVCeXRlcyA9IDIgKiAxMDI0ICogMTAyNDtcbiAgICBsZXQgc2VsZWN0ZWRGaWxlcyA9IFtdO1xuXG4gICAgZnVuY3Rpb24gZmlsZUtleShmaWxlKSB7XG4gICAgICAgIHJldHVybiBgJHtmaWxlLm5hbWV9LSR7ZmlsZS5zaXplfS0ke2ZpbGUubGFzdE1vZGlmaWVkfWA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaHVtYW5SZWFkYWJsZVNpemUoYnl0ZXMpIHtcbiAgICAgICAgaWYgKGJ5dGVzIDwgMTAyNCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke2J5dGVzfSBieXRlc2A7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBrYiA9IGJ5dGVzIC8gMTAyNDtcbiAgICAgICAgaWYgKGtiIDwgMTAyNCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke01hdGgucm91bmQoa2IpfSBLQmA7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYiA9IGtiIC8gMTAyNDtcbiAgICAgICAgcmV0dXJuIGAke21iLnRvRml4ZWQoMSl9IE1CYDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWxlVHlwZUxhYmVsKGZpbGUpIHtcbiAgICAgICAgY29uc3QgZXh0UGFydHMgPSBmaWxlLm5hbWUuc3BsaXQoJy4nKTtcbiAgICAgICAgY29uc3QgZXh0ZW5zaW9uID0gZXh0UGFydHMubGVuZ3RoID4gMSA/IGV4dFBhcnRzLnBvcCgpLnRvVXBwZXJDYXNlKCkgOiAnRklMRSc7XG4gICAgICAgIHJldHVybiBgJHtleHRlbnNpb259LCAke2h1bWFuUmVhZGFibGVTaXplKGZpbGUuc2l6ZSl9YDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0FsbG93ZWRUeXBlKGZpbGUpIHtcbiAgICAgICAgY29uc3QgZXh0UGFydHMgPSBmaWxlLm5hbWUuc3BsaXQoJy4nKTtcbiAgICAgICAgaWYgKGV4dFBhcnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGV4dGVuc2lvbiA9IGV4dFBhcnRzLnBvcCgpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHJldHVybiBhbGxvd2VkRXh0ZW5zaW9ucy5oYXMoZXh0ZW5zaW9uKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhclVwbG9hZEVycm9yKCkge1xuICAgICAgICBkb2N1bWVudHNFcnJvci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBkb2N1bWVudHNFcnJvci5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgZmlsZVVwbG9hZENvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCduaHN1ay1mb3JtLWdyb3VwLS1lcnJvcicpO1xuICAgICAgICBmaWxlSW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnbmhzdWstZmlsZS11cGxvYWQtLWVycm9yJyk7XG4gICAgICAgIGZpbGVJbnB1dC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaG93VXBsb2FkRXJyb3IoaW52YWxpZFR5cGVGaWxlcywgb3ZlcnNpemVkRmlsZXMpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZXMgPSBbXTtcblxuICAgICAgICBpZiAoaW52YWxpZFR5cGVGaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKGBVbnN1cHBvcnRlZCBmaWxlIHR5cGU6ICR7aW52YWxpZFR5cGVGaWxlcy5qb2luKCcsICcpfS4gVXNlIEpQRywgSlBFRywgQk1QLCBQTkcgb3IgUERGLmApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG92ZXJzaXplZEZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goYEZpbGUgdG9vIGxhcmdlOiAke292ZXJzaXplZEZpbGVzLmpvaW4oJywgJyl9LiBFYWNoIGZpbGUgbXVzdCBiZSAyTUIgb3Igc21hbGxlci5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50c0Vycm9yLmlubmVySFRNTCA9IGA8c3BhbiBjbGFzcz1cIm5oc3VrLXUtdmlzdWFsbHktaGlkZGVuXCI+RXJyb3I6PC9zcGFuPiAke21lc3NhZ2VzLmpvaW4oJyAnKX1gO1xuICAgICAgICBkb2N1bWVudHNFcnJvci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgZmlsZVVwbG9hZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCduaHN1ay1mb3JtLWdyb3VwLS1lcnJvcicpO1xuICAgICAgICBmaWxlSW5wdXQuY2xhc3NMaXN0LmFkZCgnbmhzdWstZmlsZS11cGxvYWQtLWVycm9yJyk7XG4gICAgICAgIGZpbGVJbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCAnZG9jdW1lbnRzLWVycm9yJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3luY0lucHV0RmlsZXMoKSB7XG4gICAgICAgIGNvbnN0IGRhdGFUcmFuc2ZlciA9IG5ldyBEYXRhVHJhbnNmZXIoKTtcbiAgICAgICAgc2VsZWN0ZWRGaWxlcy5mb3JFYWNoKChmaWxlKSA9PiBkYXRhVHJhbnNmZXIuaXRlbXMuYWRkKGZpbGUpKTtcbiAgICAgICAgZmlsZUlucHV0LmZpbGVzID0gZGF0YVRyYW5zZmVyLmZpbGVzO1xuXG4gICAgICAgIGlmICh1cGxvYWRlZEZpbGVOYW1lc0lucHV0KSB7XG4gICAgICAgICAgICB1cGxvYWRlZEZpbGVOYW1lc0lucHV0LnZhbHVlID0gSlNPTi5zdHJpbmdpZnkoc2VsZWN0ZWRGaWxlcy5tYXAoKGZpbGUpID0+IGZpbGUubmFtZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyRmlsZXMoKSB7XG4gICAgICAgIGZpbGVMaXN0Q29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZEZpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdXBsb2FkZWRGaWxlc0NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgbGl2ZVJlZ2lvbi50ZXh0Q29udGVudCA9ICdObyBmaWxlcyB1cGxvYWRlZCc7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB1cGxvYWRlZEZpbGVzQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXG4gICAgICAgIHNlbGVjdGVkRmlsZXMuZm9yRWFjaCgoZmlsZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgcm93LmNsYXNzTmFtZSA9ICduaHN1ay1zdW1tYXJ5LWxpc3RfX3Jvdyc7XG5cbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGQnKTtcbiAgICAgICAgICAgIHZhbHVlLmNsYXNzTmFtZSA9ICduaHN1ay1zdW1tYXJ5LWxpc3RfX3ZhbHVlJztcbiAgICAgICAgICAgIHZhbHVlLmlubmVySFRNTCA9IGBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9XCJjb2xvcjojMDA3ZjNiOyBkaXNwbGF5OmlubGluZS1mbGV4OyBhbGlnbi1pdGVtczpjZW50ZXI7IGdhcDo2cHg7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyBmaWxsPVwiY3VycmVudENvbG9yXCIgcm9sZT1cInByZXNlbnRhdGlvblwiIGZvY3VzYWJsZT1cImZhbHNlXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjUgMjVcIiBoZWlnaHQ9XCIyMFwiIHdpZHRoPVwiMjBcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0yNSw2LjJMOC43LDIzLjJMMCwxNC4xbDQtNC4ybDQuNyw0LjlMMjEsMkwyNSw2LjJ6XCI+PC9wYXRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZmlsZS5uYW1lfSAoJHtmaWxlVHlwZUxhYmVsKGZpbGUpfSkgc3VjY2Vzc2Z1bGx5IHVwbG9hZGVkXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgYDtcblxuICAgICAgICAgICAgY29uc3QgYWN0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RkJyk7XG4gICAgICAgICAgICBhY3Rpb25zLmNsYXNzTmFtZSA9ICduaHN1ay1zdW1tYXJ5LWxpc3RfX2FjdGlvbnMnO1xuXG4gICAgICAgICAgICBjb25zdCBkZWxldGVMaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgICAgZGVsZXRlTGluay5ocmVmID0gJyMnO1xuICAgICAgICAgICAgZGVsZXRlTGluay5jbGFzc05hbWUgPSAnbmhzdWstbGluayc7XG4gICAgICAgICAgICBkZWxldGVMaW5rLnRleHRDb250ZW50ID0gJ0RlbGV0ZSc7XG4gICAgICAgICAgICBkZWxldGVMaW5rLnNldEF0dHJpYnV0ZSgnZGF0YS1kZWxldGUtaW5kZXgnLCBTdHJpbmcoaW5kZXgpKTtcbiAgICAgICAgICAgIGRlbGV0ZUxpbmsuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgYERlbGV0ZSAke2ZpbGUubmFtZX1gKTtcblxuICAgICAgICAgICAgZGVsZXRlTGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRGaWxlcyA9IHNlbGVjdGVkRmlsZXMuZmlsdGVyKChfLCBmaWxlSW5kZXgpID0+IGZpbGVJbmRleCAhPT0gaW5kZXgpO1xuICAgICAgICAgICAgICAgIHN5bmNJbnB1dEZpbGVzKCk7XG4gICAgICAgICAgICAgICAgcmVuZGVyRmlsZXMoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhY3Rpb25zLmFwcGVuZENoaWxkKGRlbGV0ZUxpbmspO1xuICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKHZhbHVlKTtcbiAgICAgICAgICAgIHJvdy5hcHBlbmRDaGlsZChhY3Rpb25zKTtcbiAgICAgICAgICAgIGZpbGVMaXN0Q29udGFpbmVyLmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxpdmVSZWdpb24udGV4dENvbnRlbnQgPSBgJHtzZWxlY3RlZEZpbGVzLmxlbmd0aH0gZmlsZSR7c2VsZWN0ZWRGaWxlcy5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ30gdXBsb2FkZWRgO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZEZpbGVzKGZpbGVzKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nS2V5cyA9IG5ldyBTZXQoc2VsZWN0ZWRGaWxlcy5tYXAoZmlsZUtleSkpO1xuICAgICAgICBjb25zdCBpbnZhbGlkVHlwZUZpbGVzID0gW107XG4gICAgICAgIGNvbnN0IG92ZXJzaXplZEZpbGVzID0gW107XG5cbiAgICAgICAgZmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFpc0FsbG93ZWRUeXBlKGZpbGUpKSB7XG4gICAgICAgICAgICAgICAgaW52YWxpZFR5cGVGaWxlcy5wdXNoKGZpbGUubmFtZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZmlsZS5zaXplID4gbWF4RmlsZUJ5dGVzKSB7XG4gICAgICAgICAgICAgICAgb3ZlcnNpemVkRmlsZXMucHVzaChmaWxlLm5hbWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qga2V5ID0gZmlsZUtleShmaWxlKTtcbiAgICAgICAgICAgIGlmICghZXhpc3RpbmdLZXlzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRGaWxlcy5wdXNoKGZpbGUpO1xuICAgICAgICAgICAgICAgIGV4aXN0aW5nS2V5cy5hZGQoa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGludmFsaWRUeXBlRmlsZXMubGVuZ3RoID4gMCB8fCBvdmVyc2l6ZWRGaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzaG93VXBsb2FkRXJyb3IoaW52YWxpZFR5cGVGaWxlcywgb3ZlcnNpemVkRmlsZXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2xlYXJVcGxvYWRFcnJvcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3luY0lucHV0RmlsZXMoKTtcbiAgICAgICAgcmVuZGVyRmlsZXMoKTtcbiAgICB9XG5cbiAgICBmaWxlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBhZGRGaWxlcyhBcnJheS5mcm9tKGZpbGVJbnB1dC5maWxlcykpO1xuICAgIH0pO1xuXG4gICAgZHJvcHpvbmUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZHJvcHpvbmUuc3R5bGUuYmFja2dyb3VuZCA9ICcjNmY3NzdiJztcbiAgICB9KTtcblxuICAgIGRyb3B6b25lLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZHJvcHpvbmUuc3R5bGUuYmFja2dyb3VuZCA9ICcjZjBmNGY1JztcbiAgICB9KTtcblxuICAgIGRyb3B6b25lLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZHJvcHpvbmUuc3R5bGUuYmFja2dyb3VuZCA9ICcjZjBmNGY1JztcblxuICAgICAgICBpZiAoZXZlbnQuZGF0YVRyYW5zZmVyICYmIGV2ZW50LmRhdGFUcmFuc2Zlci5maWxlcykge1xuICAgICAgICAgICAgYWRkRmlsZXMoQXJyYXkuZnJvbShldmVudC5kYXRhVHJhbnNmZXIuZmlsZXMpKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQUEsU0FBUyxpQkFBaUIsb0JBQW9CLFdBQVk7QUFDdEQsUUFBTSxZQUFZLFNBQVMsZUFBZSxXQUFXO0FBQ3JELFFBQU0sV0FBVyxTQUFTLGVBQWUsb0JBQW9CO0FBQzdELFFBQU0sc0JBQXNCLFNBQVMsZUFBZSx1QkFBdUI7QUFDM0UsUUFBTSxpQkFBaUIsU0FBUyxlQUFlLGlCQUFpQjtBQUNoRSxRQUFNLHlCQUF5QixTQUFTLGVBQWUscUJBQXFCO0FBQzVFLFFBQU0seUJBQXlCLFNBQVMsZUFBZSwwQkFBMEI7QUFDakYsUUFBTSxvQkFBb0IsU0FBUyxlQUFlLGdCQUFnQjtBQUNsRSxRQUFNLGFBQWEsU0FBUyxlQUFlLHVCQUF1QjtBQUNsRSxRQUFNLG9CQUFvQixvQkFBSSxJQUFJLENBQUMsT0FBTyxRQUFRLE9BQU8sT0FBTyxLQUFLLENBQUM7QUFDdEUsUUFBTSxlQUFlLElBQUksT0FBTztBQUNoQyxNQUFJLGdCQUFnQixDQUFDO0FBRXJCLFdBQVMsUUFBUSxNQUFNO0FBQ25CLFdBQU8sR0FBRyxLQUFLLElBQUksSUFBSSxLQUFLLElBQUksSUFBSSxLQUFLLFlBQVk7QUFBQSxFQUN6RDtBQUVBLFdBQVMsa0JBQWtCLE9BQU87QUFDOUIsUUFBSSxRQUFRLE1BQU07QUFDZCxhQUFPLEdBQUcsS0FBSztBQUFBLElBQ25CO0FBRUEsVUFBTSxLQUFLLFFBQVE7QUFDbkIsUUFBSSxLQUFLLE1BQU07QUFDWCxhQUFPLEdBQUcsS0FBSyxNQUFNLEVBQUUsQ0FBQztBQUFBLElBQzVCO0FBRUEsVUFBTSxLQUFLLEtBQUs7QUFDaEIsV0FBTyxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUM7QUFBQSxFQUMzQjtBQUVBLFdBQVMsY0FBYyxNQUFNO0FBQ3pCLFVBQU0sV0FBVyxLQUFLLEtB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QUFLO0FBQ3JCLFVBQUksWUFBWSxPQUFPO0FBQ3ZCLHdCQUFrQixZQUFZLEdBQUc7QUFBQSxJQUNyQyxDQUFDO0FBRUQsZUFBVyxjQUFjLEdBQUcsY0FBYyxNQUFNLFFBQVEsY0FBYyxXQUFXLElBQUksS0FBSyxHQUFHO0FBQUEsRUFDakc7QUFFQSxXQUFTLFNBQVMsT0FBTztBQUNyQixVQUFNLGVBQWUsSUFBSSxJQUFJLGNBQWMsSUFBSSxPQUFPLENBQUM7QUFDdkQsVUFBTSxtQkFBbUIsQ0FBQztBQUMxQixVQUFNLGlCQUFpQixDQUFDO0FBRXhCLFVBQU0sUUFBUSxDQUFDLFNBQVM7QUFDcEIsVUFBSSxDQUFDLGNBQWMsSUFBSSxHQUFHO0FBQ3RCLHlCQUFpQixLQUFLLEtBQUssSUFBSTtBQUMvQjtBQUFBLE1BQ0o7QUFFQSxVQUFJLEtBQUssT0FBTyxjQUFjO0FBQzFCLHVCQUFlLEtBQUssS0FBSyxJQUFJO0FBQzdCO0FBQUEsTUFDSjtBQUVBLFlBQU0sTUFBTSxRQUFRLElBQUk7QUFDeEIsVUFBSSxDQUFDLGFBQWEsSUFBSSxHQUFHLEdBQUc7QUFDeEIsc0JBQWMsS0FBSyxJQUFJO0FBQ3ZCLHFCQUFhLElBQUksR0FBRztBQUFBLE1BQ3hCO0FBQUEsSUFDSixDQUFDO0FBRUQsUUFBSSxpQkFBaUIsU0FBUyxLQUFLLGVBQWUsU0FBUyxHQUFHO0FBQzFELHNCQUFnQixrQkFBa0IsY0FBYztBQUFBLElBQ3BELE9BQU87QUFDSCx1QkFBaUI7QUFBQSxJQUNyQjtBQUVBLG1CQUFlO0FBQ2YsZ0JBQVk7QUFBQSxFQUNoQjtBQUVBLFlBQVUsaUJBQWlCLFVBQVUsV0FBWTtBQUM3QyxhQUFTLE1BQU0sS0FBSyxVQUFVLEtBQUssQ0FBQztBQUFBLEVBQ3hDLENBQUM7QUFFRCxXQUFTLGlCQUFpQixZQUFZLFNBQVUsT0FBTztBQUNuRCxVQUFNLGVBQWU7QUFDckIsYUFBUyxNQUFNLGFBQWE7QUFBQSxFQUNoQyxDQUFDO0FBRUQsV0FBUyxpQkFBaUIsYUFBYSxXQUFZO0FBQy9DLGFBQVMsTUFBTSxhQUFhO0FBQUEsRUFDaEMsQ0FBQztBQUVELFdBQVMsaUJBQWlCLFFBQVEsU0FBVSxPQUFPO0FBQy9DLFVBQU0sZUFBZTtBQUNyQixhQUFTLE1BQU0sYUFBYTtBQUU1QixRQUFJLE1BQU0sZ0JBQWdCLE1BQU0sYUFBYSxPQUFPO0FBQ2hELGVBQVMsTUFBTSxLQUFLLE1BQU0sYUFBYSxLQUFLLENBQUM7QUFBQSxJQUNqRDtBQUFBLEVBQ0osQ0FBQztBQUNMLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
