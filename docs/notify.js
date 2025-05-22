const notifications = [{
        title: '📢 ประกาศข่าวสาร',
        messages: [
            '📱 <strong>ปรับปรุงเว็บไซต์</strong> - เว็บไซต์อยู่ระหว่างปรับปรุงเพื่อให้ใช้งานได้ดีขึ้นในมือถือและเดสก์ท็อป',
            '📣 <strong>ติดตามเรา</strong> ได้ที่ Twitter และ Discord สำหรับอัปเดตเพิ่มเติม',
        ]
    },
    {
        title: '🎓 จบการศึกษา',
        messages: [
            '<strong>การจบการศึกษา</strong> อ่านเพิ่มเติมได้ที่ <a href="https://www.vtouch.cf/main/announce" target="_blank">คลิกที่นี่</a>',
        ]
    },
    {
        title: '🌸 แนวทางสังกัด',
        messages: [
            '<strong>แนวทางการทำงานของสังกัด Vtouch Project</strong> อ่านเพิ่มเติมได้ที่ <a href="https://www.vtouch.cf/main/work-process" target="_blank">คลิกที่นี่</a>',
        ]
    }
];

const container = document.getElementById('notify-container');

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
    }, i * 1000); // เว้น 1 วินาทีต่อแจ้งเตือน
});
