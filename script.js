// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Loader
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('done'), 700);
});

// Split hero title into letters (keeps <br> and <em>)
function splitText(el) {
  let i = 0;
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const word = document.createElement('span');
          word.style.display = 'inline-block';
          [...part].forEach(c => {
            const s = document.createElement('span');
            s.className = 'ch';
            s.textContent = c;
            s.style.animationDelay = (0.9 + i * 0.03) + 's';
            i++;
            word.appendChild(s);
          });
          frag.appendChild(word);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') {
        walk(n);
      }
    });
  };
  walk(el);
}
document.querySelectorAll('[data-split]').forEach(splitText);

// Header, progress, hero parallax
const header = document.getElementById('header');
const progress = document.getElementById('progress');
const heroArch = document.getElementById('heroArch');
function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  header.classList.toggle('scrolled', y > 40);
  progress.style.width = (y / max) * 100 + '%';
  if (heroArch && y < window.innerHeight) heroArch.style.transform = 'translateY(' + y * 0.08 + 'px)';
  moveHorizontal();
}

// Mobile menu
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  nav.classList.toggle('open');
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  burger.classList.remove('open');
  nav.classList.remove('open');
}));

// Scroll reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const d = +e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add('show'), d);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('[data-r]').forEach(el => io.observe(el));

// Horizontal scroll collection (desktop only)
const collection = document.getElementById('collection');
const hTrack = document.getElementById('hTrack');
let maxShift = 0;

function setupHorizontal() {
  if (window.innerWidth <= 768) {
    collection.style.height = 'auto';
    hTrack.style.transform = 'none';
    return;
  }
  maxShift = Math.max(0, hTrack.scrollWidth - window.innerWidth);
  collection.style.height = (window.innerHeight + maxShift) + 'px';
}
function moveHorizontal() {
  if (window.innerWidth <= 768) return;
  const start = collection.offsetTop;
  const p = Math.min(Math.max((window.scrollY - start) / (collection.offsetHeight - window.innerHeight), 0), 1);
  hTrack.style.transform = 'translateX(' + (-p * maxShift) + 'px)';
}
window.addEventListener('resize', () => { setupHorizontal(); moveHorizontal(); });
window.addEventListener('load', () => { setupHorizontal(); moveHorizontal(); });
setupHorizontal();

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Open now badge + highlight today
const hours = { // day: [open, close] in minutes
  0: [540, 1260], 1: [540, 1290], 2: [540, 1260], 3: [540, 1260],
  4: [540, 1260], 5: [540, 1260], 6: [540, 1260]
};
(function openStatus() {
  const now = new Date();
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const [o, c] = hours[day];
  const badge = document.getElementById('openBadge');
  const isOpen = mins >= o && mins < c;
  badge.classList.add(isOpen ? 'open' : 'closed');
  badge.textContent = isOpen ? 'Open now' : 'Closed now · Opens 9:00 am';
  const li = document.querySelector('#hoursList li[data-d="' + day + '"]');
  if (li) li.classList.add('today');
})();