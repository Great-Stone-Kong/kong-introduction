/* i18n engine — D, HG, LANGS, IX injected by build */
const INL=new Set(['B','STRONG','EM','I','A','BR','CODE','U','SMALL','SUP','SUB','SPAN','MARK','S']);
let L='ko';
try{ const q=new URLSearchParams(location.search).get('lang'); L=q||localStorage.getItem('kong-lang')||'ko'; }catch(e){}
if(LANGS.indexOf(L)<0) L='ko';
const oT=new Map(), oH=new Map(), oA=new Map();
const norm=s=>s.replace(/\s+/g,' ').trim();
function tLine(s){
  const k=norm(s); if(!k) return s; const lead=s.match(/^\s*/)[0], trail=s.match(/\s*$/)[0];
  const v=D.T[k]; if(v) return lead+v[IX[L]]+trail;
  const nm=k.match(/^([\d.,+~%]+)\s*(\D.*)$/); if(nm&&D.T[nm[2]]){ if(nm[2]==='만 명'&&L==='en'){ const v=parseFloat(nm[1].replace(/,/g,''))*1e4; return lead+(v>=1e6?(+(v/1e6).toFixed(1))+'M':(+(v/1e3).toFixed(0))+'K')+' people'+trail; } const x=D.T[nm[2]][IX[L]]; return lead+nm[1]+x+trail; }
  let o=s; for(const f of D.F){ if(o.indexOf(f)>=0) o=o.split(f).join(D.T[f][IX[L]]); if(!HG.test(o)) break; }
  return o;
}
function tText(s){
  const k=norm(s), v=D.T[k];
  if(v){ return s.match(/^\s*/)[0]+v[IX[L]]+s.match(/\s*$/)[0]; }
  if(s.indexOf('\n')>=0) return s.split('\n').map(x=>HG.test(x)?tLine(x):x).join('\n');
  return tLine(s);
}
function doText(n){ const v=n.nodeValue; if(!HG.test(v)) return; const r=tText(v); if(r!==v){ oT.set(n,v); n.nodeValue=r; } }
function doAttr(el){ for(const a of ['title','placeholder','aria-label']){ const v=el.getAttribute&&el.getAttribute(a); if(v&&HG.test(v)){ const r=tLine(v); if(r!==v){ let m=oA.get(el); if(!m){m={};oA.set(el,m);} m[a]=v; el.setAttribute(a,r); } } } }
function inlineOnly(el){ if(el.namespaceURI!=='http://www.w3.org/1999/xhtml') return false;
  for(const d of el.querySelectorAll('*')){ if(!INL.has(d.tagName)||d.id) return false; for(const at of d.attributes) if(at.name.indexOf('data-')===0) return false; } return true; }
function tryUnit(el){ if(!el.firstElementChild||el.classList.contains('i18n-no')) return false; const tc=el.textContent; if(!HG.test(tc)) return false;
  const v=D.U[norm(tc)]; if(!v||!inlineOnly(el)) return false; oH.set(el,el.innerHTML); el.innerHTML=v[IX[L]]; return true; }
function walk(n){
  if(n.nodeType===3){ doText(n); return; }
  if(n.nodeType!==1) return; const t=n.tagName;
  if(t==='SCRIPT'||t==='STYLE'||t==='NOSCRIPT'||(n.classList&&n.classList.contains('i18n-no'))) return;
  doAttr(n);
  if(tryUnit(n)) return;
  for(let c=n.firstChild;c;){ const nx=c.nextSibling; walk(c); c=nx; }
}
function revert(){
  oH.forEach((h,el)=>{ el.innerHTML=h; }); oH.clear();
  oT.forEach((v,n)=>{ n.nodeValue=v; }); oT.clear();
  oA.forEach((m,el)=>{ for(const a in m) el.setAttribute(a,m[a]); }); oA.clear();
  unfitAll();
}
/* ---- 동적 콘텐츠 ---- */
let muted=false;
const mo=new MutationObserver(rs=>{ if(L==='ko'||muted) return;
  for(const r of rs){
    if(r.type==='characterData'){ if(r.target.parentNode) doText(r.target); }
    else if(r.type==='attributes'){ doAttr(r.target); }
    else if(r.addedNodes.length){ const p=r.target; if(p.nodeType===1&&p.isConnected&&tryUnit(p)) continue; r.addedNodes.forEach(n=>{ if(n.isConnected) walk(n); if(n.nodeType===1){ if(n.tagName==='svg') io.observe(n); else if(n.querySelectorAll) n.querySelectorAll('svg').forEach(s=>io.observe(s)); } }); }
  } });
