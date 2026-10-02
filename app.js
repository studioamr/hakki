/* RONIN · shared script for index.html, cards.html and luck.html
   Each block checks that its elements exist, so every page loads the same file. */

/* ---------- utils ---------- */
const rng = s => () => (s = (s + 0x6D2B79F5) | 0, s = Math.imul(s ^ s >>> 15, 1 | s), s ^= s + Math.imul(s ^ s >>> 7, 61 | s), ((s ^ s >>> 14) >>> 0) / 4294967296);
function noise2(seed){
  const r=rng(seed), p=Array.from({length:256},r);
  const h=(x,y)=>p[(x*57+y*131)&255 ^ ((y*13)&255)]??p[(x+y)&255];
  return (x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),fx=x-xi,fy=y-yi,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);
    const a=h(xi,yi),b=h(xi+1,yi),c=h(xi,yi+1),d=h(xi+1,yi+1);return (a*(1-u)+b*u)*(1-v)+(c*(1-u)+d*u)*v;};
}
function fit(cv){ const r=cv.getBoundingClientRect(), d=Math.min(2,devicePixelRatio||1); cv.width=Math.max(1,r.width*d); cv.height=Math.max(1,r.height*d); const c=cv.getContext('2d'); c.setTransform(d,0,0,d,0,0); return {c,w:r.width,h:r.height}; }
const INK='#0c0c0c';
const $=id=>document.getElementById(id);
const touch=matchMedia('(hover:none)').matches;
const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
const R=(a,b)=>a+Math.random()*(b-a);
const toast=t=>{const el=$('toast');el.textContent=t;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),1900);};
const ROMAN=n=>[['M',1000],['CM',900],['D',500],['CD',400],['C',100],['XC',90],['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1]].reduce((s,[k,v])=>{while(n>=v){s+=k;n-=v;}return s;},'');
const KD=['','一','二','三','四','五','六','七','八','九'];
const jnum=n=>n<10?KD[n]:(n<20?'':KD[Math.floor(n/10)])+'十'+KD[n%10];   // 1→一, 11→十一, 52→五十二

/* ---------- the collection data ----------
   Order = order on the site (the landing shows the first 7).
   To add artworks: drop the image in img/coleccion/ and add a line.
   r = rarity · e = editions · p = estimated value in SOL (real prices are set by holders)
   wide:1 = landscape artwork · bg = scene in img/escenas/ (defaults to f) · fx = the scene's particles */
const NFTS=[
  {f:'pink-field',t:'Pink Field',jt:'花の野',r:'Legendary',e:33,p:5,wide:1,fx:'petals',d:'Where the path ends: flowers, sky and a friend. The only frame where he smiles.'},
  {f:'above-clouds',t:'Above the Clouds',jt:'雲の上',r:'Legendary',e:44,p:3.5,fx:'clouds',d:'Sitting above everything that knocked him down.'},
  {f:'seventh-fall',t:'Seventh Fall',jt:'七転',r:'Epic',e:100,p:1.8,fx:'bubbles',d:'Ink, water and blood. The lowest point on the whole path.'},
  {f:'the-ground',t:'The Ground',jt:'大地',r:'Epic',e:100,p:1.8,fx:'dust',d:'Face to the sky, back on the straw. Rest is not quitting.'},
  {f:'bamboo',t:'Bamboo Rest',jt:'竹林',r:'Rare',e:150,p:0.9,fx:'leaves',d:'Bamboo bends and never breaks. Neither does he.'},
  {f:'meadow',t:'The Meadow',jt:'草原',r:'Rare',e:150,p:0.9,fx:'seeds',d:'Hills, wind and the long walk. The path is longer than it looks.'},
  {f:'cedar-path',t:'Cedar Path',jt:'杉の道',r:'Common',e:200,p:0.5,fx:'rays',d:'One step into the forest. Every legend starts walking.'},
  {f:'wanderer',t:'The Wanderer',jt:'流れ者',r:'Rare',e:150,p:0.9,fx:'clouds',bg:'shore',d:'Hair in the wind, sword loose in his hand. He walks the shore because the shore goes somewhere.'},
  {f:'stillness',t:'Stillness',jt:'静寂',r:'Legendary',e:40,p:3,fx:'dust',bg:'stillness',d:'The blade across his knees, the mind empty. The strongest moment is the one before.'},
  {f:'the-duel',t:'The Duel',jt:'決闘',r:'Legendary',e:30,p:4.5,wide:1,fx:'snow',bg:'dojo',pos:'88% 50%',d:'Snow on the dojo floor. Two swords, one silence. Only one walks away.'},
];
NFTS.forEach((n,i)=>n.ch=ROMAN(i+1));
const TOTAL=NFTS.reduce((a,n)=>a+n.e,0);
const RCOL={Common:['#a8a196','#efe9dc'],Rare:['#4fa3ff','#d8ecff'],Epic:['#c06bff','#f0d6ff'],Legendary:['#f3c22f','#fff4c2']};
const img=n=>`img/coleccion/${n.f}.webp`;
const scene=f=>`img/escenas/${f}.webp`;
let checkout=()=>{};   // set by the wallet block at the bottom
const openMarket=()=>{ if(CONFIG.marketUrl)window.open(CONFIG.marketUrl,'_blank','noopener'); else toast('Trading opens right after the mint.'); };
const nSpark={Legendary:9,Epic:6,Rare:4,Common:2};
const sparks=n=>{let sp='';for(let k=0;k<n;k++)sp+=`<i class="spark" style="left:${8+Math.random()*84}%;top:${6+Math.random()*70}%;--d:${(Math.random()*2.6).toFixed(2)}s"></i>`;return sp;};
function tilt(c,deg=16){
  if(!c)return; if(touch){c.style.setProperty('--o',.35);return;}
  c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    c.style.setProperty('--mx',(x*100)+'%');c.style.setProperty('--my',(y*100)+'%');
    c.style.setProperty('--ry',((x-.5)*deg)+'deg');c.style.setProperty('--rx',((.5-y)*deg)+'deg');c.style.setProperty('--o',1);c.style.transition='transform .08s';});
  c.addEventListener('pointerleave',()=>{c.style.transition='';['--rx','--ry'].forEach(v=>c.style.setProperty(v,'0deg'));c.style.setProperty('--o',0);});
}

/* ---------- shared chrome: nav, toast, cursor light, socials, subscribe ---------- */
(function(){
  document.body.insertAdjacentHTML('beforeend','<div class="cursor-light" id="cl" aria-hidden="true"></div><div class="toast" id="toast"></div>');
  const nav=$('nav'); if(nav)addEventListener('scroll',()=>nav.classList.toggle('solid',scrollY>40),{passive:true});
  [['sX',CONFIG.x],['sTg',CONFIG.telegram]].forEach(([id,u])=>{const a=$(id);if(!a)return;if(u){a.href=u;a.target='_blank';a.rel='noopener'}else a.classList.add('off');});
  const f=$('subForm'); if(f)f.addEventListener('submit',async e=>{
    e.preventDefault(); const msg=$('subMsg'), email=f.email.value.trim();
    const say=(t,ok)=>{msg.textContent=t;msg.className='sub-msg '+(ok?'ok':'err')};
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return say('That email doesn’t look right.');
    if(!CONFIG.subscribeUrl)return say('Subscriptions open in a few hours. Come back soon.');
    const b=f.querySelector('button'); b.disabled=true;
    try{ const r=await fetch(CONFIG.subscribeUrl,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({email})});
      if(!r.ok)throw 0; f.reset(); say('You’re in. We’ll write once, when the mint opens.',true);
    }catch(_){ say('Something failed. Try again in a minute.'); }
    b.disabled=false;
  });
})();

