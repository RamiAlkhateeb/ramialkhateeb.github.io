document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DOM Core Element Selection Elements ---
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
    const langBtn = document.getElementById('lang-toggle');
    const body = document.body;

    // --- 2. Dark Mode Theme Engine Persistence System ---
    const currentTheme = localStorage.getItem('theme');
    
    // Initial Setup Checks
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    } else if (currentTheme === 'light') {
        body.classList.remove('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // System Preference Fallback
        body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    // Toggle Click Event Handler Listener
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                if (themeIcon) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
                localStorage.setItem('theme', 'dark');
            } else {
                if (themeIcon) {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // --- 3. 3-Way Language Dropdown Navigation Matrix ---
    const dropdownBtn = document.getElementById('lang-dropdown-btn');
    const dropdownMenu = document.getElementById('lang-dropdown-menu');
    const currentLangLabel = document.getElementById('current-lang-label');
    
    let currentLang = localStorage.getItem('lang') || 'en';

    const langLabels = {
        en: 'EN',
        de: 'DE',
        ar: 'AR'
    };

    function applyLanguage(lang) {
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

    // Initialize core state
    applyLanguage(currentLang);

    // Toggle Dropdown Visibility Visibility
    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });

        // Click Handler on Menu Choices
        dropdownMenu.querySelectorAll('button[data-lang]').forEach(button => {
            button.addEventListener('click', () => {
                const selectedLang = button.getAttribute('data-lang');
                applyLanguage(selectedLang);
                dropdownMenu.classList.remove('show');
            });
        });

        // Close dropdown when clicking anywhere else on the document
        document.addEventListener('click', () => {
            dropdownMenu.classList.remove('show');
        });
    }
});