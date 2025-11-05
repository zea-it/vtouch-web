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

// —————— 3. ส่วนจัดการ Image Slide (ปรับปรุงใหม่ให้ Responsive และ Loop สมบูรณ์) ——————
function initImageSlide() {
    const track = document.getElementById("carouselTrack");
    if (!track) return;

    // --- 1. เก็บไอเท็ม Original (จาก HTML) ไว้ ---
    const originalItems = Array.from(track.children);
    if (originalItems.length === 0) return;

    // --- 2. สร้างฟังก์ชันสำหรับคำนวณและสร้าง Track ---
    function setupCarousel() {
        
        // --- 2a. คำนวณความกว้างของ 1 ชุด (Original) ---
        // เราต้องใส่ชุด original กลับเข้าไปใน track ก่อนเพื่อวัดขนาด
        track.innerHTML = ''; // ล้าง track
        originalItems.forEach(item => track.appendChild(item.cloneNode(true)));

        let originalSetWidth = 0; // ความกว้างของ 1 ชุด (4 ชิ้น)
        Array.from(track.children).forEach(item => {
            originalSetWidth += item.offsetWidth;
            const style = getComputedStyle(item);
            originalSetWidth += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        });

        if (originalSetWidth === 0) return; // ถ้าหาความกว้างไม่ได้ ให้หยุด

        // --- 2b. คำนวณจำนวนชุดที่ต้องใช้ ---
        const viewportWidth = window.innerWidth;
        
        // เราจะสร้าง "Set A" (ชุดที่จะเลื่อน) โดย copy ไอเท็มจนกว่า
        // ความกว้างของ Set A (setNameWidth) จะ *มากกว่า* ความกว้างของหน้าจอ
        
        const itemsToBuildSetA = [];
        let setAWidth = 0; // ความกว้างจริงของ Set A ที่จะสร้าง
        
        do {
            originalItems.forEach(item => {
                itemsToBuildSetA.push(item.cloneNode(true));
            });
            setAWidth += originalSetWidth;
        } while (setAWidth < viewportWidth)
        
        // ตอนนี้ setAWidth คือความกว้างของ "Set A" ที่กว้างพอดีจอ (หรือมากกว่า)

        // --- 2c. สร้าง Track ใหม่ทั้งหมด ---
        // เราต้องการ [Set A] [Set A] (เพื่อวน Loop)
        track.innerHTML = ''; // ล้างของเก่าอีกครั้ง
        
        const setAFragment = document.createDocumentFragment();
        itemsToBuildSetA.forEach(item => setAFragment.appendChild(item.cloneNode(true)));
        
        const setBFragment = document.createDocumentFragment();
        itemsToBuildSetA.forEach(item => setBFragment.appendChild(item.cloneNode(true))); // set B คือ copy ของ set A

        track.appendChild(setAFragment); // เพิ่ม [Set A]
        track.appendChild(setBFragment); // เพิ่ม [Set B]

        // --- 2d. กำหนด CSS Variable ---
        // ความกว้างที่จะเลื่อน คือความกว้างของ "Set A"
        track.style.setProperty('--carousel-original-width', `${setAWidth}px`);

        // --- 2e. ปรับความเร็วตามความกว้าง (Dynamic Speed) ---
        const speedPerSecond = 50; // 50px ต่อวินาที
        let durationInSeconds = setAWidth / speedPerSecond;

        const minDuration = 15;
        const maxDuration = 60;
        durationInSeconds = Math.max(minDuration, Math.min(durationInSeconds, maxDuration));
        
        track.style.setProperty('--scroll-duration', `${durationInSeconds}s`);
    }

    // --- 3. สร้าง Debounce Function (เหมือนเดิม) ---
    function debounce(func, delay = 250) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    // --- 4. เรียกใช้งาน ---
    
    // เรียกครั้งแรกเมื่อ DOM โหลด
    // เราต้องรอให้รูปโหลดเสร็จก่อน (หรือรอสักครู่) เพื่อให้ offsetWidth ถูกต้อง
    // แต่ในเคสนี้ เรารอ DOMContentLoaded ก็พอ (เพราะรูปมีขนาดคงที่ใน CSS)
    setupCarousel();


    // สร้างฟังก์ชัน resize ที่ผ่านการ debounce แล้ว
    const debouncedSetup = debounce(setupCarousel, 250);

    // เรียกใช้ฟังก์ชันนี้ *ทุกครั้ง* ที่มีการปรับขนาดหน้าต่าง
    window.addEventListener('resize', debouncedSetup);
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
                '<strong>แนวทางการทำงานของสังกัด Vtouch Project</strong> อ่านเพิ่มเติมได้ที่ <a href="https://www.vtouch.cf/guidelines" target="_blank">คลิกที่นี่</a>',
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


