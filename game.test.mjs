import {test} from "node:test";
import assert from "node:assert/strict";
import {newGame,startGame,step} from "./game.mjs";
test("initial state and deterministic progression",()=>{
 const initial=newGame(),running=startGame(initial);
 const next=step(running,.05,1,()=>.5);
 assert.equal(initial.phase,"ready");assert.equal(running.phase,"running");
 assert.ok(next.player.x>running.player.x);assert.equal(running.player.x,.5);
 assert.deepEqual(step(running,.05,1,()=>.5),next);
});
test("player boundaries and invalid frames",()=>{
 let s=startGame();for(let i=0;i<300;i++)s=step(s,.05,1,()=>.5);
 assert.ok(s.player.x<=.93);assert.throws(()=>step(startGame(),-1,0));
});
test("collisions remove life and set temporary immunity",()=>{
 const s={...startGame(),obstacles:[{id:1,x:.5,y:.83,speed:0,radius:.05}],spawnIn:50};
 const next=step(s,.01,0,()=>.4);
 assert.equal(next.lives,2);assert.equal(next.obstacles.length,0);
 assert.ok(next.invulnerability>0);
});
