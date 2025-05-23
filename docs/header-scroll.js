window.addEventListener('scroll', function () {
  const header = document.querySelector('header');
  const nav = document.querySelector('nav');
  const logoImg = document.getElementById('logo-img');
  const isScrolled = window.scrollY > 700;

  header.classList.toggle('scrolled', isScrolled);
  nav.classList.toggle('scrolled', isScrolled);

  const targetSrc = isScrolled
    ? 'https://new.vtouch.cf/image/favicon-dark.ico'
    : 'https://new.vtouch.cf/image/favicon.ico';

  if (logoImg.src !== targetSrc) {
    logoImg.style.opacity = '0';

    setTimeout(() => {
      logoImg.src = targetSrc;

      logoImg.onload = () => {
        logoImg.style.opacity = '1';
      };
    }, 200);
  }
});

window.onscroll = function() {
  document.getElementById('scrollTopBtn').style.display = 
    (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) ? "block" : "none";
};
document.getElementById('scrollTopBtn').onclick = function() {
  window.scrollTo({top: 0, behavior: 'smooth'});
};

