/* controls.js — filterable control library with linked risk coverage. */
"use strict";
const STATUS_BADGE={"Implemented":"badge--ok","In progress":"badge--warn","Not implemented":"badge--risk"};
let allControls=[],allRisks=[],visibleControls=[];
function makeRefList(ids,lookup,emptyText){
 const wrap=document.createElement("div"); wrap.className="reference-list";
 if(!ids?.length){wrap.textContent=emptyText;return wrap;}
 ids.forEach(id=>{const item=document.createElement("a");item.className="linked-reference record-link";item.href=`risks.html#${id}`;item.textContent=`${id} — ${lookup.get(id)?.title||"Unknown risk"}`;wrap.append(item);});
 return wrap;
}
function renderControlRows(controls){
 visibleControls=controls; const tbody=document.getElementById("control-rows");tbody.replaceChildren();
 const riskLookup=new Map(allRisks.map(r=>[r.id,r]));
 for(const control of controls){
  const row=document.createElement("tr");row.id=control.id;
  const idCell=document.createElement("td"),idRef=document.createElement("span");idRef.className="ref-id";idRef.textContent=control.id;idCell.append(idRef);
  const name=document.createElement("td");name.textContent=control.name;
  const frameworks=document.createElement("td");frameworks.textContent=control.frameworks.join(", ");
  const owner=document.createElement("td");owner.textContent=control.owner;
  const status=document.createElement("td"),badge=document.createElement("span");badge.className=`badge ${STATUS_BADGE[control.status]||""}`;badge.textContent=control.status;status.append(badge);
  const risks=document.createElement("td");risks.append(makeRefList(control.riskIds,riskLookup,"No risks currently mapped"));
  row.append(idCell,name,frameworks,owner,status,risks);tbody.append(row);
 }
 document.getElementById("control-count").textContent=`${controls.length} control${controls.length===1?"":"s"} shown.`;
}
function applyFilters(){
 const text=document.getElementById("filter-text").value.trim().toLowerCase(),framework=document.getElementById("filter-framework").value,status=document.getElementById("filter-status").value;
 const riskLookup=new Map(allRisks.map(r=>[r.id,r.title]));
 const filtered=allControls.filter(c=>{const linked=(c.riskIds||[]).map(id=>`${id} ${riskLookup.get(id)||""}`).join(" ");const searchable=`${c.id} ${c.name} ${c.owner} ${linked}`.toLowerCase();return(!text||searchable.includes(text))&&(!framework||c.frameworks.includes(framework))&&(!status||c.status===status);});
 renderControlRows(filtered);
 if(!filtered.length){const row=document.createElement("tr"),cell=document.createElement("td");cell.colSpan=6;cell.className="empty-state";cell.textContent="No controls match the selected filters.";row.append(cell);document.getElementById("control-rows").append(row);}
}
["filter-text","filter-framework","filter-status"].forEach(id=>document.getElementById(id).addEventListener(id==="filter-text"?"input":"change",applyFilters));
document.getElementById("download-controls")?.addEventListener("click",()=>downloadCSV("control-library.csv",[["Control ID","Name","Framework mapping","Owner role","Status","Risks mitigated"],...visibleControls.map(c=>[c.id,c.name,c.frameworks.join("; "),c.owner,c.status,(c.riskIds||[]).join("; ")])]));
async function initControls(){try{[allControls,allRisks]=await Promise.all([loadJSON("data/controls.json"),loadJSON("data/risks.json")]);renderControlRows(allControls);}catch(error){document.getElementById("control-count").textContent=`Controls could not be loaded — serve the site over http (see README). (${error.message})`;}}
initControls();
