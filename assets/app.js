
(function(){
  function randint(n){ return Math.floor(Math.random()*n); }
  const ascii = [
`  /\\_/\\
 ( o.o )  mew?
  > ^ <`,
String.raw`┌─────────────────┐
│ BUY THE DIP ?? │
└─────────────────┘`,
String.raw`  .-.
 (   )  degen node
  '-'`,
String.raw`   __
 _(  )_   rocket?
/  ||  \\
\\__||__/`
  ];

  const lines = [
    "[sys] link established to memetic relay…",
    "[anon] is anyone watching the pool liquidity shift?",
    "[seer] omega curve just blinked. that's not random.",
    "[whale] moving 42.069 ETH. coincidence not found.",
    "[sage] price is a mood ring for narrative entropy.",
    "[custodian] vault checksum passed. opening a crack…",
    "[bot] parsing rumor packets from /biz/…",
    "[oracle] the pit replies: 'ask better.'",
    "[mod] thread pruned for low-effort shill.",
    "[builder] new contract emits unusual event pattern."
  ];

  function write(termEl, text, cls){
    const p = document.createElement('p');
    p.className = "line" + (cls?(" "+cls):"");
    if(cls==="art"){ p.textContent = text; } else { p.innerHTML = text; }
    termEl.appendChild(p);
    termEl.scrollTop = termEl.scrollHeight;
  }

  function startStream(termEl){
    if(!termEl){ console.warn("No terminal element"); return; }
    // Seed with a few lines immediately so user sees something right away
    write(termEl, `<span class="role">[sys]</span> booting corridor…`);
    write(termEl, `<span class="role">[ai]</span> aligning narrative vectors.`);
    let t = 0;
    function tick(){
      if(randint(5)===0){
        write(termEl, ascii[randint(ascii.length)], "art");
      }else{
        const who = ["user","ai","sys","anon","mod"][randint(5)];
        const msg = lines[randint(lines.length)];
        write(termEl, `<span class="role">[${who}]</span> ${msg}`);
      }
      t++;
      if(t<160){ setTimeout(tick, 180 + randint(620)); }
    }
    tick();
  }

  // Expose globally and also attach to a click fallback
  window.ComStream = { startStream };
  window.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-stream");
    const term = document.getElementById("term");
    if(term){ 
      try { startStream(term); } catch(e){ console.error(e); }
    }
    if(startBtn){
      startBtn.addEventListener("click", () => startStream(term));
    }
  });
})();