/* ---------- hero: halftone sky + spiral sun ---------- */
function drawSky(){
  const cv=$('skyCv'); if(!cv)return; const {c,w,h}=fit(cv);
  c.fillStyle='#efe9dc'; c.fillRect(0,0,w,h);
  const n=noise2(5), cell=w<600?5:6.5;
  const fbm=(x,y)=>{let v=0,a=.55,f=1;for(let o=0;o<5;o++){v+=a*n(x*f,y*f);a*=.5;f*=2.03;}return v;};
  const hill=x=>h*.8-Math.sin(x/w*2.6+.4)*h*.05-(x/w)*h*.04;
  for(let y=0;y<h;y+=cell)for(let x=0;x<w;x+=cell){
    const off=(y/cell)%2?cell/2:0, X=x+off;
    if(y>hill(X))continue;
    const cl=fbm(X/260,y/170)+(y/h)*.18-.25;
    const e=Math.max(0,Math.min(1,(cl-.43)/.05));
    if(e<1){ c.fillStyle='#3c6f9e'; c.beginPath(); c.arc(X,y,cell*.64*(1-e*.7),0,6.283); c.fill(); }
    else { const sh=Math.max(0,Math.min(1,(.62-cl)*2.2));
      if(sh>.05){ c.fillStyle='#7d97ad'; c.beginPath(); c.arc(X,y,cell*.42*Math.sqrt(sh),0,6.283); c.fill(); } }
  }
  c.beginPath(); c.moveTo(0,h); for(let x=0;x<=w;x+=4)c.lineTo(x,hill(x)); c.lineTo(w,h); c.closePath();
  c.fillStyle='#55722a'; c.fill();
  const r=rng(9); c.strokeStyle='#2f4514'; c.lineWidth=1;
  for(let i=0;i<w*h*.0035;i++){const x=r()*w,y=hill(x)+r()*(h-hill(x));c.globalAlpha=.25+r()*.5;c.beginPath();c.moveTo(x,y);c.lineTo(x+(r()-.5)*3,y-3-r()*6);c.stroke();}
  c.globalAlpha=1; c.fillStyle='#8aa548';
  for(let i=0;i<w*h*.002;i++){const x=r()*w,y=hill(x)+r()*(h-hill(x))*.7;c.globalAlpha=.3+r()*.4;c.fillRect(x,y,1.2,2.4+r()*3);}
  c.globalAlpha=1; c.strokeStyle=INK; c.lineWidth=2.2; c.beginPath(); for(let x=0;x<=w;x+=4)(x?c.lineTo:c.moveTo).call(c,x,hill(x)+Math.sin(x*.21)*1.2); c.stroke();
}
function buildSun(){
  const s=$('sun'); if(!s)return; const r=rng(3); let d='';
  for(let k=0;k<16;k++){
    const a=k/16*Math.PI*2, L=78+(k%2?0:12)+r()*6, base=44, sp=.13, wig=(k%2?1:-1)*8;
    const P=(rad,ang)=>[Math.cos(ang)*rad,Math.sin(ang)*rad];
    const [x1,y1]=P(base,a-sp),[x2,y2]=P(base,a+sp),[tx,ty]=P(L,a);
    const [m1x,m1y]=P((base+L)/2,a-sp*.3+wig/100),[m2x,m2y]=P((base+L)/2,a+sp*.3+wig/100);
    d+=`M${x1.toFixed(1)},${y1.toFixed(1)} Q${(m1x+wig*Math.cos(a+1.57)).toFixed(1)},${(m1y+wig*Math.sin(a+1.57)).toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)} Q${(m2x+wig*Math.cos(a+1.57)).toFixed(1)},${(m2y+wig*Math.sin(a+1.57)).toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}Z `;
  }
  let sp=''; for(let i=0;i<=200;i++){const t=i/200,a=t*Math.PI*2*2.6,rr=2+t*32;sp+=(i?'L':'M')+(Math.cos(a)*rr).toFixed(1)+','+(Math.sin(a)*rr).toFixed(1);}
  s.innerHTML=`<path d="${d}" fill="#f3c22f" stroke="#1d3687" stroke-width="3" stroke-linejoin="round"/>
    <circle r="46" fill="#1d3687"/><circle r="41" fill="#f3c22f"/>
    <path d="${sp}" fill="none" stroke="#1d3687" stroke-width="6.5" stroke-linecap="round"/>`;
}

/* ---------- collection grid (landing: first 7 · cards.html: all) ---------- */
let openShrine=()=>{};
(function(){
  const box=$('cards'); if(!box)return;
  const limit=+box.dataset.limit||NFTS.length;
  const reveal=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); reveal.unobserve(e.target); } }),{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  NFTS.slice(0,limit).forEach((n,i)=>{
    const c=document.createElement('div'); c.className='card'+(n.wide?' wide':''); c.dataset.r=n.r;
    c.style.setProperty('--d',(i%7*.7)+'s'); c.style.setProperty('--k',(i%4)*.1+'s');
    c.innerHTML=`<div class="ring"></div><div class="frame"><img src="${img(n)}" alt="${n.t}" loading="lazy" style="object-position:${n.wide?'50% 50%':(n.pos||'50% 50%')}"><div class="holo"></div><div class="sweep"></div><div class="shade"></div><div class="glare"></div></div>${sparks(nSpark[n.r])}
      <div class="info"><div><small>RONIN #${String(i+1).padStart(3,'0')}</small><b>${n.t}</b></div><span class="rar">${n.r}</span></div>`;
    tilt(c); c.onclick=()=>openShrine(i); box.appendChild(c); reveal.observe(c);
  });
  const cnt=$('collCount'); if(cnt)cnt.textContent=`${NFTS.length} artworks · ${TOTAL} pieces · Solana`;
  // rarity filter (cards.html)
  const cf=$('cfilt'); if(cf){
    const k=r=>NFTS.filter(n=>r==='All'||n.r===r).length;
    cf.innerHTML=['All','Legendary','Epic','Rare','Common'].filter(r=>k(r)).map(r=>`<button data-f="${r}" class="${r==='All'?'on':''}" style="--rc:${(RCOL[r]||['#fff'])[0]}">${r}<i>${k(r)}</i></button>`).join('');
    cf.onclick=e=>{ const b=e.target.closest('button'); if(!b)return; cf.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
      box.querySelectorAll('.card').forEach(c=>c.hidden=b.dataset.f!=='All'&&c.dataset.r!==b.dataset.f); };
  }
})();

