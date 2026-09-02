class AppHeader extends HTMLElement {
  connectedCallback() {
    const page=this.getAttribute('active')||'home';
    this.innerHTML=`<header class="site-header"><div class="container nav-wrap"><a class="logo" href="index.html">Rami Alkhateeb</a><div class="nav-controls"><button class="language-toggle" type="button" aria-label="Switch language">العربية</button><button class="menu-toggle" aria-label="Open navigation" aria-expanded="false"><i class="fa-solid fa-bars"></i></button></div><nav class="nav-links" aria-label="Main navigation"><a data-nav="home" href="index.html" data-i18n="nav.home">Home</a><a data-nav="projects" href="index.html#projects" data-i18n="nav.projects">Projects</a><a data-nav="guides" href="guides.html" data-i18n="nav.guides">Guides</a><a data-nav="posts" href="posts.html" data-i18n="nav.posts">Posts</a><a data-nav="about" href="about.html" data-i18n="nav.about">About</a><a class="btn btn-small booking-link" target="_blank" rel="noopener" data-i18n="nav.book">Book a call</a></nav></div></header>`;
    const active=this.querySelector(`[data-nav="${page}"]`);if(active)active.classList.add('active');
    this.querySelector('.menu-toggle').addEventListener('click',e=>{const nav=this.querySelector('.nav-links');nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(nav.classList.contains('open')))});
  }
}
customElements.define('app-header',AppHeader);
class AppFooter extends HTMLElement { connectedCallback(){this.innerHTML=`<footer class="site-footer"><div class="container"><p class="footer-brand">Rami Alkhateeb</p><div class="footer-links"><a href="https://linkedin.com/in/rami13alkhateeb" target="_blank" rel="noopener">LinkedIn</a><a href="https://github.com/ramialkhateeb" target="_blank" rel="noopener">GitHub</a><a href="https://rami13kh.substack.com/" target="_blank" rel="noopener">Substack</a></div><p data-i18n="footer.copy">© 2026 Rami Alkhateeb.</p><small><a href="impressum.html">Impressum</a> · <a href="privacy.html">Privacy</a></small></div></footer>`;} }
customElements.define('app-footer',AppFooter);
