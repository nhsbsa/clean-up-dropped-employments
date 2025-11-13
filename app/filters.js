/**
 * @param {Environment} env
 */
module.exports = function (env) {
  const filters = {}

  /* ------------------------------------------------------------------
    add your methods to the filters obj below this comment block:
    @example:

    filters.sayHi = function(name) {
        return 'Hi ' + name + '!'
    }

    Which in your templates would be used as:

    {{ 'Paul' | sayHi }} => 'Hi Paul'

    Notice the first argument of your filters method is whatever
    gets 'piped' via '|' to the filter.

    Filters can take additional arguments, for example:

    filters.sayHi = function(name,tone) {
      return (tone == 'formal' ? 'Greetings' : 'Hi') + ' ' + name + '!'
    }

    Which would be used like this:

    {{ 'Joel' | sayHi('formal') }} => 'Greetings Joel!'
    {{ 'Gemma' | sayHi }} => 'Hi Gemma!'

    For more on filters and how to write them see the Nunjucks
    documentation.

  ------------------------------------------------------------------ */
 // filters.js
 
 filters.renderTable = function(data, columnTitles = {}, highlightColumn = null, highlightThreshold = null, page = 1, pageSize = 5) {
  if (!Array.isArray(data) || data.length === 0) {
      return '<p>No data available</p>';
  }

  // Pagination calculation
  const totalRows = data.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const currentPage = Math.min(Math.max(page, 1), totalPages); // clamp
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageData = data.slice(start, end);

  // Table headers
  const headers = Object.keys(data[0]);
  let html = '<table class="govuk-table">';
  html += '<thead><tr>';
  headers.forEach(header => {
      const title = columnTitles[header] || header;
      html += `<th class="govuk-table__header">${title}</th>`;
  });
  html += '</tr></thead><tbody>';

  // Table rows
  pageData.forEach(row => {
      let rowClass = '';
      if (highlightColumn && highlightThreshold != null && row[highlightColumn] > highlightThreshold) {
          rowClass = 'govuk-table__row--highlight';
      }

      html += `<tr class="${rowClass}">`;
      headers.forEach(header => {
          html += `<td class="govuk-table__cell">${row[header]}</td>`;
      });
      html += '</tr>';
  });

  html += '</tbody></table>';

  // Pagination component (Previous / Next)
  html += '<nav class="govuk-pagination" role="navigation" aria-label="Table pagination">';
  html += '<ul class="govuk-pagination__list">';

  // Previous
  if (currentPage > 1) {
      html += `<li class="govuk-pagination__item govuk-pagination__item--prev">
                  <a class="govuk-link" href="?page=${currentPage - 1}">Previous</a>
               </li>`;
  } else {
      html += `<li class="govuk-pagination__item govuk-pagination__item--prev govuk-pagination__link--disabled">
                  <span class="govuk-link">Previous</span>
               </li>`;
  }

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
      const activeClass = i === currentPage ? 'govuk-pagination__link--current' : '';
      html += `<li class="govuk-pagination__item"><a class="govuk-link ${activeClass}" href="?page=${i}">${i}</a></li>`;
  }

  // Next
  if (currentPage < totalPages) {
      html += `<li class="govuk-pagination__item govuk-pagination__item--next">
                  <a class="govuk-link" href="?page=${currentPage + 1}">Next</a>
               </li>`;
  } else {
      html += `<li class="govuk-pagination__item govuk-pagination__item--next govuk-pagination__link--disabled">
                  <span class="govuk-link">Next</span>
               </li>`;
  }

  html += '</ul></nav>';

  return html;
};


  
  
  /* keep the following line to return your filters to the app  */
  return filters
}

/**
 * @import { Environment } from 'nunjucks'
 */
