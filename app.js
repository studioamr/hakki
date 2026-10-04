/* RONIN · shared script for index.html, cards.html, draw.html and profile.html
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
/* two worlds, one script: RONIN (day, the root pages) and ONI (night, the pages in oni/) */
const ONI=document.documentElement.dataset.world==='oni';
const ROOT=ONI?'../':'';
const BR=ONI?'ONI':'RONIN', br=ONI?'demon':'ronin';
const SKY=ONI?{bg:'#25203c',dot:'#090b18',sh:'#3b3560',hill:'#140c14',blade:'#4a0f1a',tip:'#8e1b2b',line:'#05050a'}
             :{bg:'#efe9dc',dot:'#3c6f9e',sh:'#7d97ad',hill:'#55722a',blade:'#2f4514',tip:'#8aa548',line:INK};
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
const RONIN_NFTS=[
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
  {f:'sakura-rain',t:'Sakura Rain',jt:'桜雨',r:'Epic',e:100,p:1.6,fx:'petals',bg:'pink-field',d:'Eyes closed under falling blossoms. He stopped running long enough to hear the pond.'},
  {f:'mist-path',t:'Mist Path',jt:'霧の道',r:'Common',e:200,p:0.5,fx:'clouds',bg:'cedar-path',d:'He can only see three steps ahead. Three steps is enough.'},
  {f:'blossom-rest',t:'Blossom Rest',jt:'花の休み',r:'Rare',e:150,p:0.9,fx:'petals',bg:'bamboo',d:'Back to the moss, sword across his knees. Even a ronin is allowed to sit.'},
  {f:'spring-dream',t:'Spring Dream',jt:'春の夢',r:'Epic',e:100,p:1.7,fx:'petals',bg:'pink-field',d:'Lying in the flowers, petals on his chest. He dreams of nothing, and that is the gift.'},
  {f:'river-stone',t:'River Stone',jt:'川の石',r:'Rare',e:150,p:1,fx:'bubbles',bg:'falls',d:'The water moves around him. He does not move at all.'},
  {f:'white-earth',t:'White Earth',jt:'白い大地',r:'Legendary',e:36,p:3.2,fx:'dust',bg:'stillness',d:'Cracked ground, empty sky, one figure. Nothing left to lose, nothing left to prove.'},
  {f:'the-circle',t:'The Circle',jt:'円',r:'Legendary',e:33,p:3.8,fx:'dust',bg:'dojo',d:'Kneeling in the sand ring, blades laid down. The fight he chose not to have.'},
  {f:'first-light',t:'First Light',jt:'初光',r:'Epic',e:100,p:1.8,fx:'rays',bg:'above-clouds',d:'Knee deep in the rice fields as the sun breaks through. Every morning is another start.'},
  {f:'cosmos-walk',t:'Cosmos Walk',jt:'秋桜',r:'Rare',e:150,p:0.9,fx:'petals',bg:'pink-field',d:'A field of cosmos and a sky full of clouds. He walks it slowly on purpose.'},
  {f:'green-silence',t:'Green Silence',jt:'緑の静寂',r:'Common',e:200,p:0.5,fx:'seeds',bg:'meadow',d:'The wind combs the grass. He sits in the middle of it and lets it.'},
  {f:'footprints',t:'Footprints',jt:'足跡',r:'Rare',e:150,p:1,fx:'snow',bg:'sumi',d:'A line of steps in fresh snow. The path is only visible behind you.'},
  {f:'summit',t:'The Summit',jt:'頂',r:'Legendary',e:28,p:4.8,fx:'snow',bg:'above-clouds',d:'The top of the mountain, the wind, and no one to tell. He climbed it for himself.'},
  {f:'winter-wind',t:'Winter Wind',jt:'冬の風',r:'Common',e:200,p:0.6,fx:'snow',bg:'stillness',d:'Sun on the snow, flowers pushing through. Winter never wins for good.'},
];
/* the night world: the ronin's other face. Seven sins, seven shadows of the same man; every fall of the ronin had one of these names. */
const ONI_NFTS=[
  {f:'spec-pride',t:'Pride',jt:'傲慢',r:'Legendary',e:30,p:5,wide:1,wpos:'50% 24%',fx:'clouds',bg:'oni-castle',d:'The ronin on the highest roof with a crown he swore he never wanted. The day he forgets where he came from, this is who he becomes.'},
  {f:'spec-wrath',t:'Wrath',jt:'憤怒',r:'Legendary',e:33,p:4.5,fx:'embers',bg:'oni-hellgate',d:'Every insult he ever swallowed, still burning. His own hand on the sword, and nothing left to protect.'},
  {f:'spec-lust',t:'Lust',jt:'色欲',r:'Epic',e:100,p:1.8,fx:'petals',bg:'oni-lake',d:'The bridge he keeps crossing toward what he wants. He never reaches the other side.'},
  {f:'spec-greed',t:'Greed',jt:'強欲',r:'Epic',e:100,p:1.7,fx:'dust',bg:'oni-hellgate',d:'Kneeling over gold in the dark, still counting. The ronin who forgot that enough was the whole point.'},
  {f:'spec-envy',t:'Envy',jt:'嫉妬',r:'Rare',e:150,p:1,fx:'dust',bg:'oni-lake',d:'A wall of masks, every face he wanted instead of his own. Behind the cracked one, it is still him.'},
  {f:'spec-gluttony',t:'Gluttony',jt:'暴食',r:'Rare',e:150,p:0.9,fx:'embers',bg:'oni-hellgate',d:'The feast never ends and he never fills. The hunger is the only thing he really eats.'},
  {f:'spec-sloth',t:'Sloth',jt:'怠惰',r:'Common',e:200,p:0.5,fx:'clouds',bg:'oni-castle',d:'He will start tomorrow. The sword rusts under the vines while his shadow melts off the roof.'},
];
const NFTS=ONI?ONI_NFTS:RONIN_NFTS;
NFTS.forEach((n,i)=>n.ch=ROMAN(i+1));
const TOTAL=NFTS.reduce((a,n)=>a+n.e,0);
const RCOL={Common:['#a8a196','#efe9dc'],Rare:['#4fa3ff','#d8ecff'],Epic:['#c06bff','#f0d6ff'],Legendary:['#f3c22f','#fff4c2']};
const img=n=>`${ROOT}img/coleccion/${n.f}.webp`;
const scene=f=>`${ROOT}img/escenas/${f}.webp`;
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
  // phone menu: the links live in a dropdown behind ☰
  if(nav){ const w=nav.querySelector('.wrap'); w.insertAdjacentHTML('beforeend','<button class="nav-burger" id="navBurger" aria-label="Menu" aria-expanded="false"><i></i><i></i><i></i></button>');
    const b=$('navBurger'); b.onclick=()=>{ const o=nav.classList.toggle('open'); b.setAttribute('aria-expanded',o); };
    nav.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',()=>{ nav.classList.remove('open'); b.setAttribute('aria-expanded','false'); })); }
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
  c.fillStyle=SKY.bg; c.fillRect(0,0,w,h);
  const n=noise2(5), cell=w<600?5:6.5;
  const fbm=(x,y)=>{let v=0,a=.55,f=1;for(let o=0;o<5;o++){v+=a*n(x*f,y*f);a*=.5;f*=2.03;}return v;};
  const hill=x=>h*.8-Math.sin(x/w*2.6+.4)*h*.05-(x/w)*h*.04;
  for(let y=0;y<h;y+=cell)for(let x=0;x<w;x+=cell){
    const off=(y/cell)%2?cell/2:0, X=x+off;
    if(y>hill(X))continue;
    const cl=fbm(X/260,y/170)+(y/h)*.18-.25;
    const e=Math.max(0,Math.min(1,(cl-.43)/.05));
    if(e<1){ c.fillStyle=SKY.dot; c.beginPath(); c.arc(X,y,cell*.64*(1-e*.7),0,6.283); c.fill(); }
    else { const sh=Math.max(0,Math.min(1,(.62-cl)*2.2));
      if(sh>.05){ c.fillStyle=SKY.sh; c.beginPath(); c.arc(X,y,cell*.42*Math.sqrt(sh),0,6.283); c.fill(); } }
  }
  if(ONI){ const st=rng(21); for(let i=0;i<w*h*.00035;i++){ const x=st()*w,y=st()*hill(x)*.92, s2=st();
      c.fillStyle=s2>.9?'#f1d9a6':'#e9e4f5'; c.globalAlpha=.35+st()*.65; c.beginPath(); c.arc(x,y,s2>.96?1.6:.8,0,6.283); c.fill(); } c.globalAlpha=1; }
  c.beginPath(); c.moveTo(0,h); for(let x=0;x<=w;x+=4)c.lineTo(x,hill(x)); c.lineTo(w,h); c.closePath();
  c.fillStyle=SKY.hill; c.fill();
  const r=rng(9); c.strokeStyle=SKY.blade; c.lineWidth=1;
  for(let i=0;i<w*h*.0035;i++){const x=r()*w,y=hill(x)+r()*(h-hill(x));c.globalAlpha=.25+r()*.5;c.beginPath();c.moveTo(x,y);c.lineTo(x+(r()-.5)*3,y-3-r()*6);c.stroke();}
  c.globalAlpha=1; c.fillStyle=SKY.tip;
  for(let i=0;i<w*h*.002;i++){const x=r()*w,y=hill(x)+r()*(h-hill(x))*.7;c.globalAlpha=.3+r()*.4;c.fillRect(x,y,1.2,2.4+r()*3);}
  c.globalAlpha=1; c.strokeStyle=SKY.line; c.lineWidth=2.2; c.beginPath(); for(let x=0;x<=w;x+=4)(x?c.lineTo:c.moveTo).call(c,x,hill(x)+Math.sin(x*.21)*1.2); c.stroke();
}
function moonMarkup(){   // a real full moon: pale disc, soft maria, a few craters, no rays
  const r=rng(11); let cr='';
  for(let k=0;k<14;k++){ const a=r()*6.283, d=Math.sqrt(r())*50, x=Math.cos(a)*d, y=Math.sin(a)*d, rr=2+r()*(k<4?7:3.5);
    cr+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="#8f8a7c" opacity=".38"/><circle cx="${(x-rr*.25).toFixed(1)}" cy="${(y-rr*.25).toFixed(1)}" r="${(rr*.7).toFixed(1)}" fill="#f6f1e3" opacity=".35"/>`; }
  return `<defs><radialGradient id="moonG" cx="38%" cy="34%" r="75%"><stop offset="0" stop-color="#fffbf1"/><stop offset=".55" stop-color="#ebe4d1"/><stop offset="1" stop-color="#b8b19f"/></radialGradient>
    <clipPath id="moonC"><circle r="62"/></clipPath></defs>
    <circle r="62" fill="url(#moonG)"/>
    <g clip-path="url(#moonC)" fill="#9c9686" opacity=".42">
      <path d="M-34,-30 C-20,-42 2,-36 6,-22 C10,-8 -6,-2 -18,-6 C-30,-10 -44,-18 -34,-30Z"/>
      <path d="M8,-6 C22,-14 38,-6 36,8 C34,22 18,26 8,18 C0,12 -2,2 8,-6Z"/>
      <path d="M-26,10 C-16,6 -6,14 -10,26 C-14,36 -30,36 -36,26 C-40,18 -34,12 -26,10Z"/>
      <path d="M18,30 C26,28 32,36 28,44 C24,50 14,48 12,40 C10,34 12,32 18,30Z"/></g>
    <g clip-path="url(#moonC)">${cr}</g>
    <circle r="62" fill="none" stroke="#05050a" stroke-width="2.5" opacity=".55"/>`;
}
function sunMarkup(){ if(ONI)return moonMarkup();
  const r=rng(3); let d='';
  for(let k=0;k<16;k++){
    const a=k/16*Math.PI*2, L=78+(k%2?0:12)+r()*6, base=44, sp=.13, wig=(k%2?1:-1)*8;
    const P=(rad,ang)=>[Math.cos(ang)*rad,Math.sin(ang)*rad];
    const [x1,y1]=P(base,a-sp),[x2,y2]=P(base,a+sp),[tx,ty]=P(L,a);
    const [m1x,m1y]=P((base+L)/2,a-sp*.3+wig/100),[m2x,m2y]=P((base+L)/2,a+sp*.3+wig/100);
    d+=`M${x1.toFixed(1)},${y1.toFixed(1)} Q${(m1x+wig*Math.cos(a+1.57)).toFixed(1)},${(m1y+wig*Math.sin(a+1.57)).toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)} Q${(m2x+wig*Math.cos(a+1.57)).toFixed(1)},${(m2y+wig*Math.sin(a+1.57)).toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}Z `;
  }
  let sp=''; for(let i=0;i<=200;i++){const t=i/200,a=t*Math.PI*2*2.6,rr=2+t*32;sp+=(i?'L':'M')+(Math.cos(a)*rr).toFixed(1)+','+(Math.sin(a)*rr).toFixed(1);}
  return `<path d="${d}" fill="#f3c22f" stroke="#1d3687" stroke-width="3" stroke-linejoin="round"/>
    <circle r="46" fill="#1d3687"/><circle r="41" fill="#f3c22f"/>
    <path d="${sp}" fill="none" stroke="#1d3687" stroke-width="6.5" stroke-linecap="round"/>`;
}
function buildSun(){ const s=$('sun'); if(s)s.innerHTML=sunMarkup(); }

/* ---------- card back: the hero sky with RONIN on it (painted once, used everywhere as --back) ---------- */
async function paintBack(){
  const W=600,H=840, cv=document.createElement('canvas'); cv.width=W; cv.height=H; const c=cv.getContext('2d');
  c.fillStyle=SKY.bg; c.fillRect(0,0,W,H);
  const n=noise2(11), cell=11, fbm=(x,y)=>{let v=0,a=.55,f=1;for(let o=0;o<5;o++){v+=a*n(x*f,y*f);a*=.5;f*=2.03;}return v;};
  const hill=x=>H*.8-Math.sin(x/W*2.6+.4)*H*.04;
  for(let y=0;y<H;y+=cell)for(let x=0;x<W+cell;x+=cell){ const X=x+((y/cell)%2?cell/2:0); if(y>hill(X))continue;
    const cl=fbm(X/150,y/110)+(y/H)*.18-.25, e=Math.max(0,Math.min(1,(cl-.43)/.05));
    if(e<1){ c.fillStyle=SKY.dot; c.beginPath(); c.arc(X,y,cell*.64*(1-e*.7),0,6.283); c.fill(); }
    else { const sh=Math.max(0,Math.min(1,(.62-cl)*2.2)); if(sh>.05){ c.fillStyle=SKY.sh; c.beginPath(); c.arc(X,y,cell*.42*Math.sqrt(sh),0,6.283); c.fill(); } } }
  c.beginPath(); c.moveTo(0,H); for(let x=0;x<=W;x+=4)c.lineTo(x,hill(x)); c.lineTo(W,H); c.closePath(); c.fillStyle=SKY.hill; c.fill();
  const r=rng(9); c.strokeStyle=SKY.blade; for(let i=0;i<2600;i++){const x=r()*W,y=hill(x)+r()*(H-hill(x));c.globalAlpha=.3+r()*.5;c.beginPath();c.moveTo(x,y);c.lineTo(x+(r()-.5)*3,y-4-r()*6);c.stroke();}
  c.globalAlpha=1; c.strokeStyle=INK; c.lineWidth=3; c.beginPath(); for(let x=0;x<=W;x+=4)(x?c.lineTo:c.moveTo).call(c,x,hill(x)); c.stroke();
  // the spiral sun
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200" width="260" height="260">${sunMarkup()}</svg>`;
  await new Promise(res=>{ const im=new Image(); im.onload=()=>{ c.drawImage(im,W/2-130,H*.5-130,260,260); res(); }; im.onerror=res; im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg); });
  // the title
  try{ await document.fonts.load('900 150px Archivo'); await document.fonts.load('800 40px "Shippori Mincho"'); }catch(_){}
  c.fillStyle=ONI?'#efe6cf':INK; c.textAlign='center'; c.font='900 128px Archivo'; c.save(); c.translate(W/2,H*.27); c.scale(1,1); c.fillText(BR,0,0); c.restore();
  c.font='800 34px "Shippori Mincho"'; c.fillText(ONI?'鬼':'道',W/2,H*.27+56);
  c.font='800 20px Archivo'; c.fillStyle='#f2f0eb'; c.fillText(ONI?'S E V E N   S I N S':'N O   M A S T E R',W/2,H*.93);
  // frame
  c.strokeStyle=ONI?'#05050a':INK; c.lineWidth=10; c.strokeRect(5,5,W-10,H-10); c.lineWidth=2; c.strokeRect(22,22,W-44,H-44);
  document.documentElement.style.setProperty('--back',`url(${cv.toDataURL('image/jpeg',.88)})`);
}
paintBack();

