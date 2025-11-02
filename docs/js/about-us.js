document.addEventListener('DOMContentLoaded', function() {
    
    // JavaScript สำหรับ FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // ตรวจสอบว่ากำลังจะเปิดหรือปิด
            const isOpening = !item.classList.contains('active');

            // ปิด item อื่นๆ ทั้งหมด
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // ถ้ากำลังจะเปิด, ให้เปิด item ที่คลิก
            if (isOpening) {
                item.classList.add('active');
            }
            // (ถ้ากำลังจะปิด, มันจะถูกปิดไปแล้วตอนวนลูป)
        });
    });

    // JavaScript สำหรับการแทนที่ **text** เป็น <strong>
    const elements = document.querySelectorAll("li");
    elements.forEach(el => {
        el.innerHTML = el.innerHTML.replace(/\*\*(.+?)\*\*/g, '<strong class="bold-star">$1</strong>');
    });

});
