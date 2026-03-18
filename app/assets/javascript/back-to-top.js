const backTop = document.querySelector('.app-back-to-top');
const container = document.querySelector('.nhsuk-grid-column-full');

function handleScroll() {
    const rect = container.getBoundingClientRect();

    // 👉 Hide until user scrolls past first viewport
    if (window.scrollY < window.innerHeight - 500) {
        backTop.classList.remove('is-visible');
        return;
    } else {
        backTop.classList.add('is-visible');
    }

    if (window.innerWidth < 1250) {
        backTop.classList.add('is-relative');
        backTop.classList.remove('is-fixed');
        return;
    } else {
        backTop.classList.add('is-fixed');
        backTop.classList.remove('is-relative');
    }
    

    // 👉 Existing positioning logic
    if (rect.bottom <= window.innerHeight - 60)  {
        backTop.style.bottom = '150px';
    } else {
        backTop.style.bottom = '20px';
    }
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleScroll);

// run once on load
handleScroll();