function clearInfo(el='info') {
  const infoEl = document.getElementById(el);
  infoEl.innerHTML = "";
  infoEl.style.display = 'none';
}

function showInfo(c, el='info') {
  const infoEl = document.getElementById(el);
  infoEl.innerHTML = c;
  infoEl.style.display = 'block';
}
