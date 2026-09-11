// Clothing-only colour masks for the six normalized, illustrated player rows.
// Head regions and warm human skin / violet alien skin are never recoloured.
export const OUTFIT_COLOURS:Record<number,[number,number,number]>={55:[126,143,69],130:[48,143,148],200:[74,113,181],285:[166,61,81]};
export function clothingPixel(row:number,y:number,r:number,g:number,b:number){
 if(y<90||y>205)return false;
 if(r>g*1.2&&b>g*1.2)return false; // Preserve violet skin at hands and edges.
 const high=Math.max(r,g,b),low=Math.min(r,g,b);
 if(high<22)return false;
 if(row===0)return b>r*1.12&&b>=g;
 if(row===1)return r>90&&g>80&&b>60&&(high-low)/high<.36;
 if(row===2||row===3)return g>r*1.13&&b>r*1.13;
 return high-low<15&&high<170;
}
export function recolourOutfit(data:Uint8ClampedArray,width:number,tint:number){
 const colour=OUTFIT_COLOURS[tint];if(!colour)return;
 for(let i=0;i<data.length;i+=4){if(!data[i+3])continue;const y=Math.floor(i/4/width),r=data[i],g=data[i+1],b=data[i+2];if(!clothingPixel(Math.floor(y/256),y%256,r,g,b))continue;const light=(.2126*r+.7152*g+.0722*b)/128;for(let c=0;c<3;c++)data[i+c]=Math.min(255,Math.round(colour[c]*light));}
}