/* ---------- collection grid (landing: first 7 · cards.html: all) ---------- */
let openShrine=()=>{};
(function(){
  const box=$('cards'); if(!box)return;
  const limit=+box.dataset.limit||NFTS.length;
  const reveal=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); reveal.unobserve(e.target); } }),{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  // grouped by rank (draw.html): one row of same-size cards per rarity
  const group=!!box.dataset.group, slots={};
  if(group){ box.classList.add('tiers-wrap'); box.classList.remove('cards');
    ['Legendary','Epic','Rare','Common'].forEach(r=>{ const list=NFTS.filter(n=>n.r===r); if(!list.length)return;
      const e=list.reduce((a,n)=>a+n.e,0);
      box.insertAdjacentHTML('beforeend',`<div class="tier" style="--rc:${RCOL[r][0]}"><div class="tier-h"><i></i><b>${r}</b><span>${list.length} card${list.length>1?'s':''} · ${(e/TOTAL*100).toFixed(1)}% of every draw</span></div><div class="cards tier-grid" data-t="${r}"></div></div>`);
      slots[r]=box.querySelector(`[data-t="${r}"]`); }); }
  NFTS.slice(0,limit).forEach((n,i)=>{
    const c=document.createElement('div'); c.className='card'+(n.wide&&!group?' wide':''); c.dataset.r=n.r;
    c.style.setProperty('--d',(i%7*.7)+'s'); c.style.setProperty('--k',(i%4)*.1+'s');
    c.innerHTML=`<div class="ring"></div><div class="frame"><img src="${img(n)}" alt="${n.t}" loading="lazy" style="object-position:${n.wide&&!group?(n.wpos||'50% 50%'):(n.pos||'50% 50%')}"><div class="holo"></div><div class="sweep"></div><div class="shade"></div><div class="glare"></div></div>${sparks(nSpark[n.r])}
      <div class="info"><div><small>${BR} #${String(i+1).padStart(3,'0')}${box.dataset.odds?` · ${(n.e/TOTAL*100).toFixed(1)}% chance`:''}</small><b>${n.t}</b></div><span class="rar">${n.r}</span></div>`;
    tilt(c); c.onclick=()=>openShrine(i); (group?slots[n.r]:box).appendChild(c); reveal.observe(c);
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
      <div class="sh-seal jp">${ONI?"鬼":"道"}</div>
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
      <a class="rv sh-luck" style="--i:8" href="draw.html">or draw a random ${br} →</a>
    </div>
  </div></div>`);
  const sh=$('shrine'); let cur=0, raf=0, parts=[], mode='petals', birds=[], t=0;
  function fill(i){
    const n=NFTS[i], [c1,c2]=RCOL[n.r];
    sh.style.setProperty('--c1',c1); sh.style.setProperty('--c2',c2);
    $('shImg').src=img(n); $('shImg').style.objectPosition=n.pos||'50% 50%'; $('shBg').src=scene(n.bg||n.f);
    $('shCh').textContent=`第${jnum(i+1)}章`; $('shChEn').textContent=`${BR} #${String(i+1).padStart(3,'0')} · ${n.ch}`;
    $('shT').textContent=n.t; $('shJt').textContent=n.jt; $('shR').textContent=n.r; $('shD').textContent=n.d;
    $('shE').textContent=n.e; $('shN').textContent=`${i+1} / ${NFTS.length}`; $('shP').textContent=n.p;
    $('shNote').textContent=`A random draw costs ◎ ${CONFIG.mintPrice}. To get ${n.t} for sure, buy it from someone who holds one, at their price.`;
    mode=n.fx; cur=i;
  }
  const replay=()=>{ sh.classList.remove('on'); void sh.offsetWidth; sh.classList.add('on'); };
  openShrine=i=>{ fill(i); sh.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; replay(); startSky(); sh.scrollTop=0; };
  const close=()=>{ sh.classList.remove('on'); (document.activeElement?.blur(),sh.setAttribute('aria-hidden','true')); document.body.style.overflow=''; cancelAnimationFrame(raf); raf=0; };
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
    embers:()=>({x:R(0,W),y:R(0,H*1.2),s:R(.8,2.8),vx:R(-.3,.3),vy:R(-1.5,-.4),w:R(0,6)}),
  };
  const COUNT={embers:85,snow:110,petals:55,leaves:34,clouds:16,seeds:40,rays:36,dust:90,bubbles:40};
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
        if(p.k==='petals'){g.addColorStop(0,ONI?'#ff4a5e':'#ffd6e4');g.addColorStop(1,ONI?'#9e0d22':'#f59ab8');} else {g.addColorStop(0,'#c9e27a');g.addColorStop(1,'#5d8a2a');}
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
      case 'embers':{
        p.w+=.06; p.x+=p.vx+Math.sin(p.w)*.5; p.y+=p.vy; wrap(p);
        ctx.globalAlpha=Math.max(0,.55+Math.sin(p.w*3)*.4); ctx.fillStyle='#ff7a3a'; ctx.shadowColor='#ff2a14'; ctx.shadowBlur=12;
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
        <div class="sel"><span class="sel-r">${x.n.r} · </span>seller ${x.seller}</div><button>View · Buy</button></div></div>`).join('');
    $('lstGrid').querySelectorAll('.lst').forEach(el=>{ const go=()=>openTrade(L[+el.dataset.id]); el.onclick=go; el.onkeydown=e=>{if(e.key==='Enter')go();}; });
    // phone carousel: pagination dots follow the swipe
    let dots=$('lstDots'); if(!dots){ $('lstGrid').insertAdjacentHTML('afterend','<div class="lst-dots" id="lstDots"></div>'); dots=$('lstDots'); }
    dots.innerHTML=rows.map((_,k)=>`<i class="${k?'':'on'}"></i>`).join('');
    $('lstGrid').onscroll=()=>{ const g=$('lstGrid'), c=g.firstElementChild; if(!c)return; const k=Math.round(g.scrollLeft/(c.offsetWidth+12)); dots.querySelectorAll('i').forEach((d,j)=>d.classList.toggle('on',j===k)); };
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
    </div>
    <div class="tr-bar"><div><small>Listed</small><b>◎ <span id="trBarP"></span></b></div><button class="btn" id="trBarBuy">Buy now</button></div>
    </div></div>`);
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
    $('trSvg').innerHTML=`<defs><linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${ONI?"#c4152c":"#2f5f8e"}" stop-opacity=".22"/><stop offset="1" stop-color="${ONI?"#c4152c":"#2f5f8e"}" stop-opacity="0"/></linearGradient></defs>
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
    $('trCh').textContent=`${BR} #${String(x.i+1).padStart(3,'0')} · ${n.jt}`; $('trT').textContent=n.t; $('trR').textContent=n.r;
    $('trEd').textContent=`Edition #${x.ed} of ${n.e}`; $('trP').textContent=x.price; $('trBarP').textContent=x.price; $('trSeller').textContent=`Seller ${x.seller}`;
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
  const close=()=>{ tr.classList.remove('on'); (document.activeElement?.blur(),tr.setAttribute('aria-hidden','true')); document.body.style.overflow=''; };
  $('trX').onclick=close; tr.onclick=e=>{ if(e.target===tr)close(); }; addEventListener('keydown',e=>{ if(e.key==='Escape'&&tr.classList.contains('on'))close(); });
  $('trRange').onclick=e=>{ const b=e.target.closest('button'); if(!b)return; range=+b.dataset.d; $('trRange').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b)); drawChart(); };
  $('trBuy').onclick=()=>checkout({kind:'listing',x:curX}); $('trBarBuy').onclick=()=>checkout({kind:'listing',x:curX}); $('trOffer').onclick=openMarket;
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

