
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

  // helper: sample without repeating last picked ASCII
  function sampleAscii(ascii, last){
    if(!ascii || ascii.length===0) return null;
    let pick = sample(ascii);
    if(ascii.length>1 && pick===last){
      // try once more to avoid immediate repeat
      pick = sample(ascii);
    }
    return pick;
  }

  // Render long transcript instantly; ASCII every 8 lines (less frequent)
  function renderInstant(termEl, slug){
    const data = ROOM_DATA[slug] || {intro:["[sys] booting…"], lines:["[ai] default room lines."]};
    const ascii = ROOM_ASCII[slug] || ["(*)"];
    const transcript = [];
    data.intro.forEach(l => transcript.push(l));

    let lastAscii = null;
    const total = 80; // long but not overwhelming
    for(let i=0;i<total;i++){
      if(i>0 && i%8===0){ // ASCII frequency reduced
        const art = sampleAscii(ascii, lastAscii);
        lastAscii = art;
        transcript.push("ART::"+art);
      }else{
        transcript.push(sample(data.lines));
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

    // Keep the log at TOP on load (do not scroll to bottom)
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
