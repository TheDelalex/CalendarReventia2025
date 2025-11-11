window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.calendar-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      document.getElementById('modal-text').textContent = 'Vous avez cliqué sur la case ' + cell.textContent + '!';
      document.getElementById('modal').style.display = 'flex';
    });
  });
  document.getElementById('modal-close').onclick = function() {
    document.getElementById('modal').style.display = 'none';
  };
  document.getElementById('modal').onclick = function(event) {
    if(event.target === this) this.style.display = 'none';
  };
});
