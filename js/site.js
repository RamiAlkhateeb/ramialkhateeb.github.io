document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn?.querySelector('i');
    const dropdownBtn = document.getElementById('lang-dropdown-btn');
    const dropdownMenu = document.getElementById('lang-dropdown-menu');
    const currentLangLabel = document.getElementById('current-lang-label');

    const langLabels = { en: 'EN', de: 'DE', ar: 'AR' };
    let currentLang = localStorage.getItem('lang') || 'en';

    function updateThemeState(theme) {
        if (!body) return;

        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeIcon?.classList.remove('fa-moon');
            themeIcon?.classList.add('fa-sun');
        } else {
            body.classList.remove('dark-mode');
            themeIcon?.classList.remove('fa-sun');
            themeIcon?.classList.add('fa-moon');
        }
    }

    function applyLanguage(lang) {
        if (!body || !lang || !langLabels[lang]) return;

        body.classList.remove('lang-en', 'lang-de', 'lang-ar', 'show-german');
        body.classList.add(`lang-${lang}`);

        if (lang === 'ar') {
            body.setAttribute('dir', 'rtl');
        } else {
            body.removeAttribute('dir');
        }

        if (currentLangLabel) {
            currentLangLabel.textContent = langLabels[lang];
        }

        localStorage.setItem('lang', lang);
        currentLang = lang;
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

    applyLanguage(currentLang);

    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });

        const buttons = dropdownMenu.querySelectorAll('button[data-lang]');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedLang = button.getAttribute('data-lang');
                if (selectedLang) {
                    applyLanguage(selectedLang);
                }
                dropdownMenu.classList.remove('show');
            });
        });

        document.addEventListener('click', () => {
            dropdownMenu.classList.remove('show');
        });
    }
});
