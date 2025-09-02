console.log("funca")

const input = document.getElementById('miInput');
const menu = document.getElementById('menuA');

input.addEventListener('keydown', (e) => {
  if (e.key === 'a') {
    // Evita que aparezca el menú del SO
    e.preventDefault();

    // Mostrar tu menú
    const rect = input.getBoundingClientRect();
    menu.style.left = rect.left + 'px';
    menu.style.top = (rect.bottom + 5) + 'px';
    menu.style.display = 'block';
  }
});

document.querySelectorAll('#menuA .opcion').forEach(op => {
  op.addEventListener('click', () => {
    input.value += op.textContent;
    menu.style.display = 'none';
  });
});

