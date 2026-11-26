importScripts('version.js');
const V='step-prof-v'+APP_VERSION,F=['version.js','footer.js','nouveautes.js','nouveautes.json','./', 'index.html', 'eps-core.js', 'css/style.css', 'js/common.js', 'js/prof.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/Icon-stepeps-prof.png'];
const T=2500; // si le réseau ne répond pas en 2,5 s (wifi sans Internet, borne coupée…), on sert tout de suite la copie hors ligne
const net=r=>new Promise((ok,ko)=>{const t=setTimeout(()=>ko(new Error('timeout')),T);fetch(r,{cache:'no-cache'}).then(x=>{clearTimeout(t);ok(x)},e=>{clearTimeout(t);ko(e)})});
// Installation : chaque fichier est chargé séparément ; un fichier manquant ne bloque plus l'installation (donc le mode hors ligne).
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(F.map(u=>fetch(u,{cache:'reload'}).then(r=>r.ok&&c.put(u,r)).catch(()=>{})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('step-prof-')&&x!==V).map(x=>caches.delete(x)))));self.clients.claim()});
// Réseau d'abord (dernière version en ligne), copie locale en secours (hors ligne ou réseau trop lent).
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;
 e.respondWith(net(q).then(r=>{if(r.ok){const c=r.clone();caches.open(V).then(x=>x.put(q,c))}return r})
  .catch(()=>caches.match(q,{ignoreSearch:true}).then(h=>h||(q.mode==='navigate'?caches.match('index.html').then(x=>x||caches.match('./')):undefined)||Response.error())))});
