
(function(){
  const ROOM_DATA = window.COM_ROOMS || {};
  const ROOM_ASCII = window.COM_ASCII || {};

  const KEYWORDS = ["BTC","SOL","ETH","DOGE","PEPE","INU","MOON","RUG","FUN","PUMPFUN","USELESS","INFINITE","BACKROOMS","FARTCOIN","DEGEN","TRENCHES"];

  // Room-thematic bullet libraries
  const ROOM_THEMES = {
    "memecoin-bazaar": {
      left: [
        "- Boring whitepaper",
        "- Generic logo",
        "- Roadmap Q1–Q4",
        "- Safe tokenomics",
        "- \"Community first\" (lol)",
        "- Series A pitch deck"
      ],
      right: [
        "- Shills chant in ALL CAPS",
        "- Pumpfun rituals @ SOL",
        "- Liquidity pool is a meme",
        "- Fees paid in PEPE stickers",
        "- BTC graffitied on rugs",
        "- \"Ape now, read later\""
      ]
    },
    "oracle-pit": {
      left: [
        "- Linear forecast models",
        "- Backtested indicators",
        "- Predictable variance",
        "- KPI dashboards",
        "- Risk committee"
      ],
      right: [
        "- Omens priced in BTC",
        "- PEPE appears in smoke",
        "- SOL candles whisper",
        "- BACKROOMS echo answers",
        "- MOON ∴ RUG superposition"
      ]
    },
    "corridor-404": {
      left: [
        "- Proper sitemap",
        "- Clear navigation",
        "- Valid 200 responses"
      ],
      right: [
        "- Infinite corridor loops",
        "- 404 doors reroute you",
        "- INFINITE printed on walls",
        "- USELESS exit signs"
      ]
    },
    "omega-vault": {
      left: [
        "- Cold storage best practices",
        "- 2-of-3 multisig",
        "- Quarterly audits"
      ],
      right: [
        "- Ω seal bound to BTC hash",
        "- DOGE guardian at the gate",
        "- Prime-number token math",
        "- Vault chants: MOON MOON"
      ]
    },
    "echo-chamber": {
      left: [
        "- Single source of truth",
        "- PR-approved statements",
        "- Measured comms"
      ],
      right: [
        "- Echoes repeat: PUMPFUN",
        "- Whispers: DEGEN TRENCHES",
        "- Memes amplify SOL bags"
      ]
    },
    "anomaly-node": {
      left: [
        "- Unit tests pass",
        "- Deterministic outputs",
        "- Stable builds"
      ],
      right: [
        "- Non-deterministic fun",
        "- Glitches spell INU",
        "- ETH forks itself twice"
      ]
    },
    "chaos-cache": {
      left: [
        "- Sorted indexes",
        "- Predictable TTL",
        "- Cache hit ratio charts"
      ],
      right: [
        "- Entropy hoarding FUN",
        "- RUG stored as feature",
        "- BTC shard in cold RAM"
      ]
    },
    "phantom-layer": {
      left: [
        "- Transparent roadmap",
        "- DOXxed team",
        "- Clear release notes"
      ],
      right: [
        "- Ghost commits on-chain",
        "- PEPE watermark appears",
        "- SOL bridge of whispers"
      ]
    },
    "signal-abyss": {
      left: [
        "- Clean signals",
        "- Low noise floor",
        "- Crisp alerts"
      ],
      right: [
        "- Signals fall forever",
        "- DOGE barks from below",
        "- BTC beacons flicker"
      ]
    },
    "terminal-mirage": {
      left: [
        "- CLI help pages",
        "- Stable prompts",
        "- Predictable outputs"
      ],
      right: [
        "- $> prompt dreams back",
        "- INFINITE autocompletes",
        "- USELESS flags do something"
      ]
    },
    "data-crypt": {
      left: [
        "- AES docs",
        "- Sensible key rotation",
        "- Compliance checklist"
      ],
      right: [
        "- Keys engraved in MOON dust",
        "- Hash tastes like PEPE gum",
        "- BTC ciphers hum softly"
      ]
    },
    "noise-cathedral": {
      left: [
        "- Acoustic treatment",
        "- Quiet hours policy",
        "- Tuned organs"
      ],
      right: [
        "- Choir sings RUG in canon",
        "- PIPE organ outputs DOGE",
        "- BACKROOMS reverb chamber"
      ]
    }
  };

  function write(termEl, text, cls){
    const p = document.createElement('p');
    p.className = "line" + (cls?(" "+cls):"");
    if(cls==="art"){ p.textContent = text; } else { p.innerHTML = text; }
    termEl.appendChild(p);
  }
  function sample(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function sampleDistinct(arr, recent, windowSize){
    if(!arr || arr.length===0) return null;
    const candidates = arr.filter(x => !recent.includes(x));
    const pick = (candidates.length>0 ? sample(candidates) : sample(arr));
    recent.push(pick);
    while(recent.length > windowSize){ recent.shift(); }
    return pick;
  }

  // ---------- helpers ----------
  function panel(width=50, height=14){
    const top = "┌" + "─".repeat(width-2) + "┐";
    const bottom = "└" + "─".repeat(width-2) + "┘";
    const empty = "│" + " ".repeat(width-2) + "│";
    const lines = [top];
    for(let i=0;i<height-2;i++){ lines.push(empty); }
    lines.push(bottom);
    return lines;
  }
  function putText(line, txt, col){
    if(col < 0) col = 0;
    if(col > line.length-1) return line;
    const before = line.slice(0, col);
    const after = line.slice(col + Math.min(txt.length, line.length-col));
    const fit = txt.slice(0, Math.max(0, line.length - col));
    return before + fit + after;
  }

  // ---------- Market Panel ----------
  function makeMarketPanel(){
    const width = 50, height = 14;
    const lines = panel(width, height);
    const title = sample(["MARKET FEED","MEME BOARD","ORDER FLOW","TERMINAL NOTE"]);
    lines[1] = putText(lines[1], " "+title, 2);
    // 1–2 clean bullets with keywords
    const howMany = 1 + Math.floor(Math.random()*2);
    const shuffled = KEYWORDS.slice().sort(()=>Math.random()-0.5);
    for(let i=0;i<howMany;i++){
      const kw = shuffled[i];
      const text = " > " + kw + " ...";
      const row = 3 + i*4;
      lines[row] = putText(lines[row], text, 2);
    }
    return lines.join("\n");
  }

  // ---------- Mascots ----------
  const MASCOTS = [
    ["  (o)  "," /|\\  "," / \\  "],
    [" (°▿°) "," /|\\  "," / \\  "],
    [" (ಠ_ಠ) "," /|\\  "," / \\  "],
    [" (ᵔᴥᵔ) "," /|\\  "," / \\  "],
    [" (¬‿¬) "," /|\\  "," / \\  "]
  ];

  // ---------- Comparison Panel (room-themed) ----------
  function makeComparisonPanel(slug){
    const W = 76, H = 18;
    const sepCol = Math.floor(W/2);
    const lines = new Array(H).fill("").map(()=> " ".repeat(W));
    lines[0]  = "┌" + "─".repeat(W-2) + "┐";
    lines[H-1]= "└" + "─".repeat(W-2) + "┘";
    for(let r=1;r<H-1;r++){
      lines[r] = "│" + lines[r].slice(1, W-1) + "│";
      const row = lines[r].split(""); row[sepCol] = "│"; lines[r] = row.join("");
    }
    const leftTitle = "BASELINE COIN";
    const rightTitle = "HYPER MEME SPEC";
    lines[1] = putText(lines[1], " "+leftTitle, 2);
    lines[1] = putText(lines[1], rightTitle+" ", W - rightTitle.length - 2);

    const m1 = sample(MASCOTS);
    const m2 = sample(MASCOTS);
    for(let i=0;i<m1.length;i++){
      lines[3+i] = putText(lines[3+i], m1[i], 4);
      lines[3+i] = putText(lines[3+i], m2[i], sepCol + 4);
    }

    const lib = ROOM_THEMES[slug] || {left:["- Whitepaper"], right:["- MOON"]};
    let rowL = 7; lib.left.slice(0,6).forEach(b=>{ lines[rowL] = putText(lines[rowL], b, 2); rowL++; });
    let rowR = 7; lib.right.slice(0,6).forEach(b=>{ lines[rowR] = putText(lines[rowR], b, sepCol + 2); rowR++; });

    return lines.join("\n");
  }

  // ---------- Render ----------
  function renderInstant(termEl, slug){
    const data = ROOM_DATA[slug] || {intro:["[sys] booting…"], lines:["[ai] default room lines."]};
    const asciiPool = ROOM_ASCII[slug] || ["(*)"];

    const transcript = [];
    data.intro.forEach(l => transcript.push(l));

    const TOTAL = 180;
    const ASCII_EVERY = 10 + Math.floor(Math.random()*3); // 10–12
    const PANEL_CHANCE = 0.5;

    const recentAscii = [];
    const recentLines = [];
    for(let i=0;i<TOTAL;i++){
      if(i>0 && i % ASCII_EVERY === 0){
        if(Math.random() < PANEL_CHANCE){
          transcript.push("ART::"+makeMarketPanel());
        }else{
          transcript.push("ART::"+makeComparisonPanel(slug));
        }
      }else{
        const line = sampleDistinct(data.lines, recentLines, 10);
        transcript.push(line);
      }
    }

    const frag = document.createDocumentFragment();
    transcript.forEach(raw=>{
      if(String(raw).startsWith("ART::")){
        write(frag, String(raw).slice(5), "art");
      }else{
        const right = raw.indexOf(']');
        const role = right>0 ? raw.slice(0,right+1) : "[ai]";
        const msg  = right>0 ? raw.slice(right+1).trim() : raw;
        write(frag, `<span class="role">${role}</span> ${msg}`);
      }
    });
    termEl.appendChild(frag);
    termEl.scrollTop = 0;
  }

  window.addEventListener("DOMContentLoaded", () => {
    const term = document.getElementById("term");
    const slug = document.body.getAttribute("data-room");
    if(term){ renderInstant(term, slug); }
  });
})();
