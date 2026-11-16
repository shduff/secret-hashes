/* Secret Hashes: entirely local SHA3-512 and random-walk rendering. */
"use strict";
const WIDTH = 1240, HEIGHT = 874, MASK = (1n << 64n) - 1n;
const ROT = [
  [0,36,3,41,18],[1,44,10,45,2],[62,6,43,15,61],
  [28,55,25,21,56],[27,20,39,8,14]
];
const RC = [
  0x0000000000000001n,0x0000000000008082n,0x800000000000808an,0x8000000080008000n,
  0x000000000000808bn,0x0000000080000001n,0x8000000080008081n,0x8000000000008009n,
  0x000000000000008an,0x0000000000000088n,0x0000000080008009n,0x000000008000000an,
  0x000000008000808bn,0x800000000000008bn,0x8000000000008089n,0x8000000000008003n,
  0x8000000000008002n,0x8000000000000080n,0x000000000000800an,0x800000008000000an,
  0x8000000080008081n,0x8000000000008080n,0x0000000080000001n,0x8000000080008008n
];
function rotate(v,n){n=BigInt(n);return n===0n?v:((v<<n)|(v>>(64n-n)))&MASK;}
function permute(a){
  for(const rc of RC){
    const c=Array.from({length:5},(_,x)=>a[x]^a[x+5]^a[x+10]^a[x+15]^a[x+20]);
    for(let x=0;x<5;x++){const d=c[(x+4)%5]^rotate(c[(x+1)%5],1);for(let y=0;y<5;y++)a[x+5*y]^=d;}
    const b=new Array(25).fill(0n);
    for(let x=0;x<5;x++)for(let y=0;y<5;y++)b[y+5*((2*x+3*y)%5)]=rotate(a[x+5*y],ROT[x][y]);
    for(let x=0;x<5;x++)for(let y=0;y<5;y++)a[x+5*y]=(b[x+5*y]^((~b[(x+1)%5+5*y])&b[(x+2)%5+5*y]))&MASK;
    a[0]^=rc;
  }
}
function sha3_512(message){
  const bytes=Array.from(new TextEncoder().encode(message)), rate=72;
  bytes.push(0x06);
  while(bytes.length%rate!==rate-1)bytes.push(0);
  bytes.push(0x80);
  const a=new Array(25).fill(0n);
  for(let start=0;start<bytes.length;start+=rate){
    for(let i=0;i<rate;i++)a[Math.floor(i/8)]^=BigInt(bytes[start+i])<<BigInt(8*(i%8));
    permute(a);
  }
  let hex="";
  for(let i=0;i<64;i++)hex+=Number((a[Math.floor(i/8)]>>BigInt(8*(i%8)))&255n).toString(16).padStart(2,"0");
  return hex;
}
function randomAngle(){
  const v=new Uint32Array(1);crypto.getRandomValues(v);
  return 1+(v[0]%360); // Wolfram's original AnglePath uses numeric angles in radians.
}
function makePath(secret){
  // Wolfram's IntegerDigits[Hash[secret,"SHA3-512"]] uses DECIMAL digits.
  const decimal=BigInt("0x"+sha3_512(secret)).toString(10);
  let x=0,y=0,heading=0;const pts=[[x,y]];
  for(const digit of decimal){
    const distance=Number(digit)*100;
    heading+=randomAngle();
    x+=distance*Math.cos(heading);y+=distance*Math.sin(heading);
    pts.push([x,y]);
  }
  const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
  const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  const spanX=Math.max(1,maxX-minX),spanY=Math.max(1,maxY-minY);
  const scale=Math.min((WIDTH-160)/spanX,(HEIGHT-160)/spanY);
  const dx=(WIDTH-spanX*scale)/2-minX*scale,dy=(HEIGHT-spanY*scale)/2-minY*scale;
  return pts.map(([px,py],i)=>(i?"L":"M")+(px*scale+dx).toFixed(2)+" "+(py*scale+dy).toFixed(2)).join(" ");
}
function makeSVG(path){
  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+WIDTH+'" height="'+HEIGHT+'" viewBox="0 0 '+WIDTH+' '+HEIGHT+'"><rect width="100%" height="100%" fill="white"/><path d="'+path+'" fill="none" stroke="#2a2e2f" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
const input=document.getElementById("secret"), draw=document.getElementById("drawButt"),
  drawText=document.getElementById("drawButtText"),preview=document.getElementById("scribble"),
  svgButton=document.getElementById("download-svg"),pngButton=document.getElementById("download-png"),
  status=document.getElementById("status"),story=document.getElementById("story-div");
let currentSVG="";
function setStatus(message){status.textContent=message;}
function download(blob,name){
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
draw.addEventListener("click",()=>{
  if(!input.value.trim()){setStatus("Type a secret first.");input.focus();return;}
  try{
    currentSVG=makeSVG(makePath(input.value));
    preview.innerHTML=currentSVG;
    drawText.textContent="redraw";
    svgButton.disabled=pngButton.disabled=false;
    setStatus("");
  }catch(err){console.error(err);setStatus("Drawing failed. Please try again.");}
});
input.addEventListener("input",()=>{
  if(currentSVG){currentSVG="";preview.replaceChildren();svgButton.disabled=pngButton.disabled=true;drawText.textContent="draw";setStatus("Secret changed. Draw a new scribble.");}
});
svgButton.addEventListener("click",()=>{if(currentSVG)download(new Blob([currentSVG],{type:"image/svg+xml;charset=utf-8"}),"secret-hash.svg");});
pngButton.addEventListener("click",()=>{
  if(!currentSVG)return;
  const url=URL.createObjectURL(new Blob([currentSVG],{type:"image/svg+xml;charset=utf-8"}));
  const img=new Image();
  img.onload=()=>{
    const canvas=document.createElement("canvas");canvas.width=WIDTH;canvas.height=HEIGHT;
    canvas.getContext("2d").drawImage(img,0,0,WIDTH,HEIGHT);
    URL.revokeObjectURL(url);
    canvas.toBlob(blob=>{if(blob)download(blob,"secret-hash.png");else setStatus("Could not export PNG.");},"image/png");
  };
  img.onerror=()=>{URL.revokeObjectURL(url);setStatus("Could not export PNG.");};
  img.src=url;
});
document.querySelectorAll(".use-case").forEach(card=>card.addEventListener("click",()=>{
  const wasOpen=card.classList.contains("open");
  document.querySelectorAll(".use-case").forEach(c=>c.classList.remove("open"));
  story.replaceChildren();
  if(!wasOpen){
    card.classList.add("open");
    const content=card.querySelector(".story-text");
    if(content){const clone=content.cloneNode(true);clone.classList.remove("story-text");story.append(clone);}
  }
}));
