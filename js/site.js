document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
    const dropdownBtn = document.getElementById('lang-dropdown-btn');
    const dropdownMenu = document.getElementById('lang-dropdown-menu');
    const currentLangLabel = document.getElementById('current-lang-label');

    const langLabels = { en: 'EN', de: 'DE', ar: 'AR' };
    let currentLang = localStorage.getItem('lang') || 'en';

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

    function applyLanguage(lang) {
        if (!body || !lang || !langLabels[lang]) return;
        body.classList.remove('lang-en', 'lang-de', 'lang-ar', 'show-german');
        body.classList.add(`lang-${lang}`);
        if (lang === 'ar') { body.setAttribute('dir', 'rtl'); } else { body.removeAttribute('dir'); }
        if (currentLangLabel) { currentLangLabel.textContent = langLabels[lang]; }
        localStorage.setItem('lang', lang);
        currentLang = lang;
    }

    // Run safe initializations
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
        updateThemeState(storedTheme);
    } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        updateThemeState('dark');
    }

    applyLanguage(currentLang);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = body.classList.toggle('dark-mode');
            updateThemeState(isDark ? 'dark' : 'light');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        dropdownMenu.querySelectorAll('button[data-lang]').forEach(button => {
            button.addEventListener('click', () => {
                const selectedLang = button.getAttribute('data-lang');
                if (selectedLang) { applyLanguage(selectedLang); }
                dropdownMenu.classList.remove('show');
            });
        });
        document.addEventListener('click', () => dropdownMenu.classList.remove('show'));
    }
});


function getLang() {
    return localStorage.getItem('lang') || 'en';
}

async function fetchPreview(jsonPath, containerId, type, limit) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const res = await fetch(jsonPath);
        if (!res.ok) throw new Error('fetch failed');
        const items = await res.json();
        const lang = getLang();

        const published = items
            .filter(i => i.isPublished || i.IsPublished)
            .sort((a, b) => new Date(b.date || b.Date) - new Date(a.date || a.Date))
            .slice(0, limit);

        if (published.length === 0) {
            const emptyMsgs = {
                en: 'Nothing published yet. Check back soon.',
                de: 'Noch nichts veröffentlicht. Bald mehr.',
                ar: 'لم يُنشر شيء بعد. تابعنا قريباً.'
            };
            container.innerHTML = `<div class="preview-empty">${emptyMsgs[lang] || emptyMsgs.en}</div>`;
            return;
        }

        if (type === 'guides') {
            container.innerHTML = published.map(g => {
                const title = lang === 'de' ? (g.titleDe || g.TitleDe) : lang === 'ar' ? (g.titleAr || g.TitleAr) : (g.titleEn || g.TitleEn);
                const summary = lang === 'de' ? (g.summaryDe || g.SummaryDe) : lang === 'ar' ? (g.summaryAr || g.SummaryAr) : (g.summaryEn || g.SummaryEn);
                const buyLabel = { en: 'Buy Guide', de: 'Kaufen', ar: 'شراء' }[lang] || 'Buy';
                const price = g.priceLabel || g.PriceLabel || '';
                const img = g.coverImageUrl || g.CoverImageUrl || '';
                const link = g.buyLink || g.BuyLink || '#';
                return `
                <div class="saas-card">
                    <div class="guide-card-body">
                        ${img ? `<img src="${img}" alt="${title}" loading="lazy">` : ''}
                        <div style="font-weight:700; font-size:1.05rem; margin-bottom:8px; color:var(--text-main);">${title}</div>
                        <div style="color:var(--text-muted); font-size:0.9rem; line-height:1.6;">${summary}</div>
                        <div class="guide-card-footer">
                            <span class="guide-price">${price}</span>
                            <a href="${link}" class="btn-primary" style="font-size:0.85rem; padding:8px 16px;" target="_blank">${buyLabel} <i class="fa-solid fa-cart-shopping"></i></a>
                        </div>
                    </div>
                </div>`;
            }).join('');
        }

        if (type === 'blog') {
            container.innerHTML = published.map(p => {
                const title = lang === 'de' ? (p.titleDe || p.TitleDe) : lang === 'ar' ? (p.titleAr || p.TitleAr) : (p.titleEn || p.TitleEn);
                const summary = lang === 'de' ? (p.summaryDe || p.SummaryDe) : lang === 'ar' ? (p.summaryAr || p.SummaryAr) : (p.summaryEn || p.SummaryEn);
                const slug = p.slug || p.Slug;
                const date = p.date || p.Date || '';
                return `
                <a href="blog/${slug}.html" class="blog-row">
                    <div>
                        <div class="blog-row-title">${title}</div>
                        <div class="blog-row-summary">${summary}</div>
                    </div>
                    <div class="blog-row-date">${date}</div>
                </a>`;
            }).join('');
        }

    } catch (e) {
        const errorMsgs = {
            en: 'Could not load content.',
            de: 'Inhalt konnte nicht geladen werden.',
            ar: 'تعذّر تحميل المحتوى.'
        };
        const lang = getLang();
        container.innerHTML = `<div class="preview-empty">${errorMsgs[lang] || errorMsgs.en}</div>`;
    }
}

// Homepage preview calls
if (document.getElementById('guides-preview-container')) {
    fetchPreview('content/guides.json', 'guides-preview-container', 'guides', 3);
}
if (document.getElementById('blog-preview-container')) {
    fetchPreview('content/blog/index.json', 'blog-preview-container', 'blog', 3);
}