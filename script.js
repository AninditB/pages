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
      const element = formatter(item, index);
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

// Enhanced formatters with expandable content and modal buttons
const formatters = {
  projects: (item, index) => `
    <div class="card expandable-card" onclick="toggleCard(this)">
      <div class="card-header">
        <strong>🎯 ${item.title}</strong>
        <div class="card-actions">
          <button class="modal-btn" onclick="event.stopPropagation(); openModal('project', ${index})" title="View Details">
            👁️
          </button>
          <span class="expand-icon">+</span>
        </div>
      </div>
      <div class="card-preview" style="margin: 0.5rem 0; color: var(--text-secondary);">
        ${item.description ? item.description.substring(0, 100) + '...' : 'Click to see details'}
      </div>
      <div class="card-details" style="display: none;">
        <div style="margin: 0.5rem 0; color: var(--text-secondary); line-height: 1.6;">
          ${item.description}
        </div>
        <em>${Array.isArray(item.tech) ? item.tech.join(' • ') : item.tech}</em>
        ${item.link ? `<div style="margin-top: 1rem;"><a href="${item.link}" target="_blank" style="color: var(--accent); text-decoration: none;">🔗 View Project</a></div>` : ''}
      </div>
    </div>
  `,
  
  experience: (item, index) => `
    <div class="card expandable-card" onclick="toggleCard(this)">
      <div class="card-header">
        <strong>💼 ${item.role}</strong>
        <div class="card-actions">
          <button class="modal-btn" onclick="event.stopPropagation(); openModal('experience', ${index})" title="View Details">
            👁️
          </button>
          <span class="expand-icon">+</span>
        </div>
      </div>
      <div class="card-meta">
        <div style="color: var(--accent); font-weight: 500;">
          ${item.company} ${item.location ? '• ' + item.location : ''}
        </div>
        <div style="color: var(--text-secondary); font-size: 0.9rem;">
          ${item.duration}
        </div>
      </div>
      <div class="card-details" style="display: none; margin-top: 1rem;">
        ${item.techStack ? `
          <div style="margin-bottom: 1rem;">
            <strong style="color: var(--accent);">Tech Stack:</strong>
            <div style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">
              ${item.techStack}
            </div>
          </div>
        ` : ''}
        <div style="color: var(--text-secondary); line-height: 1.6;">
          ${Array.isArray(item.details) ? 
            '<ul style="margin: 0; padding-left: 1rem;">' + 
            item.details.map(detail => `<li style="margin-bottom: 0.5rem;">${detail}</li>`).join('') + 
            '</ul>' 
            : item.details}
        </div>
      </div>
    </div>
  `,
  
  education: (item, index) => `
    <div class="card expandable-card" onclick="toggleCard(this)">
      <div class="card-header">
        <strong>🎓 ${item.degree}</strong>
        <div class="card-actions">
          <button class="modal-btn" onclick="event.stopPropagation(); openModal('education', ${index})" title="View Details">
            👁️
          </button>
          <span class="expand-icon">+</span>
        </div>
      </div>
      <div style="color: var(--accent); font-weight: 500; margin: 0.5rem 0;">
        ${item.institution} • ${item.year}
      </div>
      <div class="card-details" style="display: none; margin-top: 1rem;">
        ${item.details ? `<div style="color: var(--text-secondary); line-height: 1.6;">${item.details}</div>` : ''}
        ${item.gpa ? `<div style="color: var(--text-secondary); margin-top: 0.5rem;"><strong>GPA:</strong> ${item.gpa}</div>` : ''}
        ${item.coursework ? `<div style="color: var(--text-secondary); margin-top: 0.5rem;"><strong>Relevant Coursework:</strong> ${item.coursework}</div>` : ''}
      </div>
    </div>
  `
};

// Global data storage for modal access
let portfolioData = {
  projects: [],
  experience: [],
  education: []
};

// Toggle card expansion
function toggleCard(card) {
  const details = card.querySelector('.card-details');
  const preview = card.querySelector('.card-preview');
  const icon = card.querySelector('.expand-icon');
  const isExpanded = details.style.display !== 'none';
  
  if (isExpanded) {
    // Collapse
    details.style.display = 'none';
    if (preview) preview.style.display = 'block';
    icon.textContent = '+';
    card.classList.remove('expanded');
  } else {
    // Expand
    details.style.display = 'block';
    if (preview) preview.style.display = 'none';
    icon.textContent = '−';
    card.classList.add('expanded');
  }
}