/* ---------- the shrine: a chapter in its own scenery ---------- */
(function(){
  if(!$('cards'))return;
  document.body.insertAdjacentHTML('beforeend',`<div class="shrine" id="shrine" aria-hidden="true" role="dialog" aria-label="Chapter">
  <div class="sh-bg"><img id="shBg" alt=""></div><canvas class="sh-sky" id="shSky"></canvas>
  <button class="sh-x" id="shX" aria-label="Close">✕</button>
  <button class="sh-nav prev" id="shPrev" aria-label="Previous">‹</button><button class="sh-nav next" id="shNext" aria-label="Next">›</button>
  <div class="sh-in">
    <div class="sh-art">
      <svg class="sh-enso" viewBox="0 0 200 200" aria-hidden="true"><path pathLength="1" d="M100 18a82 82 0 1 1-58 24"/></svg>
      <div class="sh-pic"><img id="shImg" alt=""><i class="sh-shine"></i></div>
      <i class="sh-frame" aria-hidden="true"></i>
      <span class="sh-corner tl"></span><span class="sh-corner tr"></span><span class="sh-corner bl"></span><span class="sh-corner br"></span>
      <div class="sh-seal jp">道</div>
    </div>
    <div class="sh-info">
      <div class="rv sh-ch jp" style="--i:0" id="shCh"></div>
      <div class="rv sh-chen" style="--i:1" id="shChEn"></div>
      <h3 class="rv" style="--i:2" id="shT"></h3>
      <div class="rv sh-jt jp" style="--i:3" id="shJt"></div>
      <div class="rv sh-rar" style="--i:4"><span id="shR"></span></div>
      <p class="rv sh-d" style="--i:5" id="shD"></p>
      <div class="rv sh-stats" style="--i:6"><div><small>Editions</small><b id="shE"></b></div><div><small>Chain</small><b>Solana</b></div><div><small>Artwork</small><b id="shN"></b></div></div>
      <div class="rv sh-buy" style="--i:7">
        <div class="sh-price"><small>Est. value</small><em>◎</em><b id="shP"></b><span>SOL</span></div>
        <button class="sh-mint" id="shMint"><span>Buy from a holder</span><i></i></button>
      </div>
      <p class="rv sh-note" style="--i:8" id="shNote"></p>
      <a class="rv sh-luck" style="--i:8" href="luck.html">or try your luck · draw a random piece →</a>
    </div>
  </div></div>`);
  const sh=$('shrine'); let cur=0, raf=0, parts=[], mode='petals', birds=[], t=0;
  function fill(i){
    const n=NFTS[i], [c1,c2]=RCOL[n.r];
    sh.style.setProperty('--c1',c1); sh.style.setProperty('--c2',c2);
    $('shImg').src=img(n); $('shImg').style.objectPosition=n.pos||'50% 50%'; $('shBg').src=scene(n.bg||n.f);
    $('shCh').textContent=`第${jnum(i+1)}章`; $('shChEn').textContent=`RONIN #${String(i+1).padStart(3,'0')} · ${n.ch}`;
    $('shT').textContent=n.t; $('shJt').textContent=n.jt; $('shR').textContent=n.r; $('shD').textContent=n.d;
    $('shE').textContent=n.e; $('shN').textContent=`${i+1} / ${NFTS.length}`; $('shP').textContent=n.p;
    $('shNote').textContent=`A random draw costs ◎ ${CONFIG.mintPrice}. To get ${n.t} for sure, buy it from someone who holds one, at their price.`;
    mode=n.fx; cur=i;
  }
  const replay=()=>{ sh.classList.remove('on'); void sh.offsetWidth; sh.classList.add('on'); };
  openShrine=i=>{ fill(i); sh.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; replay(); startSky(); sh.scrollTop=0; };
  const close=()=>{ sh.classList.remove('on'); sh.setAttribute('aria-hidden','true'); document.body.style.overflow=''; cancelAnimationFrame(raf); raf=0; };
  const go=d=>{ fill((cur+d+NFTS.length)%NFTS.length); replay(); seed(); burst(innerWidth/2,innerHeight/2,26); };
  $('shX').onclick=close; $('shPrev').onclick=()=>go(-1); $('shNext').onclick=()=>go(1);
  addEventListener('keydown',e=>{ if(!sh.classList.contains('on'))return; if(e.key==='Escape')close(); if(e.key==='ArrowRight')go(1); if(e.key==='ArrowLeft')go(-1); });
  $('shMint').onclick=()=>{ close(); if($('listings'))$('listings').scrollIntoView({behavior:'smooth'}); else location.href='index.html#listings'; };

  /* each scene brings its own weather */
  const cv=$('shSky'); let ctx, W, H;
  function size(){ const d=Math.min(2,devicePixelRatio||1); W=innerWidth; H=innerHeight; cv.width=W*d; cv.height=H*d; ctx=cv.getContext('2d'); ctx.setTransform(d,0,0,d,0,0); }
  const MAKE={
    petals:()=>({x:R(0,W),y:R(-H,0),s:R(6,15),vx:R(.4,1.5),vy:R(.7,1.9),a:R(0,6),va:R(-.05,.05),w:R(0,6)}),
    leaves:()=>({x:R(0,W),y:R(-H,0),s:R(10,22),vx:R(-.9,-.2),vy:R(1,2.2),a:R(0,6),va:R(-.04,.04),w:R(0,6)}),
    clouds:()=>({x:R(-W*.4,W),y:R(H*.05,H*.95),s:R(90,240),vx:R(.15,.55),o:R(.05,.16)}),
    seeds:()=>({x:R(-50,W),y:R(0,H),s:R(5,9),vx:R(.5,1.4),vy:R(-.6,-.1),w:R(0,6)}),
    rays:()=>({x:R(0,W),y:R(0,H),s:R(1.5,3.5),vx:R(-.3,.3),vy:R(-.3,.3),w:R(0,6)}),
    dust:()=>({x:R(0,W),y:R(0,H),s:R(.8,2.6),vx:R(-.15,.25),vy:R(-.2,.15),w:R(0,6),straw:Math.random()<.15}),
    bubbles:()=>({x:R(0,W),y:R(H,H*2),s:R(3,14),vy:R(-.4,-1.4),w:R(0,6)}),
    snow:()=>({x:R(0,W),y:R(-H,H),s:R(1,3.4),vy:R(.4,1.3),w:R(0,6)}),
  };
  const COUNT={snow:110,petals:55,leaves:34,clouds:16,seeds:40,rays:36,dust:90,bubbles:40};
  function seed(){ const k=matchMedia('(max-width:700px)').matches?.55:1; parts=Array.from({length:Math.round(COUNT[mode]*k)},()=>({k:mode,...MAKE[mode]()})); birds=mode==='clouds'?Array.from({length:7},()=>({x:R(-W,0),y:R(H*.1,H*.45),v:R(.8,1.6),f:R(0,6)})):[]; }
  function ember(x,y,f){ const a=Math.random()*6.283,v=f*(1+Math.random()*3); return {k:'e',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1.2,l:1,s:1+Math.random()*2.4}; }
  function burst(x,y,n){ for(let i=0;i<n;i++)parts.push(ember(x,y,1.6)); }
  function wrap(p){ if(p.y>H+40)p.y=-40; if(p.y<-40)p.y=H+40; if(p.x>W+260)p.x=-260; if(p.x<-260)p.x=W+40; }
  function draw(p){
    switch(p.k){
      case 'petals': case 'leaves':{
        p.w+=.03; p.x+=p.vx+Math.sin(p.w)*.6; p.y+=p.vy; p.a+=p.va; wrap(p);
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.a); ctx.scale(1,(p.k==='leaves'?.32:.55)+Math.sin(p.w*2)*.3);
        const g=ctx.createLinearGradient(-p.s,0,p.s,0);
        if(p.k==='petals'){g.addColorStop(0,'#ffd6e4');g.addColorStop(1,'#f59ab8');} else {g.addColorStop(0,'#c9e27a');g.addColorStop(1,'#5d8a2a');}
        ctx.fillStyle=g; ctx.globalAlpha=.88; ctx.beginPath(); ctx.moveTo(-p.s,0); ctx.quadraticCurveTo(0,-p.s*.75,p.s,0); ctx.quadraticCurveTo(0,p.s*.75,-p.s,0); ctx.fill(); ctx.restore(); break;}
      case 'clouds':{
        p.x+=p.vx; wrap(p); const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.s);
        g.addColorStop(0,`rgba(255,255,255,${p.o})`); g.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle=g;
        ctx.beginPath(); ctx.ellipse(p.x,p.y,p.s*1.6,p.s*.7,0,0,6.283); ctx.fill(); break;}
      case 'seeds':{
        p.w+=.02; p.x+=p.vx; p.y+=p.vy+Math.sin(p.w)*.4; wrap(p);
        ctx.strokeStyle='rgba(255,255,255,.75)'; ctx.lineWidth=.7; ctx.beginPath();
        for(let k=0;k<8;k++){const a=k/8*6.283+p.w;ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+Math.cos(a)*p.s,p.y+Math.sin(a)*p.s);} ctx.stroke();
        ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(p.x,p.y,1.2,0,6.283); ctx.fill(); break;}
      case 'rays': case 'dust':{
        p.w+=.03; p.x+=(p.vx||0)+Math.sin(p.w)*.3; p.y+=(p.vy||0); wrap(p);
        const c=p.k==='rays'?'#e9ff9a':'#ffd98a', a=p.k==='dust'?.55:.5+Math.sin(p.w*2)*.45;
        if(p.straw){ctx.strokeStyle='rgba(225,190,110,.6)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+9*Math.cos(p.w),p.y+9*Math.sin(p.w));ctx.stroke();break;}
        ctx.globalAlpha=Math.max(0,a); ctx.fillStyle=c; ctx.shadowColor=c; ctx.shadowBlur=p.k==='dust'?4:14;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.s,0,6.283); ctx.fill(); ctx.shadowBlur=0; ctx.globalAlpha=1; break;}
      case 'snow':{
        p.w+=.02; p.y+=p.vy; p.x+=Math.sin(p.w)*.5; if(p.y>H+10){p.y=-10;p.x=R(0,W);}
        ctx.globalAlpha=.85; ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(p.x,p.y,p.s,0,6.283); ctx.fill(); ctx.globalAlpha=1; break;}
      case 'bubbles':{
        p.w+=.04; p.y+=p.vy; p.x+=Math.sin(p.w)*.5; if(p.y<-20){p.y=H+20;p.x=R(0,W);}
        ctx.strokeStyle='rgba(190,255,225,.55)'; ctx.lineWidth=1.1; ctx.beginPath(); ctx.arc(p.x,p.y,p.s,0,6.283); ctx.stroke();
        ctx.fillStyle='rgba(255,255,255,.6)'; ctx.beginPath(); ctx.arc(p.x-p.s*.35,p.y-p.s*.35,p.s*.18,0,6.283); ctx.fill(); break;}
    }
  }
  function startSky(){
    size(); seed(); cancelAnimationFrame(raf); if(still)return;
    const loop=()=>{
      t++; ctx.clearRect(0,0,W,H); const col=getComputedStyle(sh).getPropertyValue('--c1').trim()||'#f3c22f';
      if(mode==='rays'){ ctx.save(); ctx.globalCompositeOperation='screen';
        for(let k=0;k<5;k++){const x=W*(.1+k*.2)+Math.sin(t*.004+k)*40;const g=ctx.createLinearGradient(x,0,x+W*.25,H);
          g.addColorStop(0,'rgba(255,250,200,.13)');g.addColorStop(1,'rgba(255,250,200,0)');ctx.fillStyle=g;
          ctx.beginPath();ctx.moveTo(x,-10);ctx.lineTo(x+60,-10);ctx.lineTo(x+W*.32,H);ctx.lineTo(x+W*.18,H);ctx.fill();}
        ctx.restore(); }
      for(const b of birds){ b.x+=b.v; b.f+=.18; if(b.x>W+30){b.x=-30;b.y=R(H*.1,H*.45);}
        const wy=Math.sin(b.f)*4; ctx.strokeStyle='rgba(20,20,30,.7)'; ctx.lineWidth=1.6; ctx.beginPath(); ctx.moveTo(b.x-9,b.y-wy); ctx.quadraticCurveTo(b.x-4,b.y-3,b.x,b.y); ctx.quadraticCurveTo(b.x+4,b.y-3,b.x+9,b.y-wy); ctx.stroke(); }
      if(t%11===0)parts.push(ember(Math.random()*W,H+10,.35));
      parts=parts.filter(p=>{
        if(p.k!=='e'){draw(p);return true;}
        p.x+=p.vx; p.y+=p.vy; p.vy-=.02; p.vx*=.985; p.l-=.008; if(p.l<=0)return false;
        ctx.globalAlpha=p.l; ctx.fillStyle=col; ctx.shadowColor=col; ctx.shadowBlur=12;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.s,0,6.283); ctx.fill(); ctx.shadowBlur=0; ctx.globalAlpha=1; return true;
      });
      raf=requestAnimationFrame(loop);
    };
    loop();
  }
  addEventListener('resize',()=>{ if(raf)size(); });
})();

