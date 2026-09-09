function renderList(containerId, items, formatter, emptyMessage) {
  const container = document.getElementById(containerId);

  container.innerHTML = '<div class="loading"></div>';

  setTimeout(() => {
    if (!items.length) {
      container.innerHTML = `<div class="empty-state">${emptyMessage || 'Nothing to show yet.'}</div>`;
      return;
    }
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
    <div class="card project-card expandable-card" role="button" tabindex="0" aria-expanded="false" onclick="toggleCard(this)" onkeydown="handleCardKeydown(event, this)">
      <div class="project-thumb thumb-${(index % 3) + 1}">
        <span class="thumb-index">0${index + 1}</span>
      </div>
      <div class="card-body">
        <div class="card-header">
          <strong>${item.title}</strong>
          <button class="modal-btn" onclick="event.stopPropagation(); openModal('projects', ${index})" title="View details" aria-label="View project details">
            &rarr;
          </button>
        </div>
        <div class="card-preview">
          ${item.description ? item.description.substring(0, 110) + '…' : 'Click to see details'}
        </div>
        <div class="card-details" style="display: none;">
          ${item.description}
        </div>
        <div class="tag-row">
          ${Array.isArray(item.tech) ? item.tech.slice(0, 3).map(t => `<span class="tag-pill">${t}</span>`).join('') : ''}
        </div>
      </div>
    </div>
  `,

  experience: (item, index) => `
    <div class="card experience-card expandable-card" role="button" tabindex="0" aria-expanded="false" onclick="toggleCard(this)" onkeydown="handleCardKeydown(event, this)">
      <div class="card-header">
        <strong>${item.role}</strong>
        <button class="modal-btn" onclick="event.stopPropagation(); openModal('experience', ${index})" title="View details" aria-label="View experience details">
          &rarr;
        </button>
      </div>
      <div class="card-meta">
        ${item.company}${item.location ? ' · ' + item.location : ''} · ${item.duration}
      </div>
      <div class="card-preview">
        ${Array.isArray(item.details) && item.details[0] ? item.details[0].substring(0, 110) + '…' : ''}
      </div>
      <div class="card-details" style="display: none;">
        ${Array.isArray(item.details) ?
          '<ul>' + item.details.map(detail => `<li>${detail}</li>`).join('') + '</ul>'
          : item.details}
      </div>
    </div>
  `,

  education: (item) => `
    <div class="card education-card">
      <strong>${item.degree}</strong>
      <div class="card-meta">${item.institution} · ${item.year}</div>
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
  const isExpanded = details.style.display !== 'none';

  if (isExpanded) {
    details.style.display = 'none';
    if (preview) preview.style.display = 'block';
    card.classList.remove('expanded');
    card.setAttribute('aria-expanded', 'false');
  } else {
    details.style.display = 'block';
    if (preview) preview.style.display = 'none';
    card.classList.add('expanded');
    card.setAttribute('aria-expanded', 'true');
  }
}

function handleCardKeydown(event, card) {
  if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
    event.preventDefault();
    toggleCard(card);
  }
}

// Modal functionality
let modalTriggerElement = null;

function trapFocus(e) {
  if (e.key !== 'Tab') return;
  const content = document.querySelector('.modal-overlay .modal-content');
  if (!content) return;
  const focusable = content.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function createModal() {
  if (document.querySelector('.modal-overlay')) return;

  const modalHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title" id="modal-title"></h3>
          <button class="modal-close" onclick="closeModal()" aria-label="Close dialog">&times;</button>
        </div>
        <div class="modal-meta"></div>
        <div class="modal-body"></div>
        <div class="share-section">
          <h4 style="color: var(--text); margin-bottom: 1rem; text-align: center;">Share this</h4>
          <div class="share-buttons">
            <button class="share-btn" onclick="shareOnLinkedIn()">LinkedIn</button>
            <button class="share-btn" onclick="shareOnTwitter()">Twitter</button>
            <button class="share-btn" onclick="copyToClipboard()">Copy link</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function openModal(type, index) {
  modalTriggerElement = document.activeElement;
  createModal();

  const modal = document.querySelector('.modal-overlay');
  const title = modal.querySelector('.modal-title');
  const meta = modal.querySelector('.modal-meta');
  const body = modal.querySelector('.modal-body');

  const data = portfolioData[type][index];
  if (!data) return;

  window.currentModalData = { type, index, data };

  switch (type) {
    case 'projects':
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
            <a href="${data.link}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
              View live project
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

  requestAnimationFrame(() => {
    modal.classList.add('active');
    modal.querySelector('.modal-content').focus();
  });

  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', trapFocus);
}

function closeModal(event) {
  if (event && event.target !== event.currentTarget) return;

  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    modal.classList.remove('active');
    document.removeEventListener('keydown', trapFocus);
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
      if (modalTriggerElement) {
        modalTriggerElement.focus();
        modalTriggerElement = null;
      }
    }, 300);
  }
}

// Sharing functionality
function shareOnLinkedIn() {
  const { data, type } = window.currentModalData || {};
  if (!data) return;

  let shareText = '';
  switch (type) {
    case 'projects':
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
    case 'projects':
      shareText = `Check out this project: ${data.title}`;
      break;
    case 'experience':
      shareText = `My experience as ${data.role} at ${data.company}`;
      break;
    case 'education':
      shareText = `My education: ${data.degree} from ${data.institution}`;
      break;
  }

  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`;
  window.open(url, '_blank', 'width=600,height=400');
}

function copyToClipboard() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    flashCopyButton();
  }).catch(() => {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    flashCopyButton();
  });
}

function flashCopyButton() {
  const btn = document.querySelector('.share-btn:last-child');
  if (!btn) return;
  const originalText = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => {
    btn.textContent = originalText;
  }, 2000);
}

// Compute and render the stats strip from already-loaded data
function renderStats() {
  const years = document.getElementById('stat-years');
  const projectsStat = document.getElementById('stat-projects');
  const tech = document.getElementById('stat-tech');
  const degrees = document.getElementById('stat-degrees');

  if (portfolioData.experience.length) {
    const yearRegex = /\b(19|20)\d{2}\b/g;
    const allYears = portfolioData.experience
      .flatMap(role => (role.duration || '').match(yearRegex) || [])
      .map(Number);
    if (allYears.length) {
      const span = Math.max(...allYears) - Math.min(...allYears);
      years.textContent = `${Math.max(span, 1)}+`;
    }
  }

  if (projectsStat) projectsStat.textContent = `${portfolioData.projects.length}`;
  if (tech) tech.textContent = `${portfolioData.skillsCount || 0}+`;
  if (degrees) degrees.textContent = `${portfolioData.education.length}`;
}

// Load and render data with enhanced animations
Promise.all([
  fetchData('projects.json'),
  fetchData('experience.json'),
  fetchData('education.json'),
  fetchData('skills.json')
]).then(([projectsRes, experienceRes, educationRes, skillsRes]) => {
  const projects = projectsRes.data;
  const experience = experienceRes.data;
  const education = educationRes.data;
  const skillGroups = skillsRes.data;
  const skills = skillGroups.flatMap(group => group.skills);

  portfolioData.projects = projects;
  portfolioData.experience = experience;
  portfolioData.education = education;
  portfolioData.skillsCount = skills.length;

  if (!projectsRes.ok) {
    document.getElementById('projects-list').innerHTML = '<div class="error-state">Couldn\'t load projects right now.</div>';
  } else {
    renderList('projects-list', projects, formatters.projects, 'No projects to show yet.');
  }

  if (!experienceRes.ok) {
    document.getElementById('experience-list').innerHTML = '<div class="error-state">Couldn\'t load experience right now.</div>';
  } else {
    renderList('experience-list', experience, formatters.experience, 'No experience to show yet.');
  }

  if (!educationRes.ok) {
    document.getElementById('education-list').innerHTML = '<div class="error-state">Couldn\'t load education right now.</div>';
  } else {
    renderList('education-list', education, formatters.education, 'No education to show yet.');
  }

  renderStats();

  const container = document.getElementById('skills-list');
  if (!skillsRes.ok) {
    container.innerHTML = '<div class="error-state">Couldn\'t load skills right now.</div>';
    return;
  }
  if (!skills.length) {
    container.innerHTML = '<div class="empty-state">No skills to show yet.</div>';
    return;
  }
  container.innerHTML = '<div class="loading"></div>';
  setTimeout(() => {
    container.innerHTML = skills.map((skill, index) =>
      `<span class="skill" style="animation: fadeInUp 0.6s ease-out ${index * 0.05}s both;">${skill}</span>`
    ).join('');
  }, 300);
});

// Initialize scroll animations and interactions
document.addEventListener('DOMContentLoaded', () => {
  animateOnScroll();

  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(e.target.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
});

