const K='step:prof';let D=ld(K,{list:[],rows:[]}),cls='',sel=null;const sv=()=>localStorage[K]=JSON.stringify(D);
const sub=(a,b)=>{const x=a.split(' '),y=b.split(' ');return x.every(t=>y.includes(t))||y.every(t=>x.includes(t))};
function toList(R){const h=R[0].map(norm),ci=h.findIndex(x=>x.includes('classe')),ni=h.findIndex(x=>x=='nom'),pi=h.findIndex(x=>x.startsWith('prenom')),ei=h.findIndex(x=>x.includes('eleve')||x.includes('nom'));
if(ci<0||(ni<0&&ei<0))return[];return R.slice(1).map(r=>({n:(ni>=0&&pi>=0?r[ni]+' '+r[pi]:r[ei>=0?ei:ni]||'').trim(),c:(r[ci]||'').trim()})).filter(e=>e.n)}
function scan(){let best=[];for(const k of Object.keys(localStorage)){if(k.startsWith('step:'))continue;try{let v=JSON.parse(localStorage[k]);if(!Array.isArray(v))v=Object.values(v).find(Array.isArray)||(typeof v=='object'?Object.values(v):[]);
const L=v.filter(o=>o&&typeof o=='object').map(o=>{const e=Object.entries(o),g=re=>(e.find(([a])=>re.test(norm(a)))||[])[1]||'';return{n:(g(/^nom$/)&&g(/prenom/)?g(/^nom$/)+' '+g(/prenom/):g(/eleve|nom|name/)),c:g(/classe|class/)}}).filter(e=>e.n&&e.c);if(L.length>best.length)best=L}catch{}}return best}
async function imp(files){let a=0,b=0,l=0;for(const f of files){const R=csvIn(await f.text());if(!R.length)continue;const h=R[0];
if(h.includes('FCE1')&&h.includes('NOM')){R.slice(1).forEach(r=>{const s={};F.forEach(([n,k])=>s[k]=(r[h.indexOf(n)]||'').trim());if(!s.nom||!s.date)return;s.k=tk(s.nom,s.prenom);
const i=D.rows.findIndex(x=>x.k==s.k&&x.date==s.date&&x.obj==s.obj);if(i<0){D.rows.push(s);a++}else{D.rows[i]=s;b++}})}
else{const L=toList(R);if(L.length){D.list=L;l=L.length}}}
sv();draw();toast([l&&`Liste : ${l} élèves`,(a+b)&&`${a} séance(s) ajoutée(s), ${b} mise(s) à jour`].filter(Boolean).join(' · ')||'Fichier non reconnu')}
function build(){const G={};D.rows.forEach(s=>(G[s.k]??=[]).push(s));const used=new Set(),out=[];
const find=(g,k)=>D.list.find((e,i)=>!used.has(i)&&tk(e.n)==k)||D.list.find((e,i)=>!used.has(i)&&sub(tk(e.n),k));
for(const k in G){const g=G[k],s=g[0],e=find(g,k);if(e)used.add(D.list.indexOf(e));
const st=!D.list.length?'sans liste':!e?'non reconnu':norm(e.c).replace(/ /g,'')!=norm(s.classe).replace(/ /g,'')?'classe ≠ '+e.c:'reconnu';
out.push({id:e?.id,nom:e?e.n:s.nom+' '+s.prenom,classe:e?e.c:s.classe,g:g.sort((x,y)=>y.date>x.date?1:-1),st})}
D.list.forEach((e,i)=>{if(!used.has(i))out.push({id:e.id,nom:e.n,classe:e.c,g:[],st:'aucune séance'})});return out.sort((a,b)=>a.classe.localeCompare(b.classe)||a.nom.localeCompare(b.nom))}
function draw(){const all=build(),cl=[...new Set(all.map(x=>x.classe))].sort(),A=all.filter(x=>!cls||x.classe==cls),n=x=>x.g.length,okp=x=>n(x)?Math.round(x.g.filter(s=>calc(s).v=='validé').length/n(x)*100):'–';
$('#cl').innerHTML='<option value="">Toutes les classes</option>'+cl.map(c=>`<option ${c==cls?'selected':''}>${esc(c)}</option>`).join('');
$('#st').innerHTML=`<div><b>${A.length}</b>élèves</div><div><b>${A.filter(n).length}</b>avec séances</div><div><b>${A.reduce((t,x)=>t+n(x),0)}</b>séances</div><div><b>${A.filter(x=>x.st=='non reconnu'||x.st.startsWith('classe')).length}</b>à vérifier</div>`;
$('#tb').innerHTML=A.map((x,i)=>`<tr class="c" data-i="${all.indexOf(x)}"><td><b>${esc(x.nom)}</b></td><td>${esc(x.classe)}</td><td>${n(x)}</td><td>${n(x)?new Date(x.g[0].date).toLocaleDateString('fr-FR'):'–'}</td><td>${okp(x)}${n(x)?' %':''}</td><td><span class="pill ${x.st=='reconnu'?'ok':x.st=='aucune séance'||x.st=='sans liste'?'':x.st=='non reconnu'?'ko':'warn'}">${esc(x.st)}</span></td></tr>`).join('');
const d=all[sel];$("#dt").hidden=!d;$("#dt").innerHTML=d?`<h2>${esc(d.nom)} · ${esc(d.classe)}</h2>`+(d.g.map(s=>{const c=calc(s);return`<p style="padding:8px 0;border-bottom:1px solid var(--line)"><b>${new Date(s.date).toLocaleDateString('fr-FR')}</b> · ${OBJ[s.obj]||''} · FC moy. ${c.m} / visée ${c.t} <span class="pill ${vc(c.v)}">${c.v}</span> · forme ${s.fd}→${s.ff}<br><small>${esc(s.res)}</small></p>`}).join('')||'<small>Aucune séance reçue.</small>'):'';
document.querySelectorAll('tr.c').forEach(r=>r.onclick=()=>{sel=+r.dataset.i;draw();$('#dt').scrollIntoView({behavior:'smooth'})});
$('#ls').textContent=D.list.length?`Liste active : ${D.list.length} élèves`:'Aucune liste importée'}
$('#cl').onchange=e=>{cls=e.target.value;sel=null;draw()};$('#f').onchange=e=>{imp(e.target.files);e.target.value=''};
const dz=$('#dz');dz.onclick=()=>$('#f').click();dz.ondragover=e=>e.preventDefault();dz.ondrop=e=>{e.preventDefault();imp(e.dataTransfer.files)};
const core=()=>new Promise(r=>{if(window.EPS?.all)return r(1);const x=document.createElement('script');x.src='../Mes_Apps_EPS/eps-core.js';x.onload=()=>r(!!window.EPS?.all);x.onerror=()=>r(0);document.head.append(x)});
async function sync(quiet){let L=[];try{if(await core())L=(await EPS.all()).map(e=>({n:((e.nom||'')+' '+(e.prenom||'')).trim(),c:e.classe||'',id:e.id})).filter(e=>e.n)}catch{}
if(!L.length)L=scan();if(L.length){D.list=L;sv();draw();quiet||toast(`${L.length} élèves récupérés depuis Mes Apps EPS`)}else quiet||toast("Liste introuvable : importe le .csv Pronote ou l'export de Mes Apps EPS")}
$('#sc').onclick=()=>sync();
$('#ex').onclick=()=>{const b=build().filter(x=>x.g.length);if(!b.length)return toast('Rien à exporter');dl('Step_compile.csv',csvOut([[...HEAD,'Statut'],...b.flatMap(x=>x.g.map(s=>[...rowOf(s),x.st]))]))};
$('#rz').onclick=()=>{if(confirm('Effacer les séances importées (la liste est conservée) ?')){D.rows=[];sel=null;sv();draw()}};draw();if(!D.list.length)sync(1);
$('#ps').onclick=async()=>{if(!await core())return toast('Mes Apps EPS introuvable');let n=0;
for(const x of build()){if(!x.id||!x.g.length)continue;const v=x.g.filter(s=>calc(s).v=='validé').length;
try{await EPS.setExt('step',x.id,{seances:x.g.length,validees_pct:Math.round(v/x.g.length*100),derniere_seance:x.g[0].date});n++}catch{}}
toast(n?`Résumé Step ajouté à ${n} fiches élèves`:'Aucun élève reconnu à mettre à jour')};
