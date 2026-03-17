const button = document.querySelector('.app-back-to-top');
const container = document.querySelector('.nhsuk-grid-column-full');

function handleScroll() {
    const rect = container.getBoundingClientRect();

    if (rect.bottom <= window.innerHeight) {
        button.style.position = 'relative';
        button.style.bottom = '0';
        button.style.left = '0';
    } else {
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.left = '20px';
    }
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleScroll);

// run once on load
handleScroll();