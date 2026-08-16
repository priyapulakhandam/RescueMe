function launchApp(){
  window.location.href = 'app.html';
}
function exitApp(){
  window.location.href = 'index.html';
}

const S={
  current:'home', history:[],
  city:'New Delhi', emergency:'112',
  cards:{debit:true,credit:true,digital:true,banking:true},
  docs:{passport:false,licence:false,nid:false},
  actions:{cards:false,location:false,help:false,embassy:false},
  contacts:[
    {id:1,name:'Priya Sharma',phone:'+91 98765 43210',rel:'Sister'},
    {id:2,name:'Rahul Verma',phone:'+91 91234 56789',rel:'Friend'},
  ],
  docView:null, docChecked:{}, nearbyFilter:'All',
};
const NAV={home:true,help:true,nearby:true,incident:true,settings:true};

function go(id){
  if(id===S.current) return;
  const from=document.getElementById('screen-'+S.current);
  const to=document.getElementById('screen-'+id);
  if(!to) return;
  from.classList.add('leaving');
  to.classList.add('active');
  from.classList.remove('active');
  setTimeout(()=>from.classList.remove('leaving'),340);
  S.history.push(S.current);
  S.current=id;
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  if(NAV[id]){const nb=document.getElementById('nav-'+id);if(nb)nb.classList.add('active');}
  if(id==='help'){renderHelpContacts();renderIntlNumbers();}
  if(id==='nearby')renderPlaces(S.nearbyFilter);
  if(id==='contacts')renderContacts();
  if(id==='safe')renderSafeChecklist();
  if(id==='incident')renderReportPreview();
  if(id==='home')updateHomeProgress();
  if(id==='offline')renderOfflineScreen();
  if(id==='documents'){renderDocTips();S.docView=null;document.getElementById('doc-title').textContent='Document Replacement';document.getElementById('doc-home').style.display='block';document.getElementById('doc-guide').style.display='none';}
}
function back(){
  if(S.history.length===0){go('home');return;}
  const prev=S.history.pop();
  const from=document.getElementById('screen-'+S.current);
  const to=document.getElementById('screen-'+prev);
  to.classList.add('active');
  from.classList.remove('active');
  S.current=prev;
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  if(NAV[prev]){const nb=document.getElementById('nav-'+prev);if(nb)nb.classList.add('active');}
}

function shareLocation(){
  markAction('location');
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      p=>{window.open(`https://wa.me/?text=🆘 I need help. My live location: https://maps.google.com/?q=${p.coords.latitude},${p.coords.longitude}`,'_blank');},
      ()=>alert('📍 Location sharing unavailable. Please share your location manually via WhatsApp or SMS.')
    );
  }
}
function toggleCard(btn,key){
  S.cards[key]=!S.cards[key];
  btn.classList.toggle('off',!S.cards[key]);
  if(!S.cards[key])markAction('cards');
  showFreezeConfirm();
}
function freezeAll(){
  Object.keys(S.cards).forEach(k=>S.cards[k]=false);
  ['debit','credit','digital','banking'].forEach(k=>{const el=document.getElementById('tog-'+k);if(el)el.classList.add('off');});
  const btn=document.getElementById('freeze-all-btn');
  btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" width="22" height="22"><polyline points="20 6 9 17 4 12"/></svg>&nbsp; All Accounts Secured';
  btn.style.background='var(--green)';
  markAction('cards');showFreezeConfirm();
}
function showFreezeConfirm(){
  const el=document.getElementById('freeze-confirm');
  el.style.display='flex';clearTimeout(el._t);
  el._t=setTimeout(()=>el.style.display='none',4000);
}
function toggleDoc(btn,key){S.docs[key]=!S.docs[key];btn.classList.toggle('off',!S.docs[key]);}
function markAction(key){S.actions[key]=true;updateHomeProgress();}
function updateHomeProgress(){
  const map={cards:'Cards frozen',location:'Location shared',help:'Help called',embassy:'Embassy notified'};
  const done=Object.entries(S.actions).filter(([,v])=>v).map(([k])=>map[k]);
  const el=document.getElementById('home-progress');
  const txt=document.getElementById('home-progress-text');
  if(done.length){el.style.display='block';txt.textContent=' '+done.join(' · ');}
  else el.style.display='none';
}

