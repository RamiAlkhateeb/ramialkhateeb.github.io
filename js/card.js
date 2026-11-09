// The work card: five sides (Card, Impact, Stack, Apps, About) plus a phone-only Info side, flipped with tabs, arrow keys,
// swipe or the flip button. Also the share sheet and the app detail sheet. Runs on index.html only.
(()=>{
const wc=document.getElementById('wc');if(!wc)return;
const SITE_URL='https://ramialkhateeb.github.io/';
const ORDER=['plan','eat','unwind','grow','creators'];
const ALIAS={top:'card',products:'apps',about:'about',contact:'share'};
const $=s=>wc.querySelector(s);
const tabs=[...wc.querySelectorAll('[role=tab]')];
const sides=[...wc.querySelectorAll('.wc-side')];
const wide=matchMedia('(min-width:932px) and (min-height:561px)');
const still=matchMedia('(prefers-reduced-motion:reduce)');
const rtl=()=>document.documentElement.dir==='rtl';
const visible=()=>tabs.filter(b=>!(b.hasAttribute('data-compact-only')&&wide.matches)).map(b=>b.dataset.side);
let cur='card',busy=false,pending=null;

function paint(side){cur=side;wc.dataset.side=side;sides.forEach(s=>{s.hidden=s.id!=='side-'+side});tabs.forEach(b=>{const on=b.dataset.side===side;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1});const label=document.getElementById('flip-label');if(label){label.dataset.i18n=side==='card'?'card.flip':'card.back';label.textContent=t(label.dataset.i18n)}}
function setHash(side){try{history.replaceState(null,'',side==='card'?location.pathname+location.search:'#'+side)}catch(e){}}
function go(side,{animate=true,dir=1,hash=true}={}){if(side==='info'&&wide.matches)side='about';if(!visible().includes(side))side='card';if(busy){pending={side,dir};return}if(side===cur)return;if(hash)setHash(side);if(!animate||!wc.offsetParent){paint(side);return}busy=true;const done=()=>{busy=false;if(pending){const p=pending;pending=null;go(p.side,{dir:p.dir})}};wc.style.setProperty('--fd',(dir>0?90:-90)+'deg');if(still.matches){wc.classList.add('fade-out');setTimeout(()=>{paint(side);wc.classList.remove('fade-out');done()},150);return}wc.classList.add('flip-out');setTimeout(()=>{paint(side);wc.classList.remove('flip-out');wc.classList.add('flip-in');void wc.offsetWidth;requestAnimationFrame(()=>{wc.classList.remove('flip-in');setTimeout(done,210)})},200)}
function step(n){const v=visible();const i=v.indexOf(cur);go(v[(i+n+v.length)%v.length],{dir:n})}

tabs.forEach(b=>b.addEventListener('click',()=>{const v=visible();go(b.dataset.side,{dir:v.indexOf(b.dataset.side)>=v.indexOf(cur)?1:-1})}));
$('.wc-tabs').addEventListener('keydown',e=>{const keys=['ArrowLeft','ArrowRight','Home','End'];if(!keys.includes(e.key))return;e.preventDefault();const v=visible();let i=v.indexOf(cur);const fwd=rtl()?'ArrowLeft':'ArrowRight';if(e.key==='Home')i=0;else if(e.key==='End')i=v.length-1;else i=(i+(e.key===fwd?1:-1)+v.length)%v.length;go(v[i],{dir:e.key===fwd?1:-1});const b=tabs.find(x=>x.dataset.side===v[i]);if(b)b.focus()});
document.getElementById('flip-m').addEventListener('click',()=>step(1));
document.getElementById('flip-d').addEventListener('click',()=>go(cur==='card'?'impact':'card'));

// Swipe on the card (touch/pen): next/previous side, direction follows reading direction.
const surface=document.getElementById('wc-sides');let sx=0,sy=0,sid=null,swiped=false;
surface.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;sid=e.pointerId;sx=e.clientX;sy=e.clientY;swiped=false});
surface.addEventListener('pointerup',e=>{if(e.pointerId!==sid)return;sid=null;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)<48||Math.abs(dx)<Math.abs(dy)*1.5)return;swiped=true;const forward=rtl()?dx>0:dx<0;step(forward?1:-1)});
surface.addEventListener('pointercancel',()=>{sid=null});
surface.addEventListener('click',e=>{if(swiped){e.preventDefault();e.stopPropagation();swiped=false}},true);

