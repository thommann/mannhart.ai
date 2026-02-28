(function () {
  const API_URL = "/api/chat";
  const locale = window.__chatbotLocale || "en";
  const strings = window.__chatbotStrings || {};

  const toggle = document.getElementById("chatbot-toggle");
  const panel = document.getElementById("chatbot-panel");
  const iconOpen = document.getElementById("chatbot-icon-open");
  const iconClose = document.getElementById("chatbot-icon-close");
  const form = document.getElementById("chatbot-form");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");

  let isOpen = false;
  let history = [];

  // --- Markdown renderer (XSS-safe) ---

  function renderMarkdown(text) {
    // Step 1: escape all HTML entities
    var s = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

    // Step 2: markdown links [text](url)
    // Only allow safe URL schemes: https, http, mailto, tel, relative paths, anchors
    s = s.replace(
      /\[([^\]]+)\]\(((?:https?:\/\/|mailto:|tel:|\/#?|#)[^\s)]*)\)/g,
      function (_, linkText, url) {
        if (url.startsWith("#")) {
          return (
            '<a href="' + url + '" class="chatbot-link chatbot-section-link">' +
            linkText + "</a>"
          );
        }
        return (
          '<a href="' + url + '" target="_blank" rel="noopener" class="chatbot-link">' +
          linkText + "</a>"
        );
      }
    );

    // Step 3: bold and italic
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");

    // Step 4: line breaks
    s = s.replace(/\n\n/g, "<br><br>");
    s = s.replace(/\n/g, "<br>");

    return s;
  }

  // --- Section navigation (event delegation) ---

  messages.addEventListener("click", function (e) {
    var link = e.target.closest(".chatbot-section-link");
    if (link) {
      e.preventDefault();
      var target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });

  // --- Chat UI ---

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

  var MAX_INPUT_LENGTH = 500;
  input.setAttribute("maxlength", MAX_INPUT_LENGTH);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    if (text.length > MAX_INPUT_LENGTH) {
      text = text.slice(0, MAX_INPUT_LENGTH);
    }

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

      if (res.status === 429) {
        throw new Error("rate_limited");
      }
      if (res.status === 503) {
        throw new Error("quota_exceeded");
      }
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
              span.innerHTML = renderMarkdown(botText);
              messages.scrollTop = messages.scrollHeight;
            }
          } catch (_) {
            // skip unparseable chunks
          }
        }
      }

      if (!botText) {
        botText = strings.emptyResponse;
        span.innerHTML = renderMarkdown(botText);
      }

      history.push({ role: "assistant", content: botText });
    } catch (err) {
      typingEl.innerHTML = "";
      var errSpan = document.createElement("span");
      if (err.message === "rate_limited") {
        errSpan.textContent = strings.rateLimited;
      } else if (err.message === "quota_exceeded") {
        errSpan.textContent = strings.quotaExceeded;
      } else {
        errSpan.textContent = strings.connection;
      }
      typingEl.appendChild(errSpan);
    }
  }
})();