/* ---------- wallet · sign in · profile · checkout ----------
   Wallet  = connect Phantom / Solflare / Backpack to pay (nav button "Wallet").
   Sign in = holders open their profile (profile.html) by signing a free message with their wallet.
   Paying never happens here as a plain SOL transfer: the mint contract (Candy Machine / launchpad) or the
   marketplace takes the payment and hands over the NFT in the same transaction. "Confirm & pay" sends people
   to CONFIG.mintUrl / CONFIG.marketUrl and stays off until those exist. */
(function(){
  const WALLETS=[
    {id:'phantom',name:'Phantom',get:()=>window.phantom?.solana||(window.solana?.isPhantom?window.solana:null),url:'https://phantom.app/download'},
    {id:'solflare',name:'Solflare',get:()=>window.solflare?.isSolflare?window.solflare:null,url:'https://solflare.com/download'},
    {id:'backpack',name:'Backpack',get:()=>window.backpack?.solana||window.backpack||null,url:'https://backpack.app/download'},
  ];
  const RPC=CONFIG.rpc||'https://api.mainnet-beta.solana.com';
  const short=a=>a.slice(0,4)+'…'+a.slice(-4);
  const LS={get:k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}},del:k=>{try{localStorage.removeItem(k)}catch(_){}}};
  let prov=null, addr='', bal=null, wName='', pending=null, afterConnect=null, session=LS.get('ronin-session');
  const signed=()=>!!(session&&addr&&session.addr===addr);

  // nav: "Sign in" (profile) + "Wallet"
  const navWrap=document.querySelector('nav .wrap');
  if(navWrap){ // day ↔ night: the same page in the other world
    const pg=(location.pathname.split('/').pop()||'index.html'), to=(ONI?'../':'oni/')+pg+location.hash;
    navWrap.insertAdjacentHTML('beforeend',`<a class="world" id="worldSw" href="${to}" title="${ONI?'Day · RONIN':'Night · ONI'}" aria-label="Switch to ${ONI?'RONIN (day)':'ONI (night)'}"><i class="w-sun"></i><i class="w-moon"></i><b>${ONI?'RONIN':'ONI'}</b></a>`);
    $('worldSw').onclick=e=>{ if(still)return; e.preventDefault(); document.body.classList.add('w-going'); setTimeout(()=>location.href=to,520); };
  }
  if(navWrap)navWrap.insertAdjacentHTML('beforeend','<a class="si-link" id="siLink" href="profile.html">Sign in</a><button class="wbtn" id="wBtn"><i></i><span>Wallet</span></button>');
  document.body.insertAdjacentHTML('beforeend',`
  <div class="wm" id="wModal" aria-hidden="true" role="dialog" aria-label="Connect a wallet"><div class="wm-box">
    <button class="wm-x" data-close>✕</button>
    <div class="eyebrow">Solana</div><h3>Connect a wallet</h3>
    <p class="wm-sub">Connecting only shares your public address. Nothing is ever charged without your signature.</p>
    <div class="wm-list" id="wList"></div>
  </div></div>
  <div class="wm" id="wPanel" aria-hidden="true" role="dialog" aria-label="Your wallet"><div class="wm-box pr">
    <button class="wm-x" data-close>✕</button>
    <div class="pr-head"><div class="pr-av" id="wpAv"></div><div><div class="eyebrow" id="wpName">Wallet</div><h3 id="wpAddr"></h3></div></div>
    <div class="pr-row"><div><small>Balance</small><b id="wpBal">—</b></div><div><small>Network</small><b>Solana</b></div><div><small>Status</small><b>Connected</b></div></div>
    <div class="pr-act"><button class="pr-copy" id="wpCopy">Copy address</button><a class="btn" href="profile.html">My profile</a></div>
    <button class="wm-dis" id="wpOut">Disconnect</button>
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
    <button class="co-prev" id="coPrev" hidden>See a sample draw first · free, nothing is minted →</button>
  </div></div>`);
  const btn=$('wBtn'), si=$('siLink'), wm=$('wModal'), wp=$('wPanel'), co=$('coModal');
  const open=m=>{ m.classList.add('on'); m.setAttribute('aria-hidden','false'); };
  const close=m=>{ document.activeElement?.blur(); m.classList.remove('on'); m.setAttribute('aria-hidden','true'); };
  [wm,wp,co].forEach(m=>{ m.onclick=e=>{ if(e.target===m||e.target.closest('[data-close]'))close(m); }; });
  addEventListener('keydown',e=>{ if(e.key==='Escape')[wm,wp,co].forEach(close); });
  const hue=a=>parseInt(a.slice(0,6),36)%360;

  function paint(){
    if(btn){ btn.classList.toggle('on',!!addr); btn.querySelector('span').textContent=addr?`${short(addr)}${bal!=null?' · ◎ '+bal.toFixed(2):''}`:'Wallet'; }
    if(si){ const prof=session&&LS.get('ronin-profile-'+session.addr); si.textContent=session?(prof?.name||'My profile'):'Sign in'; }
    $('wList').innerHTML=WALLETS.map(w=>{ const has=!!w.get(); return `<button class="wm-w" data-w="${w.id}"><span class="wm-logo ${w.id}">${w.name[0]}</span><b>${w.name}</b><em>${addr&&prov===w.get()?'Connected':has?'Detected':'Install'}</em></button>`; }).join('');
    if(addr){ $('wpAddr').textContent=short(addr); $('wpBal').textContent=bal!=null?'◎ '+bal.toFixed(3):'—'; $('wpName').textContent=wName||'Wallet'; $('wpAv').style.setProperty('--h',hue(addr)); }
    if(co.classList.contains('on'))fillCheckout();
    document.dispatchEvent(new CustomEvent('ronin:wallet'));
  }
  async function balance(){
    try{ const r=await fetch(RPC,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'getBalance',params:[addr]})});
      bal=(await r.json()).result.value/1e9; }catch(_){ bal=null; }
    paint();
  }
  async function connect(w){
    const p=w.get(); if(!p){ window.open(w.url,'_blank','noopener'); return; }
    try{ const res=await p.connect(); prov=p; wName=w.name; addr=(res?.publicKey||p.publicKey).toString(); LS.set('ronin-wallet',w.id);
      p.on?.('disconnect',()=>{ addr=''; bal=null; paint(); });
      p.on?.('accountChanged',pk=>{ if(pk){ addr=pk.toString(); balance(); } });
      close(wm); toast(`${w.name} connected`); paint(); balance();
      if(afterConnect){ const f=afterConnect; afterConnect=null; f(); }
      if(pending){ const k=pending; pending=null; checkout(k); }
    }catch(_){ toast('Connection cancelled'); }
  }
  wm.addEventListener('click',e=>{ const b=e.target.closest('[data-w]'); if(b)connect(WALLETS.find(w=>w.id===b.dataset.w)); });
  if(btn)btn.onclick=()=>{ paint(); open(addr?wp:wm); };
  $('wpCopy').onclick=()=>navigator.clipboard?.writeText(addr).then(()=>toast('Address copied'));
  $('wpOut').onclick=async()=>{ try{ await prov?.disconnect(); }catch(_){} addr=''; bal=null; prov=null; LS.del('ronin-wallet'); close(wp); paint(); toast('Wallet disconnected'); };
  // reconnect silently if the wallet already trusts the site
  (async()=>{ const w=WALLETS.find(x=>x.id===LS.get('ronin-wallet')), p=w&&w.get();
    if(p){ try{ const r=await p.connect({onlyIfTrusted:true}); prov=p; wName=w.name; addr=(r?.publicKey||p.publicKey).toString(); balance(); }catch(_){} } paint(); })();

  /* sign in: a free signature proves the wallet (and the cards in it) are yours */
  async function signIn(){
    if(!addr){ afterConnect=signIn; paint(); open(wm); return; }
    const msg=`Sign in to ${BR}\n\nWallet: ${addr}\nNonce: ${Math.random().toString(36).slice(2,10)}\nIssued: ${new Date().toISOString()}\n\nThis signature only proves you own this wallet. It costs nothing and approves no transaction.`;
    try{ const out=await prov.signMessage(new TextEncoder().encode(msg),'utf8'); const sig=out?.signature||out;
      session={addr,t:Date.now(),sig:btoa(String.fromCharCode(...new Uint8Array(sig))).slice(0,24)}; LS.set('ronin-session',session);
      toast('Signed in'); paint();
    }catch(_){ toast('Sign-in cancelled'); }
  }
  function signOut(){ session=null; LS.del('ronin-session'); paint(); toast('Signed out'); }
  window.RONIN_AUTH={signIn,signOut,state:()=>({addr,bal,wName,session,signed:signed()}),profile:a=>LS.get('ronin-profile-'+a)||{},saveProfile:(a,v)=>LS.set('ronin-profile-'+a,v)};

  /* owned cards: once the collection exists (CONFIG.collection + a DAS-capable RPC like Helius) */
  window.RONIN_OWNED=async a=>{
    if(!CONFIG.collection||!CONFIG.rpc)return null;            // null = collection not live yet
    try{ const r=await fetch(CONFIG.rpc,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:'r',method:'getAssetsByOwner',params:{ownerAddress:a,page:1,limit:1000}})});
      const items=(await r.json()).result?.items||[];
      return items.filter(x=>(x.grouping||[]).some(g=>g.group_key==='collection'&&g.group_value===CONFIG.collection))
        .map(x=>({id:x.id,name:x.content?.metadata?.name||'RONIN',n:NFTS.find(n=>(x.content?.metadata?.name||'').includes(n.t))}));
    }catch(_){ return []; }
  };

  /* checkout */
  let cur=null;
  function fillCheckout(){
    const k=cur, mint=k.kind==='mint', n=mint?null:k.x.n, price=mint?CONFIG.mintPrice:k.x.price, total=price+0.00001+(mint?0.012:0);
    const live=mint?!!CONFIG.mintUrl:!!CONFIG.marketUrl;
    $('coEye').textContent=mint?'Mint · random draw':'Buy from a holder';
    $('coTitle').textContent=mint?`Mint a random ${BR}`:`Buy ${n.t}`;
    $('coArt').innerHTML=mint?'<i class="co-back"></i>':`<img src="${img(n)}" alt="" style="object-position:${n.pos||'50% 50%'}">`;
    $('coArt').style.setProperty('--rc',mint?'#3c6f9e':RCOL[n.r][0]);
    $('coName').textContent=mint?'Random piece · fate decides':`${n.t} · #${k.x.ed}/${n.e}`;
    $('coMeta').textContent=mint?`Legendary ${(NFTS.filter(x=>x.r==='Legendary').reduce((a,x)=>a+x.e,0)/TOTAL*100).toFixed(1)}% · ${TOTAL} pieces`:`${n.r} · seller ${k.x.seller}`;
    $('coLine').textContent=mint?'Mint price':'Listed price';
    $('coPrice').textContent='◎ '+price; $('coRentRow').hidden=!mint; $('coTotal').textContent='◎ '+total.toFixed(3);
    const enough=bal==null||bal>=total;
    $('coWallet').innerHTML=addr?`<span class="dot ok"></span>${short(addr)}<b>${bal!=null?'◎ '+bal.toFixed(3):'balance…'}</b>${enough?'':'<em>Not enough SOL</em>'}`:`<span class="dot"></span>No wallet connected<button class="co-con" id="coCon">Connect</button>`;
    const pay=$('coPay'); pay.disabled=!addr||!live||!enough;
    pay.textContent=!addr?'Connect a wallet to pay':!live?(mint?'Mint opens soon':'Trading opens after the mint'):!enough?'Not enough SOL':'Confirm & pay';
    $('coNote').textContent=live?'You’ll sign the purchase in your wallet on the '+(mint?'mint':'marketplace')+' page. The NFT lands in your wallet in the same transaction.'
      :'Nothing can be charged yet. Connect now and you’ll be ready the moment it opens.';
    const c=$('coCon'); if(c)c.onclick=()=>{ pending=cur; close(co); paint(); open(wm); };
    $('coPrev').hidden=!(mint&&!live&&k.preview);
  }
  checkout=k=>{ cur=k; fillCheckout(); open(co); };
  $('coPay').onclick=()=>{ const u=cur.kind==='mint'?CONFIG.mintUrl:CONFIG.marketUrl; if(u)window.open(u,'_blank','noopener'); };
  $('coPrev').onclick=()=>{ close(co); cur.preview&&cur.preview(); };
})();

