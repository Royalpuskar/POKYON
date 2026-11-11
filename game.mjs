// POKYON Orbit Rush: deterministic game simulation with no external dependencies.
export const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));
export function newGame(){
 return {phase:"ready",elapsed:0,score:0,lives:3,player:{x:.5,y:.83},obstacles:[],spawnIn:.85,nextId:1,invulnerability:0,passed:0};
}
export function startGame(old=newGame()) {return {...old,phase:"running"};}
export function step(old,dt,input=0,random=Math.random){
 if(!old||old.phase!=="running")return old;
 if(!Number.isFinite(dt)||dt<0)throw Error("Invalid frame duration");
 const t=clamp(dt,0,.06),move=clamp(Number(input)||0,-1,1),elapsed=old.elapsed+t;
 const player={x:clamp(old.player.x+move*t*.78,.07,.93),y:old.player.y};
 let lives=old.lives,passed=old.passed;
 let invulnerability=Math.max(0,old.invulnerability-t);
 const obstacles=[];
 for(const p of old.obstacles){
  const o={...p,y:p.y+p.speed*t};
  if(o.y>1.15){passed++;continue}
  const radius=(o.radius||.04)+.035;
  if(invulnerability<=0&&Math.hypot(o.x-player.x,o.y-player.y)<radius){
   lives=Math.max(0,lives-1);invulnerability=.9;continue;
  }
  obstacles.push(o);
 }
 let spawnIn=old.spawnIn-t,nextId=old.nextId;
 if(spawnIn<=0){
  const x=clamp(.09+clamp(random(),0,1)*.82,.09,.91);
  obstacles.push({id:nextId++,x,y:-.08,radius:.025+clamp(random(),0,1)*.024,speed:Math.min(.7,.28+elapsed*.004)});
  spawnIn=Math.max(.24,.88-elapsed*.008);
 }
 return {phase:lives===0?"over":"running",elapsed,score:Math.floor(elapsed*5)+passed*12,lives,player,obstacles,spawnIn,nextId,invulnerability,passed};
}
