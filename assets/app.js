
(function(){
  const ROOM_DATA = window.COM_ROOMS || {};
  const ROOM_ASCII = window.COM_ASCII || {};

  const KEYWORDS = ["BTC","SOL","ETH","DOGE","PEPE","INU","MOON","RUG","FUN","PUMPFUN","USELESS","INFINITE","BACKROOMS","FARTCOIN","DEGEN"];

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

  // Framed panel like your mock (50x14), 1–2 keywords, bullets
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
    // replace starting at col (no overflow)
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
    const title = sample(["MARKET FEED","MEME BOARD","TERMINAL NOTE"]);
    // title
    lines[1] = putText(lines[1], " "+title, 2);
    // bullets (2–3)
    const howMany = 2 + Math.floor(Math.random()*2);
    const kws = KEYWORDS.slice().sort(()=>Math.random()-0.5);
    for(let i=0;i<howMany;i++){
      const kw = kws[i % kws.length];
      const text = " > " + kw + " ...";
      const row = 3 + i*3;
      lines[row] = putText(lines[row], text, 2);
    }
    return lines.join("\n");
  }

  function renderInstant(termEl, slug){
    const data = ROOM_DATA[slug] || {intro:["[sys] booting…"], lines:["[ai] default room lines."]};
    const asciiPool = ROOM_ASCII[slug] || ["(*)"];

    const transcript = [];
    data.intro.forEach(l => transcript.push(l));

    const TOTAL = 180;          // shorter than v18
    const ASCII_EVERY = 6;      // less frequent panels
    const PANEL_CHANCE = 0.6;   // when ascii slot hits, prefer our panel

    const recentAscii = [];
    const recentLines = [];
    for(let i=0;i<TOTAL;i++){
      if(i>0 && i % ASCII_EVERY === 0){
        if(Math.random() < PANEL_CHANCE){
          transcript.push("ART::"+makeMarketPanel());
        }else{
          const art = sampleDistinct(asciiPool, recentAscii, 8);
          transcript.push("ART::"+art);
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
