document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DOM Core Element Selection ---
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
    const body = document.body;

    // --- 2. Dark Mode Engine ---
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeIcon) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
    } else if (currentTheme === 'light') {
        body.classList.remove('dark-mode');
        if (themeIcon) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.classList.add('dark-mode');
        if (themeIcon) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                if (themeIcon) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
                localStorage.setItem('theme', 'dark');
            } else {
                if (themeIcon) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); }
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // --- 3. 3-Way Language Dropdown System ---
    const dropdownBtn = document.getElementById('lang-dropdown-btn');
    const dropdownMenu = document.getElementById('lang-dropdown-menu');
    const currentLangLabel = document.getElementById('current-lang-label');
    
    let currentLang = localStorage.getItem('lang') || 'en';

    const langLabels = { en: 'EN', de: 'DE', ar: 'AR' };

    function applyLanguage(lang) {
        // Strip out ALL variations cleanly
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

    // Initialize Language Configuration State safely
    applyLanguage(currentLang);

    // Dropdown Action Bindings
    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });

        dropdownMenu.querySelectorAll('button[data-lang]').forEach(button => {
            button.addEventListener('click', () => {
                const selectedLang = button.getAttribute('data-lang');
                applyLanguage(selectedLang);
                dropdownMenu.classList.remove('show');
            });
        });

        document.addEventListener('click', () => {
            dropdownMenu.classList.remove('show');
        });
    }
});