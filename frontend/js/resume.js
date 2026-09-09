function renderExperience(items) {
  const container = document.getElementById('resume-experience');
  if (!items.length) {
    container.innerHTML = '<div class="empty-state">No experience to show yet.</div>';
    return;
  }
  container.innerHTML = items.map(item => `
    <div class="resume-entry card">
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
  if (!items.length) {
    container.innerHTML = '<div class="empty-state">No education to show yet.</div>';
    return;
  }
  container.innerHTML = items.map(item => `
    <div class="resume-entry card">
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
  if (!groups.length) {
    container.innerHTML = '<div class="empty-state">No skills to show yet.</div>';
    return;
  }
  container.innerHTML = groups.map(group => `
    <div class="resume-skill-group card">
      <div class="resume-skill-group-label">${group.category}</div>
      <ul class="resume-skills-list">
        ${group.skills.map(skill => `<li>${skill}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

function renderCertifications(items) {
  const container = document.getElementById('resume-certifications');
  if (!items.length) {
    container.innerHTML = '<li class="empty-state">No certifications to show yet.</li>';
    return;
  }
  container.innerHTML = items.map(cert => `<li>${cert}</li>`).join('');
}

Promise.all([
  fetchData('experience.json'),
  fetchData('education.json'),
  fetchData('skills.json'),
  fetchData('certifications.json')
]).then(([experienceRes, educationRes, skillsRes, certificationsRes]) => {
  const sections = [
    { id: 'resume-experience', result: experienceRes, render: renderExperience, label: 'experience' },
    { id: 'resume-education', result: educationRes, render: renderEducation, label: 'education' },
    { id: 'resume-skills', result: skillsRes, render: renderSkills, label: 'skills' },
    { id: 'resume-certifications', result: certificationsRes, render: renderCertifications, label: 'certifications' }
  ];

  sections.forEach(({ id, result, render, label }) => {
    if (!result.ok) {
      const message = `Couldn't load ${label} right now.`;
      const container = document.getElementById(id);
      container.innerHTML = id === 'resume-certifications'
        ? `<li class="error-state">${message}</li>`
        : `<div class="error-state">${message}</div>`;
      return;
    }
    render(result.data);
  });
});

// Print button — résumé-specific
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('print-btn').addEventListener('click', () => {
    window.print();
  });
});
