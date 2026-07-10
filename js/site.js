const PLACEHOLDER_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR-Se828e4Nf6VL9V_9EmCC__RFJN_yZVoEQlr5ZwtFt9AIFNtWgY3qY1bDasnj6IUt5Laaymyh3qsL/pub?output=csv";

// Simple state machine CSV parser
function parseCSV(text) {
    const lines = [];
    let row = [""];
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        const next = text[i + 1];
        if (c === '"') {
            if (inQuotes && next === '"') {
                row[row.length - 1] += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (c === ',' && !inQuotes) {
            row.push("");
        } else if ((c === '\r' || c === '\n') && !inQuotes) {
            if (c === '\r' && next === '\n') {
                i++;
            }
            lines.push(row);
            row = [""];
        } else {
            row[row.length - 1] += c;
        }
    }
    if (row.length > 1 || row[0] !== "") {
        lines.push(row);
    }
    return lines;
}

function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

document.addEventListener("DOMContentLoaded", () => {
    async function loadPosts() {
        const loader = document.getElementById('posts-loader'); // الإمساك بعنصر التحميل

        try {
            const response = await fetch(PLACEHOLDER_CSV_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            const text = await response.text();
            const lines = parseCSV(text);

            const posts = [];
            for (let i = 1; i < lines.length; i++) {
                const row = lines[i];
                if (row.length >= 4 && row[0].trim() !== '') {
                    posts.push({
                        titleAr: row[0].trim(),
                        summaryAr: row[1].trim(),
                        linkedinUrl: row[2].trim(),
                        date: row[3].trim()
                    });
                }
            }

            posts.sort((b, a) => new Date(b.date) - new Date(a.date));

            if (posts.length > 0) {
                const postsGrid = document.querySelector('.posts-grid');

                if (postsGrid) {
                    // إزالة تأثير التحميل عند نجاح جلب البيانات
                    if (loader) loader.remove();

                    posts.forEach((post, index) => {
                        // إضافة كلاس fade-in وتأخير زمني متتابع (0.1s, 0.2s, ...)
                        const delay = index * 0.15;

                        const cardHTML = `
                            <a href="${escapeHTML(post.linkedinUrl)}" target="_blank" class="post-card fade-in" style="animation-delay: ${delay}s">
                                <div class="post-card-pattern">
                                    <i class="fab fa-linkedin"></i>
                                </div>
                                <div class="post-card-body">
                                    <div class="post-card-title">${escapeHTML(post.titleAr)}</div>
                                    <div class="post-card-summary">${escapeHTML(post.summaryAr).replace(/\n/g, '<br>')}</div>
                                </div>
                                <div class="post-card-meta">
                                    <span class="post-card-date">${escapeHTML(post.date)}</span>
                                    <span class="post-card-arrow">LinkedIn ←</span>
                                </div>
                            </a>
                        `.trim();

                        // إدراج المقالات الجديدة في بداية القائمة (فوق المقال الثابت)
                        postsGrid.insertAdjacentHTML('afterbegin', cardHTML);
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load posts from CSV:', error);
            // في حال فشل الاتصال، نحذف الـ Loader لكي يظهر المقال الثابت (Fallback)
            if (loader) loader.remove();
        }
    }

    loadPosts();
});

document.addEventListener("DOMContentLoaded", function () {
    const pdfModal = document.getElementById("pdf-modal");
    const pdfFrame = document.getElementById("pdf-viewer-frame");
    const closeBtn = document.getElementById("close-pdf");
    const pdfTitleSpan = document.getElementById("pdf-title");

    // وظيفة فتح المستعرض والتتبع باستخدام PDF.js الجاهز
    window.openPdfPreview = function (pdfRelativePath, guideName) {
        // بناء الرابط المطلق للملف بناءً على البيئة الحالية (Local أو Production)
        const absolutePdfUrl = new URL(pdfRelativePath, window.location.href).href;

        // تمرير رابط الملف إلى مستعرض PDF.js الرسمي عبر CDNJS
        // هذا يعطي واجهة كاملة مخصصة للهواتف تدعم التمرير والزوم بشكل سلس جداً
        const pdfJsViewerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/web/viewer.html?file=${encodeURIComponent(absolutePdfUrl)}`;

        if (pdfTitleSpan) pdfTitleSpan.textContent = `معاينة: ${guideName}`;
        if (pdfFrame) pdfFrame.src = pdfJsViewerUrl; // هنا قمنا بالتغيير ليعمل عبر المستعرض
        if (pdfModal) pdfModal.style.display = "flex";

        // 📈 تتبع حدث المعاينة في GA4
        trackStaticEvent("preview_pdf", guideName);
    };

    // إغلاق المستعرض
    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            if (pdfModal) pdfModal.style.display = "none";
            if (pdfFrame) pdfFrame.src = ""; // إيقاف التحميل في الخلفية لتوفير الأداء
        });
    }
});

// دالة التتبع الموحدة الصديقة للمواقع الـ Static
function trackStaticEvent(actionType, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', actionType, {
            'event_category': 'Guides Engagement',
            'event_label': label
        });
    } else {
        console.log(`[Local Mode] Event Tracked -> Action: ${actionType}, Target: ${label}`);
    }
}