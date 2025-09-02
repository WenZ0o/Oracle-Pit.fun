
(function(){
  const ROOM_DATA = window.COM_ROOMS || {};
  const ASCII = window.COM_ASCII || [];

  function write(termEl, text, cls){
    const p = document.createElement('p');
    p.className = "line" + (cls?(" "+cls):"");
    if(cls==="art"){ p.textContent = text; } else { p.innerHTML = text; }
    termEl.appendChild(p);
  }

  function sample(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  function renderInstant(termEl, slug){
    const data = ROOM_DATA[slug] || {intro:["[sys] booting…"], lines:["[ai] default room lines."]};
    const transcript = [];
    // more lines + more ASCII: every 3-4 lines add ASCII
    const total = 96; // much longer
    data.intro.forEach(l => transcript.push(l));
    for(let i=0;i<total;i++){
      if(i>0 && i%4===0){
        transcript.push("ART::"+sample(ASCII));
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
    termEl.scrollTop = termEl.scrollHeight;
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
