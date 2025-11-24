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
