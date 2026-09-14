import {append,distance,entities,type Game} from './game';
export const SHOP_ITEMS=[
 {id:'medkit',name:'Field medkit',category:'MEDICAL',price:20,effect:'Restore up to 16 health. Consumed on use.',detail:'A sealed trauma pack for when the conversation goes badly.'},
 {id:'blaster',name:'Pulse-blaster upgrade',category:'WEAPON',price:60,effect:'+2 damage on successful ranged attacks. Automatically equipped.',detail:'A calibrated focusing chamber. Cleaner shots, harder hits.'},
 {id:'armour',name:'Reinforced flight jacket',category:'ARMOUR',price:55,effect:'+1 defense against every enemy attack. Automatically equipped.',detail:'Discrete armour plates beneath familiar flight gear.'},
 {id:'decoder',name:'Intrusion toolkit',category:'TECH',price:40,effect:'+2 to Tech checks, including security hacks.',detail:'Bypass probes and a portable decoder. Requires an actual access point.'},
 {id:'translator',name:'Diplomatic phrasebook',category:'DIALOGUE',price:40,effect:'+2 to Presence checks, including persuasion and recruitment.',detail:'Local idioms, trade customs and the right words at a checkpoint.'},
 {id:'optics',name:'Survey optics',category:'PERCEPTION',price:35,effect:'+2 to Insight checks. Automatically equipped.',detail:'A compact scanner that helps you notice what others miss.'}
] as const;
export function shopAccess(g:Game){const vendor=entities(g).find(e=>e.id==='brakk');return !g.combat&&g.hp>0&&!g.ending&&g.scene==='shop'&&!!vendor&&distance(g.pos,vendor.pos)<=17;}
export function buyItem(original:Game,id:string):{game:Game;message:string;ok:boolean}{
 const item=SHOP_ITEMS.find(i=>i.id===id);const reject=(message:string)=>({game:original,message,ok:false});
 if(!shopAccess(original))return reject('Visit Brakk’s shop while you are out of combat to trade.');if(!item)return reject('That item is not in stock.');if(item.id==='medkit'&&original.medkits>=10)return reject('Your medical pouch is full (10 medkits).');if(item.id!=='medkit'&&original.flags[`gear_${item.id}`])return reject('You already own this equipment.');if(original.credits<item.price)return reject('You do not have enough credits.');
 const game=structuredClone(original);game.credits-=item.price;if(item.id==='medkit')game.medkits++;else game.flags[`gear_${item.id}`]=true;const message=`Purchased ${item.name} for ${item.price} credits. ${item.effect}`;append(game,'Brakk',message,'system');return {game,message,ok:true};
}
