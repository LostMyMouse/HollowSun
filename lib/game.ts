export type Role = 'Gunslinger' | 'Diplomat' | 'Engineer';
export const ABILITIES=['Strength','Dexterity','Constitution','Intelligence','Wisdom','Charisma'] as const;
export type Ability=typeof ABILITIES[number];
export type Stats=Record<Ability,number>;
export const STAT_COST:Record<number,number>={8:0,9:1,10:2,11:3,12:4,13:5,14:7,15:9};
export function statCost(s:Stats){return ABILITIES.reduce((n,a)=>n+(STAT_COST[s[a]]??100),0);}
export function defaultStats(role:Role):Stats{return role==='Diplomat'?{Strength:8,Dexterity:13,Constitution:12,Intelligence:10,Wisdom:14,Charisma:15}:role==='Engineer'?{Strength:8,Dexterity:14,Constitution:13,Intelligence:15,Wisdom:12,Charisma:10}:{Strength:8,Dexterity:15,Constitution:12,Intelligence:13,Wisdom:10,Charisma:14};}
export type Species='Human'|'Alien'|'Cyborg';
export const SPECIES_BONUSES:Record<Species,Partial<Stats>>={Human:{Charisma:2,Constitution:1,Strength:-1},Alien:{Wisdom:2,Dexterity:1,Constitution:-1},Cyborg:{Intelligence:2,Constitution:1,Charisma:-1}};
export const SPECIES_NOTES:Record<Species,string>={Human:'Social adaptability and endurance; less raw strength.',Alien:'Heightened perception and reflexes; a more fragile constitution.',Cyborg:'Enhanced processing and resilience; a harder social presence.'};
export function effectiveStats(stats:Stats,species:Species):Stats{return Object.fromEntries(ABILITIES.map(a=>[a,stats[a]+(SPECIES_BONUSES[species]?.[a]??0)])) as Stats;}
export function score(g:Pick<Game,'stats'|'species'>,ability:Ability){return effectiveStats(g.stats,g.species)[ability];}
export function modifier(value:number){return Math.floor((value-10)/2);}
export type Scene = 'ship' | 'station' | 'shop' | 'arena';
export const SCENES:Record<Scene,{name:string;label:string;art:string}>={ship:{name:'The Wayfarer',label:'CREW DECK',art:'ship'},station:{name:'Meridian Hangar',label:'MERIDIAN · HANGAR 04',art:'station'},shop:{name:'Brakk’s Salvage',label:'SALVAGE & SUPPLY',art:'shop'},arena:{name:'Veyra’s Throne Room',label:'THE HOLLOW CROWN',art:'arena'}};
export type Point = {x:number;y:number};
export type Intent = 'talk'|'investigate'|'persuade'|'recruit'|'hack'|'sneak'|'attack'|'defend'|'heal'|'rest'|'travel'|'flee'|'release'|'destroy'|'claim'|'improvise';
export const INTENTS:Intent[]=['talk','investigate','persuade','recruit','hack','sneak','attack','defend','heal','rest','travel','flee','release','destroy','claim','improvise'];
export type Plan={intent:Intent;target:string;skill:'Combat'|'Presence'|'Tech'|'Agility'|'Insight';difficulty:number;viable:boolean;reason:string};
export type Roll={skill:string;die:number;bonus:number;dc:number;success:boolean};
export type Entry={id:string;speaker:string;text:string;roll?:Roll;kind?:'player'|'narrator'|'system';ai?:boolean};
export type Enemy={id:string;name:string;hp:number;maxHp:number;pos:Point;portrait:number};
export type Game={version:1;name:string;role:Role;background:string;gender:'Female'|'Male'|'Non-binary';species:'Human'|'Alien'|'Cyborg';stats:Stats;portrait:number;appearance:number;tint:number;hp:number;maxHp:number;credits:number;medkits:number;xp:number;pos:Point;scene:Scene;target:string;flags:Record<string,boolean>;trust:number;combat:boolean;round:number;movement:number;enemies:Enemy[];ending:string;logs:Entry[];memory:string[]};
export type Entity={id:string;name:string;subtitle:string;pos:Point;portrait?:number;kind:'npc'|'enemy'|'object'|'exit'};
export function initialGame(name='Rook',role:Role='Gunslinger',background='Drifter',stats:Stats=defaultStats(role),portrait=0,appearance=0,tint=0,gender:'Female'|'Male'|'Non-binary'='Female'):Game{const species=(['Human','Alien','Cyborg'] as const)[Math.floor(appearance/2)]??'Human';const maxHp=33+modifier(effectiveStats(stats,species).Constitution)*3;return {version:1,name,role,background,gender,species,stats,portrait,appearance,tint,hp:maxHp,maxHp,credits:80,medkits:3,xp:0,pos:{x:48,y:73},scene:'ship',target:'',flags:{},trust:0,combat:false,round:0,movement:16,enemies:[],ending:'',memory:[],logs:[{id:'arrival',speaker:'Game master',kind:'narrator',text:'The docking clamps catch with a thud. Somewhere behind the cockpit, your comms console starts beeping. You weren’t expecting a call.'}]};}
export function entities(g:Game):Entity[]{
 if(g.scene==='ship')return [{id:'comms',name:'Comms console',subtitle:g.flags.transmission?'Sol’s recorded message':'Incoming transmission',pos:{x:28,y:43},kind:'object'},{id:'locker',name:'Equipment locker',subtitle:g.flags.supplies?'Packed for shore leave':'Collect your field kit',pos:{x:70,y:46},kind:'object'},{id:'practice',name:'Diagnostic console',subtitle:g.flags.practice?'Check complete':'Optional systems check',pos:{x:73,y:68},kind:'object'},{id:'ship',name:'Your bunk',subtitle:'Rest aboard the Wayfarer',pos:{x:47,y:38},kind:'object'},{id:'ramp',name:'Boarding ramp',subtitle:'Disembark · Meridian Hangar',pos:{x:24,y:77},kind:'exit'}];
 if(g.scene==='shop')return [{id:'brakk',name:'Brakk',subtitle:'Mechanic · Shopkeeper',pos:{x:65,y:43},portrait:3,kind:'npc'},{id:'wares',name:'Parts and weapons',subtitle:'Inspect the stock',pos:{x:28,y:43},kind:'object'},{id:'bench',name:'Repair bench',subtitle:'Syndicate hardware',pos:{x:80,y:62},kind:'object'},{id:'shopExit',name:'Shop door',subtitle:'Return · Meridian Hangar',pos:{x:34,y:67},kind:'exit'}];

 if(g.scene==='arena')return [{id:'veyra',name:g.flags.bossDefeated?'Veyra · defeated':'Director Veyra',subtitle:'Hollow Sun leader',pos:{x:54,y:40},portrait:5,kind:'enemy'},{id:'relay',name:'Artifact relay',subtitle:g.flags.sabotage?'Disabled':'Exposed power coupling',pos:{x:76,y:53},kind:'object'},{id:'exit',name:'Station lift',subtitle:'Return to Port Meridian',pos:{x:24,y:73},kind:'exit'}];
 return [{id:'nyx',name:'Nyx Vale',subtitle:g.flags.recruited?'Your companion':'Smuggler · Cantina',pos:g.flags.recruited?{x:Math.max(12,g.pos.x-5),y:Math.min(84,g.pos.y+3)}:{x:52,y:38},portrait:1,kind:'npc'},{id:'shopDoor',name:'Brakk’s Salvage',subtitle:'Enter the shop',pos:{x:78,y:43},kind:'exit'},{id:'pip',name:'PIP-7',subtitle:'Survey droid · Docks',pos:{x:27,y:48},portrait:2,kind:'npc'},...(!g.flags.guardsCleared?[{id:'guard',name:'Lieutenant Korr',subtitle:'Syndicate · Cargo security',pos:{x:82,y:67},portrait:4,kind:'enemy' as const}]:[]),{id:'cargo',name:'Cargo vault',subtitle:g.flags.artifact?'Courier rescued':'Restricted freight',pos:{x:89,y:74},kind:'object'},{id:'terminal',name:'Security terminal',subtitle:g.flags.sabotage?'Drones disabled':'Syndicate network',pos:{x:68,y:51},kind:'object'},{id:'ship',name:'The Wayfarer',subtitle:'Board · Crew deck',pos:{x:15,y:43},kind:'exit'},{id:'lift',name:'Throne-room lift',subtitle:'Veyra’s headquarters',pos:{x:88,y:48},kind:'exit'}];
}
export function distance(a:Point,b:Point){return Math.hypot(a.x-b.x,a.y-b.y);}
export function walkable(p:Point,scene:Scene):boolean{
 if(!Number.isFinite(p.x)||!Number.isFinite(p.y))return false;
 const poly=scene==='ship'?[[17,44],[39,28],[86,46],[82,71],[52,77],[33,65],[26,83],[16,80],[23,66]]:scene==='shop'?[[18,45],[44,29],[61,37],[72,44],[86,51],[84,65],[63,78],[42,68],[32,76],[26,71],[31,61]]:scene==='station'?[[10,42],[43,31],[72,37],[91,43],[93,76],[69,91],[27,85],[8,62]]:[[13,42],[50,31],[87,42],[93,74],[65,90],[24,85],[8,65]];
 let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [xi,yi]=poly[i],[xj,yj]=poly[j];if(((yi>p.y)!==(yj>p.y))&&(p.x<(xj-xi)*(p.y-yi)/(yj-yi)+xi))inside=!inside;}return inside;
}
export function findPath(from:Point,to:Point,scene:Scene):Point[]{
 const key=(p:Point)=>`${p.x},${p.y}`;const snap=(p:Point)=>({x:Math.round(p.x/2)*2,y:Math.round(p.y/2)*2});const start=snap(from);let goal=snap(to);
 if(!walkable(goal,scene)){let best=Infinity;for(let x=8;x<=94;x+=2)for(let y=30;y<=90;y+=2){const p={x,y};if(walkable(p,scene)&&distance(p,to)<best){best=distance(p,to);goal=p;}}}
 const open:Point[]=[start],came=new Map<string,Point>(),cost=new Map<string,number>([[key(start),0]]),closed=new Set<string>();
 while(open.length){open.sort((a,b)=>(cost.get(key(a))!+distance(a,goal))-(cost.get(key(b))!+distance(b,goal)));const p=open.shift()!;if(distance(p,goal)<1){const path:Point[]=[goal];let q=goal;while(came.has(key(q))){q=came.get(key(q))!;path.unshift(q);}return path.slice(1);}
 closed.add(key(p));for(const [dx,dy]of [[2,0],[-2,0],[0,2],[0,-2],[2,2],[-2,2],[2,-2],[-2,-2]]){const n={x:p.x+dx,y:p.y+dy};if(!walkable(n,scene)||closed.has(key(n))||!walkable({x:p.x+dx/2,y:p.y+dy/2},scene))continue;const c=cost.get(key(p))!+Math.hypot(dx,dy);if(c<(cost.get(key(n))??Infinity)){came.set(key(n),p);cost.set(key(n),c);if(!open.some(a=>key(a)===key(n)))open.push(n);}}
 }return [];
}
export function append(g:Game,speaker:string,text:string,kind:Entry['kind']='narrator',roll?:Roll,ai=false){g.logs.push({id:crypto.randomUUID(),speaker,text,kind,roll,ai});g.logs=g.logs.slice(-100);}
export function bonus(g:Game,skill:string){const main=g.role==='Gunslinger'?'Combat':g.role==='Diplomat'?'Presence':'Tech';const attribute:Record<string,Ability>={Combat:'Dexterity',Presence:'Charisma',Tech:'Intelligence',Agility:'Dexterity',Insight:'Wisdom'};return modifier(score(g,attribute[skill]??'Wisdom'))+(skill===main?3:1)+(g.xp>=60?1:0)+(skill==='Tech'&&g.flags.gear_decoder?2:skill==='Presence'&&g.flags.gear_translator?2:skill==='Insight'&&g.flags.gear_optics?2:0);}
export function dice(sides:number){const n=new Uint32Array(1);const limit=Math.floor(4294967296/sides)*sides;do{crypto.getRandomValues(n);}while(n[0]>=limit);return n[0]%sides+1;}
// Questions and refusal are dialogue, even when they mention a weapon or an attack.
export function conversationalInput(text:string){return /^(?:hello\b|hi\b|(?:what|why|who|where|when|how|can|could|would|should|do|does|did|is|are)\b|(?:i\s+)?(?:do not|don't|won't|will not|never)\s+(?:shoot|attack|kill|fire|stab|punch)\b|(?:if|suppose|imagine)\b|(?:i\s+)?(?:ask|tell|say|explain|threaten|warn|promise)\b)/i.test(text.trim());}
export function infer(text:string,g:Game):Plan{
 const t=text.toLowerCase();let target=g.target;
 for(const [id,re] of Object.entries({comms:/transmission|comms/,locker:/locker|field kit/,practice:/diagnostic|systems check/,ramp:/ramp|disembark/,shopExit:/shop door|leave the shop/,shopDoor:/enter.*shop|brakk.s salvage/,wares:/wares|stock|parts and weapons/,bench:/repair bench/,nyx:/nyx|smuggler/,brakk:/brakk|mechanic/,pip:/pip|survey/,veyra:/veyra|director|boss/,guard:/korr|guard|lieutenant/,terminal:/terminal|network|drone/,relay:/relay|coupling|coolant/,cargo:/cargo|vault|courier|sol renn/,ship:/ship|wayfarer/,lift:/lift|headquarters|reactor/}))if(re.test(t)){target=id;break;}
 let intent:Intent='talk';let skill:Plan['skill']='Presence';let difficulty=0;
 if(conversationalInput(text)&&/\b(shoot|attack|strike|punch|stab|melee|blast|fire|kill)\b/.test(t)){intent='talk';target=g.target||target;}
 else if(/\b(shoot|attack|strike|punch|stab|melee|blast|fire at|kill)\b/.test(t)){intent='attack';skill='Combat';difficulty=12;}
 else if(/destroy|shatter|break the artifact/.test(t)){intent='destroy';}
 else if(/claim|take over|rule the|keep the artifact/.test(t)){intent='claim';}
 else if(/release|free veyra|spare|arrest|take.*prisoner/.test(t)&&g.flags.bossDefeated){intent='release';}
 else if(/heal|medkit|patch.*up/.test(t)){intent='heal';}
 else if(/rest|sleep|recover/.test(t)){intent='rest';target='ship';}
 else if(/flee|retreat|escape.*fight/.test(t)){intent='flee';skill='Agility';difficulty=10;}
 else if(/defend|cover|brace|dodge/.test(t)){intent='defend';}
 else if(/hack|sabotage|disable|disconnect|overload|rewire|run.*systems check/.test(t)){intent='hack';skill='Tech';difficulty=12;}
 else if(/sneak|stealth|pick.*lock|steal|slip past/.test(t)){intent='sneak';skill='Agility';difficulty=12;}
 else if(/recruit|join.*crew|join me|come with|help me fight/.test(t)){intent='recruit';target='nyx';skill='Presence';difficulty=10;}
 else if(/persuade|convince|bribe|negotiate|pretend|lie|threaten|intimidate|defect/.test(t)){intent='persuade';skill='Presence';difficulty=12;}
 else if(/investigate|search|inspect|examine|look|scan|open|collect.*field kit|play.*transmission/.test(t)){intent='investigate';skill='Insight';}
 else if(/enter|travel|go to|take.*lift|return to|disembark|board the|leave the shop/.test(t)){intent='travel';target=entities(g).find(e=>e.id===target)?.kind==='exit'?target:g.scene==='ship'?'ramp':g.scene==='shop'?'shopExit':g.scene==='arena'?'exit':'lift';}
 else if(!target){intent='improvise';skill='Insight';}
 if(intent==='talk'&&g.target&&entities(g).find(e=>e.id===g.target)?.kind==='npc'&&!/nyx|brakk|pip|veyra|korr/.test(t))target=g.target;
 return {intent,target,skill,difficulty,viable:true,reason:''};
}
export function beginCombat(g:Game,target:string){
 if(g.combat||g.flags.bossDefeated&&target==='veyra'||g.flags.guardsCleared&&target==='guard')return;
 g.combat=true;g.round=1;g.movement=16;
 if(target==='veyra'){const hp=g.flags.sabotage?48:64;g.enemies=[{id:'veyra',name:'Director Veyra',hp,maxHp:hp,pos:{x:54,y:40},portrait:5}];append(g,'Director Veyra',g.flags.sabotage?'“You cut my drone link. Clever. Let’s see how you fare without a terminal between us.”':'“Every debt on this station belongs to me. Yours comes due now.”');}
 else g.enemies=[{id:'guard',name:'Lieutenant Korr',hp:24,maxHp:24,pos:{x:82,y:67},portrait:4},{id:'gunner',name:'Syndicate gunner',hp:14,maxHp:14,pos:{x:72,y:71},portrait:4}];
}
function award(g:Game,flag:string,xp:number){if(!g.flags[flag]){g.flags[flag]=true;g.xp+=xp;}}
export function resolve(original:Game,plan:Plan,input:string,rollDie=dice):{game:Game;facts:string;roll?:Roll}{
 const g=structuredClone(original);append(g,g.name,input,'player');
 if(plan.intent==='attack'&&g.combat&&/^attack[.!]?$/i.test(input.trim())&&!g.enemies.some(e=>e.id===plan.target)&&g.enemies.length)plan={...plan,target:g.enemies[0].id};
 if(plan.intent==='attack'&&conversationalInput(input))plan={...plan,intent:'talk',target:g.target||plan.target,skill:'Presence',difficulty:0};
 const {intent,target}=plan;const entity=entities(g).find(e=>e.id===target);let text='';let speaker='Game master';let roll:Roll|undefined;let consumed=false;
 const finish=()=>{if(text)append(g,speaker,text,'narrator',roll);if(consumed&&g.combat&&g.hp>0)enemyTurn(g,intent==='defend',rollDie);return {game:g,facts:g.logs.slice(original.logs.length>=100?-5:original.logs.length).filter(x=>x.kind!=='player').map(x=>x.speaker+': '+x.text).join('\n'),roll};};
 if(g.ending){text='This chapter has ended. Start a new captain to explore another path.';return finish();}
 if(g.hp<=0){text='You can’t get up. Your rescue beacon is blinking.';return finish();}
 if(!plan.viable){text=plan.reason||'That action is not possible with your current equipment and surroundings.';return finish();}
 const remote=['heal','defend','flee','improvise'].includes(intent);
 const enemy=g.enemies.find(e=>e.id===target)||g.enemies[0];
 if(!remote&&intent!=='attack'&&(!entity||distance(g.pos,entity.pos)>17)){text=entity?`Move closer to ${entity.name} before attempting that.`:'Choose someone or something nearby first.';return finish();}
 if(g.combat&&['rest','travel','recruit'].includes(intent)){text='You cannot do that under fire. Fight, take cover, heal, or retreat first.';return finish();}
 // Validate attacks before rolling so invalid targets cannot produce combat checks.
 if(intent==='attack'){
 const victim=g.combat?g.enemies.find(e=>e.id===target):entity;
 const hostile=g.combat?!!victim:target==='guard'&&!g.flags.guardsCleared||target==='veyra'&&!g.flags.bossDefeated;
 if(!hostile||!victim){text='There is no hostile target to attack here. Your weapon stays lowered.';return finish();}
 if(distance(g.pos,victim.pos)>(/punch|strike|melee|stab/i.test(input)?8:48)){text='Your target is out of range for that attack. Move closer before attacking.';return finish();}
 }
 let dc=0,skill=plan.skill;
 if(intent==='improvise'&&skill==='Combat')skill=conversationalInput(input)?'Presence':'Insight';
 if(intent==='attack'){dc=target==='veyra'?14:11;skill='Combat';}
 if(intent==='hack'){dc=target==='practice'?(g.flags.practice?0:8):['terminal','relay'].includes(target)&&!g.flags.codes&&!g.flags.sabotage?12:0;skill='Tech';}
 if(intent==='sneak'){dc=['cargo','guard'].includes(target)&&!g.flags.codes&&!g.flags.access?12:0;skill='Agility';}
 if(intent==='recruit'){dc=target==='nyx'&&!g.flags.recruited?(g.flags.clue?8:11):0;skill='Presence';}
 if(intent==='persuade'){dc=target==='veyra'?17:12;skill='Presence';}
 if(intent==='flee'){dc=g.combat?10:0;skill='Agility';}
 if(intent==='improvise')dc=Math.min(18,Math.max(0,plan.difficulty));
 if(dc){const die=rollDie(20),b=(skill==='Combat'&&/punch|strike|melee|stab/i.test(input)?modifier(score(g,'Strength'))+(g.role==='Gunslinger'?3:1):bonus(g,skill))+(g.flags.recruited&&skill==='Agility'?2:0);roll={skill,die,bonus:b,dc,success:die+b>=dc};}
 const success=roll?.success??true;
 switch(intent){
 case 'talk':case 'investigate':{
 if(target==='comms'){speaker='Sol Renn';g.flags.transmission=true;text='Static clears. A voice comes through, low and hurried. “Wayfarer? Sol Renn. I’m in Meridian’s cargo vault. Found a key to the old gates. Veyra found out. She’s got the guards—” A door slams somewhere behind them. “Find Nyx. By the cantina. Tell her I called.” The recording ends.';}
 else if(target==='locker'){if(!g.flags.supplies){g.flags.supplies=true;g.medkits=Math.min(10,g.medkits+1);text='You check the blaster’s charge and tuck a fresh medkit into your belt. The seals are intact.';}else text='Your kit’s packed. The locker is empty.';}
 else if(target==='practice')text=g.flags.practice?'The diagnostic light is green. Nothing else needs fixing.':'The ramp sensor is throwing an old fault. You can run a systems check here before heading out. It’s a harmless way to test your tools.';
 else if(target==='wares')text='Used blasters, sealed medkits, a drawer full of mismatched lenses. Brakk has written the prices on tape. Ask him if you want a closer look.';
 else if(target==='bench'){g.flags.weakness=true;text='A dismantled drone sits on the bench. Its power connector carries the same crest as the hangar guards. Brakk looks over. “Veyra’s. All tied to one uplink. Convenient, if you know where to cut.”';}
 else if(target==='nyx'){speaker='Nyx Vale';award(g,'clue',10);text=g.flags.recruited?'“Korr’s still at the vault. Your call how we get past him. I’ll stay close.”':'“Sol called you?” She puts her cup down. “Korr took them into the cargo vault an hour ago. Still alive. I heard shouting.” She glances at the checkpoint. “That key Sol found—Veyra gets it, she can charge every ship that uses the gates. I’d rather she didn’t.”';}
 else if(target==='brakk'){speaker='Brakk';award(g,'weakness',10);text='“See that coupling?” Brakk turns a scorched part over. “Veyra’s drones use the same one. Cut the hangar uplink and half her rig goes dead. There’s a relay upstairs too, if you like doing repairs while someone shoots at you.”';}
 else if(target==='pip'){speaker='PIP-7';award(g,'clue',10);award(g,'codes',5);text='“Sol Renn entered the cargo vault at fourteen-ten. Two guards accompanied them. Sol did not appear pleased.” PIP opens a small projector. “This is the service-door code. I was not asked to keep it secret.”';}
 else if(target==='cargo'){
 if(g.flags.artifact){text='An empty freight crate and a strip of bloodied cloth. Sol is safe aboard the Wayfarer.';}
 else if(g.flags.guardsCleared||g.flags.access){award(g,'artifact',25);award(g,'courier',10);text='The lock releases. Sol is sitting against a freight crate, one wrist wrapped in torn cloth. “Took you long enough.” They press a small crystal into your hand. “Gate key. Don’t plug it into anything Veyra owns.” You point them towards the Wayfarer. They can make it from here.';}
 else text='Three knocks come from the other side. The main lock needs Korr’s override. A narrower service hatch sits below the control panel.';
 }
 else if(target==='guard'){speaker='Lieutenant Korr';text='“Cargo’s off limits.” Something bangs behind the door. Korr stops speaking for a moment. “Look. I was told this was a customs seizure. That’s all I was told.”';}
 else if(target==='terminal')text=g.flags.sabotage?'The drone uplink is dark. Veyra will face you without its support.':'A syndicate terminal controls Veyra’s security drones. You can attempt a hack; PIP’s codes will bypass the check.';
 else if(target==='veyra'){speaker='Director Veyra';text=g.flags.bossDefeated?'Her command rig lies broken. The artifact waits for your decision: destroy it, claim it, or spare Veyra and give the gates to the station.':'“Sol hired you?” Veyra leans back. “That key opens routes nobody’s flown in centuries. I can put fuel depots on them. Patrols. Ships will pay for that.” Her gaze drops to your hands. “So. Do you have it?”';}
 else if(target==='relay')text=g.flags.sabotage?'The relay is disabled. Veyra’s rig is exposed.':'The station’s security grid feeds Veyra’s command rig through this relay. Hacking it could strip away her support.';
 else if(target==='ship')text='Your bunk is unmade. The med station beside it still works. You could get some rest here.';
 else text='The lift is marked PRIVATE. Nobody has bothered to lock it. Veyra apparently prefers visitors to come straight to her.';
 if(['nyx','brakk','pip','guard','veyra'].includes(target)&&!g.flags[`met_${target}`]&&!g.flags.bossDefeated){
 const first:Record<string,Partial<Record<Species,string>>>={nyx:{Alien:'She makes room beside her. “Another Vaeli. Dock control give you trouble?” ',Cyborg:'“If they billed you an interface tax, don’t pay it.” '},brakk:{Cyborg:'“That shoulder joint needs oil. Remind me before you leave.” ',Alien:'“Watch the guild stalls. They double the price when they see those papers.” '},guard:{Alien:'“Navigation permit. Before we go any further.” ',Cyborg:'“Keep your ports covered near the terminal.” '},veyra:{Alien:'“The guilds make life difficult for your people. I could change that.” ',Cyborg:'“Who holds your maintenance contract? Perhaps we know the same people.” '}};
 text=(first[target]?.[g.species]??'')+text;g.flags[`met_${target}`]=true;
 }
 consumed=false;break;}
 case 'recruit':if(target!=='nyx'){text='Nyx is the recruitable companion here.';break;}if(g.flags.recruited){text='Nyx is already in your crew.';break;}speaker='Nyx Vale';if(success){award(g,'recruited',15);g.trust=2;text='“All right. I’m coming.” Nyx checks the charge on her pistol. “But if you start a fight with Korr, give me a second to get behind something.”';}else{g.trust=Math.max(-2,g.trust-1);text='“I don’t know you yet. Find out what Korr’s doing with Sol. Then ask me.”';}break;
 case 'persuade':{
 consumed=false;
 if(target==='guard'){if(success){award(g,'guardsCleared',20);award(g,'ally',10);g.combat=false;g.enemies=[];text='Korr looks back at the vault. “Damn it.” He hands you the override. “Take them to your ship. I’ll tell the patrol we’ve been reassigned.”';}else{text='Korr shakes his head. “And when Veyra asks where they went? I need more than your word.”';}}
 else if(target==='veyra'){if(g.flags.artifact&&(g.flags.ally||g.flags.sabotage)&&success){award(g,'bossDefeated',60);g.combat=false;g.enemies=[];text='Veyra looks at the crystal, then at her darkened command panel. She opens a channel. “All units. Stand down.” The rig uncouples from her shoulders. “You have the station. Keep your end of the deal.”';}else{text='“You want me to hand over Meridian?” Veyra stays in her rig. “Show me the key. Show me you can stop my guards taking it. Then we’ll discuss terms.”';}}
 else if(target==='nyx'){if(success){award(g,'clue',10);g.trust=Math.min(5,g.trust+1);text='Nyx trusts you with the courier’s location: the cargo vault. “Get Sol out. Then we can talk about working together.”';}else text='Nyx is unconvinced, but she is still listening.';}
 else text=success?'Your argument earns a sympathetic hearing. Ask about the courier or the syndicate to learn more.':'Your argument doesn’t land. Try another approach.';break;}
 case 'hack':{
 if(target==='practice'){if(g.flags.practice){text='The diagnostic is finished. The ramp is ready to use.';break;}g.flags.practice=true;text=success?'You reseat the cable. The warning clears. The display keeps the check result beside a steady green light.':'The warning stays on. You switch the ramp to manual release instead. It will open safely; the diagnostic display keeps the failed check for you to review.';break;}
 if(!['terminal','relay'].includes(target)){text='That target has no accessible electronic interface. Try the security terminal or the artifact relay.';break;}
 consumed=g.combat;if(g.flags.sabotage){text='The uplink is already disabled.';break;}
 if(success||g.flags.codes){award(g,'sabotage',20);for(const e of g.enemies)if(e.id==='veyra'){e.hp=Math.max(1,e.hp-16);}text='The security uplink collapses. Veyra’s drones go dark and her rig loses its shield reserve. Your sabotage will matter in the showdown.';if(g.flags.codes){roll=undefined;text='PIP’s access codes bypass the lock. '+text;}}
 else text='The terminal rejects your intrusion and records the attempt. You can retry, get PIP’s codes, or take your chances with Veyra’s drones.';break;}
 case 'sneak':{
 if(!['cargo','guard'].includes(target)){text='There is no concealed route through that target. The cargo vault has a service entrance.';break;}
 if(g.flags.access){text='You already opened the vault’s service entrance.';break;}
 if(success||g.flags.codes){award(g,'access',20);text='You slip through the service hatch and unlock the cargo vault from inside. You can now investigate it without fighting the patrol.';if(g.flags.codes)roll=undefined;}
 else{beginCombat(g,'guard');consumed=true;text='A boot scrapes the deck. Korr spins toward you and draws his blaster. The patrol has spotted you.';}break;}
 case 'attack':{
 if(!g.combat&&entity&&distance(g.pos,entity.pos)>(/punch|strike|melee|stab/i.test(input)?8:48)){text='Your target is out of range for that attack. Move closer before attacking.';roll=undefined;break;}
 if(!g.combat){if(target==='guard'&&!g.flags.guardsCleared||target==='veyra'&&!g.flags.bossDefeated){beginCombat(g,target);}else{text='There is no hostile target to attack here. Your weapon stays lowered.';break;}}
 const victim=g.enemies.find(e=>e.id===target)||enemy||g.enemies[0];if(!victim){text='There is no active enemy.';break;}
 if(distance(g.pos,victim.pos)>(/punch|strike|melee|stab/i.test(input)?8:48)){text='Your target is out of range for that attack. Move closer before attacking.';roll=undefined;break;}
 consumed=true;if(success){const damage=rollDie(8)+4+(roll?.die===20?6:0)+(g.role==='Gunslinger'?2:0)+(g.flags.gear_blaster&&!/punch|strike|melee|stab/i.test(input)?2:0);victim.hp=Math.max(0,victim.hp-damage);text=`Your shot hits ${victim.name} for ${damage} damage.`;}else text=`Your shot misses ${victim.name} and scorches the decking.`;
 if(g.flags.recruited){const live=g.enemies.find(e=>e.hp>0);if(live){const damage=rollDie(4)+2;live.hp=Math.max(0,live.hp-damage);text+=` Nyx adds ${damage} covering-fire damage.`;}}
 g.enemies=g.enemies.filter(e=>e.hp>0);if(!g.enemies.length){g.combat=false;if(g.scene==='arena'){award(g,'bossDefeated',60);text+=' Veyra’s rig shatters. She falls to her knees. The fight is over; the fate of the artifact is yours to decide.';}else{award(g,'guardsCleared',30);g.credits+=40;text+=' The patrol is defeated. You recover 40 credits and the vault override.';}}break;}
 case 'defend':consumed=g.combat;text=g.combat?'You brace behind cover. Incoming attacks this round face a higher defense.':'You scan the concourse for cover. No one is attacking you.';break;
 case 'heal':if(g.medkits<1){text='No medkits remain. Rest at your ship when you are out of combat.';break;}if(g.hp===g.maxHp){text='You are already at full health.';break;}g.medkits--;const healed=Math.min(16,g.maxHp-g.hp);g.hp+=healed;consumed=g.combat;text=`You apply a medkit and recover ${healed} health.`;break;
 case 'rest':if(g.scene!=='ship'){text='Your bunk is aboard the Wayfarer. Board the ship first.';break;}g.hp=g.maxHp;if(g.medkits===0)g.medkits=1;text='You let the med station do its work, then lie down until your hands stop shaking. Your health is restored. If your pouch was empty, the emergency locker supplies one medkit.';break;
 case 'travel':{
 const travel=(scene:Scene,pos:Point,line:string)=>{g.scene=scene;g.pos=pos;g.target='';g.movement=16;text=line;};
 if(target==='ramp'&&g.scene==='ship'){
 if(!g.flags.transmission){text='The comms light is still flashing. You should hear that message before leaving.';break;}
 if(!g.flags.supplies){text='Your field kit is still in the locker. Grab it before heading into the hangar.';break;}
 g.flags.landed=true;travel('station',{x:20,y:52},'Warm air rolls up the ramp, carrying fuel fumes and frying onions. A customs drone scans your hull, then loses interest. Across the hangar, a woman in a weathered blue coat watches the cargo checkpoint.');}
 else if(target==='ship'&&g.scene==='station')travel('ship',{x:28,y:73},'The Wayfarer smells of warm wiring and yesterday’s coffee. You pull the hatch shut behind you.');
 else if(target==='shopDoor'&&g.scene==='station')travel('shop',{x:37,y:65},'A bell rattles above the door. Brakk puts down a soldering iron. “Mind the crate. The lid bites.”');
 else if(target==='shopExit'&&g.scene==='shop')travel('station',{x:75,y:48},'The shop bell rattles again. Outside, a cargo tug crawls past the checkpoint.');
 else if(target==='lift'&&g.scene==='station'){travel('arena',{x:29,y:71},'The lift shudders to a stop. Veyra’s throne sits above the exposed reactor, cables running from its base into her armour. She sets down her glass. “You’re a long way from your berth.”');g.target='veyra';}
 else if(target==='exit'&&g.scene==='arena')travel('station',{x:83,y:52},'The lift takes you back to the hangar. Nobody asks what happened upstairs.');
 else text='You need to reach a door or a boarding ramp to leave this area.';break;}
 case 'flee':if(!g.combat){text='You are already free to explore.';break;}if(success){g.combat=false;g.enemies=[];g.scene='station';g.pos={x:23,y:51};g.target='';text='You break line of sight and retreat to the docks. Your enemies will regroup before the next confrontation.';}else{consumed=true;text='An enemy cuts off your escape. You remain in combat.';}break;
 case 'destroy':case 'claim':case 'release':{
 if(!g.flags.bossDefeated){text='Veyra still controls the reactor. Resolve the confrontation before deciding the artifact’s fate.';break;}
 if(g.scene!=='arena'){text='Return to the reactor chamber to decide the artifact’s fate.';break;}
 if(intent==='destroy'){g.ending='A sky without masters';text='You shatter the artifact. Across the sector, the old gates go dark—but nobody will ever own them. Veyra is taken into custody. Port Meridian must build its own future, and Sol lives to help it.';}
 else if(intent==='claim'){g.ending='The new sun';text='You take the artifact and the syndicate’s command seal. Veyra yields her empire. Port Meridian has a new ruler. Nyx watches you carefully: freedom was always easier to promise than to give.';}
 else{g.ending='An open horizon';text='You strip Veyra of command and place the gates in the station council’s hands. Her life is spared, but her empire is finished. For the first time in years, ships leave Port Meridian owing nobody a debt.';}
 if(!g.flags.courier)text=text.replace('and Sol lives to help it.','and the council sends rescuers to the cargo vault.');g.memory.push(text);break;}
 case 'improvise':text=plan.reason||(success?'You give it a try. Nothing obvious changes. You’ll need another approach.':'The attempt does not work. You can adjust your approach.');consumed=g.combat&&!['Presence','Insight'].includes(skill);break;
 }
 return finish();
}
function enemyTurn(g:Game,cover:boolean,rollDie:(n:number)=>number){
 for(const e of g.enemies){const die=rollDie(20),dc=10+modifier(score(g,'Dexterity'))+(cover?6:0)+(g.flags.gear_armour?1:0);let damage=0;if(die+3>=dc){damage=rollDie(6)+2+(e.id==='veyra'&&!g.flags.sabotage?2:0);g.hp=Math.max(0,g.hp-damage);}append(g,e.name,damage?`${e.name} returns fire for ${damage} damage.`:`${e.name}'s shot misses.`, 'system',{skill:'Enemy attack',die,bonus:3,dc,success:damage>0});if(g.hp===0){g.combat=false;append(g,'Game master','Your vision fades. Your ship’s rescue beacon activates. Recover at the docks to try again.','system');break;}}
 g.round++;g.movement=16;
}
export function objective(g:Game){if(g.scene==='ship'&&!g.flags.landed)return{title:g.flags.transmission?'Someone needs help':'An unexpected call',body:g.flags.transmission?'Pack your field kit, then take the ramp into Meridian.':'Walk to the flashing comms console and play the message.'};if(g.ending)return {title:g.ending,body:'Chapter complete. Your choices shaped Port Meridian.'};if(g.flags.bossDefeated)return{title:'The price of freedom',body:'Veyra is defeated. Destroy the artifact, claim it, or give the gates to the station.'};if(g.flags.artifact)return{title:'Break the Hollow Sun',body:'Confront Veyra in the reactor chamber. Allies and sabotage can change the odds.'};if(g.flags.clue)return{title:'A life in the balance',body:'Rescue Sol from the cargo vault. Negotiate, sneak in, or fight the patrol.'};return{title:'The missing courier',body:'Find out what happened to Sol Renn before the Hollow Sun does.'};}
export function suggestions(g:Game){if(g.flags.bossDefeated&&!g.ending&&g.scene==='arena')return ['Destroy the artifact','Claim the syndicate','Spare Veyra; give the gates to the station'];if(g.combat)return ['Attack','Take cover','Use a medkit','Retreat'];const m:Record<string,string[]>={comms:['Play the transmission'],locker:['Collect my field kit'],practice:['Run a systems check'],ramp:['Disembark into Meridian Hangar'],shopDoor:['Enter Brakk’s shop'],shopExit:['Return to the hangar'],wares:['Inspect the stock'],bench:['Inspect the repair bench'],nyx:['Ask about Sol Renn','Ask Nyx to join my crew'],brakk:['Ask about Veyra’s weakness'],pip:['Ask PIP about the courier'],guard:['Persuade Korr to stand down','Attack Korr'],cargo:['Investigate the cargo vault','Sneak into the vault'],terminal:['Hack the security terminal'],ship:g.scene==='ship'?['Rest aboard my ship']:['Board the Wayfarer'],lift:['Take the throne-room lift'],veyra:['Talk to Veyra','Attack Veyra','Convince Veyra to surrender the station in exchange for preserving the gate key'],relay:['Disconnect the relay'],exit:['Return to the station']};return m[g.target]??['Look around'];}
export function validSave(v:unknown):v is Game {if(!v||typeof v!=='object')return false;const g=v as Game;return g.version===1&&typeof g.name==='string'&&g.name.length<=32&&['Gunslinger','Diplomat','Engineer'].includes(g.role)&&['ship','station','shop','arena'].includes(g.scene)&&Number.isFinite(g.hp)&&g.hp>=0&&g.hp<=g.maxHp&&g.maxHp>=27&&g.maxHp<=42&&['Human','Alien','Cyborg'].includes(g.species)&&['Female','Male','Non-binary'].includes(g.gender)&&g.stats&&ABILITIES.every(a=>Number.isInteger(g.stats[a])&&g.stats[a]>=8&&g.stats[a]<=15)&&statCost(g.stats)<=27&&Number.isInteger(g.portrait)&&g.portrait>=0&&g.portrait<6&&Number.isInteger(g.appearance)&&g.appearance>=0&&g.appearance<6&&Number.isFinite(g.tint)&&Number.isFinite(g.credits)&&Number.isFinite(g.medkits)&&g.medkits>=0&&g.medkits<=10&&Number.isFinite(g.xp)&&Number.isFinite(g.trust)&&Number.isFinite(g.round)&&Number.isFinite(g.movement)&&g.pos&&walkable(g.pos,g.scene)&&typeof g.flags==='object'&&g.flags!==null&&typeof g.combat==='boolean'&&typeof g.target==='string'&&typeof g.background==='string'&&typeof g.ending==='string'&&Array.isArray(g.memory)&&g.memory.every(s=>typeof s==='string')&&Array.isArray(g.enemies)&&g.enemies.every(e=>e&&typeof e.name==='string'&&typeof e.id==='string'&&Number.isFinite(e.hp)&&Number.isFinite(e.maxHp)&&e.pos&&Number.isFinite(e.pos.x)&&Number.isFinite(e.pos.y))&&Array.isArray(g.logs)&&g.logs.length<=100&&g.logs.every(l=>l&&typeof l.id==='string'&&typeof l.text==='string'&&typeof l.speaker==='string');}
