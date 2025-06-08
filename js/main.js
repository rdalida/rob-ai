let currentSlide = 0;

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");


function renderSlide(index) {
  const content = document.getElementById("slide-container");

  // Step 1: fade out
  content.classList.add("fade-out");

  // Step 2: wait for fade-out transition to complete
  setTimeout(() => {
    content.innerHTML = ""; // clear previous content

    const slide = slides[index];
    if (!slide) return;

    const heading = document.createElement("h2");
    heading.textContent = slide.title;
    content.appendChild(heading);

    if (slide.type === "card") {
      const card = document.createElement("div");
      card.className = "card";

      let originalEditHandler;

      const header = document.createElement("div");
      header.className = "card-header";

      const label = document.createElement("span");
      label.className = "card-label";
      label.textContent = slide.label || "text";

      const actions = document.createElement("div");
      actions.className = "card-actions";

      const copyBtn = document.createElement("span");
      copyBtn.textContent = "🔗 Copy";
      copyBtn.style.cursor = "pointer";

      const editBtn = document.createElement("span");
      editBtn.textContent = "✏️ Edit";
      editBtn.style.cursor = "pointer";

      // ✅ Define original handler
      originalEditHandler = () => {
        const currentText = pre.innerHTML || "";
        const textarea = document.createElement("textarea");
        textarea.value = currentText;
        textarea.className = "card-editor";
        textarea.rows = 4;
        card.replaceChild(textarea, pre);

        // Change Edit button to Save
        editBtn.textContent = "💾 Save";
        editBtn.onclick = () => {
          const newText = textarea.value;
          slide.content = newText;

          pre.innerHTML = newText;
          card.replaceChild(pre, textarea);

          if (slide.animate === "tokenized") {
            animateCardText(newText);
            animateTokens(newText);
          } else if (slide.animate === "reverse-token-flow") {
            animateReverseTokenFlow(newText);
          } else if (slide.animate === "typewriter") {
            animateCardText(slide.content);


            flipBtn.style.display = "none"; // hide if not needed
          }



          editBtn.textContent = "✏️ Edit";
          editBtn.onclick = originalEditHandler; // restore
        };
      };

editBtn.onclick = originalEditHandler; // ✅ SET initial behavior


      actions.appendChild(copyBtn);
      actions.appendChild(editBtn);
      header.appendChild(label);
      header.appendChild(actions);

      const pre = document.createElement("pre");
      pre.className = "card-content";
      pre.id = "animated-card";
      pre.textContent = stripHtml(slide.content); // Step 1: plain text first
      card.appendChild(header);
      card.appendChild(pre);
      content.appendChild(card);

      // Step 2: typewriter animation on the plain string
      gsap.to(pre, {
        text: { value: stripHtml(slide.content) },
        duration: 3,
        ease: "none",
        onComplete: () => {
          // Step 3: swap in the full colored content
          pre.innerHTML = slide.content;
        }
      });


      if (slide.note) {
        const note = document.createElement("div");
        note.className = "slide-note";
        note.textContent = slide.note;
        note.innerHTML = slide.note;  // ← use innerHTML here
        content.appendChild(note);
      }


      const tokenStream = document.createElement("div");
      tokenStream.id = "tokens"; // 👈 must match your selector
      tokenStream.className = "token-stream";
      card.appendChild(tokenStream);

      const flipBtn = document.createElement("button");
      flipBtn.id = "flip-tokens-btn";
      flipBtn.className = "token-button";
      flipBtn.textContent = "Token ID";

      const cardFooter = document.createElement("div");
      cardFooter.className = "card-footer";
      cardFooter.appendChild(flipBtn);
      card.appendChild(cardFooter);

      if (slide.animate === "tokenized") {
        animateCardText(slide.content);
        flipBtn.style.display = "block";
        setTimeout(() => {
          animateTokens(slide.content);
        }, 100);
      } else if (slide.animate === "reverse-token-flow") {
        flipBtn.style.display = "none";
        animateReverseTokenFlow(slide.content);
      } else if (slide.animate === "typewriter") {
        animateCardText(slide.content);


        flipBtn.style.display = "none"; // hide if not needed
      } else {
        pre.innerHTML = slide.content;
        flipBtn.style.display = "none";
      }


      flipBtn.addEventListener("click", () => {
      const tokenInners = document.querySelectorAll(".token-inner");
      const flipped = flipBtn.dataset.flipped === "true";

      tokenInners.forEach(el => {
        el.style.transform = flipped ? "rotateY(0deg)" : "rotateY(180deg)";
      });

      flipBtn.dataset.flipped = (!flipped).toString();
      flipBtn.textContent = flipped ? "Token ID" : "Tokens";
    });

      flipBtn.dataset.flipped = "false";

      // Copy logic
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(slide.content).then(() => {
          copyBtn.textContent = "✅ Copied!";
          setTimeout(() => (copyBtn.textContent = "🔗 Copy"), 1500);
        });
      };

      editBtn.onclick = () => {
        // Replace <pre> with <textarea>
        const currentText = pre.innerHTML || "";
        const textarea = document.createElement("textarea");
        textarea.value = currentText;
        textarea.className = "card-editor";
        textarea.rows = 4;
        card.replaceChild(textarea, pre);

        // Turn Edit into Save
        editBtn.textContent = "💾 Save";
        editBtn.onclick = () => {
          const newText = textarea.value;
          slide.content = newText;

          // Restore the <pre>
          pre.innerHTML = newText;
          card.replaceChild(pre, textarea);

          // Trigger animation
          if (slide.animate === "tokenized") {
            animateCardText(newText);
            animateTokens(newText);
          } else if (slide.animate === "reverse-token-flow") {
            animateReverseTokenFlow(newText);
          } else if (slide.animate === "typewriter") {
            animateCardText(slide.content);


            flipBtn.style.display = "none"; // hide if not needed
          }




          // Reset the button
          editBtn.textContent = "✏️ Edit";
          editBtn.onclick = originalEditHandler;
        };
      };


    }

    if (slide.type === "text") {
      const block = document.createElement("div");
      block.className = "text-block";
      block.innerHTML = slide.content;
      content.appendChild(block);
    }

    if (slide.type === "image") {
      const img = document.createElement("img");
      img.src = slide.content;
      img.alt = slide.title;
      img.className = "image-block";
      content.appendChild(img);

      if (slide.note) {
        const note = document.createElement("div");
        note.className = "slide-note";
        note.innerHTML = slide.note;
        note.style.whiteSpace = "pre-line"; // enables \n and <br /> behavior
        content.appendChild(note);
      }
    }

    if (slide.type === "html") {
      const iframe = document.createElement("iframe");
      iframe.src = slide.src;
      iframe.className = "html-slide";
      iframe.style.width = "100%";
      iframe.style.height = slide.height || "600px";
      iframe.style.border = "none";
      iframe.style.borderRadius = "12px";
      iframe.style.height = "calc(100vh - 160px)"; // adjust for nav/header
      iframe.style.position = "relative";
      iframe.style.width = "100vw";
      iframe.style.margin = "0 calc(-50vw + 50%)"; // center hack

      if (slide.note) {
        const note = document.createElement("p");
        note.textContent = slide.note;
        note.style.marginTop = "1rem";
        note.style.fontSize = "0.9rem";
        note.style.color = "#cccccc";
        note.style.textAlign = "center";
        content.appendChild(note);
      }



      content.appendChild(iframe);
    }



    currentSlide = index;
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === slides.length - 1;

    // ✅ Keep dropdown in sync with current slide
    const selector = document.getElementById("slide-selector");
    if (selector) {
      selector.value = index;
    }


    // Step 3: fade back in
    content.classList.remove("fade-out");
  }, 400); // match the transition duration (400ms)

  document.getElementById("flip-tokens-btn").style.display = "none";


}

