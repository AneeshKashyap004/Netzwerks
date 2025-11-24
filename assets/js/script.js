// Fonts loader
(function(){
  const l=document.createElement('link');
  l.rel='preconnect'; l.href='https://fonts.googleapis.com'; document.head.appendChild(l);
  const l2=document.createElement('link'); l2.rel='preconnect'; l2.href='https://fonts.gstatic.com'; l2.crossOrigin=''; document.head.appendChild(l2);
  const f=document.createElement('link'); f.rel='stylesheet'; f.href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'; document.head.appendChild(f);
})();

// Mobile menu toggle
const ham = document.querySelector('#hamburger');
const mobileMenu = document.querySelector('#mobileMenu');
if(ham && mobileMenu){
  ham.addEventListener('click',()=>{
    mobileMenu.classList.toggle('open');
    ham.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
    ham.classList.toggle('open');
  });
}

// Sticky active link highlighting
function setActiveLink(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('a[data-nav]')?.forEach(a=>{
    const href = a.getAttribute('href');
    if(href){ a.classList.toggle('active', href.endsWith(path)); }
  });
}
setActiveLink();

// Page enter animation
document.addEventListener('DOMContentLoaded', ()=>{
  document.body.classList.add('page-enter');
  requestAnimationFrame(()=>{
    document.body.classList.add('page-enter-active');
    // cleanup after animation
    setTimeout(()=>{
      document.body.classList.remove('page-enter','page-enter-active');
    }, 400);
  });
});

// Smooth scroll for in-page anchors
document.addEventListener('click', (e)=>{
  const a = e.target.closest('a[href^="#"]');
  if(!a) return;
  const id = a.getAttribute('href').slice(1);
  const el = document.getElementById(id);
  if(el){
    e.preventDefault();
    el.scrollIntoView({behavior:'smooth', block:'start'});
  }
});

// Page transition for internal links
document.addEventListener('click', (e)=>{
  const a = e.target.closest('a[href]');
  if(!a) return;
  const url = new URL(a.href, location.href);
  const sameOrigin = url.origin === location.origin;
  const isFileNav = !a.target && sameOrigin && !url.hash;
  if(isFileNav){
    e.preventDefault();
    document.body.classList.add('page-exit','page-exit-active');
    setTimeout(()=>{ location.href = a.href; }, 180);
  }
});

// IntersectionObserver for reveal animations
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  })
},{threshold:.14});

document.querySelectorAll('.reveal').forEach(el=> observer.observe(el));

// Header shadow on scroll
const header = document.querySelector('.header');
if(header){
  window.addEventListener('scroll',()=>{
    header.style.boxShadow = window.scrollY>4 ? '0 8px 24px rgba(0,0,0,.25)' : 'none';
  });
}

// Parallax for hero visuals
const art = document.querySelector('.art');
if(art){
  const blobs = art.querySelectorAll('.blob');
  const apply = ()=>{
    const y = window.scrollY || 0;
    blobs.forEach((b,i)=>{
      const d = (i+1)*0.15;
      b.style.transform = `translateY(${y * d * 0.05}px)`;
    });
  };
  apply();
  window.addEventListener('scroll', apply, {passive:true});
  window.addEventListener('mousemove', (e)=>{
    const {innerWidth, innerHeight} = window;
    const nx = (e.clientX/innerWidth - .5);
    const ny = (e.clientY/innerHeight - .5);
    blobs.forEach((b,i)=>{
      b.style.transform += ` translate(${nx*(i+1)*4}px, ${ny*(i+1)*4}px)`;
    });
  });
}

// Theme toggle (light/dark)
const root = document.documentElement;
const THEME_KEY = 'theme';
function applyTheme(t){
  if(t==='light') root.setAttribute('data-theme','light');
  else root.removeAttribute('data-theme');
}
applyTheme(localStorage.getItem(THEME_KEY));
document.querySelectorAll('[data-toggle-theme]')?.forEach(btn=>{
  btn.addEventListener('click',()=>{
    const isLight = root.getAttribute('data-theme')==='light';
    const next = isLight? 'dark':'light';
    if(next==='light') localStorage.setItem(THEME_KEY,'light');
    else localStorage.removeItem(THEME_KEY);
    applyTheme(next);
  });
});

// Simple form validation
function validateForm(form){
  let valid = true;
  form.querySelectorAll('[data-required]')?.forEach(input=>{
    const val = input.value.trim();
    const type = input.getAttribute('type') || input.tagName.toLowerCase();
    let ok = val.length>0;
    if(type==='email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    input.style.borderColor = ok? 'var(--border)' : 'rgba(239,68,68,.7)';
    valid = valid && ok;
  });
  return valid;
}

document.querySelectorAll('form[data-validate]')?.forEach(form=>{
  form.addEventListener('submit', (e)=>{
    if(!validateForm(form)){
      e.preventDefault();
    } else {
      // No backend: give friendly feedback
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const prev = btn.textContent;
      btn.textContent='Sent ✅';
      btn.disabled=true;
      setTimeout(()=>{btn.textContent=prev; btn.disabled=false; form.reset()}, 1800);
    }
  });
});
