// server.js
import express from "express";
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const allowed = new Set(["A", "Á", "Â", "a", "á", "â"]);
const map = new Map([
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

const disallowed = new RegExp(`[${[...map.keys()].join("")}]`);

function normalize(s) {
  return [...s]
    .map((ch) => (allowed.has(ch) ? ch : map.get(ch) || ch))
    .join("");
}

app.post("/submit", (req, res) => {
  const raw = String(req.body.onlyA || "");
  if (disallowed.test(raw))
    return res.status(400).json({ ok: false, error: "Solo A, Á o Â." });
  const value = normalize(raw);
  res.json({ ok: true, value });
});

app.listen(3000);