function animateCardText(html) {
  const target = document.getElementById("animated-card");
  if (!target) return;

  // Temporarily hold styled version
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const cleanText = doc.body.textContent || "";

  target.textContent = ""; // Clear existing

  let index = 0;
  function type() {
    if (index < cleanText.length) {
      target.textContent += cleanText.charAt(index);
      index++;
      setTimeout(type, 15);
    }
  }

  type();
}


function generateFakeTokenID() {
  return Math.floor(Math.random() * 20000 + 10000); // range: 10000–29999
}

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}


function animateTokens(text) {
  const tokens = text
  .split(/(\s+)/) // keep spaces as separate tokens
  .filter(token => token.trim() !== ""); // remove empty or all-whitespace

  const tokenContainer = document.getElementById("tokens");
  if (!tokenContainer) return;

  tokenContainer.innerHTML = tokens.map(token => `
    <div class="token-card">
      <div class="token-inner">
        <div class="token-front">${token}</div>
        <div class="token-back">ID: ${generateFakeTokenID()}</div>
      </div>
    </div>
  `).join("");


  gsap.set(".token-card", {
    opacity: 0,
    y: 20,
    scale: 0.9
  });

  gsap.to(".token-card", {
    opacity: 1,
    y: 0,
    scale: 1,
    stagger: 0.12,         // 👈 slightly slower between tokens
    delay: 2,              // 👈 wait after typewriter
    duration: 1,         // 👈 smooth duration
    ease: "power2.out"     // 👈 smoother than "back.out"
  });  

  document.getElementById("flip-tokens-btn").style.display = "block";
}

