// ===== CONTATOS: edite aqui =====
const CONTATO = {
  whatsapp: '5519983332894',   // só números, com 55 + DDD. Ex.: 5519999999999
  instagram: 'dev_adaeloliveira', // sem @
  mensagem: 'Olá, Adael! Vi seu site e gostaria de conversar sobre um projeto.'
};
document.querySelectorAll('.js-wa').forEach(a => {
  if (/^\d{10,15}$/.test(CONTATO.whatsapp)) { a.href = 'https://wa.me/' + CONTATO.whatsapp + '?text=' + encodeURIComponent(a.dataset.msg || CONTATO.mensagem); a.target = '_blank'; a.rel = 'noopener'; }
  else { a.href = 'contato.html'; a.removeAttribute('target'); }
});
document.querySelectorAll('.js-ig').forEach(a => {
  if (/^[\w.]+$/.test(CONTATO.instagram)) { a.href = 'https://instagram.com/' + CONTATO.instagram; a.querySelector('.js-ig-text').textContent = '@' + CONTATO.instagram; }
  else a.style.display = 'none';
});
document.getElementById('ano').textContent = new Date().getFullYear();
// vídeo da plataforma para guincho
const vm = document.getElementById('vmodal'), vv = document.getElementById('vguincho');
if (vm && vv) {
  const abrirVideo = () => { if (vm.showModal) vm.showModal(); else vm.setAttribute('open', ''); vv.play().catch(() => {}); };
  const fecharVideo = () => { vv.pause(); vm.close ? vm.close() : vm.removeAttribute('open'); };
  ['playGuincho', 'playGuincho2'].forEach(id => { const b = document.getElementById(id); if (b) b.addEventListener('click', abrirVideo); });
  document.getElementById('vclose').addEventListener('click', fecharVideo);
  vm.addEventListener('click', e => { if (e.target === vm) fecharVideo(); });
  vm.addEventListener('close', () => vv.pause());
}
// header
const hd = document.querySelector('header');
addEventListener('scroll', () => hd.classList.toggle('scrolled', scrollY > 10), { passive: true });
// mobile menu
const bg = document.getElementById('burger'), mn = document.getElementById('menu');
bg.addEventListener('click', () => { const o = mn.classList.toggle('open'); bg.setAttribute('aria-expanded', o); });
mn.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { mn.classList.remove('open'); bg.setAttribute('aria-expanded', false); }));
// ===== movimento =====
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(pointer: fine)').matches;
// comprimento das trilhas + pulsos de sinal correndo pelas trilhas
document.querySelectorAll('.circuit').forEach(svg => {
  const g = svg.querySelector('.pulses'); const NS = 'http://www.w3.org/2000/svg';
  svg.querySelectorAll('.tr').forEach((p, i) => {
    const L = Math.ceil(p.getTotalLength()); p.style.setProperty('--len', L); p.style.animationDelay = (i * 0.12) + 's';
    if (RM) return;
    const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', 3.5); c.setAttribute('class', 'pulse');
    const m = document.createElementNS(NS, 'animateMotion'); m.setAttribute('dur', (3.2 + (i % 3) * 0.9) + 's'); m.setAttribute('repeatCount', 'indefinite'); m.setAttribute('begin', (1.8 + i * 0.45) + 's');
    const mp = document.createElementNS(NS, 'mpath'); mp.setAttribute('href', '#' + p.id); m.appendChild(mp); c.appendChild(m);
    c.setAttribute('cx', -40); g.appendChild(c);
  });
});
// barra de progresso, cabeçalho que some ao descer e link ativo
const prog = document.getElementById('prog'); let lastY = scrollY;
// link do menu da página atual
const pagina = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';
document.querySelectorAll('.menu a').forEach(a => a.classList.toggle('on', a.getAttribute('href').replace(/\.html$/, '').replace(/^\.\/?$/, 'index') === pagina));
const steps = document.querySelector('.steps');
function onScroll() {
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
  hd.classList.toggle('hide', y > lastY && y > 400 && !mn.classList.contains('open')); lastY = y;
  if (steps) { const r = steps.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (innerHeight * .8 - r.top) / (r.height + innerHeight * .3)));
    steps.querySelector('.wire i').style.setProperty('--p', p);
    steps.querySelectorAll('.step').forEach((s, i, all) => s.classList.toggle('lit', p >= (i + .5) / all.length)); }
  if (!RM) document.querySelectorAll('[data-par]').forEach(el => { const r = el.parentElement.getBoundingClientRect(); const d = (r.top + r.height / 2 - innerHeight / 2); el.style.translate = `0 ${(-d * +el.dataset.par).toFixed(1)}px`; });
}
let tick = false; addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(() => { onScroll(); tick = false; }); } }, { passive: true }); onScroll();
// luz que acompanha o cursor nos cards
document.querySelectorAll('.svc,.pj,.step').forEach(el => el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px'); }));
if (FINE && !RM) {
  // inclinação 3D
  document.querySelectorAll('[data-tilt]').forEach(el => {
    const host = el.closest('.stage,.prod-media') || el;
    host.addEventListener('pointermove', e => { const r = host.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg) rotate(${el.classList.contains('phone') ? 2 : 0}deg)`; });
    host.addEventListener('pointerleave', () => el.style.transform = '');
  });
  // botões "magnéticos"
  document.querySelectorAll('.btn').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .15}px, ${(e.clientY - r.top - r.height / 2) * .25}px)`; });
    b.addEventListener('pointerleave', () => b.style.transform = '');
  });
}
// reveal on scroll
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 }) : null;
document.querySelectorAll('.reveal').forEach(el => { const sib = el.parentElement ? [...el.parentElement.children].filter(x => x.classList.contains('reveal')) : [el]; el.style.transitionDelay = Math.min(sib.indexOf(el), 5) * 90 + 'ms'; io ? io.observe(el) : el.classList.add('in'); });
