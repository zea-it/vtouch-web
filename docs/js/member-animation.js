document.addEventListener("DOMContentLoaded", () => {
    // 1. เลือก "กลุ่ม" ของการ์ด (แทนที่จะเลือกการ์ดทั้งหมดทีเดียว)
    const containers = document.querySelectorAll('.member-container');

    // 2. สร้าง "ผู้สังเกตการณ์" (Observer)
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // 3. ถ้า "กลุ่ม" โผล่เข้ามาในจอ (isIntersecting)
            if (entry.isIntersecting) {
                
                // 4. ค้นหา "การ์ด" ทั้งหมดที่อยู่ในกลุ่มนี้
                const cards = entry.target.querySelectorAll('.member-card');
                
                // 5. วนลูปการ์ดในกลุ่มนี้ เพื่อเพิ่ม "ลูกเล่น"
                cards.forEach((card, index) => {
                    // --- นี่คือ "ลูกเล่น" ที่เพิ่มเข้ามา ---
                    // หน่วงเวลาการ์ดแต่ละใบ 100ms * ลำดับของมัน
                    // ใบแรก (index 0) = 0ms
                    // ใบที่สอง (index 1) = 100ms
                    // ใบที่สาม (index 2) = 200ms
                    card.style.transitionDelay = `${index * 100}ms`;
                    // --- จบส่วนลูกเล่น ---

                    // 6. เพิ่มคลาส .is-visible เพื่อเริ่ม animation
                    card.classList.add('is-visible');
                });
                
                // 7. หยุดสังเกตการณ์ "กลุ่ม" นี้ (ไม่ให้มันขยับอีก)
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // ดูเทียบกับ viewport (จอ)
        rootMargin: '0px',
        threshold: 0.1 // ให้เริ่มทำงานเมื่อกลุ่มโผล่มา 10%
    });

    // 8. สั่งให้ "ผู้สังเกตการณ์" เริ่มดู "กลุ่ม" ทุกกลุ่ม
    containers.forEach(container => {
        observer.observe(container);
    });
});