const flipButton = document.getElementById("flip-tokens-btn");

let flipped = false; // track state

flipButton.onclick = () => {
  document.querySelectorAll(".token-inner").forEach(el => {
    el.style.transform = flipped ? "rotateY(0deg)" : "rotateY(180deg)";
  });

  flipped = !flipped; // toggle state
  flipButton.textContent = flipped ? "Tokens" : "Token ID";
};

function animateReverseTokenFlow(text) {
  console.log("✅ Running reverse token animation");
  const tokenContainer = document.getElementById("tokens");
  const pre = document.getElementById("animated-card");
  if (!tokenContainer || !pre) return;

  // Step 1: Create fake token IDs first
  const tokens = text.split(/\s+/);
  tokenContainer.innerHTML = tokens.map((t, i) => `
    <div class="token-card">
      <div class="token-inner">
        <div class="token-front">ID: ${generateFakeTokenID(i)}</div>
        <div class="token-back">${t}</div>
      </div>
    </div>
  `).join("");

  // Step 2: Animate token cards in
  gsap.set(".token-card", { opacity: 0, y: 20, scale: 0.9 });

  gsap.to(".token-card", {
    opacity: 1,
    y: 0,
    scale: 1,
    stagger: 0.12,
    duration: 1,
    delay: 0.5,
    ease: "power2.out"
  });

  // Step 3: Flip all tokens after delay
  setTimeout(() => {
    document.querySelectorAll(".token-inner").forEach(el => {
      el.style.transform = "rotateY(180deg)";
    });
  }, 2000);

  // Step 4: Type final output after another delay
  setTimeout(() => {
    animateCardText(text); // reuse your existing typewriter effect
  }, 3200);
}




// Load slides when window is ready
window.onload = () => {
  prevBtn.onclick = () => renderSlide(currentSlide - 1);
  nextBtn.onclick = () => renderSlide(currentSlide + 1);

  const selector = document.getElementById("slide-selector");

  slides.forEach((slide, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${index + 1}. ${slide.title || slide.type}`;
    selector.appendChild(option);
  });

  selector.addEventListener("change", (e) => {
    const index = parseInt(e.target.value, 10);
    renderSlide(index);
  });

  renderSlide(currentSlide); // call last
};


