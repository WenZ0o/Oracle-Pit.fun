
// Conversation streamer with emergent ASCII art
(function(){
  function randint(n){ return Math.floor(Math.random()*n); }
  const ascii = [
`  /\\_/\\
 ( o.o )  mew?
  > ^ <`,
`   .-.
  (o o)  owl sees trends
   |=|
  __|__`,
`   __
 _(  )_   rocket?
/  ||  \\
\\__||__/`,
String.raw`┌─────────────────┐
│ BUY THE DIP ?? │
└─────────────────┘`,
String.raw`   _______
 _/       \_
/ |  HODL  | \
\_|_______|_/
  /  | |  \`,
String.raw`  .-.
 (   )  degen node
  '-'`
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

  function startStream(termEl){
    let t = 0;
    function tick(){
      const p = document.createElement('p');
      p.className = "line";
      if(randint(5)===0){
        p.classList.add('art');
        p.textContent = ascii[randint(ascii.length)];
      }else{
        const who = ["user","ai","sys","anon","mod"][randint(5)];
        const msg = lines[randint(lines.length)];
        p.innerHTML = `<span class="role">[${who}]</span> ${msg}`;
      }
      termEl.appendChild(p);
      termEl.scrollTop = termEl.scrollHeight;
      t++;
      if(t<140){ setTimeout(tick, 180 + randint(620)); }
    }
    tick();
  }
  window.ComStream = { startStream };
})();