function renderSafeChecklist(){
  const steps=[{key:'cards',label:'Cards secured'},{key:'location',label:'Location shared'},{key:'help',label:'Help contacted'},{key:'embassy',label:'Embassy notified'}];
  document.getElementById('safe-checklist').innerHTML=steps.map(s=>{
    const done=S.actions[s.key];
    return `<div class="safe-item" style="border-color:${done?'var(--green)':'var(--border)'}">
      <div style="width:26px;height:26px;border-radius:50%;background:${done?'var(--green)':'var(--border)'};display:flex;align-items:center;justify-content:center;flex-shrink:0">
        ${done?'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>':'<span style="font-size:10px;font-weight:800;color:#aaa">–</span>'}
      </div>
      <span style="font-weight:700;font-size:14px;color:${done?'var(--green-d)':'var(--muted)'}">${s.label}</span>
      ${!done?'<span style="margin-left:auto;font-size:10px;font-weight:800;color:var(--saffron)">Pending</span>':''}
    </div>`;
  }).join('');
}

function renderHelpContacts(){
  document.getElementById('help-contacts-list').innerHTML=S.contacts.map(c=>`
    <a href="tel:${c.phone}" style="display:flex;align-items:center;gap:13px;background:var(--warm-white);border:1.5px solid var(--border);border-radius:var(--r-md);padding:13px 15px;margin-bottom:9px;color:var(--bark);box-shadow:var(--sh-sm)">
      <div style="width:44px;height:44px;border-radius:12px;background:var(--green-l);display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--green-d)" stroke-width="2.2" stroke-linecap="round" width="22" height="22"><circle cx="12" cy="8" r="4"/><path d="M20 20c0-4-3.6-7-8-7s-8 3-8 7"/></svg>
      </div>
      <div>
        <div style="font-weight:800;font-size:15px">${c.name}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:2px">${c.rel} · ${c.phone}</div>
      </div>
      <div style="margin-left:auto;opacity:.35;font-size:18px">→</div>
    </a>`).join('');
}
function renderIntlNumbers(){
  const nums=[['🇮🇳','India','112','National emergency'],['🇬🇧','United Kingdom','999','All emergencies'],['🇺🇸','USA & Canada','911','All emergencies'],['🇦🇺','Australia','000','All emergencies'],['🇪🇺','European Union','112','All EU countries'],['🇯🇵','Japan','110','Police · 119 Fire']];
  document.getElementById('intl-numbers').innerHTML=nums.map(([f,c,n,s])=>`
    <div style="display:flex;align-items:center;justify-content:space-between;background:var(--warm-white);border-radius:var(--r-sm);border:1px solid var(--border);padding:10px 13px;margin-bottom:7px">
      <div><p style="font-weight:700;font-size:13px;color:var(--bark)">${f} ${c}</p><p style="font-size:11px;color:var(--muted)">${s}</p></div>
      <a href="tel:${n}" style="background:var(--teal);color:#fff;border-radius:8px;padding:6px 14px;font-weight:800;font-size:13px">${n}</a>
    </div>`).join('');
}

const PLACES=[
  {type:'police',  name:'Connaught Place Police Station',     dist:'320m', time:'4 min', open:true, color:'var(--saffron)', lat:28.6315,lng:77.2167},
  {type:'embassy', name:'British High Commission, New Delhi', dist:'1.1km',time:'14 min',open:true, color:'var(--amber)',   lat:28.5986,lng:77.2012},
  {type:'hospital',name:'Ram Manohar Lohia Hospital',         dist:'780m', time:'10 min',open:true, color:'var(--green)',   lat:28.6234,lng:77.2090},
  {type:'police',  name:'Paharganj Police Station',           dist:'950m', time:'12 min',open:true, color:'var(--saffron)', lat:28.6442,lng:77.2100},
  {type:'hospital',name:'Safdarjung Hospital',                dist:'1.4km',time:'18 min',open:true, color:'var(--green)',   lat:28.5685,lng:77.2080},
  {type:'embassy', name:'US Embassy, Chanakyapuri',           dist:'2.1km',time:'26 min',open:false,color:'var(--amber)',   lat:28.5975,lng:77.1859},
];
const PICO={
  police:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="18" height="18"><path d="M12 2L4 6v6c0 5.2 3.4 9.8 8 11 4.6-1.2 8-5.8 8-11V6l-8-4z"/></svg>',
  embassy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="18" height="18"><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M8 22V10"/><path d="M16 22V10"/><path d="M12 4l9 6H3l9-6z"/></svg>',
  hospital:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>',
};
function filterPlaces(f,btn){
  S.nearbyFilter=f;
  document.querySelectorAll('.pill').forEach(p=>p.classList.remove('on'));
  if(btn)btn.classList.add('on');
  renderPlaces(f);
}
function renderPlaces(f){
  const list=f==='All'?PLACES:PLACES.filter(p=>p.type===f.toLowerCase());
  document.getElementById('nearby-count').textContent=`${list.length} locations nearby`;
  document.getElementById('places-list').innerHTML=list.map(p=>`
    <div class="place-row" style="margin-bottom:9px">
      <div style="display:flex;align-items:center;gap:10px">
        <div class="place-ico" style="background:${p.color}22;color:${p.color}">${PICO[p.type]}</div>
        <div>
          <div class="place-name">${p.name}</div>
          <div class="place-meta">${p.dist} · ${p.time} <span class="${p.open?'open-dot':'closed-dot'}"> ${p.open?'● Open':'● Closed'}</span></div>
        </div>
      </div>
      <a href="https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}" target="_blank" class="nav-go">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" width="12" height="12"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>Go
      </a>
    </div>`).join('');
}

