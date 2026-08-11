document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('documents');
    const dropzone = document.getElementById('documents-dropzone');
    const fileUploadContainer = document.getElementById('file-upload-container');
    const documentsError = document.getElementById('documents-error');
    const uploadedFileNamesInput = document.getElementById('uploaded-file-names');
    const uploadedFilesContainer = document.getElementById('uploaded-files-container');
    const fileListContainer = document.getElementById('uploaded-files');
    const liveRegion = document.getElementById('documents-live-region');
    const allowedExtensions = new Set(['jpg', 'jpeg', 'bmp', 'png', 'pdf']);
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
        const extParts = file.name.split('.');
        const extension = extParts.length > 1 ? extParts.pop().toUpperCase() : 'FILE';
        return `${extension}, ${humanReadableSize(file.size)}`;
    }

    function isAllowedType(file) {
        const extParts = file.name.split('.');
        if (extParts.length < 2) {
            return false;
        }

        const extension = extParts.pop().toLowerCase();
        return allowedExtensions.has(extension);
    }

    function clearUploadError() {
        documentsError.style.display = 'none';
        documentsError.innerHTML = '';
        fileUploadContainer.classList.remove('nhsuk-form-group--error');
        fileInput.classList.remove('nhsuk-file-upload--error');
        fileInput.removeAttribute('aria-describedby');
    }

    function showUploadError(invalidTypeFiles, oversizedFiles) {
        const messages = [];

        if (invalidTypeFiles.length > 0) {
            messages.push(`Unsupported file type: ${invalidTypeFiles.join(', ')}. Use JPG, JPEG, BMP, PNG or PDF.`);
        }

        if (oversizedFiles.length > 0) {
            messages.push(`File too large: ${oversizedFiles.join(', ')}. Each file must be 2MB or smaller.`);
        }

        documentsError.innerHTML = `<span class="nhsuk-u-visually-hidden">Error:</span> ${messages.join(' ')}`;
        documentsError.style.display = 'block';
        fileUploadContainer.classList.add('nhsuk-form-group--error');
        fileInput.classList.add('nhsuk-file-upload--error');
        fileInput.setAttribute('aria-describedby', 'documents-error');
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
        fileListContainer.innerHTML = '';

        if (selectedFiles.length === 0) {
            uploadedFilesContainer.style.display = 'none';
            liveRegion.textContent = 'No files uploaded';
            return;
        }

        uploadedFilesContainer.style.display = 'block';

        selectedFiles.forEach((file, index) => {
            const row = document.createElement('div');
            row.className = 'nhsuk-summary-list__row';

            const value = document.createElement('dd');
            value.className = 'nhsuk-summary-list__value';
            value.innerHTML = `
                        <strong style="color:#007f3b; display:inline-flex; align-items:center; gap:6px;">
                            <svg fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="20" width="20" aria-hidden="true">
                                <path d="M25,6.2L8.7,23.2L0,14.1l4-4.2l4.7,4.9L21,2L25,6.2z"></path>
                            </svg>
                            ${file.name} (${fileTypeLabel(file)}) successfully uploaded
                        </strong>
                    `;

            const actions = document.createElement('dd');
            actions.className = 'nhsuk-summary-list__actions';

            const deleteLink = document.createElement('a');
            deleteLink.href = '#';
            deleteLink.className = 'nhsuk-link';
            deleteLink.textContent = 'Delete';
            deleteLink.setAttribute('data-delete-index', String(index));
            deleteLink.setAttribute('aria-label', `Delete ${file.name}`);

            deleteLink.addEventListener('click', function (event) {
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

        liveRegion.textContent = `${selectedFiles.length} file${selectedFiles.length === 1 ? '' : 's'} uploaded`;
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

    fileInput.addEventListener('change', function () {
        addFiles(Array.from(fileInput.files));
    });

    dropzone.addEventListener('dragover', function (event) {
        event.preventDefault();
        dropzone.style.background = '#6f777b';
    });

    dropzone.addEventListener('dragleave', function () {
        dropzone.style.background = '#f0f4f5';
    });

    dropzone.addEventListener('drop', function (event) {
        event.preventDefault();
        dropzone.style.background = '#f0f4f5';

        if (event.dataTransfer && event.dataTransfer.files) {
            addFiles(Array.from(event.dataTransfer.files));
        }
    });
});
