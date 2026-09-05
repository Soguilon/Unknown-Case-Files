const IMG = {
 crime:"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
 office:"https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
 kitchen:"https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
 basement:"https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=1200&q=80",
 garden:"https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80",
 security:"https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80"
};

const names=["Sarah Vale","Marcus Reed","Emily Cross","Daniel Hart","Thomas Gray"];
const personalities=["calm and precise","defensive and impatient","nervous but observant","quiet and guarded","friendly but evasive"];
const avatarImgs=[
 "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
 "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
 "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
 "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
 "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
];

const rooms=[
 {name:"Crime Scene",img:IMG.crime,objects:[
  ["body","THE BODY","Inspect the victim and establish the first clue."],
  ["watch","BROKEN WATCH","A watch frozen at an important minute."],
  ["photo","TORN PHOTO","A photograph with a missing section."],
  ["floor","FLOOR MARKS","Something heavy was dragged here."]
 ]},
 {name:"Victim's Office",img:IMG.office,objects:[
  ["desk","LOCKED DESK","The desk has a four-digit lock."],
  ["diary","DIARY","A page has been ripped out."],
  ["painting","PAINTINGS","Four paintings hang in an odd order."],
  ["phone","PHONE","The screen is locked."]
 ]},
 {name:"Kitchen",img:IMG.kitchen,objects:[
  ["sink","SINK","A glass with traces of something unusual."],
  ["knife","KNIFE BLOCK","One knife is missing."],
  ["clock","WALL CLOCK","The clock is five minutes slow."],
  ["cabinet","CABINET","A coded cabinet contains lab supplies."]
 ]},
 {name:"Basement",img:IMG.basement,objects:[
  ["maze","SERVICE MAZE","A maintenance route leads deeper underground."],
  ["locker","LOCKER","A three-symbol lock protects a box."],
  ["camera","OLD CAMERA","The footage is damaged but recoverable."],
  ["crate","SEALED CRATE","Something was moved recently."]
 ]},
 {name:"Garden",img:IMG.garden,objects:[
  ["bench","GARDEN BENCH","Fresh soil is trapped beneath it."],
  ["shed","GARDEN SHED","A tool is missing from its hook."],
  ["fountain","FOUNTAIN","The pump has recently been switched on."],
  ["tree","OLD TREE","A carved mark appears under the bark."]
 ]},
 {name:"Security Room",img:IMG.security,objects:[
  ["cctv","CCTV CONSOLE","Several minutes are missing."],
  ["server","SERVER CABINET","A log can be reconstructed."],
  ["drawer","SECURITY DRAWER","Contains visitor records."],
  ["final","CASE BOARD","When enough contradictions are found, reconstruct the murder."]
 ]}
];

let state;
function rand(n){return Math.floor(Math.random()*n)}
function pick(a){return a[rand(a.length)]}
function generateCase(){
 const killerIndex=rand(5);
 const victim="Adrian Cole";
 const weapon=pick(["knife","poison","heavy paperweight"]);
 const motive=pick(["revenge","money","blackmail","fear of exposure"]);
 const time=pick(["21:47","22:05","22:12","22:18"]);
 const falseAlibi=rand(5);
 const redHerring=(killerIndex+1+rand(4))%5;
 const caseNo=String(10000+rand(89999));
 const secrets=names.map((n,i)=>i===killerIndex?"concealing the murder":i===falseAlibi?"hiding a separate secret":i===redHerring?"covering up an unrelated scandal":"knows a small piece of the timeline");
 return {caseNo,killerIndex,victim,weapon,motive,time,falseAlibi,redHerring,secrets,
  discovered:[],inventory:[],room:0,tab:"people",selectedPerson:null,log:[],puzzles:{watch:false,photo:false,desk:false,phone:false,maze:false,locker:false,cctv:false},questions:{},objective:"Inspect the crime scene. Establish the victim's timeline before questioning anyone."};
}
function reset(){state=generateCase();render();log("New case generated. Every playthrough has a different hidden truth.");}
function log(t){state.log.unshift(t); state.log=state.log.slice(0,8); document.getElementById("gameLog").innerHTML=state.log.map(x=>`<div>› ${x}</div>`).join("")}
function has(x){return state.inventory.includes(x)}
function add(x){if(!has(x)){state.inventory.push(x);log(`Evidence collected: ${x}.`);}}
function mark(x){if(!state.discovered.includes(x))state.discovered.push(x)}

