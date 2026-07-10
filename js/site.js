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
        const technicalGrid = document.getElementById('technical-posts-grid');
        const generalGrid = document.getElementById('general-posts-grid');

        // If we are not on the posts page, don't execute the fetch
        if (!technicalGrid && !generalGrid) return;

        try {
            const response = await fetch(PLACEHOLDER_CSV_URL);
            const csvText = await response.text();
            const lines = parseCSV(csvText);

            // Clear loading state if you have loaders inside the grids
            technicalGrid.innerHTML = '';
            generalGrid.innerHTML = '';

            // Skip the first row if it contains headers (Title, Summary, URL, Date, Group)
            lines.forEach((line, index) => {
                if (index === 0 && line[0].includes('title')) return; // Adjust if your header is named differently

                if (line.length >= 4 && line[0].trim() !== '') {
                    // Read the 5th column (Index 4), default to 'General' if empty
                    const postGroup = line[4] ? line[4].trim() : 'عام';

                    const post = {
                        titleAr: line[0],
                        summaryAr: line[1],
                        linkedinUrl: line[2],
                        date: line[3],
                        group: postGroup
                    };

                    const cardHTML = `
                    <a href="${escapeHTML(post.linkedinUrl)}" target="_blank" class="post-card fade-in">
                        <div class="post-card-pattern"><i class="fab fa-linkedin"></i></div>
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

                    // Inject into the correct grid based on the Google Sheet column
                    if (post.group === 'تقني' || post.group === 'Technical') {
                        if (technicalGrid) technicalGrid.insertAdjacentHTML('beforeend', cardHTML);
                    } else {
                        if (generalGrid) generalGrid.insertAdjacentHTML('beforeend', cardHTML);
                    }
                }
            });
        } catch (error) {
            console.error('Failed to load posts from CSV:', error);
        }
    }

    loadPosts();
});

document.addEventListener("DOMContentLoaded", function () {
    const pdfModal = document.getElementById("pdf-modal");
    const pdfFrame = document.getElementById("pdf-viewer-frame");
    const closeBtn = document.getElementById("close-pdf");
    const pdfTitleSpan = document.getElementById("pdf-title");

    // وظيفة فتح المستعرض والتتبع
    window.openPdfPreview = function (pdfRelativePath, guideName) {
        // بناء الرابط المطلق للملف بناءً على البيئة (Local أو Production)
        const absolutePdfUrl = new URL(pdfRelativePath, window.location.href).href;

        // الهواتف لا تدعم عرض PDF داخل iframe بشكل صحيح (تكبير مفرط، تعثّر التمرير)
        // الحل: فتح الملف مباشرةً في تبويب جديد ليُعرض بواسطة مستعرض PDF الأصلي للنظام
        const isMobile = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 1024;

        if (isMobile) {
            window.open(absolutePdfUrl, '_blank');
        } else {
            if (pdfTitleSpan) pdfTitleSpan.textContent = `معاينة: ${guideName}`;
            if (pdfFrame) pdfFrame.src = absolutePdfUrl;
            if (pdfModal) pdfModal.style.display = "flex";
        }

        // 📈 تتبع حدث المعاينة (GA4)
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