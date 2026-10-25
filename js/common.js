const $=s=>document.querySelector(s),ld=(k,d)=>{try{return JSON.parse(localStorage[k])||d}catch{return d}};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm=s=>(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const tk=(...a)=>norm(a.join(' ')).split(' ').sort().join(' ');
const OBJ={1:'Puissance',2:'Cardio-vasculaire',3:'Mémorisation motrice'};
const FORME=['','Mauvaise','Faible','Moyenne','Bonne','Optimale'];
const F=[['NOM','nom'],['Prénom','prenom'],['Classe','classe'],['Date','date'],['Forme début','fd'],['Objectif','obj'],['Sexe','sexe'],['Âge','age'],['FC repos','fcRepos'],['Intensité %','int'],['FCE1','fce1'],['FCE2','fce2'],['FCE3','fce3'],['FCE4','fce4'],['FCE5','fce5'],['Ressentis','res'],['Forme fin','ff']];
const HEAD=[...F.map(f=>f[0]),'FC max','FC moyenne','FCE théorique','Validation'];
function calc(s){const f=[1,2,3,4,5].map(i=>+s['fce'+i]).filter(Boolean),m=f.length?Math.round(f.reduce((a,b)=>a+b)/f.length):'',
mx=s.sexe=='F'?226-s.age:220-s.age,t=Math.round(+s.fcRepos+(mx-s.fcRepos)*s.int/100);let v='non évalué';
if(m&&t&&mx>0){const d=m-t;v=Math.abs(d)<=10?'validé':d<0?'intensité insuffisante':'intensité excessive'}return{m,mx:mx>0?mx:'',t:t>0?t:'',v}}
const vc=v=>v=='validé'?'ok':v=='non évalué'?'':'warn';
const csvOut=r=>'\ufeff'+r.map(l=>l.map(v=>{v=String(v??'');return/[;"\n\r]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}).join(';')).join('\r\n');
const rowOf=s=>{const c=calc(s);return[...F.map(f=>s[f[1]]??''),c.mx,c.m,c.t,c.v]};
function csvIn(t){t=t.replace(/^\ufeff/,'');const l=t.split(/\r?\n/)[0],d=l.split(';').length>=l.split(',').length?';':',',R=[];let r=[],v='',q=0;
for(let i=0;i<t.length;i++){const c=t[i];if(q){if(c=='"'){if(t[i+1]=='"'){v+='"';i++}else q=0}else v+=c}else if(c=='"')q=1;else if(c==d){r.push(v);v=''}else if(c=='\n'){r.push(v.replace(/\r$/,''));R.push(r);r=[];v=''}else v+=c}
if(v||r.length){r.push(v);R.push(r)}return R.filter(r=>r.some(x=>x.trim()))}
function dl(name,txt){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/csv;charset=utf-8'}));a.download=name;a.click()}
function toast(m){let t=$('#t');if(!t){t=document.createElement('div');t.id='t';t.setAttribute('role','status');t.style.cssText='position:fixed;top:12px;left:50%;transform:translateX(-50%);background:#1b0f3a;color:#fff;padding:10px 18px;border-radius:99px;z-index:9;font-weight:600';document.body.append(t)}t.textContent=m;t.hidden=0;setTimeout(()=>t.hidden=1,3500)}
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
