
(function(){
  function randint(n){ return Math.floor(Math.random()*n); }
  const asciiCommon = [
`  /\\_/\\
 ( o.o )  mew?
  > ^ <`,
String.raw`┌─────────────────┐
│ BUY THE DIP ?? │
└─────────────────┘`,
String.raw`   __
 _(  )_   rocket?
/  ||  \\
\\__||__/`
  ];

  const ROOM_DATA = window.COM_ROOMS || {};

  function write(termEl, text, cls){
    const p = document.createElement('p');
    p.className = "line" + (cls?(" "+cls):"");
    if(cls==="art"){ p.textContent = text; } else { p.innerHTML = text; }
    termEl.appendChild(p);
  }

  function renderInstant(termEl, slug){
    const data = ROOM_DATA[slug] || {intro:["[sys] booting…"], lines:["[ai] default room lines."]};
    const transcript = [];
    data.intro.forEach(l => transcript.push(l));
    const total = 38;
    for(let i=0;i<total;i++){
      if(i>0 && i%7===0){
        let art = asciiCommon[randint(asciiCommon.length)];
        if(slug==="omega-vault"){ art = String.raw`   Ω\n-- vault open --`; }
        if(slug==="fourchan-echo"){ art = String.raw` (•‿•)  kek`; }
        if(slug==="oracle-pit"){ art = String.raw`  ()  pit`; }
        transcript.push("ART::"+art);
      }else{
        transcript.push(data.lines[randint(data.lines.length)]);
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
