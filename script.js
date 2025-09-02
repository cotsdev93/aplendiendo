// Configurá acá los glifos que querés permitir
const GLYPHS = ['A', 'Á', 'Â', 'a', 'á', 'â', ' ', '.', ','];

// Si tu fuente usa PUA (privado), podés usar códigos como '\uE001', '\uE002', etc.
// Ejemplo: const GLYPHS = ['\uE001', '\uE002', '\uE003'];

const display = document.getElementById('display');
const hidden = document.getElementById('valueHidden');
const kbd = document.getElementById('kbd');

const btnBack = document.getElementById('backspace');
const btnClear = document.getElementById('clear');
const btnLeft = document.getElementById('moveLeft');
const btnRight = document.getElementById('moveRight');
const btnCopy = document.getElementById('copy');
const form = document.getElementById('form');

let buffer = '';
let caret = 0;

function renderKeyboard() {
  kbd.innerHTML = '';
  GLYPHS.forEach(g => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'key';
    b.textContent = g;
    b.dataset.ch = g;
    b.addEventListener('click', () => insert(g));
    kbd.appendChild(b);
  });
}

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function insert(txt) {
  const start = caret;
  const left = buffer.slice(0, start);
  const right = buffer.slice(start);
  buffer = left + txt + right;
  caret = start + txt.length;
  update();
}

function backspace() {
  if (caret === 0) return;
  buffer = buffer.slice(0, caret - 1) + buffer.slice(caret);
  caret -= 1;
  update();
}

function moveLeft() { caret = clamp(caret - 1, 0, buffer.length); update(); }
function moveRight() { caret = clamp(caret + 1, 0, buffer.length); update(); }
function clearAll() { buffer = ''; caret = 0; update(); }

function update() {
  hidden.value = buffer;

  const frag = document.createDocumentFragment();
  const chars = [...buffer];
  for (let i = 0; i < chars.length; i++) {
    if (i === caret) {
      const c = document.createElement('span');
      c.className = 'caret';
      frag.appendChild(c);
    }
    const s = document.createElement('span');
    s.className = 'ch';
    s.textContent = chars[i];
    frag.appendChild(s);
  }
  if (caret === chars.length) {
    const c = document.createElement('span');
    c.className = 'caret';
    frag.appendChild(c);
  }
  display.replaceChildren(frag);
}

function clickToCaret(ev) {
  const x = ev.clientX;
  const spans = Array.from(display.querySelectorAll('.ch'));
  let i = 0;
  for (; i < spans.length; i++) {
    const r = spans[i].getBoundingClientRect();
    if (x < r.left + r.width / 2) break;
  }
  caret = i;
  update();
}

display.addEventListener('mousedown', (e) => {
  e.preventDefault();
  clickToCaret(e);
});

btnBack.addEventListener('click', backspace);
btnClear.addEventListener('click', clearAll);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);

btnCopy.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(buffer); } catch {}
});

form.addEventListener('submit', (e) => {
  // Simulación: mostrás el valor y evitás navegación. En producción sacá el preventDefault.
  e.preventDefault();
  alert('Enviado: ' + hidden.value);
});

renderKeyboard();
update();
