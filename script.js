console.log("funca");

const input = document.getElementById("miInput");
const menu = document.getElementById("menuA");

input.addEventListener("keydown", (e) => {
  if (e.key === "a") {
    // Evita que aparezca el menú del SO
    e.preventDefault();

    // Mostrar tu menú
    const rect = input.getBoundingClientRect();
    menu.style.left = rect.left + "px";
    menu.style.top = rect.bottom + 5 + "px";
    menu.style.display = "block";
  }
});

document.querySelectorAll("#menuA .opcion").forEach((op) => {
  op.addEventListener("click", () => {
    input.value += op.textContent;
    menu.style.display = "none";
  });
});

(function () {
  const input = document.getElementById("onlyA");

  const ALLOWED = new Set(["A", "Á", "Â", "a", "á", "â"]);
  const MAP = new Map([
    // Convertí todo lo que no esté permitido a una de estas tres
    ["À", "Â"],
    ["Ã", "Â"],
    ["Ä", "Â"],
    ["Å", "Â"],
    ["Ā", "Â"],
    ["Ă", "Â"],
    ["Ą", "Â"],
    ["Ǎ", "Â"],
    ["Ȁ", "Â"],
    ["Ȃ", "Â"],
    ["Ḁ", "Â"],
    ["Ạ", "A"],
    ["Ả", "A"],
    ["Ấ", "Â"],
    ["Ầ", "Â"],
    ["Ẫ", "Â"],
    ["Ậ", "Â"],
    ["Ắ", "Á"],
    ["Ằ", "Á"],
    ["Ẵ", "Á"],
    ["Ặ", "Á"],
    ["à", "â"],
    ["ã", "â"],
    ["ä", "â"],
    ["å", "â"],
    ["ā", "â"],
    ["ă", "â"],
    ["ą", "â"],
    ["ǎ", "â"],
    ["ȁ", "â"],
    ["ȃ", "â"],
    ["ḁ", "â"],
    ["ạ", "a"],
    ["ả", "a"],
    ["ấ", "â"],
    ["ầ", "â"],
    ["ẫ", "â"],
    ["ậ", "â"],
    ["ắ", "á"],
    ["ằ", "á"],
    ["ẵ", "á"],
    ["ặ", "á"],
  ]);

  function normalizeChar(ch) {
    if (ALLOWED.has(ch)) return ch;
    return MAP.get(ch) || ch;
  }

  function normalizeValue(str) {
    let out = "";
    for (const ch of str) out += normalizeChar(ch);
    return out;
  }

  function fixSelection(el, oldVal) {
    const start = el.selectionStart,
      end = el.selectionEnd;
    const before = el.value.slice(0, start);
    const fixedBefore = normalizeValue(before);
    const delta = fixedBefore.length - before.length;
    el.selectionStart = Math.max(0, start + delta);
    el.selectionEnd = Math.max(0, end + delta);
  }

  let composing = false;

  input.addEventListener("compositionstart", () => (composing = true));
  input.addEventListener("compositionend", () => {
    composing = false;
    const v = input.value;
    const nv = normalizeValue(v);
    if (v !== nv) {
      const pos = input.selectionStart;
      input.value = nv;
      input.selectionStart = input.selectionEnd = pos;
    }
  });

  input.addEventListener("beforeinput", (e) => {
    if (e.inputType === "insertText" && e.data && e.data.length === 1) {
      const fixed = normalizeChar(e.data);
      if (fixed !== e.data) {
        e.preventDefault();
        const start = input.selectionStart,
          end = input.selectionEnd;
        const v = input.value;
        input.value = v.slice(0, start) + fixed + v.slice(end);
        const pos = start + fixed.length;
        input.selectionStart = input.selectionEnd = pos;
      }
    }
  });

  input.addEventListener("input", () => {
    if (composing) return;
    const v = input.value;
    const nv = normalizeValue(v);
    if (v !== nv) {
      const old = input.value;
      input.value = nv;
      fixSelection(input, old);
    }
  });

  input.addEventListener("paste", (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text");
    const fixed = normalizeValue(text);
    const start = input.selectionStart,
      end = input.selectionEnd;
    const v = input.value;
    input.value = v.slice(0, start) + fixed + v.slice(end);
    const pos = start + fixed.length;
    input.selectionStart = input.selectionEnd = pos;
  });
})();
