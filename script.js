// Opción 2: normaliza/valida A, Á, Â
(() => {
    const input = document.getElementById('onlyA');
    const error = document.getElementById('errorA');
  
    const ALLOWED = new Set(['A','Á','Â','a','á','â']);
    const MAP = new Map([
      ['À','Â'], ['Ã','Â'], ['Ä','Â'], ['Å','Â'], ['Ā','Â'], ['Ă','Â'], ['Ą','Â'], ['Ǎ','Â'], ['Ȁ','Â'], ['Ȃ','Â'], ['Ḁ','Â'], ['Ạ','A'], ['Ả','A'], ['Ấ','Â'], ['Ầ','Â'], ['Ẫ','Â'], ['Ậ','Â'], ['Ắ','Á'], ['Ằ','Á'], ['Ẵ','Á'], ['Ặ','Á'],
      ['à','â'], ['ã','â'], ['ä','â'], ['å','â'], ['ā','â'], ['ă','â'], ['ą','â'], ['ǎ','â'], ['ȁ','â'], ['ȃ','â'], ['ḁ','â'], ['ạ','a'], ['ả','a'], ['ấ','â'], ['ầ','â'], ['ẫ','â'], ['ậ','â'], ['ắ','á'], ['ằ','á'], ['ẵ','á'], ['ặ','á']
    ]);
  
    const DISALLOWED = new RegExp(`[${[...MAP.keys()].join('')}]`);
  
    function normalizeChar(ch){ return ALLOWED.has(ch) ? ch : (MAP.get(ch) || ch); }
    function normalizeValue(str){ let out=''; for(const ch of str) out += normalizeChar(ch); return out; }
  
    let composing = false;
    input.addEventListener('compositionstart', () => composing = true);
    input.addEventListener('compositionend', () => {
      composing = false;
      const nv = normalizeValue(input.value);
      if (nv !== input.value) input.value = nv;
    });
  
    input.addEventListener('beforeinput', (e) => {
      if (e.inputType === 'insertText' && e.data && e.data.length === 1) {
        const fixed = normalizeChar(e.data);
        if (fixed !== e.data) {
          e.preventDefault();
          const { selectionStart: s, selectionEnd: epos, value: v } = input;
          input.value = v.slice(0, s) + fixed + v.slice(epos);
          input.selectionStart = input.selectionEnd = s + fixed.length;
        }
      }
    });
  
    input.addEventListener('input', () => {
      if (composing) return;
      const v = input.value, nv = normalizeValue(v);
      if (v !== nv) input.value = nv;
      error.textContent = '';
    });
  
    document.getElementById('form-normaliza').addEventListener('submit', (e) => {
      const v = input.value;
      if (DISALLOWED.test(v)) {
        e.preventDefault();
        error.textContent = 'Solo se permiten A, Á o Â (y minúsculas).';
        input.focus();
      }
    });
  })();
  