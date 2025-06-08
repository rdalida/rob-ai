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

      actions.appendChild(copyBtn);
      actions.appendChild(editBtn);
      header.appendChild(label);
      header.appendChild(actions);

      const pre = document.createElement("pre");
      pre.className = "card-content";
      pre.id = "animated-card";
      card.appendChild(header);
      card.appendChild(pre);
      content.appendChild(card);

      const tokenStream = document.createElement("div");
      tokenStream.id = "tokens"; // 👈 must match your selector
      tokenStream.className = "token-stream";
      card.appendChild(tokenStream);

      const flipBtn = document.createElement("button");
      flipBtn.id = "flip-tokens-btn";
      flipBtn.className = "token-button";
      flipBtn.textContent = "To Vectors";

      const cardFooter = document.createElement("div");
      cardFooter.className = "card-footer";
      cardFooter.appendChild(flipBtn);
      card.appendChild(cardFooter);

      if (slide.animate === "tokenized"){
        animateCardText(slide.content);
        flipBtn.style.display = "block";
        setTimeout(() => {
          animateTokens(slide.content);
        }, 100); // delay in ms after typewriter completes
        } else {
          pre.textContent = slide.content;
          flipBtn.style.display = "none";
      }

      flipBtn.addEventListener("click", () => {
      const tokenInners = document.querySelectorAll(".token-inner");
      const flipped = flipBtn.dataset.flipped === "true";

      tokenInners.forEach(el => {
        el.style.transform = flipped ? "rotateY(0deg)" : "rotateY(180deg)";
      });

      flipBtn.dataset.flipped = (!flipped).toString();
      flipBtn.textContent = flipped ? "To Vectors" : "To Tokens";
    });

      flipBtn.dataset.flipped = "false";

      // Copy logic
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(slide.content).then(() => {
          copyBtn.textContent = "✅ Copied!";
          setTimeout(() => (copyBtn.textContent = "🔗 Copy"), 1500);
        });
      };

      // Edit placeholder
      editBtn.onclick = () => {
        alert("Edit mode not implemented yet!");
      };

    }

    if (slide.type === "text") {
      const block = document.createElement("div");
      block.className = "text-block";
      block.innerHTML = marked.parse(slide.content);
      content.appendChild(block);
    }

    if (slide.type === "image") {
      const img = document.createElement("img");
      img.src = slide.content;
      img.alt = slide.title;
      img.className = "image-block";
      content.appendChild(img);
    }

    currentSlide = index;
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === slides.length - 1;

    // Step 3: fade back in
    content.classList.remove("fade-out");
  }, 400); // match the transition duration (400ms)

  document.getElementById("flip-tokens-btn").style.display = "none";


}

function animateCardText(text) {
  const el = document.getElementById("animated-card");
  el.textContent = "";
  gsap.to(el, {
    text: text,
    duration: text.length * 0.04,
    ease: "none"
  });
}

function generateVector() {
  const nums = Array.from({ length: 2 }, () =>
    (Math.random() * 2 - 1).toFixed(2)
  );
  return `${nums.join(", ")}`.slice(0, 11);
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
        <div class="token-back">[ ${generateVector()} ]</div>
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
  flipButton.textContent = flipped ? "To Tokens" : "To Vectors";
};





// Load slides when window is ready
window.onload = () => {
  prevBtn.onclick = () => renderSlide(currentSlide - 1);
  nextBtn.onclick = () => renderSlide(currentSlide + 1);
  renderSlide(currentSlide);
  const toggleBtn = document.getElementById("toggleViz");
  const vizContainer = document.getElementById("vectorPlotContainer");

  toggleBtn.onclick = () => {
    const isHidden = vizContainer.style.display === "none";
    vizContainer.style.display = isHidden ? "block" : "none";
    toggleBtn.textContent = isHidden ? "Hide Vector Space" : "Vector Space";
  };


};