function render(){
 document.getElementById("caseId").textContent=`CASE #${state.caseNo}`;
 document.getElementById("roomName").textContent=rooms[state.room].name;
 document.getElementById("roomEyebrow").textContent=`LOCATION ${String(state.room+1).padStart(2,"0")}`;
 document.getElementById("roomCount").textContent=`${String(state.room+1).padStart(2,"0")} / ${String(rooms.length).padStart(2,"0")}`;
 document.getElementById("objectiveText").textContent=state.objective;
 document.getElementById("sceneImage").style.backgroundImage=`url("${rooms[state.room].img}")`;
 document.getElementById("sceneObjects").innerHTML=rooms[state.room].objects.map(o=>`<button class="object-btn" data-object="${o[0]}"><strong>${o[1]}</strong><span>${o[2]}</span></button>`).join("");
 document.querySelectorAll(".object-btn").forEach(b=>b.onclick=()=>interact(b.dataset.object));
 renderInventory(); renderSide(); renderInterrogation();
 document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t.dataset.tab===state.tab));
 document.getElementById("gameLog").innerHTML=state.log.map(x=>`<div>› ${x}</div>`).join("");
}
function renderInventory(){
 const items=["WATCH CLUE","PHOTO CLUE","DESK KEY","PHONE RECORD","MAZE MAP","LOCKER EVIDENCE","CCTV LOG","FINAL EVIDENCE"];
 document.getElementById("inventory").innerHTML=items.map(x=>`<div class="slot" title="${x}">${has(x)?x:""}${has(x)?'<span class="count">1</span>':""}</div>`).join("");
}
function renderSide(){
 const el=document.getElementById("sideContent");
 if(state.tab==="people"){
  el.innerHTML=`<div class="person-list">${names.map((n,i)=>`<button class="person-btn" data-person="${i}"><b>${n}</b><small>${personalities[i]}</small></button>`).join("")}</div>`;
  el.querySelectorAll(".person-btn").forEach(b=>b.onclick=()=>selectPerson(+b.dataset.person));
 } else if(state.tab==="evidence"){
  el.innerHTML=state.discovered.length?`<div class="evidence-list">${state.discovered.map(x=>`<button class="evidence-btn" onclick="inspectEvidence('${x}')"><b>${x}</b><small>Collected / examined clue</small></button>`).join("")}</div>`:`<p class="interrogation-empty">No evidence formally logged yet.</p>`;
 } else {
  const events=[
   ["21:30","Marcus leaves the office."],["21:42","Emily hears an argument."],["21:55","A person enters the kitchen."],[state.puzzles.cctv?"22:05":"??:??","Security footage has a gap."],[state.puzzles.watch?state.time:"??:??","Broken watch stops here."],["22:18","Body is discovered."]
  ];
  el.innerHTML=`<div class="timeline">${events.map(e=>`<div class="event"><strong>${e[0]}</strong>${e[1]}</div>`).join("")}</div>`;
 }
}
function renderInterrogation(){
 const el=document.getElementById("interrogation");
 if(state.selectedPerson===null){el.innerHTML=`<p class="interrogation-empty">Select a suspect or witness from the case file to begin questioning.</p>`;return}
 const i=state.selectedPerson;
 el.innerHTML=`<div class="person-header"><div class="avatar" style="background-image:url('${avatarImgs[i]}')"></div><div><b>${names[i]}</b><div class="eyebrow">${personalities[i]}</div></div></div>
 <div class="dialogue" id="dialogue">"${openingLine(i)}"</div>
 <div class="question-list">${questionsFor(i).map((q,j)=>`<button class="question-btn" data-q="${j}">${q}</button>`).join("")}</div>`;
 el.querySelectorAll(".question-btn").forEach(b=>b.onclick=()=>ask(i,+b.dataset.q));
}
function selectPerson(i){state.selectedPerson=i;state.tab="people";render();log(`You begin an interview with ${names[i]}.`)}
function openingLine(i){
 if(i===state.killerIndex)return pick(["I don't know why you're looking at me.","I've already answered the basic questions.","This is a terrible misunderstanding."]);
 if(i===state.falseAlibi)return pick(["I was here all evening.","I don't remember the exact time.","I don't want to discuss my personal business."]);
 return pick(["I want to help you.","Ask me whatever you need.","I saw something, but I'm not sure it matters."]);
}
function questionsFor(i){return["Where were you at the time of the murder?","When did you last see Adrian?","What are you hiding?","Who do you think is lying?","Confront with the broken watch","Confront with the CCTV gap"]}

