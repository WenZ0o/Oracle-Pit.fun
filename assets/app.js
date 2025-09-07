
(function(){
  const ROOM_DATA = window.COM_ROOMS || {};
  const ROOM_ASCII = window.COM_ASCII || {};

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

  const NOISE_SET = ["█","▓","▒","░","#","@","/","|","\\","~","=","-","+",":","."];
  function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }

  function makeGlitchBlock(width=34, height=randInt(10,12)){
    let out=[];
    for(let r=0;r<height;r++){
      let line="";
      for(let c=0;c<width;c++){
        if(Math.random()<0.06){ line += " "; continue; }
        line += sample(NOISE_SET);
      }
      out.push(line);
    }
    return out.join("\\n");
  }

  function makeOrganicBlock(){
    const h = randInt(10,12);
    const w = 34;
    const cx = Math.floor(w/2);
    let out=[];
    for(let r=0;r<h;r++){
      let line="";
      for(let c=0;c<w;c++){
        const dx = Math.abs(c-cx);
        if(r===Math.floor(h/2) && dx<2){ line += "◦"; continue; }
        if(Math.abs(r-h/2)<3 && dx===6){ line += "()"; c++; continue; }
        if(Math.abs(r-h/2)===4 && dx<12 && (c%3===0)){ line += "-"; continue; }
        if(r%5===0 && c%7===0){ line += "*"; continue; }
        if((r+c)%13===0){ line += ":"; continue; }
        if(Math.random()<0.05){ line += "."; continue; }
        line += " ";
      }
      out.push(line);
    }
    return out.join("\\n");
  }

  function maybeGeneratedArt(){
    return (Math.random()<0.5) ? makeGlitchBlock() : makeOrganicBlock();
  }

  function renderInstant(termEl, slug){
    const data = ROOM_DATA[slug] || {intro:["[sys] booting…"], lines:["[ai] default room lines."]};
    const asciiPool = ROOM_ASCII[slug] || ["(*)"];

    const transcript = [];
    data.intro.forEach(l => transcript.push(l));

    const TOTAL = 220;
    const ASCII_EVERY = 4;
    const BLOCK_CHANCE = 0.45;

    const recentAscii = [];
    const recentLines = [];
    for(let i=0;i<TOTAL;i++){
      if(i>0 && i % ASCII_EVERY === 0){
        if(Math.random() < BLOCK_CHANCE){
          transcript.push("ART::"+maybeGeneratedArt());
        }else{
          const art = sampleDistinct(asciiPool, recentAscii, 6);
          transcript.push("ART::"+art);
        }
      }else{
        const line = sampleDistinct(data.lines, recentLines, 8);
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
