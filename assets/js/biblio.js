/* Bibliography search & filter interactions.
   Works with biblio entries that carry data-cat and data-search attributes. */
(function(){
  const search = document.getElementById("biblio-search");
  const list   = document.getElementById("biblio-list");
  const count  = document.getElementById("biblio-count");
  const empty  = document.getElementById("biblio-empty");
  const chips  = Array.from(document.querySelectorAll(".biblio-chip"));
  if (!search || !list) return;

  const entries = Array.from(list.querySelectorAll(".biblio-entry"));
  const total   = entries.length;
  let activeFilter = "all";
  let q = "";

  function escRe(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  function highlight(entry, term){
    const textEl = entry.querySelector(".biblio-text");
    if (!textEl) return;
    // Store original HTML once
    if (!textEl.dataset.orig) textEl.dataset.orig = textEl.innerHTML;
    if (!term){
      textEl.innerHTML = textEl.dataset.orig;
      return;
    }
    // Highlight only in plain text nodes, not inside tags
    const re = new RegExp("(" + escRe(term) + ")", "gi");
    // Walk DOM nodes to avoid corrupting <a> tags
    textEl.innerHTML = textEl.dataset.orig;
    const walker = document.createTreeWalker(textEl, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(node => {
      if (!re.test(node.nodeValue)) return;
      const span = document.createElement("span");
      span.innerHTML = node.nodeValue.replace(re, "<mark>$1</mark>");
      node.parentNode.replaceChild(span, node);
    });
  }

  function apply(){
    let shown = 0;
    const term = q.trim().toLowerCase();
    entries.forEach(e => {
      const cat = e.dataset.cat || "other";
      const hay = e.dataset.search || "";
      const catOK = activeFilter === "all" || cat === activeFilter;
      const qOK   = !term || hay.includes(term);
      if (catOK && qOK){
        e.classList.remove("hidden");
        highlight(e, term);
        shown++;
      } else {
        e.classList.add("hidden");
        highlight(e, "");
      }
    });
    if (count) count.textContent = shown;
    if (empty) empty.hidden = shown !== 0;
  }

  let t;
  search.addEventListener("input", (e) => {
    q = e.target.value;
    clearTimeout(t);
    t = setTimeout(apply, 90);
  });

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => { c.classList.remove("is-active"); c.setAttribute("aria-pressed","false"); });
      chip.classList.add("is-active");
      chip.setAttribute("aria-pressed","true");
      activeFilter = chip.dataset.filter || "all";
      apply();
    });
  });

  // Slash keyboard shortcut focuses search
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== search){
      e.preventDefault();
      search.focus();
    }
  });
})();
