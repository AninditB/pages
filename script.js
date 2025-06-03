async function fetchData(file) {
  try {
    const response = await fetch(`data/${file}`);
    if (!response.ok) throw new Error(`Failed to fetch ${file}`);
    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

function renderList(containerId, items, formatter) {
  const container = document.getElementById(containerId);
  
  // Add loading state
  container.innerHTML = '<div class="loading"></div>';
  
  // Simulate loading delay for smooth transition
  setTimeout(() => {
    container.innerHTML = items.map((item, index) => {
      const element = formatter(item);
      return `<div style="animation: fadeInUp 0.6s ease-out ${index * 0.1}s both;">${element}</div>`;
    }).join('');
  }, 300);
}

function animateOnScroll() {
  const elements = document.querySelectorAll('.section-animate');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  elements.forEach(el => observer.observe(el));
}

// Enhanced formatters with better styling
const formatters = {
  projects: (item) => `
    <div class="card">
      <strong>🎯 ${item.title}</strong><br>
      <div style="margin: 0.5rem 0; color: var(--text-secondary); line-height: 1.6;">
        ${item.description}
      </div>
      <em>${Array.isArray(item.tech) ? item.tech.join(' • ') : item.tech}</em>
    </div>
  `,
  
  experience: (item) => `
    <div class="card">
      <strong>💼 ${item.role} – ${item.company}</strong><br>
      <div style="color: var(--accent); font-weight: 500; margin: 0.5rem 0;">
        ${item.duration}
      </div>
      <div style="color: var(--text-secondary); line-height: 1.6;">
        ${item.details}
      </div>
    </div>
  `,
  
  education: (item) => `
    <div class="card">
      <strong>🎓 ${item.degree}</strong><br>
      <div style="color: var(--accent); font-weight: 500; margin: 0.5rem 0;">
        ${item.institution} • ${item.year}
      </div>
      ${item.details ? `<div style="color: var(--text-secondary); line-height: 1.6;">${item.details}</div>` : ''}
    </div>
  `
};

// Load and render data with enhanced animations
fetchData('projects.json').then(data => {
  renderList('projects', data, formatters.projects);
});

fetchData('experience.json').then(data => {
  renderList('experience', data, formatters.experience);
});

fetchData('education.json').then(data => {
  renderList('education', data, formatters.education);
});

fetchData('skills.json').then(data => {
  const container = document.getElementById('skills');
  container.innerHTML = '<div class="loading"></div>';
  
  setTimeout(() => {
    container.innerHTML = data.map((skill, index) => 
      `<span class="skill" style="animation: fadeInUp 0.6s ease-out ${index * 0.05}s both;">${skill}</span>`
    ).join('');
  }, 300);
});

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  animateOnScroll();
  
  // Add smooth scrolling for internal links
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(e.target.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
  
  // Add subtle parallax effect
  let ticking = false;
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    document.body.style.backgroundPositionY = `${rate}px`;
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick);
  
  // Add card hover sound effect (optional)
  document.addEventListener('mouseenter', (e) => {
    if (e.target.classList.contains('card') || e.target.classList.contains('skill')) {
      e.target.style.transform = e.target.classList.contains('card') 
        ? 'translateY(-10px) scale(1.02)' 
        : 'translateY(-2px) scale(1.05)';
    }
  }, true);
  
  document.addEventListener('mouseleave', (e) => {
    if (e.target.classList.contains('card') || e.target.classList.contains('skill')) {
      e.target.style.transform = '';
    }
  }, true);
});

// Add loading states and error handling
window.addEventListener('load', () => {
  // Remove any lingering loading indicators after page fully loads
  setTimeout(() => {
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => {
      if (el.parentElement && el.parentElement.children.length === 1) {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 300);
      }
    });
  }, 2000);
});

// Performance optimization: throttle scroll events
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}