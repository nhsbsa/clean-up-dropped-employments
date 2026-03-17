document.querySelectorAll(".paginated-table").forEach(container => {

    const rowsPerPage = 5
    let currentPage = 1
    let showingHidden = true

    const toggleBtns = container.querySelectorAll(".toggleBtnHH, .toggleBtnCT")
    const allRows = Array.from(container.querySelectorAll(".rows-hh, .hrsError, .rows-conts, .contsError"))

    const prevBtn = container.querySelector(".nhsuk-pagination__previous")
    const nextBtn = container.querySelector(".nhsuk-pagination__next")
    const paginationList = container.querySelector(".nhsuk-pagination__list")
    const pagination = container.querySelector(".nhsuk-pagination")

    // get the rows that should currently be visible
    function getVisibleRows() {
        return allRows.filter(row => {
            // hide hidden rows if toggle is off
            if (!showingHidden && row.classList.contains("hidden-row")) return false
            return true
        })
    }

    function createPageItem(page, isCurrent = false) {

        const li = document.createElement("li")
        li.className = "nhsuk-pagination__item"

        if (isCurrent) li.classList.add("nhsuk-pagination__item--current")

        const link = document.createElement("a")
        link.href = "#"
        link.className = "nhsuk-pagination__link"
        link.textContent = page

        if (isCurrent) link.setAttribute("aria-current", "page")

        link.addEventListener("click", e => {
            e.preventDefault()
            currentPage = page
            renderTable()
        })

        li.appendChild(link)
        return li
    }

    function renderPagination(totalPages) {

        paginationList.innerHTML = ""

        for (let i = 1; i <= totalPages; i++) {
            paginationList.appendChild(createPageItem(i, i === currentPage))
        }

        prevBtn.style.display = currentPage === 1 ? "none" : "block"
        nextBtn.style.display = currentPage === totalPages ? "none" : "block"
    }

    function renderTable() {

        const visibleRows = getVisibleRows()
        const totalPages = Math.ceil(visibleRows.length / rowsPerPage) || 1

        const start = (currentPage - 1) * rowsPerPage
        const end = start + rowsPerPage

        allRows.forEach(row => row.style.display = "none")

        visibleRows.slice(start, end).forEach(row => {
            row.style.display = ""
        })

        renderPagination(totalPages)

        pagination.style.display = showingHidden ? "block" : "none"
    }

    prevBtn.addEventListener("click", e => {
        e.preventDefault()
        currentPage--
        renderTable()
    })

    nextBtn.addEventListener("click", e => {
        e.preventDefault()
        currentPage++
        renderTable()
    })

    toggleBtns.forEach(toggleBtn => {

        toggleBtn.addEventListener("click", () => {

            showingHidden = !showingHidden

            toggleBtn.textContent = showingHidden
                ? "Hide correct rows"
                : "Show correct rows"

            currentPage = 1
            renderTable()

        })

    })

    renderTable()

})