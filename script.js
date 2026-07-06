// Persisted theme toggle
(function theme() {
  const root = document.body;
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  btn.setAttribute('aria-pressed', root.getAttribute('data-theme') === 'light' ? 'true' : 'false');
  btn.addEventListener('click', () => {
    const cur = root.getAttribute('data-theme');
    const next = cur === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    btn.setAttribute('aria-pressed', next === 'light' ? 'true' : 'false');
  });
})();

// Project filters with basic keyboard support
(function filters() {
  const buttons = Array.from(document.querySelectorAll('.filter-btn'));
  const grid = document.getElementById('projectGrid');
  
  function apply(filter) {
    buttons.forEach(b => {
      const active = b.dataset.filter === filter || filter === 'all' && b.dataset.filter === 'all';
      b.classList.toggle('active', b.dataset.filter === filter);
      b.setAttribute('aria-selected', b.classList.contains('active') ? 'true' : 'false');
    });
    const cards = grid.querySelectorAll('.project');
    cards.forEach(card => {
      const tags = (card.dataset.tags || '').split(/\s+/);
      const show = filter === 'all' || tags.includes(filter);
      card.style.display = show ? '' : 'none';
      card.setAttribute('aria-hidden', show ? 'false' : 'true');
    });
  }
  
  buttons.forEach(b => b.addEventListener('click', () => apply(b.dataset.filter)));
  
  // Arrow key navigation
  buttons.forEach((b, i) => {
    b.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); (buttons[i + 1] || buttons[0]).focus(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); (buttons[i - 1] || buttons[buttons.length - 1]).focus(); }
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); }
    });
  });
  apply('all');
})();

// Contact form validation and fake submit
(function contact() {
  const f = document.getElementById('contactForm');
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const msg = document.getElementById('message');
  const status = document.getElementById('formStatus');
  const hints = {
    name: document.getElementById('nameHint'),
    email: document.getElementById('emailHint'),
    message: document.getElementById('messageHint')
  };
  
  function setHint(el, text) {
    const target = hints[el.id];
    target.textContent = text || '';
  }
  
  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
  
  [name, email, msg].forEach(el => {
    el.addEventListener('input', () => {
      if (el === email && el.value && !validEmail(el.value)) setHint(el, 'Enter a valid email.');
      else if (!el.value.trim()) setHint(el, 'This field is required.');
      else setHint(el, '');
    });
  });
  
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    let ok = true;
    if (!name.value.trim()) { setHint(name, 'Please enter your name.'); ok = false; }
    if (!email.value.trim() || !validEmail(email.value)) { setHint(email, 'Please enter a valid email.'); ok = false; }
    if (!msg.value.trim()) { setHint(msg, 'Please enter a message.'); ok = false; }
    if (!ok) { status.textContent = 'Please fix the highlighted fields.'; return; }
    
    status.textContent = 'Sending...';
    // Simulate network
    await new Promise(r => setTimeout(r, 900));
    // Replace this with a real endpoint if desired
    status.textContent = 'Message sent! I’ll get back to you soon.';
    f.reset();
  });
})();

// Year
document.getElementById('year').textContent = new Date().getFullYear();