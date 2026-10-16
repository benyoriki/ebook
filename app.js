(()=>{'use strict';
const $=s=>document.querySelector(s),app=$('#app');
/* ---- storage.js (lapisan data; ganti isi fungsi ini untuk Firebase) ---- */
const K=k=>'bn_'+k+'_v1';
const DB={get(k,d){try{const v=localStorage.getItem(K(k));return v?JSON.parse(v):d}catch(e){return d}},
set(k,v){try{localStorage.setItem(K(k),JSON.stringify(v));return true}catch(e){toast('Penyimpanan penuh');return false}}};
const rp=n=>'Rp '+n.toLocaleString('id-ID'),id=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
async function hash(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('bn:'+s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2400)}
/* ---- data demo ---- */
const RAW=[['Senja di Ujung Jakarta','Raka Pratama','Romance',0,29000,4.6],['Luka yang Tumbuh','Nadia Putri','Novel',0,25000,4.5],['Bayangan di Balik Hutan','Dimas Ardy','Horor',0,22000,4.3],['Langit ke Tujuh','Sari Melati','Fantasi',1,0,4.7],['Mindset Kaya','Andi Wijaya','Bisnis',0,35000,4.4],['Rahasia Produktif','Maya Sari','Motivasi',0,28000,4.2],['Cinta di Antara Waktu','Dimas Ardy','Romance',0,27000,4.5],['Jejak di Pulau Senja','Sari Melati','Cerita pendek',1,0,4.1],['Dunia Paralel','Dimas Ardy','Thriller',0,29000,4.6],['Kisah Kecil di Kota Besar','Nadia Putri','Cerita pendek',1,0,4.0],['Algoritma Kehidupan','Raka Pratama','Teknologi',0,27000,4.4],['Komik: Sang Petualang','Maya Sari','Komik digital',1,0,4.3]];
const BOOKS=RAW.map((r,i)=>({id:'b'+(i+1),title:r[0],author:r[1],genre:r[2],free:!!r[3],price:r[4],rating:r[5],reviews:200+i*137,status:'Diterbitkan',date:2026*12+i,pop:(i*7)%12,
desc:`Sebuah kisah ${r[2].toLowerCase()} karya ${r[1]} yang membawa pembaca menyusuri perjalanan penuh makna, kejutan, dan emosi.`}));
(function seed(){if(!DB.get('books')){DB.set('books',BOOKS);DB.set('users',[]);DB.set('access',[]);DB.set('transactions',[]);DB.set('progress',{});DB.set('library',{});
Promise.all(['demo123'].map(hash)).then(([h])=>{DB.set('users',[{id:'u1',nama:'Andi Pratama',email:'pembaca@demo.id',pw:h,role:'user',aktif:true},{id:'u2',nama:'Sari Melati',email:'penulis@demo.id',pw:h,role:'penulis',aktif:true},{id:'u3',nama:'Admin',email:'admin@demo.id',pw:h,role:'admin',aktif:true}])})}})();
const books=()=>DB.get('books',[]).filter(b=>b.status==='Diterbitkan');
const bk=i=>DB.get('books',[]).find(b=>b.id===i);
function cover(b){const h=(parseInt(b.id.slice(1))*47)%360,t=esc(b.title).split(' ');const ln=[];let c='';t.forEach(w=>{if((c+' '+w).length>12){ln.push(c);c=w}else c=(c+' '+w).trim()});ln.push(c);
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h},70%,40%)"/><stop offset="1" stop-color="hsl(${(h+60)%360},70%,18%)"/></linearGradient></defs><rect width="200" height="300" fill="url(#g)"/><circle cx="150" cy="70" r="40" fill="hsla(${(h+40)%360},90%,70%,.35)"/><g fill="#fff" font-family="Georgia" font-weight="bold" font-size="22" text-anchor="middle">${ln.map((l,i)=>`<text x="100" y="${150+i*28}">${l}</text>`).join('')}</g><text x="100" y="280" fill="#fffb" font-size="11" text-anchor="middle" font-family="sans-serif">${esc(b.author)}</text></svg>`;
return'data:image/svg+xml,'+encodeURIComponent(svg)}
function chapters(b){return[1,2,3,4,5].map(n=>({n,title:['Pertemuan di Stasiun','Kenangan yang Kembali','Rahasia yang Terbuka','Pilihan Sulit','Awal yang Baru'][n-1],
text:[`Hujan turun pelan di awal kisah "${b.title}". Aroma tanah basah bercampur dengan hiruk pikuk kota. Tokoh utama berdiri di bawah kanopi, menatap jam tangan yang menunjukkan pukul 17.23.`,`Ia menghembuskan napas panjang, mencoba menenangkan pikirannya yang sejak pagi dipenuhi berbagai pertanyaan. Hidupnya terasa seperti kereta yang berjalan tanpa tujuan.`,`Bab ${n} melanjutkan perjalanan dengan konflik yang makin dalam. Setiap keputusan membawa akibat, dan setiap pertemuan membuka lembaran baru yang tak terduga.`,`Pada akhirnya, ia sadar bahwa jawaban tidak selalu ada di luar sana; kadang ia tumbuh pelan di dalam diri sendiri.`]}))}
/* ---- auth ---- */
const me=()=>DB.get('users',[]).find(u=>u.id===DB.get('session'));
async function login(e,pw){const h=await hash(pw);const u=DB.get('users',[]).find(x=>x.email===e.trim().toLowerCase()&&x.pw===h);if(!u)return toast('Email/password salah');if(!u.aktif)return toast('Akun dinonaktifkan');DB.set('session',u.id);toast('Selamat datang, '+u.nama);authUI();location.hash=u.role==='user'?'#/akun':'#/akun'}
async function register(n,e,pw){e=e.trim().toLowerCase();if(!n||!/^\S+@\S+\.\S+$/.test(e)||pw.length<6)return toast('Data tidak valid (password min. 6 karakter)');
const us=DB.get('users',[]);if(us.some(u=>u.email===e))return toast('Email sudah terdaftar');us.push({id:id('u'),nama:n,email:e,pw:await hash(pw),role:'user',aktif:true});DB.set('users',us);login(e,pw)}
function authUI(){const u=me();$('#auth').innerHTML=u?`<a class="btn s" href="#/akun">${esc(u.nama.split(' ')[0])}</a>`:`<a class="btn s" href="#/masuk">Masuk</a>`}
/* ---- akses & transaksi (payment.js) ---- */
const hasAccess=(b,n)=>{if(b.free||n===1)return true;const u=me();return !!u&&DB.get('access',[]).some(a=>a.u===u.id&&a.b===b.id&&(a.c==='all'||a.c===n))};
const chPrice=b=>Math.max(2000,Math.round(b.price/5/500)*500);
function pay(bId,c,metode){const u=me(),b=bk(bId);if(!u||!b)return;const key=c==='all'?'all':+c;
if(DB.get('access',[]).some(a=>a.u===u.id&&a.b===bId&&(a.c==='all'||a.c===key)))return toast('Akses sudah dimiliki');
const tx={id:'TRX-'+Date.now().toString(36).toUpperCase(),u:u.id,b:bId,c:key,total:key==='all'?b.price:chPrice(b),metode,status:'Berhasil',tgl:new Date().toISOString()};
const t=DB.get('transactions',[]);t.push(tx);DB.set('transactions',t);const a=DB.get('access',[]);a.push({u:u.id,b:bId,c:key,tx:tx.id});DB.set('access',a);toast('Pembayaran simulasi berhasil');return tx}
/* ---- tampilan ---- */
const card=b=>`<a class="bk" href="#/buku/${b.id}"><span class="tag ${b.free?'g':''}">${b.free?'Gratis':'Premium'}</span><img loading="lazy" src="${cover(b)}" alt="Cover ${esc(b.title)}" width="200" height="300"><div><b>${esc(b.title)}</b><small>${esc(b.author)}<br>★ ${b.rating} · ${b.free?'Gratis':rp(b.price)}</small></div></a>`;
const gen=()=>[...new Set(books().map(b=>b.genre))];
const V={
beranda(){const l=books();app.innerHTML=`<section class="hero"><div style="display:block"><h1>Temukan Dunia Baru Dalam Setiap Buku</h1><p>Baca bab pertama gratis, dukung penulis favorit, dan nikmati ribuan cerita berkualitas.</p><div><a class="btn c" href="#/katalog">Jelajahi Buku</a><a class="btn o" style="color:#fff;border-color:#fff" href="#/masuk">Jadi Penulis</a></div></div><div style="font-size:90px;justify-content:center">📖</div></section>
<h2>Kategori Populer</h2><div class="chips">${gen().map(g=>`<a class="chip" href="#/katalog/${encodeURIComponent(g)}">${g}</a>`).join('')}</div>
<h2>Buku Populer</h2><div class="grid">${[...l].sort((a,b)=>b.rating-a.rating).slice(0,5).map(card).join('')}</div>
<h2>Buku Gratis</h2><div class="grid">${l.filter(b=>b.free).map(card).join('')}</div>
<h2>Buku Premium</h2><div class="grid">${l.filter(b=>!b.free).slice(0,5).map(card).join('')}</div>`},
katalog(g){V._f={g:g?decodeURIComponent(g):'',s:'',o:'baru',q:$('#q').value};cat()},
buku(i){const b=bk(i);if(!b||b.status!=='Diterbitkan')return V.nf();const u=me(),lib=DB.get('library',{})[u&&u.id]||[];
app.innerHTML=`<div class="det"><div><img src="${cover(b)}" alt="Cover"></div><div><h1>${esc(b.title)}</h1><p>oleh <b>${esc(b.author)}</b> · ${b.genre} · ★ ${b.rating} (${b.reviews})</p><h2 style="color:var(--pr)">${b.free?'Gratis':rp(b.price)}</h2>
<div class="row"><a class="btn" href="#/baca/${b.id}/1">Baca Bab Gratis</a>${b.free?'':`<a class="btn c" href="#/bayar/${b.id}/all">Beli Akses Buku</a>`}<button class="btn o" id="sv">${lib.includes(b.id)?'✓ Tersimpan':'♡ Simpan'}</button></div>
<div class="card"><b>Sinopsis</b><p>${esc(b.desc)}</p></div><div class="card toc"><b>Daftar Isi</b>${chapters(b).map(c=>`<a href="#/baca/${b.id}/${c.n}"><span>Bab ${c.n}: ${c.title}</span><span>${hasAccess(b,c.n)?(c.n===1||b.free?'Gratis':'✓ Dimiliki'):'🔒 '+rp(chPrice(b))}</span></a>`).join('')}</div></div></div>
<h2>Buku Serupa</h2><div class="grid">${books().filter(x=>x.genre===b.genre&&x.id!==b.id||x.author===b.author&&x.id!==b.id).slice(0,5).map(card).join('')}</div>`;
$('#sv').onclick=()=>{if(!me()){toast('Masuk dulu untuk menyimpan');return location.hash='#/masuk'}const L=DB.get('library',{});const a=L[me().id]||[];L[me().id]=a.includes(b.id)?a.filter(x=>x!==b.id):[...a,b.id];DB.set('library',L);V.buku(i)}},
baca(i,n){const b=bk(i);n=+n||1;if(!b||b.status!=='Diterbitkan')return V.nf();const cs=chapters(b),c=cs[n-1];if(!c)return V.nf();const ok=hasAccess(b,n),S=DB.get('reader',{t:'light',f:18});
if(ok&&me()){const p=DB.get('progress',{});p[me().id+'|'+b.id]=n;DB.set('progress',p)}
const body=ok?c.text.map(p=>`<p>${esc(p)}</p>`).join(''):`<p>${esc(c.text[0])}</p>`;
app.innerHTML=`<div class="row sp" style="max-width:680px;margin:0 auto 10px"><a href="#/buku/${b.id}">← Daftar Isi</a><span><button class="btn s o" id="fm">A−</button> <button class="btn s o" id="fp">A+</button> <button class="btn s o" id="tt">🎨</button></span></div>
<div class="bar" style="max-width:680px;margin:0 auto 10px"><i style="width:${n/cs.length*100}%"></i></div>
<article class="rd ${S.t}" style="font-size:${S.f}px;line-height:1.8"><small>${esc(b.title)} · ${esc(b.author)}</small><h2>Bab ${n}: ${c.title}</h2>${body}</article>
${ok?'':`<div class="card lock" style="max-width:680px;margin:14px auto"><h3>🔒 Lanjutkan kisahnya tanpa batas.</h3><p>Bab ${n}: ${c.title}</p>${me()?'':'<p><small>Masuk atau daftar untuk membuka bab premium.</small></p>'}<div class="row" style="justify-content:center"><a class="btn" href="#/bayar/${b.id}/${n}">Buka Bab Ini · ${rp(chPrice(b))}</a><a class="btn c" href="#/bayar/${b.id}/all">Beli Seluruh Buku · ${rp(b.price)}</a></div></div>`}
<div class="row sp" style="max-width:680px;margin:14px auto">${n>1?`<a class="btn o" href="#/baca/${b.id}/${n-1}">← Sebelumnya</a>`:'<span></span>'}<small>${n} / ${cs.length}</small>${n<cs.length?`<a class="btn" href="#/baca/${b.id}/${n+1}">Selanjutnya →</a>`:'<span></span>'}</div>`;
const sv=o=>{DB.set('reader',{...S,...o});V.baca(i,n)};$('#fm').onclick=()=>sv({f:Math.max(14,S.f-2)});$('#fp').onclick=()=>sv({f:Math.min(30,S.f+2)});$('#tt').onclick=()=>sv({t:{light:'sepia',sepia:'dark',dark:'light'}[S.t]})},
bayar(i,c){const b=bk(i),u=me();if(!u){toast('Masuk dulu untuk membeli');return location.hash='#/masuk'}if(!b)return V.nf();const tot=c==='all'?b.price:chPrice(b);
app.innerHTML=`<div class="card" style="max-width:520px;margin:auto"><h2>Checkout</h2><p><b>${esc(b.title)}</b><br>${c==='all'?'Seluruh buku':'Bab '+c}</p><h3>${rp(tot)}</h3><b>Metode (simulasi)</b>${['Transfer Bank','QRIS','E-Wallet'].map((m,k)=>`<label class="r"><input type="radio" name="m" value="${m}" ${k?'':'checked'}>${m}</label>`).join('')}<button id="go" style="width:100%;margin-top:10px">Simulasikan Pembayaran Berhasil</button><p><small>Ini simulasi. Tidak ada transaksi uang nyata.</small></p></div>`;
$('#go').onclick=()=>{if(pay(b.id,c,document.querySelector('[name=m]:checked').value))location.hash=`#/baca/${b.id}/${c==='all'?2:c}`}},
masuk(){app.innerHTML=`<div class="card" style="max-width:420px;margin:auto"><h2>Masuk</h2><input id="e" type="email" placeholder="Email" aria-label="Email"><input id="p" type="password" placeholder="Password" aria-label="Password"><button id="l" style="width:100%">Masuk</button>
<hr><h3>Daftar Baru</h3><input id="rn" placeholder="Nama lengkap"><input id="re" type="email" placeholder="Email"><input id="rp" type="password" placeholder="Password (min. 6)"><button class="o btn" id="r" style="width:100%">Daftar</button>
<div class="card"><small><b>Akun demo</b> (bukan autentikasi aman):<br>pembaca@demo.id · penulis@demo.id · admin@demo.id<br>Password: demo123</small></div></div>`;
$('#l').onclick=()=>login($('#e').value,$('#p').value);$('#r').onclick=()=>register($('#rn').value,$('#re').value,$('#rp').value)},
akun(){const u=me();if(!u){toast('Silakan masuk dulu');return location.hash='#/masuk'}const P=DB.get('progress',{}),L=DB.get('library',{})[u.id]||[],T=DB.get('transactions',[]).filter(t=>t.u===u.id),own=[...new Set(DB.get('access',[]).filter(a=>a.u===u.id).map(a=>a.b))];
const rd=Object.keys(P).filter(k=>k.startsWith(u.id+'|')).map(k=>({b:bk(k.split('|')[1]),n:P[k]})).filter(x=>x.b);
app.innerHTML=`<div class="card"><h2>${esc(u.nama)}</h2><small>${esc(u.email)} · peran: ${u.role}</small><div class="stats"><div><b>${rd.length}</b>Dibaca</div><div><b>${L.length}</b>Koleksi</div><div><b>${own.length}</b>Dibeli</div></div></div>
<h3>Lanjutkan Membaca</h3>${rd.map(x=>`<a class="card row sp" href="#/baca/${x.b.id}/${x.n}"><span>${esc(x.b.title)}</span><span>Bab ${x.n} →</span></a>`).join('')||'<p>Belum ada progres membaca.</p>'}
<h3>Koleksi</h3><div class="grid">${L.map(bk).filter(Boolean).map(card).join('')||'<p>Koleksi kosong.</p>'}</div>
<h3>Riwayat Pembelian</h3>${T.map(t=>`<div class="card row sp"><span>${t.id}<br><small>${esc(bk(t.b)?.title||'-')} · ${t.c==='all'?'Seluruh buku':'Bab '+t.c} · ${t.metode}</small></span><b>${rp(t.total)}<br><small style="color:var(--ok)">${t.status}</small></b></div>`).join('')||'<p>Belum ada transaksi.</p>'}
<div class="row"><button id="lo" class="btn c">Keluar</button><button id="bk" class="btn o">Backup JSON</button><button id="rs" class="btn o">Reset Data Demo</button></div>
<p><small>Dashboard Penulis & Admin: tahap berikutnya (belum dibuat).</small></p>`;
$('#lo').onclick=()=>{DB.set('session',null);authUI();toast('Anda telah keluar');location.hash='#/'};
$('#bk').onclick=()=>{const o={};Object.keys(localStorage).filter(k=>k.startsWith('bn_')).forEach(k=>o[k]=localStorage[k]);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(o)],{type:'application/json'}));a.download='bukunusa-backup.json';a.click()};
$('#rs').onclick=()=>{if(confirm('Hapus semua data demo dan mulai ulang?')){Object.keys(localStorage).filter(k=>k.startsWith('bn_')).forEach(k=>localStorage.removeItem(k));location.hash='#/';location.reload()}}},
nf(){app.innerHTML='<div class="card" style="text-align:center"><h2>404</h2><p>Halaman tidak ditemukan.</p><a class="btn" href="#/">Ke Beranda</a></div>'}};
function cat(){const f=V._f;let l=books().filter(b=>(!f.g||b.genre===f.g)&&(!f.s||(f.s==='g')===b.free)&&(!f.q||(b.title+b.author+b.genre).toLowerCase().includes(f.q.toLowerCase())));
l.sort((a,b)=>f.o==='rating'?b.rating-a.rating:f.o==='judul'?a.title.localeCompare(b.title):b.date-a.date);
app.innerHTML=`<h1>Katalog Buku</h1><div class="chips">${['',...gen()].map(g=>`<button class="chip ${f.g===g?'on':''}" data-g="${g}">${g||'Semua'}</button>`).join('')}</div>
<div class="row"><select id="fs" aria-label="Status"><option value="">Semua status</option><option value="g" ${f.s==='g'?'selected':''}>Gratis</option><option value="p" ${f.s==='p'?'selected':''}>Premium</option></select><select id="fo" aria-label="Urutan"><option value="baru">Terbaru</option><option value="rating" ${f.o==='rating'?'selected':''}>Rating</option><option value="judul" ${f.o==='judul'?'selected':''}>Judul</option></select></div>
<p>${l.length} buku</p><div class="grid">${l.map(card).join('')||'<div class="card">Tidak ada buku ditemukan.</div>'}</div>`;
document.querySelectorAll('[data-g]').forEach(c=>c.onclick=()=>{f.g=c.dataset.g;cat()});$('#fs').onchange=e=>{f.s=e.target.value;cat()};$('#fo').onchange=e=>{f.o=e.target.value;cat()}}
function route(){const[p,...a]=(location.hash.slice(2)||'beranda').split('/');(V[p]&&p[0]!=='_'?V[p]:V.nf)(...a);scrollTo(0,0)}
$('#q').addEventListener('input',e=>{if(!location.hash.startsWith('#/katalog')){location.hash='#/katalog'}setTimeout(()=>{if(V._f){V._f.q=e.target.value;cat()}},0)});
$('#th').onclick=()=>{const t=document.documentElement.dataset.t==='dark'?'light':'dark';document.documentElement.dataset.t=t;DB.set('theme',t)};
document.documentElement.dataset.t=DB.get('theme','light');
const net=()=>$('#net').textContent=navigator.onLine?'● Online':'○ Offline';addEventListener('online',net);addEventListener('offline',net);net();
let dp;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;$('#inst').hidden=false});$('#inst').onclick=()=>dp&&dp.prompt();
addEventListener('hashchange',route);authUI();route();
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
})();