/* ---- SVG 텍스트 맞춤 ---- */
let fitted=new WeakSet(); const fitList=[];
function fitSvg(svg){
  if(L==='ko'||fitted.has(svg)) return; fitted.add(svg); muted=true;
  svg.querySelectorAll('text').forEach(t=>{
    const ns=[...t.childNodes].filter(n=>n.nodeType===3&&oT.has(n)); if(!ns.length) return;
    const tr=ns.map(n=>n.nodeValue); let w0=0,w1=0;
    try{ ns.forEach(n=>n.nodeValue=oT.get(n)); w0=t.getComputedTextLength(); ns.forEach((n,i)=>n.nodeValue=tr[i]); w1=t.getComputedTextLength(); }catch(e){ ns.forEach((n,i)=>n.nodeValue=tr[i]); return; }
    if(!(w0>0)||w1<=w0*1.3) return;
    const fs=parseFloat(getComputedStyle(t).fontSize)||12, k=Math.max(.8,w0*1.3/w1);
    fitList.push([t,t.style.fontSize,t.getAttribute('textLength'),t.getAttribute('lengthAdjust')]);
    t.style.fontSize=(fs*k).toFixed(2)+'px';
    const w2=t.getComputedTextLength(); if(w2>w0*1.6){ t.setAttribute('textLength',(w0*1.55).toFixed(1)); t.setAttribute('lengthAdjust','spacingAndGlyphs'); }
  });
  mo.takeRecords(); muted=false;
}
function unfitAll(){ fitList.forEach(([t,fs,tl,la])=>{ t.style.fontSize=fs||''; if(tl==null) t.removeAttribute('textLength'); else t.setAttribute('textLength',tl); if(la==null) t.removeAttribute('lengthAdjust'); else t.setAttribute('lengthAdjust',la); }); fitList.length=0; fitted=new WeakSet(); }
const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) fitSvg(e.target); }));
function reobserve(){ io.disconnect(); document.querySelectorAll('svg').forEach(s=>io.observe(s)); }
/* ---- 메뉴 자동 맞춤 ---- */
const shortOrig=new Map();
function applyShort(on){
  const nav=document.getElementById('topnav'); if(!nav) return;
  [...nav.children].forEach(b=>{ const n=[...b.childNodes].find(x=>x.nodeType===3&&x.nodeValue.trim()); if(!n) return;
    if(on){ const ko=norm(oT.get(n)||(shortOrig.has(n)?shortOrig.get(n)[1]:n.nodeValue)); const s=D.S[ko]; if(s){ if(!shortOrig.has(n)) shortOrig.set(n,[n.nodeValue,ko]); n.nodeValue=s[LANGS.indexOf(L)]; } }
    else if(shortOrig.has(n)){ n.nodeValue=shortOrig.get(n)[0]; shortOrig.delete(n); } });
}
function fitNav(){
  const nav=document.getElementById('topnav'); if(!nav) return; muted=true;
  applyShort(false); nav.classList.remove('nf1','nf2','nf3');
  const tg=nav.previousElementSibling&&nav.previousElementSibling.querySelector('span'); if(tg) tg.style.display='';
  const over=()=>nav.scrollWidth>nav.clientWidth+2;
  if(over()) nav.classList.add('nf1'); if(over()&&tg) tg.style.display='none'; if(over()) nav.classList.add('nf2'); if(over()){ nav.classList.add('nf3'); applyShort(true); }
  mo.takeRecords(); muted=false;
}
/* ---- 언어 드롭다운 ---- */
const LANG_LAB={ko:'한국어',en:'English',ja:'日本語'};
const LSW_ICO='<svg class="lsw-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7 1.62-4.33L19.12 17h-3.24z"/></svg>';
const LSW_CHEV='<svg class="lsw-chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5"/></svg>';
function closeLsw(root){ if(!root) return; root.classList.remove('open'); const b=root.querySelector('.lsw-btn'); if(b) b.setAttribute('aria-expanded','false'); }
function syncLsw(root){
  if(!root) return;
  const lab=root.querySelector('.lsw-lab'); if(lab) lab.textContent=LANG_LAB[L]||L;
  root.querySelectorAll('.lsw-menu [data-l]').forEach(b=>b.classList.toggle('on',b.dataset.l===L));
  const btn=root.querySelector('.lsw-btn'); if(btn) btn.setAttribute('aria-label','Language: '+(LANG_LAB[L]||L));
}
function sw(){
  const d=document.createElement('div'); d.className='lsw i18n-no';
  d.innerHTML='<button type="button" class="lsw-btn" aria-haspopup="listbox" aria-expanded="false">'+LSW_ICO+'<span class="lsw-lab"></span>'+LSW_CHEV+'</button>'+
    '<ul class="lsw-menu" role="listbox">'+LANGS.map(l=>'<li role="none"><button type="button" role="option" data-l="'+l+'">'+LANG_LAB[l]+'</button></li>').join('')+'</ul>';
  const btn=d.querySelector('.lsw-btn');
  btn.onclick=e=>{ e.stopPropagation(); const on=!d.classList.contains('open'); document.querySelectorAll('.lsw.open').forEach(x=>{ if(x!==d) closeLsw(x); }); d.classList.toggle('open',on); btn.setAttribute('aria-expanded',on?'true':'false'); };
  d.querySelectorAll('.lsw-menu [data-l]').forEach(b=>{ b.onclick=e=>{ e.stopPropagation(); setLang(b.dataset.l); closeLsw(d); }; });
  syncLsw(d); return d;
}
function ensureSw(){
  const side=document.getElementById('side'); if(!side) return;
  if(side.querySelector('.lsw')) return;
  const s=sw();
  const vb=side.querySelector('.vbox');
  if(vb) side.insertBefore(s,vb);
  else side.appendChild(s);
}
function setLang(l){
  if(LANGS.indexOf(l)<0) return; muted=true; applyShort(false); revert(); L=l;
  document.documentElement.lang=l; document.documentElement.dataset.lang=l;
  try{ localStorage.setItem('kong-lang',l); }catch(e){}
  if(l!=='ko') walk(document.documentElement);
  mo.takeRecords(); muted=false;
  document.querySelectorAll('.lsw').forEach(syncLsw);
  fitNav(); if(l!=='ko') reobserve(); geoLocal(); if(typeof window.rebuildAudience==='function') window.rebuildAudience(); else if(typeof setupSpy==='function') setupSpy();
}
const GEO={ko:{lon:126.98,lat:37.57,t:'대한민국 · Seoul',w:146,c:''},ja:{lon:139.69,lat:35.69,t:'日本 · Tokyo',w:124,c:'Tokyo'},en:{lon:103.82,lat:1.35,t:'Singapore',w:104,c:'Singapore'}};
function geoLocal(){
  window.KONG_GEO_HL=GEO[L]; muted=true;
  if(window.drawGeo) window.drawGeo();
  document.querySelectorAll('.cities span').forEach(sp=>sp.classList.toggle('loc',!!GEO[L].c&&sp.textContent.trim()===GEO[L].c));
  mo.takeRecords(); muted=false;
}
function tTpl(koTpl, vars){
  let s=(L!=='ko'&&D.T[norm(koTpl)])?D.T[norm(koTpl)][IX[L]]:koTpl;
  return String(s).replace(/\$\{(\w+)\}/g,(_,k)=>vars&&vars[k]!=null?String(vars[k]):'');
}
window.KONG_I18N={setLang,get lang(){return L;},tpl:tTpl};
const sideMo=new MutationObserver(ensureSw);
function init(){
  const side=document.getElementById('side'); if(side) sideMo.observe(side,{childList:true});
  ensureSw();
  document.addEventListener('click',()=>document.querySelectorAll('.lsw.open').forEach(closeLsw));
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') document.querySelectorAll('.lsw.open').forEach(closeLsw); });
  mo.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','placeholder','aria-label']});
  setLang(L);
  let rt;
  const nav=document.getElementById('topnav'), hd=nav&&nav.parentElement; let lw=0;
  if(hd&&window.ResizeObserver) new ResizeObserver(()=>{ const w=Math.round(hd.clientWidth); if(w===lw) return; lw=w; clearTimeout(rt); rt=setTimeout(fitNav,80); }).observe(hd);
}
document.documentElement.dataset.lang=L;
if(document.readyState==='complete') init(); else window.addEventListener('load',init);
})();