/* ---------- listings + trade sheet ---------- */
(function(){
  if(!$('lstGrid'))return;
  document.querySelectorAll('.js-market').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openMarket();}));
  // every number below is a fixed example (same for everyone), clearly labelled until trading opens
  const r=rng(77), B58='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const addr=(g=r)=>Array.from({length:4},()=>B58[Math.floor(g()*58)]).join('')+'…'+Array.from({length:4},()=>B58[Math.floor(g()*58)]).join('');
  const L=[]; NFTS.forEach((n,i)=>{ const k=n.r==='Legendary'?1:2; for(let j=0;j<k;j++){ const mult=.95+r()*1.1; L.push({id:L.length,i,n,ed:1+Math.floor(r()*n.e),price:+(n.p*mult).toFixed(2),seller:addr(),up:Math.round((n.p*mult/CONFIG.mintPrice-1)*100)}); } });
  let filt='All', sort='price-asc';
  $('filters').innerHTML=['All','Common','Rare','Epic','Legendary'].map(f=>`<button data-f="${f}" class="${f==='All'?'on':''}">${f}</button>`).join('')+`<button data-s="1">Price ↑</button>`;
  function render(){
    const rows=L.filter(x=>filt==='All'||x.n.r===filt).sort((a,b)=>sort==='price-asc'?a.price-b.price:b.price-a.price);
    $('lstGrid').innerHTML=rows.map(x=>`<div class="lst" style="--rc:${RCOL[x.n.r][0]}" data-id="${x.id}" tabindex="0" role="button" aria-label="${x.n.t}, details">
      <div class="im"><img src="${img(x.n)}" alt="${x.n.t}" loading="lazy" style="object-position:${x.n.pos||'50% 50%'}"><span class="ex">EXAMPLE</span><span class="rr">${x.n.r}</span></div>
      <div class="bd"><small>${x.n.ch} · #${x.ed}/${x.n.e}</small><b>${x.n.t}</b>
        <div class="row"><span class="pr"><em>◎</em>${x.price}</span><span class="up">${x.up>=0?'+':''}${x.up}% vs mint</span></div>
        <div class="sel">seller ${x.seller}</div><button>View · Buy</button></div></div>`).join('');
    $('lstGrid').querySelectorAll('.lst').forEach(el=>{ const go=()=>openTrade(L[+el.dataset.id]); el.onclick=go; el.onkeydown=e=>{if(e.key==='Enter')go();}; });
  }
  $('filters').onclick=e=>{ const b=e.target.closest('button'); if(!b)return;
    if(b.dataset.s){ sort=sort==='price-asc'?'price-desc':'price-asc'; b.textContent=sort==='price-asc'?'Price ↑':'Price ↓'; }
    else { filt=b.dataset.f; $('filters').querySelectorAll('[data-f]').forEach(x=>x.classList.toggle('on',x===b)); }
    render(); };
  render();

  /* the trade sheet */
  document.body.insertAdjacentHTML('beforeend',`<div class="trade" id="trade" aria-hidden="true" role="dialog" aria-label="Listing details"><div class="tr-box">
    <div class="tr-top"><span class="chip-ex">Example data · trading opens after the mint</span><button class="tr-x" id="trX" aria-label="Close">✕</button></div>
    <div class="tr-grid">
      <aside class="tr-side">
        <div class="tr-art"><img id="trImg" alt=""></div>
        <div class="tr-id"><small id="trCh"></small><h3 id="trT"></h3><div class="tr-meta"><span class="tr-rar" id="trR"></span><span id="trEd"></span></div></div>
        <div class="tr-buy"><small>Listed price</small><div><em>◎</em><b id="trP"></b><span>SOL</span></div><div class="tr-usd" id="trSeller"></div>
          <button class="btn tr-go" id="trBuy">Buy now</button><button class="tr-offer" id="trOffer">Make an offer</button></div>
      </aside>
      <div class="tr-main">
        <div class="tr-stats" id="trStats"></div>
        <div class="tr-chart">
          <div class="tr-ch-head"><div><b>Price history</b><span id="trChg"></span></div><div class="tr-range" id="trRange"><button data-d="7">7D</button><button data-d="30" class="on">30D</button><button data-d="90">90D</button></div></div>
          <div class="tr-plot" id="trPlot"><svg id="trSvg" viewBox="0 0 720 240" preserveAspectRatio="none"></svg><div class="tr-tip" id="trTip"></div></div>
          <svg class="tr-vol" id="trVol" viewBox="0 0 720 56" preserveAspectRatio="none"></svg>
          <div class="tr-axis" id="trAxis"></div>
        </div>
        <div class="tr-tables">
          <div><h4>Recent sales</h4><table><thead><tr><th>When</th><th>Price</th><th>From</th><th>To</th></tr></thead><tbody id="trSales"></tbody></table></div>
          <div><h4>Offers</h4><table><thead><tr><th>Price</th><th>vs listed</th><th>From</th><th>Expires</th></tr></thead><tbody id="trOffers"></tbody></table></div>
        </div>
      </div>
    </div></div></div>`);
  const tr=$('trade'); let hist=[], vols=[], range=30;
  const fmt=v=>v>=10?v.toFixed(1):v.toFixed(2);
  const dayLabel=k=>{const d=new Date(); d.setDate(d.getDate()-k); return d.toLocaleDateString('en-US',{month:'short',day:'numeric'});};
  function series(x){
    const g=rng(1000+x.id*13), T=90, end=x.price*R(.9,.98), a=Math.log(CONFIG.mintPrice), b=Math.log(end);
    let w=0; const walk=[0]; for(let k=1;k<=T;k++){ w+=(g()-.5)*.16; walk.push(w); }
    hist=walk.map((v,k)=>Math.exp(a+(b-a)*(k/T)**.8+(v-walk[T]*k/T)*.9));          // brownian bridge from mint to today
    vols=hist.map(()=>Math.round(g()**2*6)).map((c,k)=>+(c*hist[k]).toFixed(2));
  }
  function drawChart(){
    const n=range+1, H=hist.slice(-n), V=vols.slice(-n);
    const lo=Math.min(...H,CONFIG.mintPrice)*.92, hi=Math.max(...H)*1.06, X=k=>44+k*(720-56)/(n-1), Y=v=>14+(1-(v-lo)/(hi-lo))*(240-38);
    let grid=''; for(let k=0;k<4;k++){ const v=lo+(hi-lo)*k/3, y=Y(v); grid+=`<line x1="44" x2="708" y1="${y}" y2="${y}" class="gl"/><text x="38" y="${y+4}" class="yl">${fmt(v)}</text>`; }
    const pts=H.map((v,k)=>`${X(k).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
    const my=Y(CONFIG.mintPrice);
    $('trSvg').innerHTML=`<defs><linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2f5f8e" stop-opacity=".22"/><stop offset="1" stop-color="#2f5f8e" stop-opacity="0"/></linearGradient></defs>
      ${grid}<line x1="44" x2="708" y1="${my}" y2="${my}" class="mint"/><text x="704" y="${my-6}" class="ml" text-anchor="end">Mint ◎${CONFIG.mintPrice}</text>
      <polygon points="44,${240-24} ${pts} ${X(n-1)},${240-24}" fill="url(#ga)"/><polyline points="${pts}" class="ln"/>
      <circle cx="${X(n-1)}" cy="${Y(H[n-1])}" r="5" class="dot last"/>
      <g id="trHover" style="display:none"><line id="trCross" y1="10" y2="${240-24}" class="cross"/><circle id="trDot" r="5" class="dot"/></g>
      <rect x="44" y="0" width="664" height="240" fill="transparent" id="trHit"/>`;
    const vmax=Math.max(...V,1), bw=Math.max(2,(720-56)/n*.55);
    $('trVol').innerHTML=V.map((v,k)=>v?`<rect x="${(X(k)-bw/2).toFixed(1)}" y="${(52-v/vmax*44).toFixed(1)}" width="${bw.toFixed(1)}" height="${(v/vmax*44).toFixed(1)}" rx="2" class="vb"/>`:'').join('');
    const ticks=[0,Math.round((n-1)/3),Math.round(2*(n-1)/3),n-1];
    $('trAxis').innerHTML=ticks.map(k=>`<span style="left:${X(k)/720*100}%">${k===n-1?'Today':dayLabel(n-1-k)}</span>`).join('');
    const chg=(H[n-1]/H[0]-1)*100;
    $('trChg').innerHTML=`<i class="${chg>=0?'up':'dn'}">${chg>=0?'▲':'▼'} ${chg>=0?'+':''}${chg.toFixed(1)}%</i> over ${range} days`;
    // hover: crosshair + tooltip
    const hit=$('trHit'), hov=$('trHover'), tip=$('trTip'), plot=$('trPlot');
    hit.onpointermove=e=>{ const bx=plot.getBoundingClientRect(), px=(e.clientX-bx.left)/bx.width*720, k=Math.max(0,Math.min(n-1,Math.round((px-44)/((720-56)/(n-1)))));
      hov.style.display=''; $('trCross').setAttribute('x1',X(k)); $('trCross').setAttribute('x2',X(k)); $('trDot').setAttribute('cx',X(k)); $('trDot').setAttribute('cy',Y(H[k]));
      tip.style.display='block'; tip.innerHTML=`<small>${k===n-1?'Today':dayLabel(n-1-k)}</small><b>◎ ${fmt(H[k])}</b>${V[k]?`<small>${Math.round(V[k]/H[k])} sale${V[k]/H[k]>1.5?'s':''}</small>`:''}`;
      const lx=X(k)/720*bx.width; tip.style.left=Math.min(bx.width-130,Math.max(0,lx+12))+'px'; tip.style.top=(Y(H[k])/240*bx.height-20)+'px'; };
    hit.onpointerleave=()=>{ hov.style.display='none'; tip.style.display='none'; };
  }
  let curX=null;
  function openTrade(x){ curX=x;
    const n=x.n, g=rng(5000+x.id*7), [c1]=RCOL[n.r];
    tr.style.setProperty('--rc',c1); series(x);
    $('trImg').src=img(n); $('trImg').style.objectPosition=n.pos||'50% 50%';
    $('trCh').textContent=`RONIN #${String(x.i+1).padStart(3,'0')} · ${n.jt}`; $('trT').textContent=n.t; $('trR').textContent=n.r;
    $('trEd').textContent=`Edition #${x.ed} of ${n.e}`; $('trP').textContent=x.price; $('trSeller').textContent=`Seller ${x.seller}`;
    const same=L.filter(y=>y.i===x.i), floor=Math.min(...same.map(y=>y.price),x.price*R(.9,.97));
    const last=hist[hist.length-1], d1=(last/hist[hist.length-2]-1)*100, vol7=vols.slice(-7).reduce((a,b)=>a+b,0);
    const rank=[...NFTS].sort((a,b)=>a.e-b.e).indexOf(n)+1, holders=Math.round(n.e*R(.62,.8));
    const tile=(k,v,s='')=>`<div class="st"><small>${k}</small><b>${v}</b>${s?`<span>${s}</span>`:''}</div>`;
    $('trStats').innerHTML=tile('Floor','◎ '+fmt(floor))+tile('Last sale','◎ '+fmt(last))
      +tile('24h',`<i class="${d1>=0?'up':'dn'}">${d1>=0?'▲ +':'▼ '}${d1.toFixed(1)}%</i>`)+tile('7d volume','◎ '+fmt(vol7))
      +tile('Holders',holders,`of ${n.e}`)+tile('Listed',same.length,`${(same.length/n.e*100).toFixed(1)}%`)
      +tile('Rarity rank',`#${rank}`,`of ${NFTS.length}`)+tile('vs mint',`<i class="${x.up>=0?'up':'dn'}">${x.up>=0?'+':''}${x.up}%</i>`);
    let ago=0; $('trSales').innerHTML=Array.from({length:6},(_,k)=>{ if(k)ago+=1+Math.floor(g()*4); const v=hist[Math.max(0,hist.length-1-ago)];
      return `<tr><td>${ago?ago+'d ago':'today'}</td><td>◎ ${fmt(v)}</td><td>${addr(g)}</td><td>${addr(g)}</td></tr>`; }).join('');
    $('trOffers').innerHTML=Array.from({length:4},(_,k)=>{ const v=x.price*(.95-k*R(.04,.08));
      return `<tr><td>◎ ${fmt(v)}</td><td class="dn">${((v/x.price-1)*100).toFixed(0)}%</td><td>${addr(g)}</td><td>${1+Math.floor(g()*6)}d</td></tr>`; }).join('');
    range=30; $('trRange').querySelectorAll('button').forEach(b=>b.classList.toggle('on',+b.dataset.d===30)); drawChart();
    tr.setAttribute('aria-hidden','false'); tr.classList.add('on'); document.body.style.overflow='hidden';
  }
  const close=()=>{ tr.classList.remove('on'); tr.setAttribute('aria-hidden','true'); document.body.style.overflow=''; };
  $('trX').onclick=close; tr.onclick=e=>{ if(e.target===tr)close(); }; addEventListener('keydown',e=>{ if(e.key==='Escape'&&tr.classList.contains('on'))close(); });
  $('trRange').onclick=e=>{ const b=e.target.closest('button'); if(!b)return; range=+b.dataset.d; $('trRange').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b)); drawChart(); };
  $('trBuy').onclick=()=>checkout({kind:'listing',x:curX}); $('trOffer').onclick=openMarket;
})();

