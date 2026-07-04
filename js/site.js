const PLACEHOLDER_CSV_URL = "PLACEHOLDER_CSV_URL";

// Simple state machine CSV parser
function parseCSV(text) {
    const lines = [];
    let row = [""];
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        const next = text[i+1];
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
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;

    function updateThemeState(theme) {
        if (!body) return;
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        } else {
            body.classList.remove('dark-mode');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
    }

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
        updateThemeState(storedTheme);
    } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        updateThemeState('dark');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = body.classList.toggle('dark-mode');
            updateThemeState(isDark ? 'dark' : 'light');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // Dynamic LinkedIn posts fetching from Google Sheet CSV
    async function loadPosts() {
        if (!PLACEHOLDER_CSV_URL || PLACEHOLDER_CSV_URL === 'PLACEHOLDER_CSV_URL') {
            console.log('PLACEHOLDER_CSV_URL is placeholder or empty. Static fallback left in place.');
            return;
        }

        try {
            const response = await fetch(PLACEHOLDER_CSV_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const csvText = await response.text();
            const rows = parseCSV(csvText);

            if (rows.length < 2) {
                throw new Error('CSV is empty or invalid');
            }

            const headers = rows[0].map(h => h.trim().toLowerCase());
            const titleIdx = headers.indexOf('title_ar');
            const summaryIdx = headers.indexOf('summary_ar');
            const linkedinIdx = headers.indexOf('linkedin_url');
            const dateIdx = headers.indexOf('date');

            if (titleIdx === -1 || summaryIdx === -1 || linkedinIdx === -1 || dateIdx === -1) {
                throw new Error('CSV headers do not match expected: title_ar, summary_ar, linkedin_url, date');
            }

            const posts = [];
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                if (row.length <= Math.max(titleIdx, summaryIdx, linkedinIdx, dateIdx)) {
                    continue; // Skip malformed or empty rows
                }

                const titleAr = row[titleIdx].trim();
                const summaryAr = row[summaryIdx].trim();
                const linkedinUrl = row[linkedinIdx].trim();
                const date = row[dateIdx].trim();

                if (titleAr || summaryAr) {
                    posts.push({ titleAr, summaryAr, linkedinUrl, date });
                }
            }

            if (posts.length === 0) {
                throw new Error('No valid post entries found in CSV');
            }

            const main = document.querySelector('main.container');
            if (!main) return;

            // Find all comment nodes in main to locate POSTS_START and POSTS_END
            const comments = [];
            const iterator = document.createNodeIterator(main, NodeFilter.SHOW_COMMENT);
            let node;
            while (node = iterator.nextNode()) {
                comments.push(node);
            }

            const startComment = comments.find(c => c.nodeValue.trim() === 'POSTS_START');
            const endComment = comments.find(c => c.nodeValue.trim() === 'POSTS_END');

            if (startComment && endComment) {
                // Clear existing posts between markers
                let next = startComment.nextSibling;
                while (next && next !== endComment) {
                    const toRemove = next;
                    next = next.nextSibling;
                    toRemove.remove();
                }

                // Render and insert cards
                posts.forEach(post => {
                    const cardHTML = `
                        <a href="${escapeHTML(post.linkedinUrl)}" target="_blank" class="post-card">
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

                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = cardHTML;
                    const cardNode = tempDiv.firstChild;
                    endComment.parentNode.insertBefore(cardNode, endComment);
                });
            }
        } catch (error) {
            console.error('Failed to load posts from CSV:', error);
            // Gracefully leave existing static fallback cards in index.html
        }
    }

    loadPosts();
});