function toggleAddForm(){
  const f=document.getElementById('add-contact-form');
  f.style.display=f.style.display==='none'?'flex':'none';
}
function addContact(){
  const name=document.getElementById('c-name').value.trim();
  const phone=document.getElementById('c-phone').value.trim();
  const rel=document.getElementById('c-rel').value.trim();
  if(!name||!phone){alert('Name and phone are required.');return;}
  S.contacts.push({id:Date.now(),name,phone,rel});
  document.getElementById('c-name').value='';
  document.getElementById('c-phone').value='';
  document.getElementById('c-rel').value='';
  toggleAddForm();renderContacts();
}
function removeContact(id){S.contacts=S.contacts.filter(c=>c.id!==id);renderContacts();}
function renderContacts(){
  document.getElementById('contacts-count').textContent=`${S.contacts.length} contact${S.contacts.length!==1?'s':''} saved`;
  const list=document.getElementById('contacts-list');
  if(!S.contacts.length){
    list.innerHTML='<div class="app-card" style="text-align:center;padding:28px;border-style:dashed;color:var(--muted)"><p style="font-weight:700;font-size:14px">No contacts yet</p><p style="font-size:12px;margin-top:4px">Tap + to add trusted contacts.</p></div>';
    return;
  }
  list.innerHTML=S.contacts.map(c=>`
    <div class="contact-card" style="margin-bottom:9px">
      <div style="display:flex;align-items:center;gap:11px">
        <div class="avatar"><svg viewBox="0 0 24 24" fill="none" stroke="var(--saffron-d)" stroke-width="2.2" stroke-linecap="round" width="20" height="20"><circle cx="12" cy="8" r="4"/><path d="M20 20c0-4-3.6-7-8-7s-8 3-8 7"/></svg></div>
        <div><p style="font-weight:800;font-size:14px;color:var(--bark)">${c.name}</p><p style="font-size:11px;color:var(--muted);margin-top:2px">${c.rel?c.rel+' · ':''}${c.phone}</p></div>
      </div>
      <div style="display:flex;gap:7px">
        <a href="tel:${c.phone}" style="width:36px;height:36px;border-radius:10px;background:var(--green);display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" width="16" height="16"><path d="M22 16.9a18.3 18.3 0 0 1-5.1-.6 1 1 0 0 0-1 .24l-2.2 2.2a14.5 14.5 0 0 1-6.4-6.4l2.2-2.2a1 1 0 0 0 .24-1A18.3 18.3 0 0 1 9.1 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1 19 19 0 0 0 19 19 1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z"/></svg></a>
        <button onclick="removeContact(${c.id})" style="width:36px;height:36px;border-radius:10px;background:var(--red-l);display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2.2" stroke-linecap="round" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
      </div>
    </div>`).join('');
}

