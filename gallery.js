"use strict";
const studio=document.getElementById("studio"),open=document.getElementById("open-studio"),expand=document.getElementById("expand-studio"),close=document.getElementById("close-studio");
function toggleStudio(on){document.body.classList.toggle("studio-expanded",on);close.hidden=!on;studio.setAttribute("aria-hidden",String(!on));expand.textContent=on?"Collapse ↙":"Expand ↗";expand.setAttribute("aria-expanded",String(on));if(on)close.focus();else open.focus();}
open.addEventListener("click",()=>toggleStudio(true));
document.getElementById("encode-secret").addEventListener("click",()=>toggleStudio(true));
expand.addEventListener("click",()=>toggleStudio(!document.body.classList.contains("studio-expanded")));
close.addEventListener("click",()=>toggleStudio(false));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&document.body.classList.contains("studio-expanded"))toggleStudio(false);});
const tabs=Array.from(document.querySelectorAll(".use-case"));
tabs.forEach((tab,i)=>{
 const trigger=tab.querySelector("summary");trigger.setAttribute("role","tab");trigger.setAttribute("tabindex","0");trigger.setAttribute("aria-selected",String(tab.classList.contains("open")));
 trigger.addEventListener("click",()=>setTimeout(()=>{tabs.forEach(t=>{const selected=t===tab;t.classList.toggle("open",selected);t.querySelector("summary").setAttribute("aria-selected",String(selected));});const story=document.getElementById("story-div");story.replaceChildren();const content=tab.querySelector(".story-text").cloneNode(true);content.classList.remove("story-text");story.append(content);story.scrollTop=0;},0));
 trigger.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();trigger.click();}if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();tabs[(i+(e.key==="ArrowRight"?1:tabs.length-1))%tabs.length].querySelector("summary").focus();}});
});