// Modal functionality
function createModal() {
  if (document.querySelector('.modal-overlay')) return;
  
  const modalHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title"></h3>
          <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-meta"></div>
        <div class="modal-body"></div>
        <div class="share-section">
          <h4 style="color: var(--accent); margin-bottom: 1rem; text-align: center;">Share This</h4>
          <div class="share-buttons">
            <button class="share-btn" onclick="shareOnLinkedIn()">
              <span>📄</span> LinkedIn
            </button>
            <button class="share-btn" onclick="shareOnTwitter()">
              <span>🐦</span> Twitter
            </button>
            <button class="share-btn copy-btn" onclick="copyToClipboard()">
              <span>📋</span> Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function openModal(type, index) {
  createModal();
  
  const modal = document.querySelector('.modal-overlay');
  const title = modal.querySelector('.modal-title');
  const meta = modal.querySelector('.modal-meta');
  const body = modal.querySelector('.modal-body');
  
  const data = portfolioData[type][index];
  if (!data) return;
  
  // Store current modal data for sharing
  window.currentModalData = { type, index, data };
  
  switch (type) {
    case 'project':
      title.textContent = data.title;
      meta.innerHTML = `
        <div class="tech-stack">
          <strong>Technologies:</strong> ${Array.isArray(data.tech) ? data.tech.join(', ') : data.tech}
        </div>
      `;
      body.innerHTML = `
        <div class="project-description">
          ${data.description}
        </div>
        ${data.features ? `
          <h4>Key Features:</h4>
          <ul>
            ${data.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        ` : ''}
        ${data.challenges ? `
          <h4>Challenges & Solutions:</h4>
          <div>${data.challenges}</div>
        ` : ''}
        ${data.link ? `
          <div style="margin-top: 2rem; text-align: center;">
            <a href="${data.link}" target="_blank" style="
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              color: var(--accent);
              text-decoration: none;
              padding: 1rem 2rem;
              border: 2px solid var(--accent);
              border-radius: 2rem;
              transition: all 0.3s ease;
              font-weight: 500;
            ">
              🔗 View Live Project
            </a>
          </div>
        ` : ''}
      `;
      break;
      
    case 'experience':
      title.textContent = data.role;
      meta.innerHTML = `
        <div class="company">${data.company}</div>
        <div class="duration">${data.duration} ${data.location ? '• ' + data.location : ''}</div>
        ${data.techStack ? `
          <div class="tech-stack">
            <strong>Tech Stack:</strong> ${data.techStack}
          </div>
        ` : ''}
      `;
      body.innerHTML = `
        ${data.summary ? `<div class="role-summary">${data.summary}</div>` : ''}
        ${Array.isArray(data.details) ? `
          <h4>Key Responsibilities & Achievements:</h4>
          <ul>
            ${data.details.map(detail => `<li>${detail}</li>`).join('')}
          </ul>
        ` : `<div>${data.details}</div>`}
        ${data.impact ? `
          <h4>Impact:</h4>
          <div class="impact-section">${data.impact}</div>
        ` : ''}
      `;
      break;
      
    case 'education':
      title.textContent = data.degree;
      meta.innerHTML = `
        <div class="institution">${data.institution}</div>
        <div class="year">${data.year}</div>
      `;
      body.innerHTML = `
        ${data.details ? `<div class="education-details">${data.details}</div>` : ''}
        ${data.gpa ? `
          <div style="margin: 1rem 0;">
            <strong style="color: var(--accent);">GPA:</strong> ${data.gpa}
          </div>
        ` : ''}
        ${data.coursework ? `
          <h4>Relevant Coursework:</h4>
          <div>${data.coursework}</div>
        ` : ''}
        ${data.projects ? `
          <h4>Academic Projects:</h4>
          <ul>
            ${data.projects.map(project => `<li>${project}</li>`).join('')}
          </ul>
        ` : ''}
        ${data.honors ? `
          <h4>Honors & Awards:</h4>
          <div>${data.honors}</div>
        ` : ''}
      `;
      break;
  }
  
  // Show modal with animation
  requestAnimationFrame(() => {
    modal.classList.add('active');
  });
  
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
}

function closeModal(event) {
  if (event && event.target !== event.currentTarget) return;
  
  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
    }, 300);
  }
}

// Sharing functionality
function shareOnLinkedIn() {
  const { data, type } = window.currentModalData || {};
  if (!data) return;
  
  let shareText = '';
  switch (type) {
    case 'project':
      shareText = `Check out this project: ${data.title}`;
      break;
    case 'experience':
      shareText = `My experience as ${data.role} at ${data.company}`;
      break;
    case 'education':
      shareText = `My education: ${data.degree} from ${data.institution}`;
      break;
  }
  
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(shareText)}`;
  window.open(url, '_blank', 'width=600,height=400');
}

function shareOnTwitter() {
  const { data, type } = window.currentModalData || {};
  if (!data) return;
  
  let shareText = '';
  switch (type) {
    case 'project':
      shareText = `Check out this project: ${data.title} 🚀`;
      break;
    case 'experience':
      shareText = `My experience as ${data.role} at ${data.company} 💼`;
      break;
    case 'education':
      shareText = `My education: ${data.degree} from ${data.institution} 🎓`;
      break;
  }
  
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`;
  window.open(url, '_blank', 'width=600,height=400');
}

function copyToClipboard() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.querySelector('.copy-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>✅</span> Copied!';
    btn.style.background = '#10b981';
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
    }, 2000);
  }).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    const btn = document.querySelector('.copy-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>✅</span> Copied!';
    btn.style.background = '#10b981';
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
    }, 2000);
  });
}

// Load and render data with enhanced animations
fetchData('projects.json').then(data => {
  portfolioData.projects = data;
  renderList('projects', data, formatters.projects);
});

fetchData('experience.json').then(data => {
  portfolioData.experience = data;
  renderList('experience', data, formatters.experience);
});

fetchData('education.json').then(data => {
  portfolioData.education = data;
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
  
  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
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