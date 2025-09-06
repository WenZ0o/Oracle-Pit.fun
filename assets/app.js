
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
  function renderInstant(termEl, slug){
    const data = ROOM_DATA[slug] || {intro:["[sys] booting…"], lines:["[ai] default room lines."]};
    const ascii = ROOM_ASCII[slug] || ["(*)"];
    const transcript = [];
    data.intro.forEach(l => transcript.push(l));
    const total = 160, asciiEvery = 5;
    const recentAscii=[], recentLines=[];
    for(let i=0;i<total;i++){
      if(i>0 && i%asciiEvery===0){
        const art = sampleDistinct(ascii, recentAscii, 5);
        transcript.push("ART::"+art);
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
  window.addEventListener("DOMContentLoaded", () => {
    const term = document.getElementById("term");
    const slug = document.body.getAttribute("data-room");
    if(term){ renderInstant(term, slug); }
  });
})();