/* ---------- luck.html: draw your fate ---------- */
(function(){
  const stage=$('fate'); if(!stage)return;
  const tiers=['Legendary','Epic','Rare','Common'].map(r=>({r,e:NFTS.filter(n=>n.r===r).reduce((a,n)=>a+n.e,0)})).filter(t=>t.e);
  $('fOdds').innerHTML=tiers.map(t=>`<div class="fo" style="--rc:${RCOL[t.r][0]}"><span>${t.r}</span><b>${(t.e/TOTAL*100).toFixed(1)}%</b><i style="width:${t.e/TOTAL*100}%"></i></div>`).join('');
  $('fPrice').textContent=CONFIG.mintPrice; $('fSupply').textContent=TOTAL.toLocaleString('en-US'); $('fArt').textContent=NFTS.length;
  const live=!!CONFIG.mintUrl; $('fDraw').querySelector('span').textContent=`Draw · ◎ ${CONFIG.mintPrice}`;
  $('fMode').textContent=live?'Mint is live':'Mint opens soon';
  // countdown when a date is set
  if(CONFIG.mintDate){ const end=new Date(CONFIG.mintDate); const tick=()=>{ const s=Math.max(0,(end-new Date())/1000|0);
    $('fMode').textContent=s?`Mint opens in ${Math.floor(s/86400)}d ${Math.floor(s%86400/3600)}h ${Math.floor(s%3600/60)}m ${s%60}s`:'Mint is live'; }; tick(); setInterval(tick,1000); }
  const flash=$('fFlash'), res=$('fResult'), reel=$('reel'), track=$('reelTrack');
  const pick=()=>{ let x=Math.random()*TOTAL; for(const n of NFTS){ x-=n.e; if(x<=0)return n; } return NFTS[NFTS.length-1]; };
  // the reel: every card in the collection, repeated so it loops seamlessly
  const cardHTML=n=>`<div class="rc" data-r="${n.r}" style="--rc:${RCOL[n.r][0]}"><div class="rc-in"><img src="${img(n)}" alt="${n.t}" style="object-position:${n.pos||'50% 50%'}"><span class="rc-r">${n.r}</span><b>${n.t}</b></div></div>`;
  let IW=0, Lp=0, copies=0, offset=0, speed=.45, spin=null, busy=false, landed=false;   // landed: the reel holds still on the drawn card
  function build(){
    track.innerHTML=NFTS.map(cardHTML).join('');
    const first=track.firstElementChild; IW=first.getBoundingClientRect().width+parseFloat(getComputedStyle(track).columnGap||getComputedStyle(track).gap||0);
    Lp=IW*NFTS.length; copies=Math.ceil(reel.clientWidth/Lp)+2;
    track.innerHTML=Array.from({length:copies},()=>NFTS.map(cardHTML).join('')).join('');
  }
  build(); addEventListener('resize',()=>{ if(!busy&&!landed)build(); });
  const loop=t=>{
    if(spin){ const f=Math.min(1,(t-spin.t0)/spin.dur), e=1-Math.pow(1-f,4); const prev=offset; offset=spin.from+(spin.to-spin.from)*e;
      reel.classList.toggle('blur',offset-prev>18); if(f>=1){ const s=spin; spin=null; s.done(); } }
    else if(!busy&&!landed&&!still) offset+=speed;
    track.style.transform=`translate3d(${-(offset%Lp)}px,0,0)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  function draw(){
    if(busy)return; busy=true; landed=false; res.classList.remove('on'); stage.classList.remove('done');
    track.querySelectorAll('.rc').forEach(c=>c.classList.remove('win','dim'));
    const n=pick(), t=NFTS.indexOf(n), [c1,c2]=RCOL[n.r];
    stage.classList.add('rumble'); fx.burst(innerWidth/2,innerHeight*.5,30,'#0c0c0c');
    setTimeout(()=>{
      stage.classList.remove('rumble');
      const cx=reel.clientWidth/2, now=offset%Lp;
      const delta=(((t*IW+(IW-parseFloat(getComputedStyle(track).gap||0))/2-cx-now)%Lp)+Lp)%Lp;
      offset=now; spin={t0:performance.now(),dur:still?10:3600,from:now,to:now+Lp*(4+Math.floor(Math.random()*2))+delta,done:()=>{
        reel.classList.remove('blur');
        // light up the card that stopped in the window
        track.style.transform=`translate3d(${-(offset%Lp)}px,0,0)`;
        const cards=[...track.querySelectorAll('.rc')], half=(IW-parseFloat(getComputedStyle(track).gap||0))/2;
        let best=0, bd=1e9; cards.forEach((c,k)=>{ c.classList.add('dim'); if(k%NFTS.length!==t)return; const d=Math.abs(k*IW+half-(offset%Lp)-cx); if(d<bd){bd=d;best=k;} });
        cards[best].classList.remove('dim'); cards[best].classList.add('win');
        stage.style.setProperty('--c1',c1); stage.style.setProperty('--c2',c2); stage.classList.add('done');
        flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');
        fx.burst(innerWidth/2,reel.getBoundingClientRect().top+reel.clientHeight/2,n.r==='Legendary'?160:n.r==='Epic'?90:50,c1);
        if(n.r==='Legendary'){ fx.rays(c1); document.body.classList.add('quake'); setTimeout(()=>document.body.classList.remove('quake'),700); }
        $('fRr').textContent=n.r; $('fRt').textContent=n.t; $('fRj').textContent=n.jt;
        $('fRo').textContent=`1 of ${n.e} editions · ${(n.e/TOTAL*100).toFixed(1)}% chance · est. value ◎ ${n.p}`;
        $('fRnote').textContent=live?'':'Nothing was minted yet: the mint opens soon.';
        res.classList.add('on'); landed=true; busy=false;
        setTimeout(()=>{ const r=res.getBoundingClientRect(); if(r.bottom>innerHeight)scrollBy({top:r.bottom-innerHeight+24,behavior:'smooth'}); },300);
      }};
    },500);
  }
  $('fAgain').onclick=()=>{ track.querySelectorAll('.rc').forEach(c=>c.classList.remove('win','dim')); stage.classList.remove('done'); draw(); };
  $('fDraw').onclick=()=>{ if(live)window.open(CONFIG.mintUrl,'_blank','noopener'); draw(); };
  $('fMint').onclick=()=>checkout({kind:'mint'});

  /* sky: moon dust, petals and fireflies around the torii */
  const fx=(function(){
    const cv=$('fSky'); let c,W,H,parts=[],rays=null;
    const size=()=>{ ({c,w:W,h:H}=fit(cv)); };
    size(); addEventListener('resize',size);
    for(let i=0;i<70;i++)parts.push({k:i%3?'m':'p',x:R(0,W),y:R(0,H),s:i%3?R(.8,2.4):R(5,11),vx:R(-.2,.5),vy:i%3?R(-.35,-.05):R(.4,1.1),w:R(0,6),a:R(0,6)});
    const api={ burst(x,y,n,col){ const b=cv.getBoundingClientRect(); x-=b.left; y-=b.top;   // callers pass viewport coordinates
      for(let i=0;i<n;i++){const a=R(0,6.283),v=R(1,7);parts.push({k:'e',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1,l:1,s:R(1,3.2),col});} },
      rays(col){ rays={col,l:1}; } };
    const loop=()=>{ c.clearRect(0,0,W,H);
      if(rays){ c.save(); c.translate(W/2,H*.48); c.globalCompositeOperation='screen';
        for(let k=0;k<14;k++){ c.rotate(Math.PI*2/14); const g=c.createLinearGradient(0,0,0,-Math.max(W,H)); g.addColorStop(0,rays.col+'aa'); g.addColorStop(1,rays.col+'00');
          c.globalAlpha=rays.l*.5; c.fillStyle=g; c.beginPath(); c.moveTo(-14,0); c.lineTo(14,0); c.lineTo(70,-Math.max(W,H)); c.lineTo(-70,-Math.max(W,H)); c.fill(); }
        c.restore(); rays.l-=.006; if(rays.l<=0)rays=null; }
      parts=parts.filter(p=>{
        if(p.k==='e'){ p.x+=p.vx; p.y+=p.vy; p.vy+=.03; p.vx*=.98; p.l-=.011; if(p.l<=0)return false;
          c.globalAlpha=p.l; c.fillStyle=p.col; c.shadowColor=p.col; c.shadowBlur=14; c.beginPath(); c.arc(p.x,p.y,p.s,0,6.283); c.fill(); c.shadowBlur=0; c.globalAlpha=1; return true; }
        p.w+=.03; p.x+=p.vx+Math.sin(p.w)*.4; p.y+=p.vy; if(p.y<-20)p.y=H+20; if(p.y>H+20)p.y=-20; if(p.x>W+20)p.x=-20;
        if(p.k==='m'){ c.globalAlpha=.18+Math.sin(p.w*2)*.1; c.fillStyle='#0c0c0c'; c.beginPath(); c.arc(p.x,p.y,p.s*.8,0,6.283); c.fill(); c.globalAlpha=1; }   // drifting ink dust
        else { p.a+=.02; c.save(); c.translate(p.x,p.y); c.rotate(p.a); c.scale(1,.55+Math.sin(p.w*2)*.3); c.fillStyle='#ffc6d9'; c.globalAlpha=.85;
          c.beginPath(); c.moveTo(-p.s,0); c.quadraticCurveTo(0,-p.s*.75,p.s,0); c.quadraticCurveTo(0,p.s*.75,-p.s,0); c.fill(); c.restore(); }
        return true; });
      if(!still)requestAnimationFrame(loop); };
    loop(); return api;
  })();
})();

/* ---------- page-wide foil on buttons + cursor light + hero motes ---------- */
(function(){
  document.querySelectorAll('.btn').forEach((el,i)=>{
    el.classList.add('fx'); el.style.setProperty('--d',(i%7*.9)+'s');
    el.insertAdjacentHTML('beforeend','<i class="fx-holo"></i><i class="fx-glare"></i><i class="fx-sweep"></i>');
    if(touch)return;
    const tl=Math.max(2,Math.min(10,2600/Math.max(el.offsetWidth,1)));
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      el.style.setProperty('--mx',x*100+'%');el.style.setProperty('--my',y*100+'%');el.style.setProperty('--o',1);
      if(!still){el.style.transition='transform .08s';el.style.setProperty('--ry',(x-.5)*tl+'deg');el.style.setProperty('--rx',(.5-y)*tl+'deg');}});
    el.addEventListener('pointerleave',()=>{el.style.transition='';el.style.setProperty('--o',0);el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg');});
  });
  const cl=$('cl');
  if(!touch)addEventListener('pointermove',e=>{cl.style.transform=`translate(${e.clientX}px,${e.clientY}px)`},{passive:true}); else cl.remove();
  const sky=document.querySelector('.sky');
  if(sky&&!still)for(let k=0;k<16;k++){const m=document.createElement('i');m.className='mote';
    m.style.cssText=`left:${Math.random()*100}%;bottom:${8+Math.random()*14}%;--t:${9+Math.random()*9}s;--d:${-Math.random()*14}s;--dx:${(Math.random()-.5)*160}px;transform:scale(${.5+Math.random()})`;
    sky.appendChild(m);}
})();

/* ---------- boot ---------- */
buildSun();
document.fonts.ready.then(drawSky);
let rt; addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(drawSky,200);});

/* ---------- wallet + checkout ----------
   Connecting a wallet happens right here (Phantom, Solflare, Backpack).
   Paying never happens here as a plain SOL transfer: the mint contract (Candy Machine / launchpad)
   or the marketplace takes the payment and hands over the NFT in the same transaction.
   So "Confirm & pay" sends the buyer to CONFIG.mintUrl / CONFIG.marketUrl, and stays off until those exist. */
(function(){
  const WALLETS=[
    {id:'phantom',name:'Phantom',get:()=>window.phantom?.solana||(window.solana?.isPhantom?window.solana:null),url:'https://phantom.app/download'},
    {id:'solflare',name:'Solflare',get:()=>window.solflare?.isSolflare?window.solflare:null,url:'https://solflare.com/download'},
    {id:'backpack',name:'Backpack',get:()=>window.backpack?.solana||window.backpack||null,url:'https://backpack.app/download'},
  ];
  const RPC=CONFIG.rpc||'https://api.mainnet-beta.solana.com';
  const short=a=>a.slice(0,4)+'…'+a.slice(-4);
  let prov=null, addr='', bal=null, pending=null;

  // nav button
  document.querySelectorAll('nav .wl-link').forEach(a=>a.insertAdjacentHTML('beforebegin','<button class="wbtn" id="wBtn"><i></i><span>Connect wallet</span></button>'));
  document.body.insertAdjacentHTML('beforeend',`
  <div class="wm" id="wModal" aria-hidden="true" role="dialog" aria-label="Connect a wallet"><div class="wm-box">
    <button class="wm-x" data-close>✕</button>
    <div class="eyebrow">Solana</div><h3>Connect a wallet</h3>
    <p class="wm-sub">Your wallet stays yours: connecting only shares your public address. Nothing is ever charged without your signature.</p>
    <div class="wm-list" id="wList"></div>
  </div></div>
  <div class="wm" id="coModal" aria-hidden="true" role="dialog" aria-label="Checkout"><div class="wm-box co">
    <button class="wm-x" data-close>✕</button>
    <div class="eyebrow" id="coEye">Checkout</div><h3 id="coTitle"></h3>
    <div class="co-item"><div class="co-art" id="coArt"></div><div><b id="coName"></b><small id="coMeta"></small></div></div>
    <dl class="co-sum">
      <div><dt id="coLine">Price</dt><dd id="coPrice"></dd></div>
      <div><dt>Network fee</dt><dd>≈ ◎ 0.00001</dd></div>
      <div id="coRentRow"><dt>NFT account (rent)</dt><dd>≈ ◎ 0.012</dd></div>
      <div class="tot"><dt>Total</dt><dd id="coTotal"></dd></div>
    </dl>
    <div class="co-wallet" id="coWallet"></div>
    <button class="btn co-pay" id="coPay">Confirm &amp; pay</button>
    <p class="co-note" id="coNote"></p>
  </div></div>`);
  const btn=$('wBtn'), wm=$('wModal'), co=$('coModal');
  const open=m=>{ m.classList.add('on'); m.setAttribute('aria-hidden','false'); };
  const close=m=>{ m.classList.remove('on'); m.setAttribute('aria-hidden','true'); };
  [wm,co].forEach(m=>{ m.onclick=e=>{ if(e.target===m||e.target.hasAttribute('data-close'))close(m); }; });
  addEventListener('keydown',e=>{ if(e.key==='Escape'){ close(wm); close(co); } });

  function paint(){
    if(btn){ btn.classList.toggle('on',!!addr); btn.querySelector('span').textContent=addr?`${short(addr)}${bal!=null?' · ◎ '+bal.toFixed(2):''}`:'Connect wallet'; }
    $('wList').innerHTML=WALLETS.map(w=>{ const has=!!w.get(); return `<button class="wm-w" data-w="${w.id}"><span class="wm-logo ${w.id}">${w.name[0]}</span><b>${w.name}</b><em>${addr&&prov===w.get()?'Connected':has?'Detected':'Install'}</em></button>`; }).join('')
      +(addr?`<button class="wm-dis" id="wDis">Disconnect ${short(addr)}</button>`:'');
    if(co.classList.contains('on'))fillCheckout();
  }
  async function balance(){
    try{ const r=await fetch(RPC,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'getBalance',params:[addr]})});
      const j=await r.json(); bal=j.result.value/1e9; }catch(_){ bal=null; }
    paint();
  }
  async function connect(w){
    const p=w.get(); if(!p){ window.open(w.url,'_blank','noopener'); return; }
    try{ const res=await p.connect(); prov=p; addr=(res?.publicKey||p.publicKey).toString(); try{localStorage.setItem('ronin-wallet',w.id)}catch(_){}
      p.on?.('disconnect',()=>{ addr=''; bal=null; paint(); });
      p.on?.('accountChanged',pk=>{ if(pk){ addr=pk.toString(); balance(); } });
      close(wm); toast('Wallet connected'); paint(); balance(); if(pending){ const k=pending; pending=null; checkout(k); }
    }catch(e){ toast('Connection cancelled'); }
  }
  wm.addEventListener('click',async e=>{
    const b=e.target.closest('[data-w]'); if(b)return connect(WALLETS.find(w=>w.id===b.dataset.w));
    if(e.target.id==='wDis'){ try{ await prov?.disconnect(); }catch(_){} addr=''; bal=null; prov=null; try{localStorage.removeItem('ronin-wallet')}catch(_){} paint(); toast('Wallet disconnected'); }
  });
  if(btn)btn.onclick=()=>{ paint(); open(wm); };
  // reconnect silently if this wallet already trusts the site
  (async()=>{ let id=null; try{id=localStorage.getItem('ronin-wallet')}catch(_){} const w=WALLETS.find(x=>x.id===id); const p=w&&w.get();
    if(p){ try{ const r=await p.connect({onlyIfTrusted:true}); prov=p; addr=(r?.publicKey||p.publicKey).toString(); paint(); balance(); }catch(_){} } paint(); })();

  let cur=null;
  function fillCheckout(){
    const k=cur, mint=k.kind==='mint', n=mint?null:k.x.n, price=mint?CONFIG.mintPrice:k.x.price, total=price+0.00001+(mint?0.012:0);
    const live=mint?!!CONFIG.mintUrl:!!CONFIG.marketUrl;
    $('coEye').textContent=mint?'Mint · random draw':'Buy from a holder';
    $('coTitle').textContent=mint?'Mint a random RONIN':`Buy ${n.t}`;
    $('coArt').innerHTML=mint?'<span class="jp">運</span>':`<img src="${img(n)}" alt="" style="object-position:${n.pos||'50% 50%'}">`;
    $('coArt').style.setProperty('--rc',mint?'#3c6f9e':RCOL[n.r][0]);
    $('coName').textContent=mint?'Random piece · fate decides':`${n.t} · #${k.x.ed}/${n.e}`;
    $('coMeta').textContent=mint?`Legendary ${(NFTS.filter(x=>x.r==='Legendary').reduce((a,x)=>a+x.e,0)/TOTAL*100).toFixed(1)}% · ${TOTAL} pieces`:`${n.r} · seller ${k.x.seller}`;
    $('coLine').textContent=mint?'Mint price':'Listed price';
    $('coPrice').textContent='◎ '+price; $('coRentRow').hidden=!mint; $('coTotal').textContent='◎ '+total.toFixed(3);
    const enough=bal==null||bal>=total;
    $('coWallet').innerHTML=addr?`<span class="dot ok"></span>${short(addr)}<b>${bal!=null?'◎ '+bal.toFixed(3):'balance…'}</b>${enough?'':'<em>Not enough SOL</em>'}`:`<span class="dot"></span>No wallet connected<button class="co-con" id="coCon">Connect</button>`;
    const pay=$('coPay');
    pay.disabled=!addr||!live||!enough;
    pay.textContent=!addr?'Connect a wallet to pay':!live?(mint?'Mint opens soon':'Trading opens after the mint'):!enough?'Not enough SOL':'Confirm & pay';
    $('coNote').textContent=live?'You’ll sign the purchase in your wallet on the '+(mint?'mint':'marketplace')+' page. The NFT lands in your wallet in the same transaction.'
      :'Nothing can be charged yet. Connect now and you’ll be ready the moment it opens.';
    const c=$('coCon'); if(c)c.onclick=()=>{ pending=cur; close(co); paint(); open(wm); };
  }
  checkout=k=>{ cur=k; fillCheckout(); open(co); };
  $('coPay').onclick=()=>{ const u=cur.kind==='mint'?CONFIG.mintUrl:CONFIG.marketUrl; if(u)window.open(u,'_blank','noopener'); };
})();
