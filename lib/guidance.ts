import type {Game} from './game';
export function guidance(g:Game){
 if(g.ending)return {label:'YOUR STORY IS COMPLETE',title:'A different captain can find another ending.',body:'Save your ending or begin another story.',target:'',action:''};
 if(g.hp<=0)return {label:'RECOVER',title:'Your rescue beacon is active.',body:'Use Recover at the docks to get back on your feet. Your discoveries remain.',target:'',action:''};
 if(g.combat)return {label:'YOUR TURN',title:'Choose an enemy, then make your move.',body:'Attack, take cover or use a medkit. You can move before acting.',target:g.enemies[0]?.id??'',action:'Open combat actions'};
 if(g.flags.bossDefeated&&g.scene==='station')return {label:'YOUR FINAL CHOICE',title:'Return to the reactor to decide the gates’ fate.',body:'Veyra is defeated. The reactor lift takes you back to the artifact.',target:'lift',action:'Return to the reactor'};
 if(g.flags.bossDefeated)return {label:'YOUR FINAL CHOICE',title:'Decide what happens to the gates.',body:'Speak to Veyra to destroy the artifact, claim it or give control to the station.',target:'veyra',action:'Make your choice'};
 if(g.scene==='arena')return {label:'THE CONFRONTATION',title:'Veyra is ahead. Choose your approach.',body:'Talk to her, weaken the relay or fight. The station lift lets you return and prepare.',target:'veyra',action:'Approach Veyra'};
 if(g.flags.artifact)return {label:'NEXT LEAD',title:'Take the reactor lift to Veyra.',body:'You have the artifact. Recruit Nyx or disable the security network first if you want support.',target:'lift',action:'Walk to reactor lift'};
 if(!g.flags.clue)return {label:'START HERE · 1 OF 3',title:'Speak to Nyx by the cantina.',body:'Sol Renn is missing. Nyx knows this station. Click her gold marker—or use this button to walk over.',target:'nyx',action:'Walk to Nyx'};
 if(g.flags.guardsCleared||g.flags.access)return {label:'RESCUE SOL · 3 OF 3',title:'The cargo vault is within reach.',body:'Inspect the vault to find Sol. You can keep exploring before confronting the syndicate.',target:'cargo',action:'Walk to cargo vault'};
 if(g.flags.codes)return {label:'FIND A WAY IN · 2 OF 3',title:'Use PIP’s codes at the cargo vault.',body:'Approach the vault and choose “Sneak into the vault”. Talking to Korr is another route.',target:'cargo',action:'Walk to cargo vault'};
 return {label:'FOLLOW THE LEAD · 2 OF 3',title:'Find a way past Korr’s checkpoint.',body:'Talk Korr into standing down, ask PIP for another way in, or fight. Your route is your choice.',target:'guard',action:'Walk to Korr'};
}