function updateIncidentBar(){
  const fields=['what','when','where','desc'].map(k=>document.getElementById('inc-'+k).value.trim());
  const filled=fields.filter(Boolean).length;
  document.getElementById('inc-pct').textContent=`${filled}/4`;
  document.getElementById('inc-bar').style.width=`${(filled/4)*100}%`;
  document.getElementById('inc-bar').style.background=filled===4?'var(--green)':'var(--saffron)';
  renderReportPreview();
}
function getReportText(){
  const f=(id)=>document.getElementById('inc-'+id)?.value||'—';
  return `EMERGENCY INCIDENT REPORT
Generated: ${new Date().toLocaleString()}
City: ${S.city}

WHAT WAS STOLEN/LOST: ${f('what')}
DATE & TIME: ${f('when')}
LOCATION: ${f('where')}
DESCRIPTION: ${f('desc')||'—'}
POLICE REFERENCE (FIR No.): ${f('ref')||'Pending'}

SECURED ACCOUNTS:
- Cards frozen: ${S.actions.cards?'Yes':'No'}
- Embassy notified: ${S.actions.embassy?'Yes':'No'}
- Location shared: ${S.actions.location?'Yes':'No'}

LOST DOCUMENTS:
- Passport: ${S.docs.passport?'Reported stolen':'Not reported'}
- Licence: ${S.docs.licence?'Reported stolen':'Not reported'}
- Aadhaar Card: ${S.docs.nid?'Reported stolen':'Not reported'}`;
}
function renderReportPreview(){const el=document.getElementById('report-preview');if(el)el.textContent=getReportText();}
async function copyReport(){
  try{
    await navigator.clipboard.writeText(getReportText());
    const el=document.getElementById('inc-confirm');el.style.display='flex';
    setTimeout(()=>el.style.display='none',3000);
  }catch{alert('Please screenshot the report preview above.');}
}
function saveReport(){
  const el=document.getElementById('inc-confirm');
  el.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="var(--green-d)" stroke-width="2.5" stroke-linecap="round" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg> Report saved successfully.';
  el.style.display='flex';setTimeout(()=>el.style.display='none',4000);
}

function renderOfflineScreen(){
  const steps=[
    ['Stay calm and find a safe public location','A chai shop, hotel lobby, or store can provide safety, help, and a phone.'],
    ['Find a local to help you call emergency services','Show them: "Please call 112. My belongings were stolen." — or show in local language.'],
    ['Go to the nearest police station','Report the theft in person. Request a written FIR (First Information Report) — you will need this.'],
    ["Contact your country's embassy",'They can issue emergency travel documents and help contact your bank.'],
    ['Ask your hotel or dharamshala for help','Hotels deal with this situation regularly and can assist with calls and local guidance.'],
  ];
  document.getElementById('offline-steps-list').innerHTML=steps.map(([t,d])=>`
    <div class="app-card">
      <p style="font-weight:800;font-size:14px;color:var(--bark)">${t}</p>
      <p style="font-size:12px;color:var(--muted);margin-top:5px;line-height:1.6">${d}</p>
    </div>`).join('');

  const numbers=[['🇮🇳 India','112'],['🌍 Global','112'],['🇬🇧 UK','999'],['🇺🇸 USA','911'],['🇦🇺 Australia','000'],['🇯🇵 Japan','110/119']];
  document.getElementById('offline-numbers-list').innerHTML=numbers.map(([c,n])=>`
    <div class="setting-row">
      <span style="font-weight:700;font-size:14px;color:var(--bark)">${c}</span>
      <span style="font-weight:900;font-size:18px;color:var(--saffron)">${n}</span>
    </div>`).join('');

  const phrases=[
    ['English','My belongings were stolen. Please help me.'],
    ['Hindi','Mera samaan chori ho gaya. Kripaya meri madad karein.'],
    ['Bengali','Amar jinishpatra churi hoye geche. Doya kore sahajja korun.'],
    ['Tamil','En saamangal thirduponadhaa. Thayavu seidhu udavi seyyungal.'],
    ['Telugu','Naa samaanulu doorindi. Dayachesi sahaayam cheyyandi.'],
  ];
  document.getElementById('offline-phrases-list').innerHTML=phrases.map(([lang,phrase])=>`
    <div class="app-card">
      <p style="font-size:10px;font-weight:800;color:var(--muted);margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em">${lang}</p>
      <p style="font-size:14px;font-weight:700;line-height:1.5;color:var(--bark)">${phrase}</p>
    </div>`).join('');
}

function renderDocTips(){
  const tips=['Report theft to police within 24 hours','Keep digital copies of documents in email','Photograph your passport before you travel',"Save your embassy's 24/7 emergency line"];
  document.getElementById('doc-tips-list').innerHTML=tips.map(t=>`
    <div class="app-card" style="font-size:13px;font-weight:600;line-height:1.5;display:flex;gap:10px;color:var(--bark)">
      <span>💡</span><span>${t}</span>
    </div>`).join('');
}

