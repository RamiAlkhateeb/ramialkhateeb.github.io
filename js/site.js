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

// Add to site.js
function previewPDF(pdfPath) {
    // Get absolute URL of your hosted PDF
    const absoluteUrl = new URL(pdfPath, window.location.href).href;
    const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=true`;

    document.getElementById('pdfFrame').src = googleViewerUrl;
    document.getElementById('pdfModal').style.display = 'block';

    // Track the preview (see section 2)
    trackEvent('preview_pdf', 'Basic Guide');
}

// فتح نافذة المعاينة
function openPdfPreview(relativePdfPath) {
    const modal = document.getElementById('pdfModal');
    const iframe = document.getElementById('pdfFrame');

    // بناء الرابط المطلق بناءً على بيئة التشغيل الحالية
    const absolutePdfUrl = new URL(relativePdfPath, window.location.href).href;

    // التحقق إذا كان الموقع يعمل محلياً للتطوير والتجربة
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.warn("Google Viewer cannot access local files. Opening directly in a new tab for testing.");
        window.open(absolutePdfUrl, '_blank');
        return;
    }

    // الرابط النهائي الموجه لمحرك جوجل (عند الرفع على جيت هاب)
    const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(absolutePdfUrl)}&embedded=true`;

    iframe.src = googleViewerUrl;
    modal.style.display = 'flex';

    // تتبع الـ Analytics (اختياري)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'preview_pdf', { 'file_name': relativePdfPath });
    }
}

// إغلاق نافذة المعاينة
function closePdfPreview() {
    const modal = document.getElementById('pdfModal');
    const iframe = document.getElementById('pdfFrame');

    modal.style.display = 'none';
    iframe.src = ''; // تفريغ الإطار لوقف التحميل في الخلفية
}