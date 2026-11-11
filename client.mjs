import {newGame,startGame,step} from "./game.mjs";
const el=id=>document.getElementById(id);
const canvas=el("field"),ctx=canvas.getContext("2d");
let state=newGame(),heldLeft=false,heldRight=false,pointerDirection=0,last=0;
const W=canvas.width,H=canvas.height;
const stars=Array.from({length:110},(_,i)=>({x:(Math.sin(i*94.23)*9831%1+1)%1,y:(Math.sin(i*41.53)*5643%1+1)%1,r:(i%4===0?2:1)}));
function hud(){
 el("score").textContent=String(state.score).padStart(4,"0");
 el("lives").textContent=Array.from({length:3},(_,i)=>i<state.lives?"◆":"◇").join(" ");
 el("elapsed").textContent=state.elapsed.toFixed(1)+"s";
 el("passed").textContent=String(state.passed);
 el("game-status").textContent=state.phase==="running"?"IN FLIGHT":state.phase==="over"?"MISSION ENDED":state.phase.toUpperCase();
}
function overlay(){
 const visible=state.phase!=="running";el("overlay").hidden=!visible;
 if(state.phase==="over"){
  el("overlay-eyebrow").textContent="MISSION COMPLETE";
  el("overlay-title").textContent="You scored "+state.score;
  el("overlay-body").textContent="You cleared "+state.passed+" hazards in "+state.elapsed.toFixed(1)+" seconds. Try a fresh run and beat that result.";
  el("start").textContent="Play again ↗";
 }else if(state.phase==="paused"){
  el("overlay-eyebrow").textContent="MISSION PAUSED";
  el("overlay-title").textContent="Refocus and return.";
  el("overlay-body").textContent="Your position and score are preserved. Resume when ready.";
  el("start").textContent="Resume mission ↗";
 }else{
  el("overlay-eyebrow").textContent="POKYON // ORBIT RUSH";
  el("overlay-title").textContent="Avoid. Adapt. Survive.";
  el("overlay-body").textContent="Steer using A / D, arrows, or touch controls. Dodge hazards and build your score.";
  el("start").textContent="Launch mission ↗";
 }
 el("pause").textContent=state.phase==="paused"?"Resume":"Pause";
}
function launch(){
 if(state.phase==="over")state=newGame();
 state=startGame(state);
 overlay();hud();
 canvas.focus?.();
}
function pause(){
 if(state.phase==="running")state={...state,phase:"paused"};
 else if(state.phase==="paused")state=startGame(state);
 overlay();hud();
}
function reset(){state=newGame();overlay();hud();}
el("start").addEventListener("click",launch);
el("pause").addEventListener("click",pause);
el("restart").addEventListener("click",reset);
document.addEventListener("keydown",e=>{
 if(["ArrowLeft","ArrowRight","KeyA","KeyD","KeyP"].includes(e.code)&&!["INPUT","TEXTAREA"].includes(document.activeElement?.tagName||""))e.preventDefault();
 if(e.code==="ArrowLeft"||e.code==="KeyA")heldLeft=true;
 if(e.code==="ArrowRight"||e.code==="KeyD")heldRight=true;
 if(e.code==="KeyP"&&!e.repeat)pause();
 if(e.code==="Space"&&state.phase!=="running"&&!e.repeat)launch();
});
document.addEventListener("keyup",e=>{
 if(e.code==="ArrowLeft"||e.code==="KeyA")heldLeft=false;
 if(e.code==="ArrowRight"||e.code==="KeyD")heldRight=false;
});
for(const [id,direction]of [["left",-1],["right",1]]){
 const b=el(id);b.addEventListener("pointerdown",e=>{pointerDirection=direction;b.setPointerCapture?.(e.pointerId)});
 for(const name of ["pointerup","pointercancel","lostpointercapture"])b.addEventListener(name,()=>{pointerDirection=0});
}
canvas.addEventListener("pointerdown",e=>{pointerDirection=e.clientX<canvas.getBoundingClientRect().left+canvas.getBoundingClientRect().width/2?-1:1;canvas.setPointerCapture?.(e.pointerId)});
canvas.addEventListener("pointermove",e=>{if(e.buttons)pointerDirection=e.clientX<canvas.getBoundingClientRect().left+canvas.getBoundingClientRect().width/2?-1:1});
for(const name of ["pointerup","pointercancel","lostpointercapture"])canvas.addEventListener(name,()=>{pointerDirection=0});
document.addEventListener("visibilitychange",()=>{if(document.hidden&&state.phase==="running")pause()});
window.addEventListener("blur",()=>{heldLeft=heldRight=false;pointerDirection=0});
function draw(){
 const backdrop=ctx.createLinearGradient(0,0,0,H);backdrop.addColorStop(0,"#071826");backdrop.addColorStop(1,"#102b3b");ctx.fillStyle=backdrop;ctx.fillRect(0,0,W,H);
 ctx.save();
 for(const p of stars){const shift=(p.y+state.elapsed*.012*(p.r+1))%1;ctx.globalAlpha=.3+p.r*.12;ctx.fillStyle="#adf7ed";ctx.fillRect(p.x*W,shift*H,p.r+1,p.r+1)}ctx.restore();
 ctx.strokeStyle="#27516a";ctx.lineWidth=1;
 for(let x=0;x<=W;x+=W/8){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
 for(let y=0;y<=H;y+=H/9){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
 ctx.strokeStyle="#3c6873";ctx.setLineDash([18,22]);ctx.lineWidth=3;
 for(let x=W/4;x<W;x+=W/4){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}ctx.setLineDash([]);
 for(const hazard of state.obstacles){
  const x=hazard.x*W,y=hazard.y*H,r=hazard.radius*W;
  ctx.save();ctx.translate(x,y);ctx.rotate(state.elapsed*.7+hazard.id);
  ctx.shadowColor="#fc966f";ctx.shadowBlur=26;ctx.fillStyle="#ff875a";ctx.strokeStyle="#ffd4ad";ctx.lineWidth=3;
  ctx.beginPath();for(let i=0;i<7;i++){const a=Math.PI*2*i/7,v=i%2===0?1:.78;const px=Math.cos(a)*r*v,py=Math.sin(a)*r*v;if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py)}ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
 }
 const x=state.player.x*W,y=state.player.y*H,scale=1.1;
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
 if(state.invulnerability>0&&Math.floor(state.elapsed*13)%2===0)ctx.globalAlpha=.42;
 ctx.shadowColor="#adff61";ctx.shadowBlur=37;
 ctx.beginPath();ctx.moveTo(0,-34);ctx.lineTo(28,28);ctx.lineTo(0,14);ctx.lineTo(-28,28);ctx.closePath();ctx.fillStyle="#aef45a";ctx.fill();
 ctx.lineWidth=4;ctx.strokeStyle="#e9ffe1";ctx.stroke();
 ctx.fillStyle="#61e9eb";ctx.fillRect(-8,6,16,9);
 ctx.restore();
 const vignette=ctx.createRadialGradient(W/2,H/2,H*.15,W/2,H/2,W*.65);vignette.addColorStop(0,"#00000000");vignette.addColorStop(1,"#020a1699");ctx.fillStyle=vignette;ctx.fillRect(0,0,W,H);
}
function frame(timestamp){
 const dt=last?Math.min((timestamp-last)/1000,.05):0;last=timestamp;
 if(state.phase==="running"){const input=pointerDirection||Number(heldRight)-Number(heldLeft);const before=state.phase;state=step(state,dt,input);if(before!==state.phase)overlay()}
 draw();hud();requestAnimationFrame(frame);
}
overlay();hud();requestAnimationFrame(frame);
