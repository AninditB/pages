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

function renderExperience(items) {
  const container = document.getElementById('resume-experience');
  container.innerHTML = items.map(item => `
    <div class="resume-entry">
      <div class="resume-entry-meta">
        <strong>${item.role}</strong>
        <div>${item.company}</div>
        <div>${item.duration}</div>
        ${item.location ? `<div>${item.location}</div>` : ''}
      </div>
      <div class="resume-entry-body">
        ${Array.isArray(item.details) ? `
          <ul>
            ${item.details.map(detail => `<li>${detail}</li>`).join('')}
          </ul>
        ` : `<p>${item.details}</p>`}
      </div>
    </div>
  `).join('');
}

function renderEducation(items) {
  const container = document.getElementById('resume-education');
  container.innerHTML = items.map(item => `
    <div class="resume-entry">
      <div class="resume-entry-meta">
        <div>${item.institution}</div>
        <div>${item.year}</div>
      </div>
      <div class="resume-entry-body">
        <strong>${item.degree}</strong>
      </div>
    </div>
  `).join('');
}

function renderSkills(groups) {
  const container = document.getElementById('resume-skills');
  container.innerHTML = groups.map(group => `
    <div class="resume-skill-group">
      <div class="resume-skill-group-label">${group.category}</div>
      <ul class="resume-skills-list">
        ${group.skills.map(skill => `<li>${skill}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

function renderCertifications(items) {
  const container = document.getElementById('resume-certifications');
  container.innerHTML = items.map(cert => `<li>${cert}</li>`).join('');
}

Promise.all([
  fetchData('experience.json'),
  fetchData('education.json'),
  fetchData('skills.json'),
  fetchData('certifications.json')
]).then(([experience, education, skills, certifications]) => {
  renderExperience(experience);
  renderEducation(education);
  renderSkills(skills);
  renderCertifications(certifications);
});

// Theme toggle — shares the same localStorage key as the main page
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  const isDark = localStorage.getItem('theme') === 'dark';

  if (isDark) {
    document.body.classList.add('dark-mode');
    toggle.textContent = '🌞';
    toggle.setAttribute('aria-label', 'Switch to light mode');
  }

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkNow = document.body.classList.contains('dark-mode');
    toggle.textContent = isDarkNow ? '🌞' : '🌙';
    toggle.setAttribute('aria-label', isDarkNow ? 'Switch to light mode' : 'Switch to dark mode');
    localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
  });

  document.getElementById('print-btn').addEventListener('click', () => {
    window.print();
  });
});
