export const runtime='nodejs';
export const maxDuration=60;
export const dynamic='force-dynamic';
import {z} from 'zod';
import {hostAI,reserveHostRequest} from '@/lib/host-ai';
const headers={'Cache-Control':'no-store','Pragma':'no-cache'};
const cast={
 'Nyx Vale':{voice:'marin',direction:'A sharp, dry-witted space smuggler. Conversational and guarded, with underlying warmth.'},
 Brakk:{voice:'onyx',direction:'A gruff, practical mechanic. Low, grounded, unhurried; kind beneath the rough delivery.'},
 'PIP-7':{voice:'echo',direction:'A small helpful survey droid. Precise, lightly rhythmic and literal, with gentle curiosity. Clearly intelligible.'},
 'Lieutenant Korr':{voice:'cedar',direction:'A tired checkpoint lieutenant. Restrained authority, conflicted and human, never shouting.'},
 'Director Veyra':{voice:'coral',direction:'A charismatic crime boss. Calm, measured, elegant and quietly threatening.'},
 'Game master':{voice:'sage',direction:'An intimate space-opera narrator. Vivid, calm and conversational.'}
} as const;
const schema=z.object({text:z.string().trim().min(1).max(1800),speaker:z.enum(['Nyx Vale','Brakk','PIP-7','Lieutenant Korr','Director Veyra','Game master'])});
export async function POST(request:Request){
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Voice requests must come from the game.'},{status:403,headers});
 if(Number(request.headers.get('content-length')||0)>8000)return Response.json({error:'That voice line is too long.'},{status:413,headers});
 const host=hostAI(),auth=host.key?`Bearer ${host.key}`:request.headers.get('authorization')||'';
 if(!/^Bearer sk-[A-Za-z0-9_-]{16,500}$/.test(auth))return Response.json({error:'Connect the AI game master to enable voices.'},{status:401,headers});
 let input;try{const raw=await request.text();if(raw.length>8000)throw Error();input=schema.parse(JSON.parse(raw));}catch{return Response.json({error:'That voice line could not be read.'},{status:400,headers});}
 if(host.key){try{if(!await reserveHostRequest(host.limit))return Response.json({error:'The shared daily AI allowance is reached. Text dialogue remains available.'},{status:429,headers});}catch{return Response.json({error:'Shared voices are temporarily unavailable. Text dialogue remains available.'},{status:503,headers});}}
 const profile=cast[input.speaker];try{
 const upstream=await fetch('https://api.openai.com/v1/audio/speech',{method:'POST',headers:{Authorization:auth,'Content-Type':'application/json'},body:JSON.stringify({model:'gpt-4o-mini-tts',voice:profile.voice,input:input.text,response_format:'mp3',instructions:`Read the supplied fictional dialogue exactly, without adding any words or sounds. ${profile.direction}`}),signal:AbortSignal.timeout(40000)});
 if(!upstream.ok)return Response.json({error:upstream.status===429?'Voice generation is currently rate-limited. Continue with text or try again later.':'Voice generation is unavailable. Check that your API project has access to gpt-4o-mini-tts.'},{status:502,headers});
 const bytes=await upstream.arrayBuffer();if(!bytes.byteLength)throw Error('empty');return new Response(bytes,{headers:{...headers,'Content-Type':'audio/mpeg'}});
 }catch{return Response.json({error:'The voice took too long to generate. You can continue reading or try replay.'},{status:502,headers});}
}
