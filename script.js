const REG={eur:'Western Europe',gt:'Greece & Turkey',ber:'Berlin',kor:'Korea',cub:'Cuba',home:'Home Front'};
const CARDS=[
{n:'Truman Doctrine',c:2,t:1,l:0,b:{gt:3},o:1,d:'Aid free nations resisting Communism.'},
{n:'Marshall Plan',c:3,t:0,l:0,b:{eur:3},o:1,d:'Economic aid to Western Europe.'},
{n:'Berlin Airlift',c:2,t:1,l:0,b:{ber:4},o:0,d:'Supply West Berlin by air.'},
{n:'NATO',c:2,t:1,l:0,b:{eur:2,ber:2},o:0,d:'Defensive alliance. The USSR answers with the Warsaw Pact.'},
{n:'Send Troops',c:3,t:2,l:0,b:{kor:4},o:0,d:'Help South Korea resist attack.'},
{n:'Loyalty Review Boards',c:1,t:0,l:-2,b:{home:3},o:0,d:'Question federal workers. Costs liberty.'},
{n:'CIA Covert Op',c:2,t:1,l:0,b:{cub:3},o:0,d:'Train exiles to overthrow Castro.'},
{n:'Economic Boycott',c:1,t:0,l:0,b:{cub:2},o:0,d:'Cut trade with Cuba.'},
{n:'Hydrogen Bomb',c:3,t:3,l:0,b:{},o:2,d:'Arms race. Strengthens everything but risks war.'},
{n:'Diplomacy',c:1,t:-1,l:0,b:{},o:1,d:'Talks. Calms tension, small help anywhere.'},
{n:'Protect Civil Rights',c:1,t:0,l:2,b:{home:1},o:0,d:'Defend individual rights against fear.'}
];
const EV=[
['1946','The Iron Curtain','Soviets install Communists across Eastern Europe. Churchill warns of an "Iron Curtain." Western Europe is weak.','eur',4],
['1947','Greece & Turkey Threatened','Communists threaten both governments.','gt',4],
['1948','Berlin Blockade','Stalin cuts all land routes to West Berlin.','ber',5],
['1950','Korean War','North Korea invades South Korea. MacArthur nears China\'s border.','kor',5],
['1950s','The Second Red Scare','Fear of Communist spies grows. Senator McCarthy makes charges without evidence.','home',4],
['1955','Warsaw Pact','The Soviets and their allies form a military alliance. The arms race heats up.','eur',5,1],
['1959','Castro Takes Cuba','Fidel Castro seizes U.S. investments and builds a Communist state.','cub',4],
['1961','Berlin Wall','Khrushchev orders a wall built. The Bay of Pigs invasion has just failed.','ber',6,1]
];
let S,sel;
const $=id=>document.getElementById(id);
function start(){S={i:0,b:5,t:2,lib:6,pts:0,reg:{eur:'free',gt:'free',ber:'free',kor:'free',cub:'free',home:'free'},log:[]};sel=[];turn()}
function turn(){sel=[];draw()}
function budget(){return 5-sel.reduce((a,k)=>a+CARDS[k].c,0)}
function draw(){
 const e=EV[S.i];
 $('hud').innerHTML=`<div class="m">Year<b>${e?e[0]:'End'}</b></div><div class="m">Budget<b>${e?budget():0}</b></div><div class="m">Tension ${S.t}/10<b>&#9762;</b><div class="bar"><i style="width:${S.t*10}%;background:var(--red)"></i></div></div><div class="m">Liberty ${S.lib}/10<b>&#9878;</b><div class="bar"><i style="width:${S.lib*10}%;background:var(--blue)"></i></div></div>`;
 $('map').innerHTML=Object.keys(REG).map(k=>`<div class="r ${S.reg[k]} ${e&&e[3]==k?'threat':''}">${REG[k]}<small>${S.reg[k]=='free'?'Free':'Lost'}${e&&e[3]==k?' · Threat '+e[4]:''}</small></div>`).join('');
 if(!e)return finish();
 $('event').innerHTML=`<div class="yr">${e[0]}</div><h3>${e[1]}</h3><p>${e[2]}</p><p><i>Play policy cards (budget 5 each turn) to raise stability in <b>${REG[e[3]]}</b> to at least ${e[4]}. A roll of -1 to +1 is added.</i></p>`;
 $('cards').innerHTML=CARDS.map((c,k)=>{const on=sel.includes(k),off=!on&&c.c>budget();return `<button class="c ${on?'on':''} ${off?'off':''}" onclick="tog(${k})"><b>${c.n}</b><span>Cost ${c.c} · ${c.d}</span></button>`}).join('');
 $('bar').innerHTML=`<button class="go" onclick="resolve()">Resolve ${e[0]}</button>`;
}
function tog(k){if(sel.includes(k))sel=sel.filter(x=>x!=k);else if(CARDS[k].c<=budget())sel.push(k);draw()}
function resolve(){
 const e=EV[S.i],r=e[3];let st=0,t=0,l=0;
 sel.forEach(k=>{const c=CARDS[k];st+=(c.b[r]||0)+c.o;t+=c.t;l+=c.l});
 const roll=Math.floor(Math.random()*3)-1,tot=st+roll,left=budget();
 S.t=Math.max(0,S.t+t+(e[5]||0));S.lib=Math.min(10,S.lib+l);
 let m=`<p><b>${e[0]}:</b> stability ${st} ${roll>=0?'+':''}${roll} = ${tot} vs ${e[4]}. `;
 if(tot>=e[4]){m+=`<span class="win">${REG[r]} holds.</span>`;S.pts+=100+left*10}
 else{m+=`<span class="lose">${REG[r]} falls.</span>`;if(r!='home')S.reg[r]='red';else{S.reg[r]='red';S.lib-=3}S.t++}
 S.log.unshift(m+'</p>');$('log').innerHTML=S.log.join('');
 S.i++;
 if(S.t>=10||S.lib<=0){S.i=EV.length;return finish(true)}
 turn()
}
function finish(bad){
 const held=Object.values(S.reg).filter(v=>v=='free').length;
 let msg;
 if(S.t>=10)msg='Tension reached 10. Nuclear war ends the world.';
 else if(S.lib<=0)msg='You crushed civil liberties. McCarthyism won at home.';
 else{S.pts+=held*50+S.lib*10-S.t*10;msg=held>=5?'Containment worked!':held>=3?'A costly stalemate.':'The Cold War was lost.'}
 $('event').innerHTML=`<h2>${msg}</h2><p>Regions held: ${held}/6 · Final score: <b>${Math.max(0,S.pts)}</b></p>`;
 $('cards').innerHTML='';$('bar').innerHTML='<button class="go" onclick="start()">Play Again</button>';
 $('hud').innerHTML+=''}
start();