/* ---------- profile.html ---------- */
(function(){
  const root=$('profile'); if(!root)return;
  const A=window.RONIN_AUTH, short=a=>a.slice(0,4)+'…'+a.slice(-4);
  const card=(n,i)=>`<div class="card in" data-r="${n.r}" style="--d:${i*.4}s"><div class="ring"></div><div class="frame"><img src="${img(n)}" alt="${n.t}" style="object-position:${n.pos||'50% 50%'}"><div class="holo"></div><div class="sweep"></div><div class="shade"></div><div class="glare"></div></div><div class="info"><div><small>${n.ch}</small><b>${n.t}</b></div><span class="rar">${n.r}</span></div></div>`;
  async function render(){
    const st=A.state();
    if(!st.session){
      root.innerHTML=`<div class="pf-gate"><div class="pf-k jp">${ONI?"鬼":"道"}</div><div class="eyebrow">Holders</div><h1>Sign in to your profile.</h1>
        <p>Your cards live in your wallet. Sign a free message with it to open your profile: your ${BR}s, your rank and your activity. Signing never moves funds.</p>
        <button class="btn pf-go" id="pfGo">${st.addr?'Sign in with '+short(st.addr):'Continue with wallet'}</button>
        <a class="pf-alt" href="draw.html">Don't have a card yet? Draw your first ${br} →</a></div>`;
      $('pfGo').onclick=()=>A.signIn(); return;
    }
    const a=st.session.addr, prof=A.profile(a), owned=await window.RONIN_OWNED(a);
    const list=owned?owned.filter(o=>o.n):[], value=list.reduce((s,o)=>s+o.n.p,0), leg=list.filter(o=>o.n.r==='Legendary').length;
    const rarest=list.slice().sort((x,y)=>x.n.e-y.n.e)[0];
    const since=new Date(prof.since||st.session.t).toLocaleDateString('en-US',{month:'short',year:'numeric'});
    root.innerHTML=`<div class="pf-head">
        <div class="pf-av" style="--h:${parseInt(a.slice(0,6),36)%360}">${rarest?`<img src="${img(rarest.n)}" alt="">`:''}</div>
        <div class="pf-id"><div class="eyebrow">${BR} holder · since ${since}</div>
          <h1 id="pfName" contenteditable="true" spellcheck="false" title="Click to edit">${(prof.name||(ONI?'Nameless demon':'Nameless ronin')).replace(/</g,'&lt;')}</h1>
          <div class="pf-addr"><code>${short(a)}</code><button id="pfCopy">Copy</button>${st.addr===a?'<span class="ok">● wallet connected</span>':'<span>wallet not connected</span>'}</div></div>
        <button class="pf-out" id="pfOut">Sign out</button></div>
      <div class="pf-stats">
        <div><small>Cards</small><b>${owned?list.length:'—'}</b></div><div><small>Legendary</small><b>${owned?leg:'—'}</b></div>
        <div><small>Est. value</small><b>${owned?'◎ '+value.toFixed(1):'—'}</b></div><div><small>Rarest</small><b>${rarest?rarest.n.t:'—'}</b></div></div>
      <div class="pf-sec"><h2>Your cards</h2>
        ${owned===null?`<div class="pf-empty"><b>The collection isn't live yet.</b><p>When the mint opens, every ${BR} in this wallet shows up here automatically.</p><a class="btn" href="draw.html">Draw a ${br}</a></div>`
          :list.length?`<div class="cards pf-cards">${list.map((o,i)=>card(o.n,i)).join('')}</div>`
          :`<div class="pf-empty"><b>No ${BR} in this wallet yet.</b><p>Draw one at random, or buy the exact one you want from a holder.</p><a class="btn" href="draw.html">Draw a ${br}</a> <a class="btn ghost" href="index.html#listings">Listings</a></div>`}
      </div>`;
    const nm=$('pfName'); nm.onblur=()=>{ const v=nm.textContent.trim().slice(0,32)||(ONI?'Nameless demon':'Nameless ronin'); A.saveProfile(a,{...prof,name:v,since:prof.since||st.session.t}); toast('Name saved'); };
    nm.onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); nm.blur(); } };
    $('pfCopy').onclick=()=>navigator.clipboard?.writeText(a).then(()=>toast('Address copied'));
    $('pfOut').onclick=()=>{ A.signOut(); render(); };
    root.querySelectorAll('.pf-cards .card').forEach(c=>tilt(c));
  }
  document.addEventListener('ronin:wallet',render); render();
})();

/* ---------- coin.html: $HAKKI ---------- */
(function(){
  const pg=$('coinPage'); if(!pg)return;
  const C=CONFIG.coin||{};
  // the 3D coin: two faces + a stack of rims for thickness
  const face=(back)=>`<div class="c3-face ${back?'b':'f'}"><svg viewBox="-110 -110 220 220" aria-hidden="true">
      <defs><path id="rim${back?'b':'f'}" d="M0,-86 a86,86 0 1,1 -0.1,0"/></defs>
      <circle r="104" fill="#f3c22f"/><circle r="104" fill="none" stroke="#1d3687" stroke-width="6"/><circle r="92" fill="none" stroke="#1d3687" stroke-width="2" stroke-dasharray="3 5"/>
      <text font-family="Archivo" font-weight="900" font-size="15" letter-spacing="6" fill="#1d3687"><textPath href="#rim${back?'b':'f'}">${back?'NO MASTER · NO TAX · NO TEAM · ':'$HAKKI · THE COIN OF THE RONIN · '}</textPath></text>
      ${back?'<text y="22" text-anchor="middle" font-family="Shippori Mincho,serif" font-weight="800" font-size="78" fill="#1d3687">八起</text>':`<g transform="scale(.62)">${sunMarkup()}</g>`}
    </svg></div>`;
  const rims=Array.from({length:14},(_,i)=>`<i class="c3-rim" style="transform:translateZ(${(i-6.5)*1.4}px)"></i>`).join('');
  $('c3d').innerHTML=face(false)+rims+face(true);
  tilt($('chCoin'),18);
  // contract address + links
  $('caTxt').innerHTML='<b>CA</b>'+(C.ca||'soon. Only trust this page.');
  $('caBtn').onclick=()=>{ if(!C.ca)return toast('The contract isn’t live yet'); navigator.clipboard.writeText(C.ca).then(()=>toast('CA copied')); };
  const buy=e=>{ if(C.buyUrl){ window.open(C.buyUrl,'_blank','noopener'); } else { e.preventDefault(); toast('$HAKKI isn’t live yet. Soon.'); } };
  ['coinBuy','coinBuy2'].forEach(id=>{ const a=$(id); if(a)a.onclick=e=>{ if(id==='coinBuy'&&!C.buyUrl)return; buy(e); }; });
  if(C.buyUrl){ $('coinBuy').href=C.buyUrl; $('coinBuy').target='_blank'; }
  if(C.chartUrl){ const a=$('coinChart'); a.href=C.chartUrl; a.target='_blank'; a.rel='noopener'; }
  // tokenomics donut: two segments with a 2px paper gap
  const seg=[[90,'#3c6f9e'],[10,'#f3c22f']], R0=80, sw=26, Ci=2*Math.PI*R0; let off=0;
  $('tkSvg').innerHTML=`<circle r="${R0}" cx="100" cy="100" fill="none" stroke="#0c0c0c14" stroke-width="${sw}"/>`+seg.map(([v,c])=>{ const L=Ci*v/100-3, el=`<circle r="${R0}" cx="100" cy="100" fill="none" stroke="${c}" stroke-width="${sw}" stroke-dasharray="${L} ${Ci-L}" stroke-dashoffset="${-off}" transform="rotate(-90 100 100)"/>`; off+=Ci*v/100; return el; }).join('');
})();

/* ---------- merch: the Ronin Cap ---------- */
const CAPS=[ // the merch line: six colorways, not tied to any card
  {n:'Sumi',k:'墨',c:'#1b1b1b',t:'#f2f0eb',d:'Ink black'},
  {n:'Sora',k:'空',c:'#5b9bd5',t:'#0c0c0c',d:'Sky blue'},
  {n:'Sakura',k:'桜',c:'#f29bbd',t:'#0c0c0c',d:'Blossom pink'},
  {n:'Take',k:'竹',c:'#5f9e3c',t:'#f2f0eb',d:'Bamboo green'},
  {n:'Hi',k:'日',c:'#f3c22f',t:'#1d3687',d:'Sun yellow'},
  {n:'Kami',k:'紙',c:'#efe9dc',t:'#0c0c0c',d:'Paper white'},
];
function capSVG(cap){
  return `<svg viewBox="0 0 220 150" aria-hidden="true">
    <ellipse cx="110" cy="138" rx="86" ry="9" fill="#0c0c0c22"/>
    <path d="M28 104 Q110 152 196 98 Q186 118 110 128 Q46 128 28 104Z" fill="${cap.c}" stroke="#0c0c0c" stroke-width="4" stroke-linejoin="round"/>
    <path d="M30 104 C26 40 70 14 112 14 C158 14 196 44 192 100 Q110 120 30 104Z" fill="${cap.c}" stroke="#0c0c0c" stroke-width="4" stroke-linejoin="round"/>
    <path d="M112 14 C96 40 92 74 96 112 M112 14 C132 40 140 72 140 110" fill="none" stroke="#0c0c0c" stroke-opacity=".35" stroke-width="2.5"/>
    <circle cx="112" cy="15" r="6" fill="${cap.c}" stroke="#0c0c0c" stroke-width="3"/>
    <path d="M44 58 C62 34 84 26 104 24" fill="none" stroke="#ffffff" stroke-opacity=".35" stroke-width="5" stroke-linecap="round"/>
    <text x="118" y="86" text-anchor="middle" font-family="Shippori Mincho,serif" font-weight="800" font-size="40" fill="${cap.t}">${cap.k}</text>
  </svg>`;
}
// prices are a proposal in USD; change them here
const ONI_MERCH=[   // the night line: black, bone and blood
  {id:'oni-cap',n:'Oni Cap',cat:'Headwear',p:35,d:'Unstructured black cap, 鬼 embroidered in blood red.',c:['#111015','#c4152c']},
  {id:'oni-tee',n:'Seven Sins Tee',cat:'Apparel',p:40,d:'Heavyweight black cotton, a real full moon crossed by smoke.',c:['#111015']},
  {id:'oni-hoodie',n:'鬼 Hoodie',cat:'Apparel',p:80,d:'Heavy black fleece, red brush kanji on the chest.',c:['#111015']},
];
const DAY_MERCH=[   // v = colorways: [hex, name, image]; products without v show their colors as static dots
  {id:'cap',n:'Ronin Cap',cat:'Headwear',p:35,d:'Unstructured dad cap, embroidered RONIN.',v:[['#1b1b1b','Ink','cap'],['#5b9bd5','Sky','cap-sky'],['#f29bbd','Sakura','cap-pink'],['#5f9e3c','Bamboo','cap-green'],['#f3c22f','Sun','cap-yellow'],['#efe9dc','Paper','cap-white']]},
  {id:'tee',n:'Path Tee',cat:'Apparel',p:40,d:'Heavyweight cotton, RONIN on the chest.',v:[['#efe9dc','Paper','tee'],['#1b1b1b','Ink','tee-black']]},
  {id:'hoodie',n:'浪人 Hoodie',cat:'Apparel',p:80,d:'Heavy fleece, brush kanji on the chest.',v:[['#1b1b1b','Ink','hoodie'],['#55585e','Charcoal','hoodie-grey']]},
  {id:'tote',n:'Ensō Tote',cat:'Accessories',p:28,d:'Natural canvas, ink circle print.',c:['#e8dcc0']},
  {id:'socks',n:'八 Socks',cat:'Accessories',p:16,d:'Crew socks with the 八 pattern.',v:[['#f2f0eb','Paper','socks'],['#1b1b1b','Ink','socks-black']]},
  {id:'pins',n:'Seal Pin Set',cat:'Accessories',p:18,d:'Three enamel pins: seal, sun, ensō.',c:['#d23a2a','#f3c22f','#1b1b1b']},
];
const MERCH=ONI?ONI_MERCH:DAY_MERCH;
(function(){
  const grid=$('shopGrid'); if(!grid)return;
  const cats=['All',...new Set(MERCH.map(m=>m.cat))];
  $('shopF').innerHTML=cats.map((c,i)=>`<button class="${i?'':'on'}" data-c="${c}">${c}</button>`).join('');
  const render=c=>{ grid.innerHTML=MERCH.filter(m=>c==='All'||m.cat===c).map((m,i)=>`<article class="prod" style="--k:${i*.07}s">
      <div class="prod-img"><img src="${ROOT}img/merch/${m.id}.webp" alt="${m.n}" loading="lazy"><span class="pill">Soon</span></div>
      <div class="prod-b"><small>${m.cat}</small><h4>${m.n}</h4><p>${m.d}</p>
        <div class="prod-f"><div class="dots">${m.v?m.v.map((x,k)=>`<button class="${k?'':'on'}" style="--c:${x[0]}" data-img="${x[2]}" data-name="${x[1]}" aria-label="${x[1]}"></button>`).join(''):m.c.map(x=>`<i style="--c:${x}"></i>`).join('')}</div><b>$${m.p}</b></div>
        ${m.v?`<span class="prod-col">${m.v[0][1]}</span>`:''}
        <a class="prod-go" href="#subscribe">Notify me</a></div></article>`).join(''); };
  // tapping a color swaps the product photo to that colorway
  grid.addEventListener('click',e=>{ const b=e.target.closest('.dots button'); if(!b)return; const card=b.closest('.prod'), im=card.querySelector('.prod-img img');
    card.querySelectorAll('.dots button').forEach(x=>x.classList.toggle('on',x===b)); card.querySelector('.prod-col').textContent=b.dataset.name;
    im.classList.add('swap'); const nx=new Image(); nx.onload=()=>{ im.src=nx.src; requestAnimationFrame(()=>im.classList.remove('swap')); }; nx.src=`${ROOT}img/merch/${b.dataset.img}.webp`; });
  // preload the other colorways so the swap is instant
  MERCH.forEach(m=>(m.v||[]).forEach(x=>{ const i=new Image(); i.src=`${ROOT}img/merch/${x[2]}.webp`; }));
  $('shopF').onclick=e=>{ const b=e.target.closest('button'); if(!b)return; $('shopF').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b)); render(b.dataset.c); };
  render('All');
})();

/* ---------- the falls: ronin by the pond, subscribe ---------- */
(function(){
  const sec=$('subscribe'), bg=$('flBg'), cv=$('flFx'); if(!sec||!cv)return;
  let c,W,H,parts=[],ripples=[],t=0,vis=false;
  const size=()=>{ ({c,w:W,h:H}=fit(cv)); }; size(); addEventListener('resize',size);
  new IntersectionObserver(es=>{ vis=es[0].isIntersecting; },{threshold:0}).observe(sec);
  // parallax: the scene drifts slower than the page
  addEventListener('scroll',()=>{ const r=sec.getBoundingClientRect(); if(r.bottom<0||r.top>innerHeight)return; bg.style.transform=`translate3d(0,${(r.top*-.12).toFixed(1)}px,0) scale(1.12)`; },{passive:true});
  const spawn=()=>{ const k=Math.random();
    if(k<.45)return {k:'mist',x:R(W*.25,W*.85),y:R(H*.35,H*.75),r:R(60,160),vx:R(-.15,.25),vy:R(-.35,-.1),l:0,max:R(.08,.18)};
    if(k<.75)return {k:'mote',x:R(0,W),y:R(H*.2,H),s:R(1,2.6),vx:R(-.2,.2),vy:R(-.45,-.1),l:0,max:R(.5,.9),w:R(0,6)};
    return {k:'petal',x:R(-40,W),y:R(-40,H*.3),s:R(5,10),vx:R(.3,1),vy:R(.5,1.2),a:R(0,6),w:R(0,6),l:0,max:.9}; };
  for(let i=0;i<70;i++){ const p=spawn(); p.l=p.max*Math.random(); parts.push(p); }
  const loop=()=>{
    requestAnimationFrame(loop); if(!vis||still)return; t++;
    c.clearRect(0,0,W,H);
    if(t%40===0)ripples.push({x:R(W*.35,W*.95),y:R(H*.78,H*.95),r:2,l:1});
    for(const r of ripples){ r.r+=.6; r.l-=.008; c.strokeStyle=`rgba(255,255,255,${Math.max(0,r.l)*.45})`; c.lineWidth=1.2; c.beginPath(); c.ellipse(r.x,r.y,r.r*2.4,r.r*.55,0,0,6.283); c.stroke(); }
    ripples=ripples.filter(r=>r.l>0);
    parts.forEach((p,i)=>{
      p.l=Math.min(p.max,p.l+.004); p.x+=p.vx; p.y+=p.vy;
      if(p.k==='mist'){ const g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r); g.addColorStop(0,`rgba(255,255,255,${p.l})`); g.addColorStop(1,'rgba(255,255,255,0)'); c.fillStyle=g; c.beginPath(); c.arc(p.x,p.y,p.r,0,6.283); c.fill(); if(p.y<H*.1)parts[i]=spawn(); }
      else if(p.k==='mote'){ p.w+=.04; c.globalAlpha=p.l*(.5+Math.sin(p.w)*.5); c.fillStyle=ONI?'#dfe6ff':'#fff6d6'; c.shadowColor=ONI?'#8fa6ff':'#ffe9a8'; c.shadowBlur=10; c.beginPath(); c.arc(p.x+Math.sin(p.w)*3,p.y,p.s,0,6.283); c.fill(); c.shadowBlur=0; c.globalAlpha=1; if(p.y<0)parts[i]=spawn(); }
      else { p.w+=.03; p.a+=.02; c.save(); c.translate(p.x+Math.sin(p.w)*8,p.y); c.rotate(p.a); c.scale(1,.55+Math.sin(p.w*2)*.3); c.fillStyle=ONI?'#d4182f':'#ffd3e2'; c.globalAlpha=p.l;
        c.beginPath(); c.moveTo(-p.s,0); c.quadraticCurveTo(0,-p.s*.75,p.s,0); c.quadraticCurveTo(0,p.s*.75,-p.s,0); c.fill(); c.restore(); if(p.y>H+20)parts[i]=spawn(); }
    });
  };
  loop();
})();

/* ---------- draw.html: the legendary draw ---------- */
(function(){
  const pg=$('drawPage'); if(!pg)return;
  const KANJI={Common:'並',Rare:'稀',Epic:'傑',Legendary:'伝説'}, ORDER=['Common','Rare','Epic','Legendary'];
  const live=!!CONFIG.mintUrl, ring=$('dwRing'), card=$('dwCard'), flip=$('dwFlip'), res=$('dwResult');
  // ui: price, odds, pool
  $('dwPrice').textContent=CONFIG.mintPrice;
  $('dwGo').querySelector('span').textContent=`Draw · ◎ ${CONFIG.mintPrice}`;
  $('dwMode').textContent=live?'Mint is live':'Mint opens soon';
  const tiers=['Legendary','Epic','Rare','Common'].map(r=>({r,e:NFTS.filter(n=>n.r===r).reduce((a,n)=>a+n.e,0)})).filter(t=>t.e);
  $('dwOdds').innerHTML=tiers.map(t=>`<div style="--rc:${RCOL[t.r][0]}"><i></i><span>${t.r}</span><b>${(t.e/TOTAL*100).toFixed(1)}%</b></div>`).join('');
  if($('dwPool'))$('dwPool').innerHTML=NFTS.map(n=>`<div class="dp" style="--rc:${RCOL[n.r][0]}"><img src="${img(n)}" alt="${n.t}" loading="lazy" style="object-position:${n.pos||'50% 50%'}"><div><b>${n.t}</b><small>${n.r} · ${(n.e/TOTAL*100).toFixed(1)}%</small></div></div>`).join('');

  // the ring of face-down cards
  const N=12; ring.innerHTML=Array.from({length:N},(_,i)=>`<div class="dw-rc" style="--i:${i}"><i></i><i class="b2"></i></div>`).join('');   // a back on both sides, so the far half never reads mirrored
  const rcs=[...ring.children]; let ang=0, vel=.12, radius=0, mode='idle', raf;
  const place=()=>{ radius=Math.min(innerWidth*.36,380); rcs.forEach((c,i)=>{ c.dataset.a=i*360/N; }); };
  place(); addEventListener('resize',place);
  const loop=()=>{
    ang+=vel; const tilt=-14;
    rcs.forEach((c,i)=>{ const a=+c.dataset.a+ang, r=mode==='collapse'?0:radius;
      c.style.transform=`rotateX(${tilt}deg) rotateY(${a}deg) translateZ(${r}px)`; });
    raf=requestAnimationFrame(loop);
  };
  if(!still)loop(); else rcs.forEach((c,i)=>c.style.transform=`rotateY(${i*360/N}deg) translateZ(${radius}px)`);

  /* night halftone sky with twinkling stars */
  (function(){
    const cv=$('dwSky'); let c,W,H,stars=[],t=0;
    const paint=()=>{ ({c,w:W,h:H}=fit(cv)); stars=Array.from({length:Math.round(W*H/9000)},()=>({x:R(0,W),y:R(0,H*.85),s:R(.6,2),p:R(0,6)})); };
    const n=noise2(21), fbm=(x,y)=>{let v=0,a=.55,f=1;for(let o=0;o<4;o++){v+=a*n(x*f,y*f);a*=.5;f*=2.03;}return v;};
    let base=null;
    const bake=()=>{ const o=document.createElement('canvas'); o.width=W; o.height=H; const g=o.getContext('2d');
      const grd=g.createLinearGradient(0,0,0,H); grd.addColorStop(0,ONI?'#07060d':'#0b1430'); grd.addColorStop(.7,ONI?'#1a0b16':'#16254d'); grd.addColorStop(1,ONI?'#3a0a16':'#1d2f5c'); g.fillStyle=grd; g.fillRect(0,0,W,H);
      const cell=W<600?6:8; for(let y=0;y<H;y+=cell)for(let x=0;x<W+cell;x+=cell){ const X=x+((y/cell)%2?cell/2:0), cl=fbm(X/320,y/200)+(y/H)*.25-.3;
        const e=Math.max(0,Math.min(1,(cl-.4)/.08)); if(e<=0)continue; g.fillStyle=ONI?`rgba(196,21,44,${.08+e*.2})`:`rgba(120,150,210,${.10+e*.22})`; g.beginPath(); g.arc(X,y,cell*.42*e,0,6.283); g.fill(); }
      base=o; };
    const loop=()=>{ t+=.02; c.drawImage(base,0,0,W,H);
      for(const s of stars){ const a=.35+.65*Math.abs(Math.sin(t+s.p)); c.globalAlpha=a; c.fillStyle='#f2f0eb'; c.beginPath(); c.arc(s.x,s.y,s.s,0,6.283); c.fill(); }
      c.globalAlpha=1; if(!still)requestAnimationFrame(loop); };
    paint(); bake(); loop(); addEventListener('resize',()=>{ paint(); bake(); });
  })();

  /* particles: ink sparks, petals, light rays */
  const fx=(function(){
    const cv=$('dwFx'); let c,W,H,parts=[],rays=null,petals=0;
    const size=()=>{ ({c,w:W,h:H}=fit(cv)); }; size(); addEventListener('resize',size);
    const api={
      burst(n,col,f=1){ const b=card.getBoundingClientRect(), cb=cv.getBoundingClientRect(), x=b.left+b.width/2-cb.left, y=b.top+b.height/2-cb.top;
        for(let i=0;i<n;i++){ const a=R(0,6.283),v=R(2,11)*f; parts.push({k:'s',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,s:R(1.2,3.6),col}); } },
      reset(){ rays=null; parts=[]; },
      rays(col){ rays={col,l:1}; }, petals(n){ for(let i=0;i<n;i++)parts.push({k:'p',x:R(0,W),y:R(-H,0),s:R(6,13),vx:R(.3,1.4),vy:R(1,2.4),a:R(0,6),w:R(0,6),l:1}); }
    };
    const loop=()=>{ c.clearRect(0,0,W,H);
      if(rays){ const b=card.getBoundingClientRect(), cb=cv.getBoundingClientRect(); c.save(); c.translate(b.left+b.width/2-cb.left,b.top+b.height/2-cb.top); c.rotate(performance.now()/3000); c.globalCompositeOperation='lighter';
        for(let k=0;k<16;k++){ c.rotate(Math.PI*2/16); const L=Math.max(W,H); const g=c.createLinearGradient(0,0,0,-L); g.addColorStop(0,rays.col+'cc'); g.addColorStop(1,rays.col+'00');
          c.globalAlpha=rays.l*.55; c.fillStyle=g; c.beginPath(); c.moveTo(-10,0); c.lineTo(10,0); c.lineTo(80,-L); c.lineTo(-80,-L); c.fill(); }
        c.restore(); rays.l-=.004; if(rays.l<=0)rays=null; }
      parts=parts.filter(p=>{
        if(p.k==='s'){ p.x+=p.vx; p.y+=p.vy; p.vy+=.12; p.vx*=.985; p.l-=.012; if(p.l<=0)return false;
          c.globalAlpha=p.l; c.fillStyle=p.col; c.shadowColor=p.col; c.shadowBlur=16; c.beginPath(); c.arc(p.x,p.y,p.s,0,6.283); c.fill(); c.shadowBlur=0; c.globalAlpha=1; return true; }
        p.w+=.03; p.x+=p.vx+Math.sin(p.w)*.6; p.y+=p.vy; p.a+=.03; if(p.y>H+20)return false;
        c.save(); c.translate(p.x,p.y); c.rotate(p.a); c.scale(1,.55+Math.sin(p.w*2)*.3); c.fillStyle='#ffc6d9'; c.globalAlpha=.9;
        c.beginPath(); c.moveTo(-p.s,0); c.quadraticCurveTo(0,-p.s*.75,p.s,0); c.quadraticCurveTo(0,p.s*.75,-p.s,0); c.fill(); c.restore(); return true; });
      requestAnimationFrame(loop); };
    loop(); return api;
  })();

  const sleep=ms=>new Promise(r=>setTimeout(r,still?0:ms));
  const pick=()=>{ let x=Math.random()*TOTAL; for(const n of NFTS){ x-=n.e; if(x<=0)return n; } return NFTS[NFTS.length-1]; };
  const ramp=(from,to,ms)=>new Promise(res=>{ const t0=performance.now(); const st=t=>{ const f=Math.min(1,(t-t0)/ms); vel=from+(to-from)*f*f; f<1?requestAnimationFrame(st):res(); }; requestAnimationFrame(st); });
  let busy=false;
  async function draw(){
    if(busy)return; busy=true; res.classList.remove('on'); pg.classList.remove('done','r-Common','r-Rare','r-Epic','r-Legendary');
    flip.classList.remove('up'); card.className='dw-card'; $('dwKanji').className='dw-kanji jp'; fx.reset();
    const n=pick(), [c1,c2]=RCOL[n.r], lvl=ORDER.indexOf(n.r);
    pg.style.setProperty('--c1',c1); pg.style.setProperty('--c2',c2);
    $('dwImg').src=img(n); $('dwImg').style.objectPosition=n.pos||'50% 50%'; $('dwFtR').textContent=n.r;
    // 1 · the ring spins into a whirlwind, then collapses into one card
    pg.classList.add('spin'); await ramp(vel,9,1300); await sleep(500);
    mode='collapse'; pg.classList.add('collapse'); await sleep(450);
    flash('#ffffff'); card.classList.add('show'); fx.burst(60,'#cfe0ff',.8); await sleep(700);
    // 2 · anticipation: the glow climbs the rarity ladder only as far as the pull goes
    for(let k=0;k<=lvl;k++){ card.style.setProperty('--g',RCOL[ORDER[k]][0]); card.classList.remove('pulse'); void card.offsetWidth; card.classList.add('pulse','lv'+k);
      fx.burst(14+k*14,RCOL[ORDER[k]][0],.5+k*.2); await sleep(k===lvl?900:650); }
    // 3 · the reveal
    card.classList.add('reveal'); flip.classList.add('up'); flash(c1);
    const kj=$('dwKanji'); kj.textContent=KANJI[n.r]; kj.classList.add('stamp');
    const sh=$('dwShock'); sh.classList.remove('go'); void sh.offsetWidth; sh.classList.add('go');
    fx.burst(n.r==='Legendary'?260:n.r==='Epic'?150:n.r==='Rare'?90:50,c1,n.r==='Legendary'?1.4:1);
    if(n.r==='Legendary'){ fx.rays(c1); fx.petals(90); document.body.classList.add('quake'); setTimeout(()=>document.body.classList.remove('quake'),900); }
    else if(n.r==='Epic'){ fx.rays(c1); }
    pg.classList.add('done','r-'+n.r);
    $('dwRr').textContent=n.r; $('dwRt').textContent=n.t; $('dwRj').textContent=n.jt;
    $('dwRo').textContent=`1 of ${n.e} editions · ${(n.e/TOTAL*100).toFixed(1)}% chance · est. value ◎ ${n.p}`;
    $('dwNote').textContent=live?'':'Nothing was minted yet: the mint opens soon.';
    await sleep(500); res.classList.add('on');
    // the ring quietly comes back behind the drawn card
    mode='idle'; pg.classList.remove('spin','collapse'); vel=.12; busy=false;
  }
  function flash(col){ const f=$('dwFlash'); f.style.setProperty('--f',col); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); }
  const go=()=>checkout({kind:'mint',preview:draw});
  $('dwGo').onclick=go; $('dwAgain').onclick=go; $('dwReal').onclick=go;
})();