function ask(i,q){
 let r="";
 const killer=i===state.killerIndex, falseA=i===state.falseAlibi;
 if(q===0){
  if(killer) r=pick([`I was nowhere near the ${state.room===2?"kitchen":"crime scene"}.`,`I was alone. Nobody can verify it.`]);
  else if(falseA) r="I was in the office. I don't want to explain why.";
  else r=pick(["I was moving between the garden and the hall.","I was with someone for part of the evening.","I was working alone."]);
 } else if(q===1){
  r=killer?"Earlier that evening. Nothing unusual happened.":pick(["Around dinner time.","Not long before the argument.","I saw Adrian shortly before everyone scattered."]);
 } else if(q===2){
  r=killer?pick(["Nothing.","You are looking for a secret that isn't there."]):state.secrets[i];
 } else if(q===3){
  r=i===state.redHerring?names[state.killerIndex]+" is acting strangely.":pick(names.filter((_,x)=>x!==i));
 } else if(q===4){
  if(!state.puzzles.watch){r="You don't have enough evidence to confront them with the watch yet."}
  else r=killer?"That watch proves nothing.":`The watch? I never touched it.`;
 } else {
  if(!state.puzzles.cctv)r="What CCTV gap? I haven't heard about one.";
  else r=killer?"Cameras fail all the time.":`If the cameras went down, someone in security should explain that.`;
 }
 document.getElementById("dialogue").textContent=`"${r}"`;
 state.questions[`${i}-${q}`]=r;
 if((q===4&&state.puzzles.watch)||(q===5&&state.puzzles.cctv)) log(`You challenged ${names[i]} with evidence. Their response was recorded.`);
}

