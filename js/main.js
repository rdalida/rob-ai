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
      label.textContent = "text";

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
      pre.textContent = slide.content;

      // Copy logic
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(pre.textContent).then(() => {
          copyBtn.textContent = "✅ Copied!";
          setTimeout(() => (copyBtn.textContent = "🔗 Copy"), 1500);
        });
      };

      // Edit placeholder
      editBtn.onclick = () => {
        alert("Edit mode not implemented yet!");
      };

      card.appendChild(header);
      card.appendChild(pre);
      content.appendChild(card);
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
}



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

