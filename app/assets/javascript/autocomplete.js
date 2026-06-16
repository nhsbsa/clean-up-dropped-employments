import accessibleAutocomplete from 'accessible-autocomplete'

window.addEventListener('load', () => {
    document.querySelectorAll('.js-autocomplete').forEach(selectElement => {
      accessibleAutocomplete.enhanceSelectElement({
        selectElement
      })
    })
  })