const DOC_GUIDES={
  passport:{title:'Replace Your Passport',steps:[
    {t:'Report to police first',d:'Get an FIR with a reference number — you will need this for the embassy.'},
    {t:'Contact your embassy',d:'Call or visit your embassy. They can issue an Emergency Travel Document (ETD) within 1–2 days.'},
    {t:'Gather required documents',d:'Bring: FIR copy, 2 passport photos, proof of identity, and proof of onward travel.'},
    {t:'Pay the fee',d:'Emergency passports typically cost ₹5,000–₹15,000. Credit card or cash accepted at most embassies.'},
    {t:'Collect your ETD',d:'An Emergency Travel Document lets you travel home. Apply for a full passport on return.'},
  ]},
  id:{title:'Replace Aadhaar Card',steps:[
    {t:'File an FIR at the police station',d:'Report the stolen Aadhaar at the nearest police station. Get a written FIR with a reference number.'},
    {t:'Visit the nearest Aadhaar Seva Kendra',d:'Carry your FIR and any alternate ID. You can re-enroll or request a reprint of your Aadhaar.'},
    {t:'Apply via UIDAI when home',d:'Full Aadhaar reprint can also be done at uidai.gov.in or an Aadhaar enrolment centre near you.'},
  ]},
  licence:{title:"Replace Driver's Licence",steps:[
    {t:'Stop driving immediately',d:'Do not drive without a valid licence. Penalties in other states can be significant.'},
    {t:'Report to police',d:'File an FIR for the lost/stolen licence. This protects you if the licence is used fraudulently.'},
    {t:'Request a duplicate at your home RTO',d:'Contact your Regional Transport Office (RTO) with the FIR. A duplicate licence can be issued.'},
    {t:'Use alternative transport',d:'Use auto-rickshaws, taxis, or Ola/Uber until you are home with a replacement.'},
  ]}
};
function showDocGuide(key){
  S.docView=key;
  const guide=DOC_GUIDES[key];
  document.getElementById('doc-title').textContent=guide.title;
  document.getElementById('doc-home').style.display='none';
  document.getElementById('doc-guide').style.display='block';
  document.getElementById('doc-guide-steps').innerHTML=`
    <div class="info-box ib-teal" style="margin-bottom:12px">Tap each step to mark it complete.</div>
    ${guide.steps.map((s,i)=>{
      const ck=key+'-'+i;
      const done=!!S.docChecked[ck];
      return `<div class="step-card ${done?'done':''}" id="step-${ck}" style="margin-bottom:9px">
        <div style="display:flex;align-items:flex-start;gap:12px">
          <button class="step-num ${done?'done':''}" id="stepnum-${ck}" onclick="toggleStep('${ck}')">
            ${done?'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>':(i+1)}
          </button>
          <div><p style="font-weight:800;font-size:14px;color:var(--bark)">${s.t}</p><p style="font-size:12px;color:var(--muted);margin-top:4px;line-height:1.6">${s.d}</p></div>
        </div>
      </div>`;
    }).join('')}
    <button onclick="docBack()" style="background:var(--sand);border:1.5px solid var(--border);border-radius:var(--r-md);padding:13px;font-weight:700;font-size:14px;color:var(--muted);width:100%;margin-top:4px">← Back to Documents</button>`;
}
function toggleStep(ck){
  S.docChecked[ck]=!S.docChecked[ck];
  const done=S.docChecked[ck];
  document.getElementById('step-'+ck).classList.toggle('done',done);
  const num=document.getElementById('stepnum-'+ck);
  num.classList.toggle('done',done);
  num.innerHTML=done?'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>':(ck.split('-')[1]*1+1);
}
function docBack(){
  if(S.docView){
    S.docView=null;
    document.getElementById('doc-title').textContent='Document Replacement';
    document.getElementById('doc-home').style.display='block';
    document.getElementById('doc-guide').style.display='none';
  } else back();
}

function updateCountry(val){const[city,num]=val.split('|');S.city=city;S.emergency=num;}
function resetAll(){
  if(!confirm('Reset all emergency data? This will clear all completed actions.'))return;
  Object.keys(S.actions).forEach(k=>S.actions[k]=false);
  Object.keys(S.cards).forEach(k=>S.cards[k]=true);
  Object.keys(S.docs).forEach(k=>S.docs[k]=false);
  S.docChecked={};
  ['debit','credit','digital','banking'].forEach(k=>{const el=document.getElementById('tog-'+k);if(el)el.classList.remove('off');});
  const btn=document.getElementById('freeze-all-btn');
  if(btn){
    btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" width="24" height="24"><rect x="3" y="11" width="18" height="10" rx="3"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>&nbsp;Freeze Everything Now';
    btn.style.background='var(--saffron)';
  }
  updateHomeProgress();alert('All data has been reset.');
}

const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis');});
},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

document.addEventListener('DOMContentLoaded',()=>{
  renderPlaces('All');
  renderContacts();
  renderReportPreview();
  renderDocTips();
  renderOfflineScreen();
});