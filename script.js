const cv=document.getElementById('c'),g=cv.getContext('2d'),W=480,H=720;
const FACTS=[
["Yalta, 1945","Stalin promised free elections in Poland, but he never honored the pledge."],
["Potsdam, 1945","Truman met Stalin at Potsdam and became suspicious of Soviet postwar goals."],
["The Iron Curtain","Churchill said an 'Iron Curtain' now split Communist Eastern Europe from the West."],
["Truman Doctrine, 1947","The U.S. promised aid to free countries resisting Communism, starting with Greece and Turkey."],
["Marshall Plan","The U.S. sent economic aid to rebuild Western Europe."],
["Berlin Blockade, 1948","Stalin cut off West Berlin's land routes. The U.S. answered with the Berlin Airlift."],
["NATO, 1949","Western allies formed NATO to defend each other."],
["Warsaw Pact, 1955","The USSR and its Eastern European allies formed the Warsaw Pact in response."],
["China, 1949","Mao Zedong's Communists took over China."],
["Korean War","War ended at Panmunjom in 1953, leaving a Demilitarized Zone (DMZ) between North and South."],
["The Red Scare","Loyalty Review Boards questioned federal workers. 'McCarthyism' means unfounded fear of Communists."],
["The Arms Race","After the USSR tested an atomic bomb, both superpowers built hydrogen bombs."],
["Cuba, 1959-61","Castro made Cuba Communist. The Bay of Pigs invasion, launched by Kennedy, failed."],
["Berlin Wall, 1961","Khrushchev ordered the Wall built. Kennedy declared 'I am a Berliner.'"]];
let got=[];try{got=JSON.parse(localStorage.aa_f||'[]')}catch(e){}
let best=+(localStorage.aa_b||0),mode='title',S,keys={},T={x:240,y:600},AC;
const R=(a,b)=>a+Math.random()*(b-a);
function beep(f,d=.08){try{AC=AC||new AudioContext();const o=AC.createOscillator(),v=AC.createGain();o.frequency.value=f;o.type='square';v.gain.value=.04;o.connect(v);v.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}}
function reset(){S={x:240,y:600,tons:0,lives:3,combo:0,inv:0,shake:0,t:0,cr:[],mg:[],fl:[],pu:[],fx:[],sh:0,mag:0,slow:0,nextF:150,pause:null,won:false,ts:{c:0,m:0,f:0,p:8}};mode='play'}
document.getElementById('play').onclick=()=>{if(mode!='play')reset()};
document.getElementById('facts').onclick=()=>{const d=document.getElementById('gal');d.innerHTML='<div><b>Fact Files: '+got.length+'/14 unlocked.</b> Reach new tonnage milestones to earn more. Tap to close.</div>'+FACTS.map((f,i)=>got.includes(i)?`<div><b>${f[0]}</b><br>${f[1]}</div>`:`<div class="lock">&#128274; Locked. Keep flying!</div>`).join('');d.hidden=false;d.onclick=()=>d.hidden=true};
function pos(e){const r=cv.getBoundingClientRect();T.x=(e.clientX-r.left)/r.width*W;T.y=(e.clientY-r.top)/r.height*H-(e.pointerType=='touch'?70:0)}
cv.addEventListener('pointermove',pos);cv.addEventListener('pointerdown',e=>{pos(e);if(S&&S.pause){S.pause=null}else if(mode!='play')reset()});
onkeydown=e=>{keys[e.key]=1;if(S&&S.pause&&(e.key==' '||e.key=='Enter'))S.pause=null;else if(mode!='play'&&(e.key==' '||e.key=='Enter'))reset()};onkeyup=e=>keys[e.key]=0;
function boom(x,y,c){for(let i=0;i<14;i++)S.fx.push({x,y,vx:R(-160,160),vy:R(-160,160),l:R(.3,.7),c})}
function hurt(){if(S.inv>0||S.sh>0)return;S.lives--;S.inv=1.6;S.combo=0;S.shake=.4;beep(90,.3);boom(S.x,S.y,'#ff8a3c');if(S.lives<=0){mode='over';best=Math.max(best,Math.floor(S.tons));try{localStorage.aa_b=best}catch(e){}}}
function upd(dt){
 S.t+=dt;const lv=Math.floor(S.tons/150),sp=(1+lv*.12)*(S.slow>0?.45:1);
 if(keys.ArrowLeft||keys.a)T.x-=340*dt;if(keys.ArrowRight||keys.d)T.x+=340*dt;if(keys.ArrowUp||keys.w)T.y-=340*dt;if(keys.ArrowDown||keys.s)T.y+=340*dt;
 T.x=Math.max(30,Math.min(W-30,T.x));T.y=Math.max(60,Math.min(H-40,T.y));
 S.x+=(T.x-S.x)*Math.min(1,dt*9);S.y+=(T.y-S.y)*Math.min(1,dt*9);
 ['inv','shake','sh','mag','slow'].forEach(k=>S[k]=Math.max(0,S[k]-dt));
 const ts=S.ts;ts.c-=dt;ts.m-=dt;ts.f-=dt;ts.p-=dt;
 if(ts.c<=0){ts.c=.55;S.cr.push({x:R(30,W-30),y:-20,e:['&#128230;','&#127838;','&#129371;','&#128138;'][Math.floor(R(0,4))]})}
 if(ts.m<=0){ts.m=Math.max(.6,1.9-lv*.15);S.mg.push({x:R(30,W-30),y:-30,vx:R(-60,60)})}
 if(ts.f<=0){ts.f=Math.max(1,2.6-lv*.15);S.fl.push({x:R(50,W-50),y:R(120,H-120),t:0})}
 if(ts.p<=0){ts.p=R(10,15);S.pu.push({x:R(40,W-40),y:-20,k:Math.floor(R(0,3))})}
 S.cr.forEach(c=>{c.y+=150*sp*dt;const dx=S.x-c.x,dy=S.y-c.y,d=Math.hypot(dx,dy);if(S.mag>0&&d<170){c.x+=dx/d*400*dt;c.y+=dy/d*400*dt}
  if(d<28){c.dead=1;S.combo++;const m=Math.min(4,1+Math.floor(S.combo/5));S.tons+=10*m;beep(500+S.combo*15,.05);boom(c.x,c.y,'#ffd54a')}});
 S.mg.forEach(m=>{m.y+=210*sp*dt;m.x+=m.vx*dt+(S.x-m.x)*.4*dt;if(Math.hypot(S.x-m.x,S.y-m.y)<26){m.dead=1;hurt()}});
 S.fl.forEach(f=>{f.t+=dt;if(f.t>1.3&&f.t<1.6&&Math.hypot(S.x-f.x,S.y-f.y)<55)hurt();if(f.t>1.6)f.dead=1});
 S.pu.forEach(p=>{p.y+=110*dt;if(Math.hypot(S.x-p.x,S.y-p.y)<30){p.dead=1;beep(800,.2);if(p.k==0)S.sh=6;if(p.k==1)S.mag=8;if(p.k==2)S.slow=6}});
 S.fx.forEach(f=>{f.x+=f.vx*dt;f.y+=f.vy*dt;f.l-=dt});
 ['cr','mg','pu','fl','fx'].forEach(k=>S[k]=S[k].filter(o=>!o.dead&&o.y<H+40&&(o.l===undefined||o.l>0)));
 if(S.tons>=S.nextF){S.nextF+=150;const c=[...FACTS.keys()].filter(i=>!got.includes(i));const i=c.length?c[0]:-1;
  if(i>=0){got.push(i);try{localStorage.aa_f=JSON.stringify(got)}catch(e){}S.pause={h:'NEW FACT FILE: '+FACTS[i][0],t:FACTS[i][1]}}}
 if(S.tons>=1000&&!S.won){S.won=1;S.pause={h:'BLOCKADE LIFTED! May 1949',t:'Stalin reopened the roads to West Berlin. You flew just over a year. Keep flying for a high score!'}}
}
function plane(x,y,a){g.save();g.translate(x,y);g.globalAlpha=a;g.fillStyle='#b8c4d4';g.beginPath();g.ellipse(0,0,9,26,0,0,7);g.fill();g.fillStyle='#8a99ae';g.fillRect(-32,-4,64,10);g.fillRect(-12,18,24,6);g.fillStyle='#d33a2c';g.fillRect(-32,-4,4,10);g.fillRect(28,-4,4,10);g.fillStyle='#3a4a63';g.fillRect(-4,-18,8,8);g.restore()}
function wrap(t,x,y,w,lh){let l='';t.split(' ').forEach(o=>{if(g.measureText(l+o).width>w){g.fillText(l,x,y);y+=lh;l=''}l+=o+' '});g.fillText(l,x,y)}
function emo(e,x,y,s){g.font=s+'px serif';g.fillText(e.replace(/&#(\d+);/g,(m,n)=>String.fromCodePoint(n)),x,y)}
function draw(){
 g.save();if(S&&S.shake>0)g.translate(R(-6,6),R(-6,6));
 const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#0a1226');gr.addColorStop(1,'#1d3a63');g.fillStyle=gr;g.fillRect(0,0,W,H);
 const t=(S?S.t:performance.now()/1000);g.fillStyle='#fff8';for(let i=0;i<40;i++){g.fillRect((i*97)%W,((i*53+t*60*(1+i%3))%H),2,2)}
 g.strokeStyle='#ff5b4d88';g.setLineDash([12,10]);g.lineWidth=3;g.beginPath();g.moveTo(14,0);g.lineTo(14,H);g.stroke();g.setLineDash([]);
 g.fillStyle='#ffd54a';g.textAlign='center';g.font='bold 11px system-ui';
 if(mode=='title'){g.fillStyle='#fff';g.font='bold 46px Georgia';g.fillText('AIRLIFT ACE',W/2,190);g.font='22px Georgia';g.fillStyle='#ffd54a';g.fillText('Berlin, 1948',W/2,225);plane(W/2,340+Math.sin(t*2)*8,1);
  g.fillStyle='#ddd';g.font='16px system-ui';wrap('Stalin has blockaded West Berlin. Fly supplies in, dodge Soviet MiGs and flak, and unlock the Fact Files.',W/2,450,360,22);g.fillStyle='#fff';g.fillText('Move: mouse, touch, or arrow keys',W/2,560);g.fillText('Best: '+best+' tons · Facts: '+got.length+'/14',W/2,590);g.fillStyle='#ffd54a';g.font='bold 20px system-ui';g.fillText('Tap or press Space to start',W/2,640);g.restore();return}
 S.cr.forEach(c=>emo(c.e,c.x,c.y+10,30));
 S.pu.forEach(p=>{g.fillStyle='#4cc38a55';g.beginPath();g.arc(p.x,p.y,20,0,7);g.fill();emo(['&#128737;','&#129522;','&#9203;'][p.k],p.x,p.y+9,26)});
 S.mg.forEach(m=>{g.save();g.translate(m.x,m.y);g.fillStyle='#e23a2c';g.beginPath();g.moveTo(0,22);g.lineTo(-22,-14);g.lineTo(0,-6);g.lineTo(22,-14);g.fill();g.fillStyle='#fff';g.font='bold 9px system-ui';g.fillText('★',0,-8);g.restore()});
 S.fl.forEach(f=>{const p=Math.min(1,f.t/1.3);g.strokeStyle='#ffb02e';g.lineWidth=2;g.beginPath();g.arc(f.x,f.y,55,0,7);g.stroke();
  if(f.t<1.3){g.fillStyle='#ffb02e55';g.beginPath();g.arc(f.x,f.y,55*p,0,7);g.fill()}else{g.fillStyle='#ff5b4dcc';g.beginPath();g.arc(f.x,f.y,55,0,7);g.fill();emo('&#128165;',f.x,f.y+14,44)}});
 S.fx.forEach(f=>{g.fillStyle=f.c;g.globalAlpha=Math.max(0,f.l*2);g.fillRect(f.x,f.y,4,4);g.globalAlpha=1});
 if(mode=='play'){if(S.sh>0){g.strokeStyle='#4cc38a';g.lineWidth=3;g.beginPath();g.arc(S.x,S.y,40,0,7);g.stroke()}plane(S.x,S.y,S.inv>0&&Math.floor(S.inv*10)%2?.3:1)}
 g.fillStyle='#0009';g.fillRect(0,0,W,44);g.fillStyle='#fff';g.textAlign='left';g.font='bold 16px system-ui';g.fillText(Math.floor(S.tons)+' tons',12,28);
 g.textAlign='center';const mo=['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'][Math.min(11,Math.floor(S.tons/84))];g.fillText(mo+(S.tons>=500?' 1949':' 1948'),W/2,28);
 g.textAlign='right';g.fillText('&#10084;&#65039;'.replace(/&#(\d+);/g,(m,n)=>String.fromCodePoint(n)).repeat(S.lives)+'  x'+Math.min(4,1+Math.floor(S.combo/5)),W-12,28);
 g.fillStyle='#ffffff33';g.fillRect(0,44,W,4);g.fillStyle='#ffd54a';g.fillRect(0,44,W*Math.min(1,S.tons/1000),4);
 if(S.mag>0||S.slow>0){g.textAlign='center';g.fillStyle='#4cc38a';g.fillText((S.mag>0?'MAGNET ':'')+(S.slow>0?'SLOW-MO':''),W/2,70)}
 if(S.pause||mode=='over'){g.fillStyle='#000c';g.fillRect(0,0,W,H);g.textAlign='center';g.fillStyle='#ffd54a';g.font='bold 26px Georgia';
  if(S.pause){wrap(S.pause.h,W/2,250,380,32);g.fillStyle='#fff';g.font='19px Georgia';wrap(S.pause.t,W/2,330,380,28);g.fillStyle='#ffd54a';g.font='bold 16px system-ui';g.fillText('Tap or press Space to keep flying',W/2,520)}
  else{g.fillText('SHOT DOWN',W/2,250);g.fillStyle='#fff';g.font='20px system-ui';g.fillText(Math.floor(S.tons)+' tons delivered',W/2,300);g.fillText('Best: '+best+' tons',W/2,335);g.fillText('Fact Files: '+got.length+'/14',W/2,370);g.fillStyle='#ffd54a';g.fillText('Tap or press Space to fly again',W/2,450)}}
 g.restore()}
let last=performance.now();
(function loop(n){const dt=Math.min(.05,(n-last)/1000);last=n;if(mode=='play'&&!S.pause)upd(dt);document.getElementById('fc').textContent=got.length+'/14';draw();requestAnimationFrame(loop)})(last);
