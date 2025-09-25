function getInputs() {
  return {
    role: document.getElementById("role").value,
    style: document.getElementById("style").value,
    tone: document.getElementById("tone").value,
    rules: document.getElementById("rules").value,
    format: document.getElementById("format").value,
    variable: document.getElementById("variable").value,
  };
}

// Generate staked view
function generateStaked() {
  const { role, style, tone, rules, format, variable } = getInputs();
  const output = `[STAKE 1: Role]\n${role}\n\n` +
                 `[STAKE 2: Style]\n${style}\n\n` +
                 `[STAKE 3: Tone]\n${tone}\n\n` +
                 `[STAKE 4: Rules]\n${rules}\n\n` +
                 `[STAKE 5: Output Format]\n${format}\n\n` +
                 `[STAKE 6: Variable]\n${variable}`;
  document.getElementById("output").innerText = output;
}

// Generate unified clean prompt
function generateUnified() {
  const { role, style, tone, rules, format, variable } = getInputs();
  const output = `${role} Write in a style that is ${style}. ` +
                 `The tone should be ${tone}. ` +
                 `Follow these rules: ${rules}. ` +
                 `Format the response as follows: ${format}. ` +
                 `Use this variable input: ${variable}.`;
  document.getElementById("output").innerText = output;
}

// Grammar check with LanguageTool API (free, no key needed)
function checkGrammar() {
  const text = document.getElementById("output").innerText;
  if (!text) {
    alert("Generate a prompt first!");
    return;
  }

  fetch("https://api.languagetool.org/v2/check", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      text: text,
      language: "en-US",
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.matches.length === 0) {
        alert("✅ No grammar or clarity issues found!");
      } else {
        let suggestions = "Grammar Suggestions:\n\n";
        data.matches.forEach((m) => {
          suggestions += `→ ${m.message}\n   Suggestion: ${m.replacements.map((r) => r.value).join(", ")}\n\n`;
        });
        document.getElementById("output").innerText = text + "\n\n---\n" + suggestions;
      }
    })
    .catch((err) => alert("Error checking grammar: " + err));
}