// Apps grid and detail sheet
function renderApps(){const grid=document.getElementById('apps-grid');if(!grid||!window.RAMI_PROJECTS)return;const list=[...RAMI_PROJECTS].sort((a,b)=>ORDER.indexOf(a.purpose||'creators')-ORDER.indexOf(b.purpose||'creators'));grid.innerHTML=list.map(p=>{const c=localized(p);return `<li><button type="button" class="app-btn" data-slug="${esc(p.slug)}" aria-haspopup="dialog"><span class="app-tag mono d-only">${esc(t('purpose.'+(p.purpose||'creators')))}</span><img src="${esc(p.logo)}" alt="" width="76" height="76"><span class="app-name">${esc(c.title)}</span><span class="app-line d-only">${esc(c.short)}</span></button></li>`}).join('')}
let opener=null;
function openSheet(d,from){opener=from||document.activeElement;if(!d.open)d.showModal()}
document.addEventListener('click',e=>{const b=e.target.closest('.reco-open');if(b)openSheet(document.getElementById('reco-sheet'),b)});
document.querySelectorAll('dialog.sheet').forEach(d=>{d.addEventListener('click',e=>{if(e.target===d||e.target.closest('[data-close]'))d.close()});d.addEventListener('close',()=>{if(opener&&opener.focus)opener.focus();if(location.hash==='#share')setHash(cur)})});
document.getElementById('apps-grid').addEventListener('click',e=>{const b=e.target.closest('.app-btn');const p=b&&projectBySlug(b.dataset.slug);if(!p)return;const c=localized(p);const d=document.getElementById('app-sheet');document.getElementById('app-icon').src=p.logo||'';document.getElementById('app-tag').textContent=t('purpose.'+(p.purpose||'creators'));document.getElementById('app-title').textContent=c.title;document.getElementById('app-short').textContent=c.short;const shot=document.getElementById('app-shot');const src=(p.screenshots||[])[0]||p.poster||'';shot.hidden=!src;if(src){shot.src=src;shot.alt=`${c.title} — ${t('product.screenshot')}`}const tryA=document.getElementById('app-try');if(p.tryUrl){tryA.hidden=false;tryA.href=p.tryUrl;tryA.textContent=t('project.try')+' ↗'}else{tryA.hidden=true}const cs=document.getElementById('app-case');cs.href='product.html?slug='+encodeURIComponent(p.slug);cs.textContent=t('product.caseStudy');openSheet(d,b)});

// Share sheet: QR, vCard download, copy link
const share=document.getElementById('share-sheet'),status=document.getElementById('share-status');
const say=k=>{status.textContent=t(k);clearTimeout(say.t);say.t=setTimeout(()=>{status.textContent=''},2500)};
const openShare=from=>{status.textContent='';openSheet(share,from)};
document.getElementById('open-share').addEventListener('click',e=>openShare(e.currentTarget));
document.getElementById('open-share-d').addEventListener('click',e=>openShare(e.currentTarget));
document.getElementById('copy-link').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(SITE_URL);say('share.copied')}catch(e){const i=document.createElement('input');i.value=SITE_URL;document.body.appendChild(i);i.select();try{document.execCommand('copy');say('share.copied')}catch(err){}i.remove()}});
function vcard(){const mail=window.PORTFOLIO_CONFIG?.email||'';return['BEGIN:VCARD','VERSION:3.0','N:Alkhateeb;Rami;;;','FN:Rami Alkhateeb','TITLE:Senior Software Engineer','EMAIL;TYPE=INTERNET:'+mail,'URL:'+SITE_URL,'X-SOCIALPROFILE;TYPE=linkedin:https://linkedin.com/in/rami13alkhateeb','X-SOCIALPROFILE;TYPE=github:https://github.com/ramialkhateeb','END:VCARD',''].join('\r\n')}
document.querySelectorAll('.save-contact').forEach(b=>b.addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([vcard()],{type:'text/vcard;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='rami-alkhateeb.vcf';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);if(share.open)say('share.saved')}));

function applyHash(first){const raw=location.hash.replace('#','').toLowerCase();const id=ALIAS[raw]||raw;if(id==='share'){openShare(document.activeElement);return}if(sides.some(s=>s.id==='side-'+id)||id==='info')go(id,{animate:!first,hash:false})}
window.renderCard=()=>{const mail=window.PORTFOLIO_CONFIG?.email||'';document.querySelectorAll('.mail-link').forEach(a=>a.href='mailto:'+mail);document.querySelectorAll('.mail-text').forEach(el=>el.textContent=mail);renderApps();paint(cur)};
wide.addEventListener('change',()=>{if(!visible().includes(cur))paint('about')});
addEventListener('hashchange',()=>applyHash(false));
window.renderCard();applyHash(true);paint(cur);
})();
