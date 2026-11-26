(() => {
  const D = DATA, $q = s => document.querySelector(s), grid = $q(".menu-grid");
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const main = $q("main");
  function screen(id, icon, eyebrow, title, body) {
    const s = el("section", "screen detail-screen", `<button class="back-btn" data-back>← برگشت</button><div class="section-icon">${icon}</div><p class="eyebrow">${eyebrow}</p><h2>${title}</h2>`);
    s.id = id; s.appendChild(body); main.appendChild(s);
  }
  function card(id, icon, t, sub) { grid.appendChild(el("button", "menu-card", `<span class="menu-icon">${icon}</span><strong>${t}</strong><small>${sub}</small>`)).dataset.open = id; }

  // Timeline
  if (D.timeline.length) {
    screen("timeline", "⏳", "از اون روز تا حالا", "خاطره‌های <span>ما</span>", el("div", "tl", D.timeline.map(i => `<div class="tl-item"><b>${esc(i.d)}</b><p>${esc(i.t)}</p></div>`).join("")));
    card("timeline", "⏳", "خاطره‌های ما", "قدم‌به‌قدم");
  }
  // Photos
  if (D.photos.length) {
    screen("photos", "📷", "قاب‌های کوچیک", "عکس‌های <span>قشنگ</span>", el("div", "pg", D.photos.map(p => `<figure><img src="${esc(p.src)}" alt="" loading="lazy"><figcaption>${esc(p.cap || "")}</figcaption></figure>`).join("")));
    card("photos", "📷", "قاب‌های ما", "عکس و خاطره");
  }
  // Reasons
  if (D.reasons.length) {
    const b = el("div", "rs", `<div class="rs-card" id="rsText">روی دکمه بزن تا یه دلیل ببینی ♡</div><button class="primary-btn" id="rsBtn">یه دلیل دیگه <span>✿</span></button>`);
    screen("reasons", "🌷", "فقط چند تا از دلیل‌ها", "چرا <span>دوستت دارم</span>", b);
    card("reasons", "🌷", "دلیل‌هام", "بزن تا بخونی");
    let order = [], last = -1;
    b.querySelector("#rsBtn").onclick = () => {
      if (!order.length) { order = D.reasons.map((_, i) => i).sort(() => Math.random() - .5); if (order[0] === last) order.push(order.shift()); }
      last = order.shift(); const t = $q("#rsText"); t.textContent = D.reasons[last]; t.animate([{opacity:0,transform:"translateY(8px)"},{opacity:1,transform:"none"}], {duration:350});
    };
  }
  // Open when
  if (D.openWhen.length) {
    const b = el("div", "ow", D.openWhen.map(o => `<button class="ow-btn">${esc(o.t)}</button><div class="ow-x hidden">${esc(o.x)}</div>`).join(""));
    screen("openwhen", "💌", "نامه‌های سربسته", "وقتی <span>...</span>", b);
    card("openwhen", "💌", "وقتی...", "نامه‌های کوتاه");
    b.querySelectorAll(".ow-btn").forEach(btn => btn.onclick = () => btn.nextElementSibling.classList.toggle("hidden"));
  }
  // Reply + invite
  const c = D.contact, link = txt => c.whatsapp ? `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(txt)}` : c.telegram ? `https://t.me/${c.telegram}?text=${encodeURIComponent(txt)}` : "";
  function send(txt) {
    if (!txt.trim()) return showToast("اول یه چیزی بنویس ♡");
    const u = link(txt);
    if (u) window.open(u, "_blank");
    else { (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => showToast("کپی شد؛ برام بفرستش ♡"), () => showToast("متن رو کپی کن و برام بفرست ♡")); }
  }
  const rb = el("div", "rp", `<div class="gift-message"><h3>${esc(D.invite.title)}</h3><div class="yn"><button class="primary-btn" id="yesBtn">${esc(D.invite.yes)}</button><button class="outline-btn" id="noBtn">${esc(D.invite.no)}</button></div></div><textarea id="rpText" rows="4" placeholder="هرچی دلت می‌خواد برام بنویس..."></textarea><button class="primary-btn" id="rpSend">بفرست برام <span>✉</span></button>`);
  screen("reply", "💬", "نوبت توئه", "یه <span>جواب</span> برام بنویس", rb);
  card("reply", "💬", "جواب بده", "قرار یا هر حرفی");
  $q("#yesBtn").onclick = () => { burstHearts(); send(D.invite.yesMsg); };
  const no = $q("#noBtn"); let n = 0;
  const run = e => { e.preventDefault(); n++; no.textContent = n > 3 ? "باشه، بله 😅" : D.invite.no; no.style.transform = `translate(${(Math.random() - .5) * 150}px,${(Math.random() - .5) * 70}px)`; if (n > 6) { no.onclick = () => $q("#yesBtn").click(); } };
  no.addEventListener("pointerenter", run); no.addEventListener("click", run);
  $q("#rpSend").onclick = () => send($q("#rpText").value);

  // Voice
  if (D.voice) {
    const v = el("div", "music-row", `<div class="music-symbol">🎙</div><div class="music-copy"><strong>یه ویس از من</strong><small id="vSt">برای پخش، دکمه رو بزن</small></div><button class="music-btn" id="vBtn">▶</button><audio id="vAud" src="${esc(D.voice)}" preload="none"></audio>`);
    $q(".footer-note").before(v);
    const a = $q("#vAud"), vb = $q("#vBtn");
    vb.onclick = () => { if (a.paused) { const m = $q("#backgroundMusic"); m.pause(); a.play(); } else a.pause(); };
    a.onplay = () => { vb.textContent = "Ⅱ"; $q("#vSt").textContent = "در حال پخش"; };
    a.onpause = a.onended = () => { vb.textContent = "▶"; $q("#vSt").textContent = "برای پخش، دکمه رو بزن"; };
  }
  // Lock
  if (D.lock.on) {
    const L = el("div", "lock", `<p class="soft-note">${esc(D.lock.qs[Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5) % D.lock.qs.length])}</p><input id="lockIn" autocomplete="off" placeholder="جواب...">`);
    const en = $q("#enterBtn"); en.before(L);
    const norm = s => s.replace(/[\s.!؟?،]/g, "").toLowerCase(), ok = D.lock.a.map(norm);
    en.addEventListener("click", e => { if (!ok.includes(norm($q("#lockIn").value))) { e.stopImmediatePropagation(); showToast("جوابش این نیست؛ دوباره امتحان کن 😉"); } }, true);
  }
})();
