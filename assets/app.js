
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
  function pickN(arr, n){
    const a = arr.slice(); const out=[];
    while(out.length<n && a.length){
      const i = Math.floor(Math.random()*a.length);
      out.push(a.splice(i,1)[0]);
    }
    return out;
  }
  function sampleDistinct(arr, recent, windowSize){
    if(!arr || arr.length===0) return null;
    const candidates = arr.filter(x => !recent.includes(x));
    const pick = (candidates.length>0 ? sample(candidates) : sample(arr));
    recent.push(pick);
    while(recent.length > windowSize){ recent.shift(); }
    return pick;
  }

  function frame(width=50, height=14){
    const top = "█".repeat(width);
    const mid = "█" + " ".repeat(width-2) + "█";
    const arr=[top];
    for(let i=0;i<height-2;i++) arr.push(mid);
    arr.push(top);
    return arr;
  }

  function embedKeyword(lines, keyword, row){
    const w = lines[0].length;
    const start = Math.max(1, Math.floor((w - keyword.length)/2));
    const line = lines[row];
    lines[row] = line.slice(0,start) + keyword + line.slice(start+keyword.length);
  }

  function sprinkleLightNoise(lines){
    const h = lines.length, w=lines[0].length;
    for(let i=2;i<h-2;i+=3){
      const arr = lines[i].split("");
      for(let c=2;c<w-2;c+=Math.floor(6+Math.random()*6)){
        arr[c] = (Math.random()<0.5?"░":"▒");
      }
      lines[i] = arr.join("");
    }
  }

  function makeGentleBlock(){
    const width = 50, height = 14;
    let lines = frame(width, height);
    const howMany = Math.random()<0.25 ? 2 : 1; // mostly 1, sometimes 2
    const kws = pickN(KEYWORDS, howMany);
    // primary on center row
    embedKeyword(lines, kws[0], Math.floor(height/2));
    // optional secondary lower
    if(kws[1]) embedKeyword(lines, kws[1], Math.floor(height*0.68));
    sprinkleLightNoise(lines);
    return lines.join("\\n");
  }

  function renderInstant(termEl, slug){
    const data = ROOM_DATA[slug] || {intro:["[sys] booting…"], lines:["[ai] default room lines."]};
    const asciiPool = ROOM_ASCII[slug] || ["(*)"];

    const transcript = [];
    data.intro.forEach(l => transcript.push(l));

    const TOTAL = 220;
    const ASCII_EVERY = 4;
    const BLOCK_CHANCE = 0.5;

    const recentAscii = [];
    const recentLines = [];
    for(let i=0;i<TOTAL;i++){
      if(i>0 && i % ASCII_EVERY === 0){
        if(Math.random() < BLOCK_CHANCE){
          transcript.push("ART::"+makeGentleBlock());
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

  function getSlugFromPath(){
    const file = (location.pathname.split('/').pop()||"").toLowerCase();
    return file.replace(".html","");
  }

  window.addEventListener("DOMContentLoaded", () => {
    const term = document.getElementById("term");
    const slug = document.body.getAttribute("data-room") || getSlugFromPath();
    if(term){ renderInstant(term, slug); }
  });
})();