function interact(o){
 switch(o){
 case"body": modal("THE BODY",`The victim, <b>${state.victim}</b>, has no obvious defensive wound. A faint chemical smell is present near the collar. The scene is staged, but not perfectly.`);mark("BODY EXAMINATION");state.objective="Find a physical clue that anchors the timeline.";break;
 case"watch": if(state.puzzles.watch) return modal("BROKEN WATCH","Already examined. It stopped at <b>"+state.time+"</b>."); puzzleWatch();break;
 case"photo": puzzlePhoto();break;
 case"floor": modal("FLOOR MARKS","Parallel scrape marks run toward the service corridor. Something heavy was moved after the victim collapsed.");mark("FLOOR MARKS");break;
 case"desk": puzzleDesk();break;
 case"diary": modal("DIARY","Most pages are harmless. One remaining sentence reads: <div class='clue-box'>THE FOUR PAINTINGS ARE NOT IN THEIR ORIGINAL ORDER.</div>");mark("DIARY CLUE");state.objective="Use the painting arrangement to decode the office lock.";break;
 case"painting": puzzleDesk();break;
 case"phone": puzzlePhone();break;
 case"sink": modal("SINK","A glass has a faint residue. The label on a cleaning bottle has been scratched away.");mark("GLASS RESIDUE");break;
 case"knife": modal("KNIFE BLOCK","One knife is missing. The remaining blades are clean. A tiny thread is caught in the block.");mark("MISSING KNIFE");break;
 case"clock": modal("WALL CLOCK","The wall clock reads five minutes behind. That means visual time cannot be trusted without cross-checking.");mark("CLOCK OFFSET");break;
 case"cabinet": puzzleDesk();break;
 case"maze": puzzleMaze();break;
 case"locker": puzzleLocker();break;
 case"camera": puzzleCCTV();break;
 case"crate": modal("SEALED CRATE","The crate is empty except for packing dust and a fresh scrape. It was used recently.");mark("CRATE MARK");break;
 case"bench": modal("GARDEN BENCH","Fresh soil contains a tiny metal fragment.");mark("METAL FRAGMENT");add("METAL FRAGMENT");break;
 case"shed": modal("GARDEN SHED","The missing tool is a pry bar. The hook has fresh dust around it.");mark("MISSING PRY BAR");break;
 case"fountain": modal("FOUNTAIN","The pump was switched on at 21:58 according to its mechanical timer.");mark("PUMP TIMER");break;
 case"tree": modal("OLD TREE","A carved symbol resembles the third symbol on the basement lock.");mark("TREE SYMBOL");state.objective="Use the tree symbol to solve the basement locker.";break;
 case"cctv":puzzleCCTV();break;
 case"server":puzzleCCTV();break;
 case"drawer":modal("SECURITY DRAWER","Visitor records show one person's stated departure time doesn't match the sign-out sheet.");mark("VISITOR RECORDS");break;
 case"final":finalBoard();break;
 }
 render();
}
function modal(title,body){document.getElementById("modalContent").innerHTML=`<h3>${title}</h3><div>${body}</div>`;document.getElementById("modal").classList.remove("hidden")}
function closeModal(){document.getElementById("modal").classList.add("hidden")}
function puzzleWatch(){
 modal("BROKEN WATCH",`The second hand is frozen. Around the room you find three references: a slow wall clock, a security timestamp and the watch itself.<div class="clue-box">Which source is least affected by a deliberately mis-set clock?</div><div class="choice-grid">
 <button class="choice" onclick="solveWatch('clock')">Use the wall clock.</button>
 <button class="choice" onclick="solveWatch('cctv')">Use the security timestamp.</button>
 <button class="choice" onclick="solveWatch('guess')">Guess from the watch alone.</button></div>`);
}
function solveWatch(x){if(x==="cctv"){state.puzzles.watch=true;mark("BROKEN WATCH — "+state.time);add("WATCH CLUE");state.objective="Question people about "+state.time+" and look for a contradiction.";closeModal();log("The timeline anchor is reliable enough to investigate.");}else log("That source is compromised. Cross-check another clue.");}
function puzzlePhoto(){
 if(state.puzzles.photo)return modal("RECONSTRUCTED PHOTO","The restored photograph shows a figure entering the service corridor shortly before the camera gap.");
 modal("TORN PHOTO",`The photograph is split into tiles. Reconstruct it by choosing the correct order of the three visible fragments.<div class="choice-grid">
 <button class="choice" onclick="solvePhoto('A')">A — window → figure → corridor</button>
 <button class="choice" onclick="solvePhoto('B')">B — corridor → window → figure</button>
 <button class="choice" onclick="solvePhoto('C')">C — figure → corridor → window</button></div>`);
}
function solvePhoto(x){if(x==="A"){state.puzzles.photo=true;mark("RECONSTRUCTED PHOTO");add("PHOTO CLUE");state.objective="Find out why the figure used the service corridor.";closeModal();}else log("The reconstructed scene doesn't make spatial sense. Try again.");}
function puzzleDesk(){
 modal("FOUR-DIGIT LOCK",`The diary says the paintings are out of order. Their labels are <b>1, 4, 2, 3</b>, but the frame dates read <b>3, 1, 4, 2</b>.<div class="clue-box">Restore chronological order, then read the labels.</div><div class="choice-grid">
 <button class="choice" onclick="solveDesk('3142')">3 — 1 — 4 — 2</button>
 <button class="choice" onclick="solveDesk('1423')">1 — 4 — 2 — 3</button>
 <button class="choice" onclick="solveDesk('2413')">2 — 4 — 1 — 3</button></div>`);
}
function solveDesk(x){if(x==="3142"){state.puzzles.desk=true;mark("OFFICE LOCK");add("DESK KEY");state.objective="Use the desk evidence to unlock the phone's hidden record.";closeModal();}else log("The lock rejects that order.");}
function puzzlePhone(){
 if(!state.puzzles.desk)return modal("PHONE","Locked. The office desk may contain the missing unlock clue.");
 modal("PHONE RECORD",`The phone unlocks. One deleted message remains:<div class="clue-box">“If the cameras go dark, use the service route. Do not trust the first story you hear.”</div><p>This message was sent shortly before the murder.</p><button class="choice" onclick="solvePhone()">RESTORE RECORD</button>`);
}
function solvePhone(){state.puzzles.phone=true;mark("PHONE RECORD");add("PHONE RECORD");state.objective="Recover the missing CCTV minutes in the basement.";closeModal();}
function puzzleMaze(){
 modal("SERVICE MAZE",`Three routes are shown. The photo places the figure at the corridor entrance. Which route avoids the blocked maintenance section?<div class="choice-grid">
 <button class="choice" onclick="solveMaze('left')">LEFT → DOWN → RIGHT</button>
 <button class="choice" onclick="solveMaze('middle')">RIGHT → UP → LEFT</button>
 <button class="choice" onclick="solveMaze('right')">DOWN → LEFT → UP</button></div>`);
}
function solveMaze(x){if(x==="left"){state.puzzles.maze=true;mark("SERVICE ROUTE");add("MAZE MAP");state.objective="Open the basement locker using the symbol clue from the garden.";closeModal();}else log("That route ends at a blocked maintenance section.");}
function puzzleLocker(){
 if(!state.puzzles.maze)return modal("LOCKER","Three symbols are needed. Search the connected locations for them.");
 modal("THREE-SYMBOL LOCK",`The first symbol is a triangle. The garden tree revealed the third. The remaining clue is hidden in the restored photo.<div class="choice-grid">
 <button class="choice" onclick="solveLocker('tri-circle-star')">TRIANGLE → CIRCLE → STAR</button>
 <button class="choice" onclick="solveLocker('tri-star-circle')">TRIANGLE → STAR → CIRCLE</button>
 <button class="choice" onclick="solveLocker('circle-tri-star')">CIRCLE → TRIANGLE → STAR</button></div>`);
}
function solveLocker(x){if(x==="tri-star-circle"){state.puzzles.locker=true;mark("LOCKER EVIDENCE");add("LOCKER EVIDENCE");state.objective="Recover CCTV footage and compare it against every suspect's alibi.";closeModal();}else log("The lock gives a hard click, then resets.");}
function puzzleCCTV(){
 if(!state.puzzles.locker)return modal("CCTV CONSOLE","The console is missing a recovery key. The basement locker should contain it.");
 modal("CCTV RECOVERY",`A damaged sequence has three timestamps. Reconstruct the missing minute by comparing the pump timer and watch clue.<div class="clue-box">21:58 → [ ? ] → 22:12</div><div class="choice-grid">
 <button class="choice" onclick="solveCCTV('2205')">22:05</button>
 <button class="choice" onclick="solveCCTV('2208')">22:08</button>
 <button class="choice" onclick="solveCCTV('2210')">22:10</button></div>`);
}
function solveCCTV(x){if(x==="2205"){state.puzzles.cctv=true;mark("CCTV LOG");add("CCTV LOG");state.objective="Cross-check the CCTV gap against suspect statements, then open the final case board.";closeModal();}else log("The recovered sequence doesn't align with the mechanical timer.");}
function inspectEvidence(x){modal(x,"This clue is part of the connected case. Compare it with statements, locations and timestamps rather than treating it as proof by itself.");}
function finalBoard(){
 const ready=state.puzzles.watch&&state.puzzles.photo&&state.puzzles.phone&&state.puzzles.maze&&state.puzzles.locker&&state.puzzles.cctv;
 if(!ready)return modal("CASE BOARD","You are missing major evidence. The board requires the timeline, photograph, phone, route, locker and CCTV to be reconstructed first.");
 const opts=names.map((n,i)=>`<button class="choice" onclick="submitCase(${i})">${n}</button>`).join("");
 modal("FINAL DEDUCTION",`<p>You have reconstructed the critical chain:</p><div class="clue-box">Timeline → service route → missing footage → conflicting alibis</div><p>Who is responsible for Adrian Cole's murder?</p><div class="choice-grid">${opts}</div>`);
}
function submitCase(i){
 if(i===state.killerIndex){
  document.getElementById("modalContent").innerHTML=`<div class="victory"><h3>CASE SOLVED</h3><p><b>${names[i]}</b> was the murderer.</p><p>Motive: <b>${state.motive}</b><br>Method: <b>${state.weapon}</b><br>Critical time: <b>${state.time}</b></p><p>You caught the contradiction before the false alibi could survive.</p><button class="choice" onclick="closeModal();reset()">GENERATE ANOTHER CASE</button></div>`;
  state.objective="Case solved. Generate another case to play again with a different hidden truth.";
 }else{
  document.getElementById("modalContent").innerHTML=`<h3>WRONG ACCUSATION</h3><p>${names[i]} was not the murderer. You found real clues, but the final deduction was incorrect.</p><div class="clue-box">The actual murderer remains unidentified.</div><button class="choice" onclick="closeModal()">RETURN TO CASE</button>`;
 }
}
document.getElementById("prevRoom").onclick=()=>{state.room=(state.room-1+rooms.length)%rooms.length;render();log(`Moved to ${rooms[state.room].name}.`)}
document.getElementById("nextRoom").onclick=()=>{state.room=(state.room+1)%rooms.length;render();log(`Moved to ${rooms[state.room].name}.`)}
document.getElementById("newCaseBtn").onclick=reset;
document.getElementById("closeModal").onclick=closeModal;
document.getElementById("modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal()});
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{state.tab=t.dataset.tab;render()});
let touchStartX=null;
document.querySelector(".scene").addEventListener("touchstart",e=>touchStartX=e.changedTouches[0].clientX,{passive:true});
document.querySelector(".scene").addEventListener("touchend",e=>{if(touchStartX===null)return;const dx=e.changedTouches[0].clientX-touchStartX;if(Math.abs(dx)>55){state.room=(state.room+(dx<0?1:-1)+rooms.length)%rooms.length;render();}touchStartX=null},{passive:true});
document.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"){state.room=(state.room-1+rooms.length)%rooms.length;render()}if(e.key==="ArrowRight"){state.room=(state.room+1)%rooms.length;render()}if(e.key==="Escape")closeModal()});
reset();
