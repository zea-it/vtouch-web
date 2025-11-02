document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll("li");

    elements.forEach(el => {
        el.innerHTML = el.innerHTML.replace(/\*\*(.+?)\*\*/g, '<strong class="bold-star">$1</strong>');
    });
});