async function fetchData(file) {
  try {
    const response = await fetch(`../data/${file}`);
    if (!response.ok) throw new Error(`Failed to fetch ${file}`);
    return { ok: true, data: await response.json() };
  } catch (err) {
    console.error(err);
    return { ok: false, data: [] };
  }
}
