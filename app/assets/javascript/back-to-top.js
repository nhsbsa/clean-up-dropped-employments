const button = document.querySelector('.app-back-to-top');
const container = document.querySelector('.nhsuk-grid-column-full');

function handleScroll() {
    const rect = container.getBoundingClientRect();

    // 👉 Hide until user scrolls past first viewport
    if (window.scrollY < window.innerHeight) {
        button.classList.remove('is-visible');
        return;
    } else {
        button.classList.add('is-visible');
    }

    if (window.innerWidth < 1250) {
        button.classList.add('is-relative');
        button.classList.remove('is-fixed');
        return;
    } else {
        button.classList.add('is-fixed');
        button.classList.remove('is-relative');
    }
    

    // 👉 Existing positioning logic
    if (rect.bottom <= window.innerHeight - 60)  {
        button.style.bottom = '150px';
    } else {
        button.style.bottom = '20px';
    }
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleScroll);

// run once on load
handleScroll();