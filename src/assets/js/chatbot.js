(function () {
  const API_URL = "/api/chat";
  const locale = window.__chatbotLocale || "en";

  const toggle = document.getElementById("chatbot-toggle");
  const panel = document.getElementById("chatbot-panel");
  const iconOpen = document.getElementById("chatbot-icon-open");
  const iconClose = document.getElementById("chatbot-icon-close");
  const form = document.getElementById("chatbot-form");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");

  let isOpen = false;
  let history = [];

  toggle.addEventListener("click", function () {
    isOpen = !isOpen;
    if (isOpen) {
      panel.style.display = "flex";
      requestAnimationFrame(function () {
        panel.classList.add("open");
      });
      iconOpen.style.display = "none";
      iconClose.style.display = "block";
      input.focus();
    } else {
      panel.classList.remove("open");
      setTimeout(function () {
        panel.style.display = "none";
      }, 250);
      iconOpen.style.display = "block";
      iconClose.style.display = "none";
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    history.push({ role: "user", content: text });
    input.value = "";

    var typingEl = appendTyping();
    sendMessage(history, typingEl);
  });

  function appendMessage(text, role) {
    var div = document.createElement("div");
    div.className = "chatbot-msg chatbot-msg-" + role;
    var span = document.createElement("span");
    span.textContent = text;
    div.appendChild(span);
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function appendTyping() {
    var div = document.createElement("div");
    div.className = "chatbot-msg chatbot-msg-bot";
    div.innerHTML =
      '<span class="chatbot-typing"><span></span><span></span><span></span></span>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  async function sendMessage(msgs, typingEl) {
    try {
      var res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs, locale: locale }),
      });

      if (!res.ok) {
        throw new Error("HTTP " + res.status);
      }

      var reader = res.body.getReader();
      var decoder = new TextDecoder();
      var botText = "";
      var span = document.createElement("span");
      typingEl.innerHTML = "";
      typingEl.appendChild(span);

      while (true) {
        var result = await reader.read();
        if (result.done) break;
        var chunk = decoder.decode(result.value, { stream: true });
        var lines = chunk.split("\n");
        for (var i = 0; i < lines.length; i++) {
          var line = lines[i].trim();
          if (!line.startsWith("data: ")) continue;
          var data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            var parsed = JSON.parse(data);
            var delta =
              parsed.choices &&
              parsed.choices[0] &&
              parsed.choices[0].delta &&
              parsed.choices[0].delta.content;
            if (delta) {
              botText += delta;
              span.textContent = botText;
              messages.scrollTop = messages.scrollHeight;
            }
          } catch (_) {
            // skip unparseable chunks
          }
        }
      }

      if (!botText) {
        botText = locale === "de"
          ? "Entschuldigung, ich konnte keine Antwort generieren."
          : "Sorry, I couldn't generate a response.";
        span.textContent = botText;
      }

      history.push({ role: "assistant", content: botText });
    } catch (err) {
      typingEl.innerHTML = "";
      var errSpan = document.createElement("span");
      errSpan.textContent =
        locale === "de"
          ? "Verbindungsfehler. Bitte versuche es erneut."
          : "Connection error. Please try again.";
      typingEl.appendChild(errSpan);
    }
  }
})();
