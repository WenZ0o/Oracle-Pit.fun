
(function(){
  const ROOM_DATA = window.COM_ROOMS || {};
  const ROOM_ASCII = window.COM_ASCII || {};

  const KEYWORDS = ["BTC","SOL","ETH","DOGE","PEPE","INU","MOON","RUG","FUN","PUMPFUN","USELESS","INFINITE","BACKROOMS","FARTCOIN","DEGEN","TRENCHES"];

  // Pools of bullets per room
  const ROOM_THEMES = {
    "memecoin-bazaar": {
      left: [
        "- Boring whitepaper",
        "- Generic logo",
        "- Roadmap Q1–Q4",
        "- Safe tokenomics",
        "- \"Community first\" (lol)",
        "- Series A pitch deck",
        "- Whitelist for early adopters",
        "- Same mascot recycled",
        "- Empty telegram promises"
      ],
      right: [
        "- Shills chant in ALL CAPS",
        "- Pumpfun rituals @ SOL",
        "- Liquidity pool is a meme",
        "- Fees paid in PEPE stickers",
        "- BTC graffitied on rugs",
        "- \"Ape now, read later\"",
        "- DOGE bark as governance",
        "- Inu clan whispers",
        "- Backrooms banners everywhere"
      ]
    },
    "oracle-pit": {
      left: [
        "- Linear forecast models",
        "- Backtested indicators",
        "- Predictable variance",
        "- KPI dashboards",
        "- Risk committee",
        "- Probability distributions",
        "- On-chain analytics"
      ],
      right: [
        "- Omens priced in BTC",
        "- PEPE appears in smoke",
        "- SOL candles whisper",
        "- BACKROOMS echo answers",
        "- MOON ∴ RUG superposition",
        "- DOGE howl forecast",
        "- INFINITE loop prophecy"
      ]
    },
    "corridor-404": {
      left: [
        "- Proper sitemap",
        "- Clear navigation",
        "- Valid 200 responses",
        "- Standard routers",
        "- API spec published"
      ],
      right: [
        "- Infinite corridor loops",
        "- 404 doors reroute you",
        "- INFINITE printed on walls",
        "- USELESS exit signs",
        "- BTC sprayed at junctions",
        "- DOGE pawprints vanish"
      ]
    },
    "omega-vault": {
      left: [
        "- Cold storage best practices",
        "- 2-of-3 multisig",
        "- Quarterly audits",
        "- Insurance cover",
        "- Legal wrappers"
      ],
      right: [
        "- Ω seal bound to BTC hash",
        "- DOGE guardian at the gate",
        "- Prime-number token math",
        "- Vault chants: MOON MOON",
        "- SOL shard as key",
        "- RUG hidden inside chest"
      ]
    },
    "echo-chamber": {
      left: [
        "- Single source of truth",
        "- PR-approved statements",
        "- Measured comms",
        "- Official announcements",
        "- Marketing slogans"
      ],
      right: [
        "- Echoes repeat: PUMPFUN",
        "- Whispers: DEGEN TRENCHES",
        "- Memes amplify SOL bags",
        "- BACKROOMS noise multiplies",
        "- DOGE reverb loop"
      ]
    },
    "anomaly-node": {
      left: [
        "- Unit tests pass",
        "- Deterministic outputs",
        "- Stable builds",
        "- Predictable commits",
        "- Documented endpoints"
      ],
      right: [
        "- Non-deterministic fun",
        "- Glitches spell INU",
        "- ETH forks itself twice",
        "- DOGE packet storm",
        "- MOON variance anomaly"
      ]
    },
    "chaos-cache": {
      left: [
        "- Sorted indexes",
        "- Predictable TTL",
        "- Cache hit ratio charts",
        "- Clean eviction policy",
        "- Monitored metrics"
      ],
      right: [
        "- Entropy hoarding FUN",
        "- RUG stored as feature",
        "- BTC shard in cold RAM",
        "- DOGE bits in chaos",
        "- USELESS keys cached"
      ]
    },
    "phantom-layer": {
      left: [
        "- Transparent roadmap",
        "- DOXxed team",
        "- Clear release notes",
        "- Bugfix logs",
        "- Audit trails"
      ],
      right: [
        "- Ghost commits on-chain",
        "- PEPE watermark appears",
        "- SOL bridge of whispers",
        "- DOGE phantom trace",
        "- MOON mirage layer"
      ]
    },
    "signal-abyss": {
      left: [
        "- Clean signals",
        "- Low noise floor",
        "- Crisp alerts",
        "- Calibrated sensors",
        "- Stable indicators"
      ],
      right: [
        "- Signals fall forever",
        "- DOGE barks from below",
        "- BTC beacons flicker",
        "- MOONlight interference",
        "- USELESS channel hum"
      ]
    },
    "terminal-mirage": {
      left: [
        "- CLI help pages",
        "- Stable prompts",
        "- Predictable outputs",
        "- Documented flags",
        "- Safe shell"
      ],
      right: [
        "- $> prompt dreams back",
        "- INFINITE autocompletes",
        "- USELESS flags do something",
        "- DOGE ascii appears",
        "- PEPE hijacks stdout"
      ]
    },
    "data-crypt": {
      left: [
        "- AES docs",
        "- Sensible key rotation",
        "- Compliance checklist",
        "- Security audits",
        "- Key escrow policies"
      ],
      right: [
        "- Keys engraved in MOON dust",
        "- Hash tastes like PEPE gum",
        "- BTC ciphers hum softly",
        "- DOGE runes inside blocks",
        "- SOL sigils glow"
      ]
    },
    "noise-cathedral": {
      left: [
        "- Acoustic treatment",
        "- Quiet hours policy",
        "- Tuned organs",
        "- Choir sheet music",
        "- Silent intervals"
      ],
      right: [
        "- Choir sings RUG in canon",
        "- PIPE organ outputs DOGE",
        "- BACKROOMS reverb chamber",
        "- MOON hymns distort",
        "- PEPE chants overlap"
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

  function makeMarketPanel(){
    const width = 50, height = 14;
    const lines = panel(width, height);
    const title = sample(["MARKET FEED","MEME BOARD","ORDER FLOW","TERMINAL NOTE"]);
    lines[1] = putText(lines[1], " "+title, 2);
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

  const MASCOTS = [
    ["  (o)  "," /|\\  "," / \\  "],
    [" (°▿°) "," /|\\  "," / \\  "],
    [" (ಠ_ಠ) "," /|\\  "," / \\  "],
    [" (ᵔᴥᵔ) "," /|\\  "," / \\  "],
    [" (¬‿¬) "," /|\\  "," / \\  "]
  ];

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
    const pickBullets = (arr) => {
      const pool = arr.slice().sort(()=>Math.random()-0.5);
      return pool.slice(0, Math.min(6, pool.length));
    };
    let rowL = 7; pickBullets(lib.left).forEach(b=>{ lines[rowL] = putText(lines[rowL], b, 2); rowL++; });
    let rowR = 7; pickBullets(lib.right).forEach(b=>{ lines[rowR] = putText(lines[rowR], b, sepCol + 2); rowR++; });

    return lines.join("\n");
  }

  function renderInstant(termEl, slug){
    const data = ROOM_DATA[slug] || {intro:["[sys] booting…"], lines:["[ai] default room lines."]};
    const asciiPool = ROOM_ASCII[slug] || ["(*)"];

    const transcript = [];
    data.intro.forEach(l => transcript.push(l));

    const TOTAL = 180;
    const ASCII_EVERY = 10 + Math.floor(Math.random()*3);
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
