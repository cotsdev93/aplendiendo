// Opción 3
(() => {
    // Mobile: teclado propio (input readonly)
    const mInput = document.getElementById('kbdMobile');
    document.querySelectorAll('.kbd .k').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'backspace') {
          const v = mInput.value;
          mInput.value = v.slice(0, -1);
          return;
        }
        const ch = btn.dataset.ch || ' ';
        const { selectionStart: s, selectionEnd: e } = mInput;
        const v = mInput.value;
        mInput.value = v.slice(0, s) + ch + v.slice(e);
        const pos = s + ch.length;
        mInput.selectionStart = mInput.selectionEnd = pos;
        mInput.focus();
      });
    });
  
    // Desktop: long-press en "a"
    const dInput = document.getElementById('kbdDesktop');
    const menu = document.getElementById('longPressMenu');
  
    let pressTimer = null;
    let menuOpen = false;
  
    function openMenu() {
      const rect = dInput.getBoundingClientRect();
      menu.style.left = `${rect.left}px`;
      menu.style.top = `${rect.bottom + 8 + window.scrollY}px`;
      menu.hidden = false;
      menuOpen = true;
    }
    function closeMenu() { menu.hidden = true; menuOpen = false; }
  
    function insertAtCaret(el, text) {
      const { selectionStart: s, selectionEnd: e } = el;
      const v = el.value;
      el.value = v.slice(0, s) + text + v.slice(e);
      const pos = s + text.length;
      el.selectionStart = el.selectionEnd = pos;
      el.focus();
    }
  
    dInput.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'a') {
        if (pressTimer) clearTimeout(pressTimer);
        pressTimer = setTimeout(() => {
          openMenu();
        }, 320);
      }
      if (menuOpen && ['1','2','3','Escape'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'Escape') { closeMenu(); return; }
        const idx = Number(e.key) - 1;
        const btn = menu.querySelectorAll('button')[idx];
        if (btn) {
          insertAtCaret(dInput, btn.dataset.ch);
          closeMenu();
        }
      }
    });
  
    dInput.addEventListener('keyup', (e) => {
      if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
      if (menuOpen && e.key.toLowerCase() === 'a') e.preventDefault();
    });
  
    document.addEventListener('click', (e) => {
      if (menuOpen && !menu.contains(e.target) && e.target !== dInput) closeMenu();
    });
  
    menu.querySelectorAll('button').forEach((b) => {
      b.addEventListener('click', () => {
        insertAtCaret(dInput, b.dataset.ch);
        closeMenu();
      });
    });
  })();
  