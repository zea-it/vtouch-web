    let vtubers = [];
    let current = 0;

    // โหลดข้อมูลจาก vtubers.json
    async function loadVtubers() {
        const res = await fetch('https://new.vtouch.cf/vtubers.json');
        vtubers = await res.json();
        showVtuber(0);
    }

    function showVtuber(index) {
        if (!vtubers.length) return;
        current = index;
        const data = vtubers[index];
        document.getElementById('story-content').innerHTML = `
        <h2>${data.name} - เรื่องราว</h2>
        ${data.story.map(p => `<p>${p}</p>`).join('')}
      `;
        document.getElementById('model-image').src = data.image;
        document.getElementById('model-image').alt = data.name + " Model";
        document.getElementById('prev-btn').disabled = (index === 0);
        document.getElementById('next-btn').disabled = (index === vtubers.length - 1);
    }

    document.getElementById('prev-btn').onclick = () => {
        if (current > 0) showVtuber(current - 1);
    };
    document.getElementById('next-btn').onclick = () => {
        if (current < vtubers.length - 1) showVtuber(current + 1);
    };

    // รองรับ swipe บนมือถือ
    let touchStartX = 0;
    document.body.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });
    document.body.addEventListener('touchend', (e) => {
        let dx = e.changedTouches[0].clientX - touchStartX;
        if (dx > 70) { // ปัดขวา = ก่อนหน้า
            if (current > 0) showVtuber(current - 1);
        } else if (dx < -70) { // ปัดซ้าย = ถัดไป
            if (current < vtubers.length - 1) showVtuber(current + 1);
        }
    });

    loadVtubers();
