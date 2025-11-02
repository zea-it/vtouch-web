// js/app.js
// ไฟล์นี้รวม Logic จาก:
// 1. mobile-menu.js (จัดการเมนู)
// 2. header-scroll.js (จัดการ Header, Logo, ปุ่ม Scroll-to-top)
// 3. image-slide.js (จัดการ Carousel)
// 4. notify.js (จัดการกล่องแจ้งเตือน)

// —————— 1. ส่วนจัดการเมนู (จาก mobile-menu.js) ——————
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

// —————— 2. ส่วนจัดการ Header และ Scroll (จาก header-scroll.js) ——————
function initHeaderScroll() {
    const defaultLogo = '/assets/image/favicon.ico';
    const scrolledLogo = '/assets/image/favicon-dark.ico';
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const logoImg = document.getElementById('logo-img');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    function handleScroll() {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const isScrolled = scrollY > 750; // จุดที่โลโก้และ header จะเปลี่ยน

        // ———— header & nav ————
        if (header) {
            if (isScrolled) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }
        if (nav) {
            if (isScrolled) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        }

        // ———— โลโก้ + fade ————
        if (logoImg) {
            const newSrc = isScrolled ? scrolledLogo : defaultLogo;
            if (logoImg.dataset.currentLogo !== newSrc) {
                logoImg.style.transition = 'opacity 0.3s';
                logoImg.style.opacity = '0';
                logoImg.onload = () => {
                    logoImg.style.opacity = '1';
                    logoImg.onload = null;
                };
                logoImg.src = newSrc;
                logoImg.dataset.currentLogo = newSrc;
            }
        }

        // ———— ปุ่ม scroll-to-top (รวมจาก scroll-to-top.js มาไว้ที่นี่) ————
        if (scrollTopBtn) {
            scrollTopBtn.style.display = (scrollY > 200) ? 'block' : 'none';
        }
    }

    // ———— ตั้งค่าเริ่มต้น ————
    if (logoImg) {
        logoImg.dataset.currentLogo = defaultLogo;
        logoImg.src = defaultLogo;
        logoImg.style.opacity = '1';
    }
    if (header) header.classList.remove('scrolled');
    if (nav) nav.classList.remove('scrolled');

    // เรียกครั้งแรก
    handleScroll();

    // เพิ่ม listener
    window.addEventListener('scroll', handleScroll);

    // Click handler ของปุ่ม Scroll-to-top
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// —————— 3. ส่วนจัดการ Image Slide (ปรับปรุงใหม่ให้ Responsive) ——————
function initImageSlide() {
    const track = document.getElementById("carouselTrack");
    if (!track) return;

    // --- 1. สร้างฟังก์ชันสำหรับคำนวณขนาดโดยเฉพาะ ---
    // เราจะเรียกใช้ฟังก์ชันนี้ทั้งตอนโหลดและตอนปรับขนาดจอ
    function calculateCarouselWidth() {
        let originalWidth = 0;
        
        // เรามี 2 ชุดใน HTML, เราจึงคำนวณแค่ครึ่งเดียว (ชุดแรก)
        const initialItemsCount = Math.floor(track.children.length / 2);
        if (initialItemsCount === 0) return;

        // วนลูปเฉพาะชุดแรกเพื่อหาความกว้างรวม
        for (let i = 0; i < initialItemsCount; i++) {
            const item = track.children[i];
            if (item) {
                originalWidth += item.offsetWidth;
                const style = getComputedStyle(item);
                originalWidth += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
            }
        }

        // 2. กำหนด CSS Variable ให้ Animation
        track.style.setProperty('--carousel-original-width', `${originalWidth}px`);

        // 3. ปรับความเร็วตามความกว้าง (Dynamic Speed)
        const speedPerSecond = 50; // 50px ต่อวินาที
        let durationInSeconds = originalWidth / speedPerSecond;

        // 4. จำกัดความเร็ว (ไม่ให้ช้า/เร็วเกินไป)
        const minDuration = 15; // อย่างน้อย 15 วินาที
        const maxDuration = 60; // ไม่เกิน 60 วินาที
        durationInSeconds = Math.max(minDuration, Math.min(durationInSeconds, maxDuration));
        
        track.style.setProperty('--scroll-duration', `${durationInSeconds}s`);
    }

    // --- 5. สร้าง Debounce Function ---
    // (ฟังก์ชันนี้ช่วยป้องกันไม่ให้ 'resize' ทำงานถี่เกินไปจนค้าง)
    function debounce(func, delay = 250) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    // --- 6. เรียกใช้งาน ---
    
    // เรียกครั้งแรกเมื่อ DOM โหลด
    calculateCarouselWidth();

    // สร้างฟังก์ชัน resize ที่ผ่านการ debounce แล้ว
    const debouncedCalculate = debounce(calculateCarouselWidth, 250);

    // เรียกใช้ฟังก์ชันนี้ *ทุกครั้ง* ที่มีการปรับขนาดหน้าต่าง
    window.addEventListener('resize', debouncedCalculate);
}

// —————— 4. ส่วนจัดการกล่องแจ้งเตือน (จาก notify.js) ——————
function initNotifications() {
    const notifications = [{
            title: 'ประกาศข่าวสาร',
            messages: [
                '<strong>ปรับปรุงเว็บไซต์</strong> - เว็บไซต์อยู่ระหว่างปรับปรุงเพื่อให้ใช้งานได้ดีขึ้นในมือถือและเดสก์ท็อป',
                '<strong>ติดตามเรา</strong> ได้ที่ Twitter และ Discord สำหรับอัปตเพิ่มเติม',
            ]
        },
        {
            title: 'จบการศึกษา',
            messages: [
                '<strong>การจบการศึกษา</strong> อ่านเพิ่มเติมได้ที่ <a href="https://www.vtouch.cf/announce" target="_blank">คลิกที่นี่</a>',
            ]
        },
        {
            title: 'แนวทางสังกัด',
            messages: [
                '<strong>แนวทางการทำงานของสังกัด Vtouch Project</strong> อ่านเพิ่มเติมได้ที่ <a href="https://www.vtouch.cf/work-process" target="_blank">คลิกที่นี่</a>',
            ]
        }
    ];

    const container = document.getElementById('notify-container');

    if (container) {
        notifications.forEach((data, i) => {
            setTimeout(() => {
                const box = document.createElement('div');
                box.className = 'notify-box';

                const closeBtn = document.createElement('button');
                closeBtn.className = 'close-btn';
                closeBtn.innerHTML = '&times;';
                closeBtn.onclick = () => {
                    clearTimeout(autoRemove);
                    box.remove();
                };

                const title = document.createElement('h2');
                title.innerHTML = data.title;

                const list = document.createElement('ul');
                data.messages.forEach(msg => {
                    const li = document.createElement('li');
                    li.innerHTML = msg;
                    list.appendChild(li);
                });

                const progress = document.createElement('div');
                progress.className = 'progress-bar';

                box.appendChild(closeBtn);
                box.appendChild(title);
                box.appendChild(list);
                box.appendChild(progress);

                container.appendChild(box);

                // force show with animation
                setTimeout(() => box.classList.add('show'), 10);

                // animate progress
                setTimeout(() => progress.style.width = '0%', 50);
                progress.style.transitionDuration = '10s';

                // auto remove
                const autoRemove = setTimeout(() => box.remove(), 10000);
            }, i * 2000); // เว้น 2 วินาทีต่อแจ้งเตือน
        });
    }
}

// —————— 5. เรียกใช้งานฟังก์ชันทั้งหมด ——————

// เรียกใช้ฟังก์ชันที่ต้องรอ DOM
document.addEventListener("DOMContentLoaded", function() {
    initMobileMenu();
    initHeaderScroll();
    initImageSlide();
});

// เรียกใช้ฟังก์ชันที่ไม่ต้องรอ DOM (หรือรอในตัวมันเอง)
initNotifications();
