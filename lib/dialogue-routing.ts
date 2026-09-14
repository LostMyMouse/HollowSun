import {immersionPlan} from './immersion';
import {infer,suggestions,type Game,type Plan} from './game';

const normalise=(text:string)=>text.trim().toLowerCase().replace(/[?.!]+$/,'').replace(/\s+/g,' ');
/** Only exact, authored phrases qualify. Qualifications and compound actions go to AI. */
export function standardPlan(text:string,game:Game,forced?:Plan):Plan|undefined{
 if(forced)return forced;
 const boundary=immersionPlan(text,game.target);if(boundary)return boundary;
 const phrase=normalise(text);
 if(suggestions(game).some(s=>normalise(s)===phrase)){
  if(phrase==='look around'&&!game.target)return {intent:'improvise',target:'',skill:'Insight',difficulty:0,viable:true,reason:game.scene==='ship'?'The comms light is blinking. Your kit is in the locker; the boarding ramp leads outside.':game.scene==='shop'?'Brakk works behind the counter. Parts fill the shelves; the door leads back to the hangar.':game.scene==='station'?'Nyx waits by the cantina, PIP patrols the docks, and Brakk’s shop is open. Korr guards the cargo vault. Click a marked person or doorway to walk over.':'Veyra waits beside her command rig. An exposed relay powers her defenses, and the station lift offers a way back.'};
  if(phrase==='run a systems check')return {intent:'hack',target:'practice',skill:'Tech',difficulty:8,viable:true,reason:''};
  if(phrase==='collect my field kit')return {intent:'investigate',target:'locker',skill:'Insight',difficulty:0,viable:true,reason:''};
  if(phrase==='play the transmission')return {intent:'investigate',target:'comms',skill:'Insight',difficulty:0,viable:true,reason:''};
  return infer(text,game);
 }
 const questions:Record<string,string[]>={
  nyx:['hello','hi','who is sol renn','where is sol','where is sol renn','what happened to the courier','tell me about sol renn'],
  brakk:['hello','hi','what do you know about veyra','what is veyra’s weakness','what is veyra\'s weakness'],
  pip:['hello','hi','where is the courier','where is sol renn','do you have access codes'],
  guard:['hello','hi','why is the vault locked','who are you guarding'],
  veyra:['hello','hi','what do you want','why do you want the artifact','why do you want the artefact'],
 };
 if(questions[game.target]?.includes(phrase))return {intent:'talk',target:game.target,skill:'Presence',difficulty:0,viable:true,reason:''};
 return undefined;
}
