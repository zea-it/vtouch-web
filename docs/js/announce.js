/**
 * Formats an ISO date string into a Thai date format.
 * @param {string} isoDate - The date string in ISO format.
 * @returns {string} A formatted Thai date string.
 */
function formatThaiDate(isoDate) {
    if (!isoDate) return "ไม่ระบุวันที่";
    try {
        const date = new Date(isoDate);
        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return "รูปแบบวันที่ไม่ถูกต้อง";
        }
        // --- แก้ไข: เอาเวลาออก ---
        return date.toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch (error) {
        return "ไม่สามารถแปลงวันที่ได้";
    }
}

/**
 * Injects NewsArticle Schema.org JSON-LD into the document head.
 * @param {Array} articles - An array of article objects.
 */
function injectSchema(articles) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "ประกาศล่าสุด - Vtouch Project VTuber",
        "description": "รวมประกาศและข่าวสารล่าสุดจาก Vtouch Project",
        "url": "https://www.vtouch.cf/announce",
        "publisher": {
            "@type": "Organization",
            "name": "Vtouch Project",
            "url": "https://www.vtouch.cf",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.vtouch.cf/assets/image/Logo-Fix-2-png-light.png"
            }
        },
        "mainEntity": articles.map(item => ({
            "@type": "NewsArticle",
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://www.vtouch.cf/announce"
            },
            "headline": item.title?.trim() || "ไม่มีหัวข้อ",
            "datePublished": item.data, // ใช้ ISO date ที่ API ส่งมา
            "author": {
                "@type": "Organization",
                "name": "Vtouch Project",
                "url": "https://www.vtouch.cf"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Vtouch Project",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.vtouch.cf/assets/image/Logo-Fix-2-png-light.png"
                }
            },
            "articleBody": (item.text || "ไม่มีเนื้อหา").trim()
        }))
    };

    // สร้าง <script> tag และเพิ่มลงใน <head>
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'dynamic-schema'; // ตั้ง ID ไว้เผื่อต้องอ้างอิง
    script.innerHTML = JSON.stringify(schema, null, 2);
    
    // ลบ schema เก่า (ถ้ามี) ก่อนเพิ่มใหม่
    const oldSchema = document.getElementById('dynamic-schema');
    if (oldSchema) {
        oldSchema.remove();
    }
    document.head.appendChild(script);
}

/**
 * Fetches announcement data from a Google Apps Script endpoint and renders it.
 */
async function fetchData() {
    const container = document.getElementById("announce");
    const API_URL = "https://script.google.com/macros/s/AKfycby8mC9X7nCRfYT6YbckBdSpNrGXVxi2D5g8LAS1VvgMCwsJR4kIcG69g-38okoBKZ4e0A/exec";

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`ไม่สามารถโหลดข้อมูลได้ (Status: ${response.status})`);
        }

        const data = await response.json();
        container.innerHTML = ""; // Clear loading message

        if (!data || !data.length) {
            container.innerHTML = '<p class="status-message">ยังไม่มีประกาศในขณะนี้</p>';
            return;
        }

        // Sort data by date, newest first
        data.sort((a, b) => new Date(b.data) - new Date(a.data));

        // --- START: SEO ---
        injectSchema(data);
        // --- END: SEO ---


        for (const item of data) {
            const block = document.createElement("div");
            block.className = "announce";

            const title = item.title?.trim() || "ไม่มีหัวข้อ";
            const date = formatThaiDate(item.data); 
            
            // --- START: แก้ไขตามคำขอ (ลบ Regex) ---
            // เราจะใช้ CSS (white-space: pre-wrap) จัดการ \n ที่มาจาก Google Sheets โดยตรง
            // ไม่ต้องแทนที่ด้วย <br> อีกต่อไป
            const text = (item.text || "ไม่มีเนื้อหา").trim();
            // --- END: แก้ไขตามคำขอ ---

            // --- START: แก้ไขการแสดงผล ---
            // เราต้องใช้ innerText เพื่อให้ \n ทำงานกับ pre-wrap
            // แต่ title กับ date ยังต้องใช้ innerHTML
            // เราจะสร้าง <p> แยกต่างหาก
            block.innerHTML = `
                <h3>${title}</h3>
                <small>${date}</small>
            `;
            
            const p = document.createElement('p');
            p.innerText = text; // ใช้ .innerText เพื่อให้ \n ถูกเก็บไว้เป็น newline จริงๆ
            block.appendChild(p);
            // --- END: แก้ไขการแสดงผล ---

            container.appendChild(block);
        }

    } catch (error) {
        console.error("Fetch Error:", error);
        container.innerHTML = `<p class="error-message">⚠️ เกิดข้อผิดพลาด: ${error.message}</p>`;
    }
}

// Fetch data when the page content is fully loaded
window.addEventListener("DOMContentLoaded", fetchData);

