function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function(event) {
            mainNav.classList.toggle('active');
            event.stopPropagation();
        });

        document.addEventListener('click', function(event) {
            const isClickInsideNav = mainNav.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            const isMenuOpen = mainNav.classList.contains('active');

            if (isMenuOpen && !isClickOnToggle && (!isClickInsideNav || (event.target.tagName === 'A' && isClickInsideNav))) {
                mainNav.classList.remove('active');
            }
        });
    }
}
