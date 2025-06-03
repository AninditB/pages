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
  container.innerHTML = items.map(formatter).join('');
}

fetchData('projects.json').then(data => {
  renderList('projects', data, item => `
    <div class="card">
      <strong>${item.title}</strong><br>
      ${item.description}<br>
      <em>${item.tech.join(', ')}</em>
    </div>
  `);
});

fetchData('experience.json').then(data => {
  renderList('experience', data, item => `
    <div class="card">
      <strong>${item.role} – ${item.company}</strong> (${item.duration})<br>
      ${item.details}
    </div>
  `);
});

fetchData('education.json').then(data => {
  renderList('education', data, item => `
    <div class="card">
      <strong>${item.degree}</strong> – ${item.institution} (${item.year})
    </div>
  `);
});

fetchData('skills.json').then(data => {
  renderList('skills', data, skill => `<span class="skill">${skill}</span> `);
});