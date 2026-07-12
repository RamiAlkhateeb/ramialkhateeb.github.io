// js/components.js

// 1. Navigation Bar Component
class AppHeader extends HTMLElement {
    connectedCallback() {
        const active = this.getAttribute('active') || 'home';
        this.innerHTML = `
            <header class="container">
                <nav>
                    <div class="logo">
                        <a href="index.html">كتب/يات</a>
                    </div>
                    <div class="nav-links">
                        <a href="index.html#guides">الكتيبات</a>
                        <a href="posts.html">المقالات</a>
                        
                        <a href="https://rami13kh.substack.com/" target="_blank"
                            style="color: var(--accent-gold); font-weight: 700;">English Blog</a>
                    </div>
                </nav>
            </header>
        `;
    }
}
customElements.define('app-header', AppHeader);

// 2. Footer Component
class AppFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="site-footer">
    <div style="margin-bottom: 15px;">
        <a href="https://linkedin.com/in/rami13alkhateeb" target="_blank"><i class="fab fa-linkedin" style="font-size: 1.5rem;"></i></a>
        <a href="https://github.com/ramialkhateeb" target="_blank"><i class="fab fa-github" style="font-size: 1.5rem;"></i></a>
        <a href="https://rami13kh.substack.com/" target="_blank"><i class="fas fa-envelope-open-text" style="font-size: 1.5rem;"></i></a>
    </div>
    <div style="margin-bottom: 10px; font-size: 0.85rem;">
        <a href="impressum.html" style="color: var(--text-muted); margin: 0 8px;">Impressum</a>
        <a href="privacy.html" style="color: var(--text-muted); margin: 0 8px;">Datenschutz</a>
    </div>
    <p>&copy; 2026 رامي الخطيب</p>
</footer>
        `;
    }
}
customElements.define('app-footer', AppFooter);

// 3. PDF Modal Component
class PdfModal extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div id="pdf-modal" class="pdf-modal" style="display: none;">
                <div class="pdf-modal-container">
                    <div class="pdf-modal-header">
                        <button id="close-pdf" class="close-pdf-btn">
                            <i class="fas fa-times"></i> إغلاق المعاينة
                        </button>
                        <span id="pdf-title" class="pdf-modal-title">معاينة الدليل</span>
                    </div>
                    <div class="pdf-modal-body">
                        <iframe id="pdf-viewer-frame" src="" width="100%" height="100%" allow="fullscreen"></iframe>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('pdf-modal', PdfModal);