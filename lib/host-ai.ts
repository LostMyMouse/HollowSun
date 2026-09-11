// Secrets are read only inside the server API route, never in the browser.
export function hostAI(){return {key:process.env.OPENAI_API_KEY||'',model:process.env.OPENAI_MODEL||'gpt-4.1-mini',limit:Math.min(2000,Math.max(20,Number(process.env.AI_DAILY_REQUEST_LIMIT)||600))};}
export async function reserveHostRequest(limit:number){
 const url=process.env.UPSTASH_REDIS_REST_URL,token=process.env.UPSTASH_REDIS_REST_TOKEN;
 if(!url||!token)throw new Error('Configure Redis to enable shared AI.');
 // Atomic check/increment across all Vercel instances; failed requests still count.
 const script="local n=tonumber(redis.call('GET',KEYS[1]) or '0'); if n>=tonumber(ARGV[1]) then return 0 end; redis.call('INCR',KEYS[1]); redis.call('EXPIRE',KEYS[1],172800); return 1";
 const day=new Date().toISOString().slice(0,10);
 const response=await fetch(url,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(['EVAL',script,'1',`hollow-sun:ai:${day}`,String(limit)]),cache:'no-store',signal:AbortSignal.timeout(5000)});
 if(!response.ok)throw new Error('AI usage storage is unavailable.');
 const data=await response.json() as {result?:number;error?:string};
 if(data.error||(data.result!==0&&data.result!==1))throw new Error('AI usage storage returned an invalid response.');
 return data.result===1;
}
