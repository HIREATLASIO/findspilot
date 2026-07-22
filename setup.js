const opsStorageKey = "findspilot:launch-os:v2";
const criticalTasks = [
  { id: "stripe", order: "01", title: "Reconnect Stripe", copy: "Reauthorize the existing Stripe connector. Then create four one-time EUR Payment Links.", href: "https://dashboard.stripe.com/", cta: "Open Stripe" },
  { id: "inbox", order: "02", title: "Activate partner inbox", copy: "Use free Cloudflare Email Routing: partners@agentlinks.de → your verified inbox.", href: "https://dash.cloudflare.com/", cta: "Open Cloudflare" },
  { id: "legal", order: "03", title: "Publish seller identity", copy: "Legal seller name, business address, tax/VAT status, contact and service/refund terms.", href: "./#legal", cta: "Review public legal" },
  { id: "affiliate", order: "04", title: "Approve one money route", copy: "A fresh approved affiliate URL, current terms and one conversion test—not an old referral link.", href: "#signups", cta: "Open applications" },
  { id: "leads", order: "05", title: "Check the private lead inbox", copy: "Review new partner requests in the existing free EU-region Supabase project.", href: "https://supabase.com/dashboard/project/acychihnodkzwngboinf/editor", cta: "Open lead database" }
];

const signupGroups = [
  { name: "Revenue core", rule: "Complete before content volume", items: [
    { id: "stripe", name: "Stripe", state: "REAUTH", href: "https://dashboard.stripe.com/", copy: "One-time service checkout and receipts." },
    { id: "cloudflare", name: "Cloudflare Email Routing", state: "FREE", href: "https://dash.cloudflare.com/", copy: "Private partner inbox on agentlinks.de." },
    { id: "vercel", name: "Vercel", state: "REAUTH", href: "https://vercel.com/login", copy: "Deploy the full /start command route." }
  ]},
  { name: "Popular agent programs", rule: "Fresh company-owned accounts only", items: [
    { id: "joyagoo", name: "JoyaGoo", state: "PRIORITY 1", href: "https://mgt.joyagoo.com/", copy: "Save fresh share URL, delivered-parcel rule, expiry and payout." },
    { id: "superbuy", name: "Superbuy", state: "PRIORITY 1", href: "https://www.superbuy.com/en/page/about/affiliate/", copy: "Join the official affiliate system and save the current tier table." },
    { id: "allchinabuy", name: "AllChinaBuy", state: "PRIORITY 2", href: "https://www.allchinabuy.com/en/page/about/affiliate/", copy: "Request current attribution, rate and payout evidence." },
    { id: "kakobuy", name: "KakoBuy", state: "PRIORITY 2", href: "https://www.kakobuy.com/register", copy: "Verify the operating domain and written commercial terms." }
  ]},
  { name: "One owned brand identity", rule: "Reserve handles; post manually at first", items: [
    { id: "tiktok", name: "TikTok", state: "@FINDSPILOT", href: "https://www.tiktok.com/signup", copy: "One daily original tutorial or fee-truth post." },
    { id: "instagram", name: "Instagram", state: "@FINDSPILOT", href: "https://www.instagram.com/accounts/emailsignup/", copy: "Reels, carousels and Stories pointing to owned tools." },
    { id: "youtube", name: "YouTube", state: "@FINDSPILOT", href: "https://www.youtube.com/", copy: "Shorts plus searchable buying tutorials." },
    { id: "x", name: "X", state: "@FINDSPILOT", href: "https://x.com/i/flow/signup", copy: "Fee updates, evidence notes and useful replies." },
    { id: "reddit", name: "Reddit", state: "ONE ACCOUNT", href: "https://www.reddit.com/register/", copy: "Warm up with value; follow every subreddit rule." },
    { id: "telegram", name: "Telegram", state: "OWNED CHANNEL", href: "https://telegram.org/", copy: "Retention, route updates and consent-based alerts." }
  ]}
];

const qs = (selector) => document.querySelector(selector);
function getOpsState(){ try{return JSON.parse(localStorage.getItem(opsStorageKey)||"{}");}catch{return{};} }
function setOpsState(value){ try{localStorage.setItem(opsStorageKey,JSON.stringify(value));}catch{} }
function toggleOps(id){const state=getOpsState();state[id]=!state[id];setOpsState(state);renderOps();}
function opsToast(message){const node=qs("#ops-toast");node.textContent=message;node.classList.add("show");setTimeout(()=>node.classList.remove("show"),1800);}
async function copyOps(value){try{await navigator.clipboard.writeText(value);}catch{const field=document.createElement("textarea");field.value=value;field.style.position="fixed";field.style.opacity="0";document.body.appendChild(field);field.select();document.execCommand("copy");field.remove();}}

function renderOps(){
  const state=getOpsState();
  qs("#critical-grid").innerHTML=criticalTasks.map(task=>`<article class="mission-card ${state[task.id]?"done":""}"><span>${task.order}</span><h3>${task.title}</h3><p>${task.copy}</p><a href="${task.href}" ${task.href.startsWith("http")?'target="_blank" rel="noreferrer"':""}>${task.cta} ↗</a><button type="button" data-toggle="${task.id}">${state[task.id]?"Completed ✓":"Mark complete"}</button></article>`).join("");
  qs("#signup-groups").innerHTML=signupGroups.map(group=>`<section class="signup-group"><header><h3>${group.name}</h3><span>${group.rule}</span></header><div class="signup-list">${group.items.map(item=>`<article class="signup-card ${state[item.id]?"done":""}"><span>${item.state}</span><h4>${item.name}</h4><p>${item.copy}</p><div><a href="${item.href}" target="_blank" rel="noreferrer">Open ↗</a><button type="button" data-toggle="${item.id}">${state[item.id]?"Done ✓":"Mark"}</button></div></article>`).join("")}</div></section>`).join("");
  document.querySelectorAll("[data-toggle]").forEach(button=>button.addEventListener("click",()=>toggleOps(button.dataset.toggle)));
  const taskIds=[...new Set([...criticalTasks.map(item=>item.id),...signupGroups.flatMap(group=>group.items.map(item=>item.id))])];
  const done=taskIds.filter(id=>state[id]).length;
  const score=Math.round(done/taskIds.length*100);
  qs("#readiness-score").textContent=`${score}%`;
  qs("#readiness-bar").style.width=`${score}%`;
  qs("#readiness-state").textContent=score===100?"Execution system ready. Keep evidence current.":score>=60?"Close the remaining revenue gates.":score>=25?"Foundation active. Continue in order.":"Complete the critical path below.";
}

function updateMath(){
  const shipping=Math.max(0,Number(qs("#shipping-fee").value)||0);
  const rate=Math.max(0,Number(qs("#commission-rate").value)||0)/100;
  const parcels=Math.max(0,Number(qs("#parcel-count").value)||0);
  const perParcel=shipping*rate;
  qs("#affiliate-result").textContent=`€${Math.round(perParcel*parcels).toLocaleString()}`;
  qs("#affiliate-target").textContent=perParcel?`${Math.ceil(1500/perParcel).toLocaleString()} delivered parcels for €1,500.`:"Enter a rate above zero.";
  const price=Number(qs("#service-price").value)||0;
  const count=Math.max(0,Number(qs("#service-count").value)||0);
  qs("#service-result").textContent=`€${(price*count).toLocaleString()}`;
}

const angleTemplates={
  fee:{hook:"The signup coupon is not the real cost.",proof:"Compare product price, exchange-rate spread, service fees and the final international shipping quote.",cta:"Run the same source link through FindsPilot before choosing."},
  tutorial:{hook:"Here is the cleanest way to buy from a Chinese marketplace without losing the original source.",proof:"Keep the Taobao, Weidian, 1688 or Tmall URL, then compare official agent routes and checkout totals.",cta:"Save this and use the free converter."},
  compare:{hook:"The best shopping agent is not a universal winner.",proof:"The answer changes with destination, parcel weight, restrictions, support and live shipping lines.",cta:"Compare at least two live checkout quotes."},
  risk:{hook:"A QC photo is evidence—not authentication.",proof:"Check seller history, return rules, restricted-item policy, customs exposure and the agent’s terms before paying.",cta:"Use the source-linked risk screen, then decide."},
  tool:{hook:"One product link. Four official routes.",proof:"FindsPilot keeps the original marketplace URL intact and never labels a neutral route as an affiliate route.",cta:"Paste your link into the free converter."}
};

qs("#affiliate-math").addEventListener("input",updateMath);qs("#service-math").addEventListener("input",updateMath);
qs("#content-form").addEventListener("submit",event=>{event.preventDefault();const channel=qs("#content-channel").value;const agent=qs("#content-agent").value;const angle=angleTemplates[qs("#content-angle").value];qs("#content-result").textContent=`CHANNEL: ${channel}\nSUBJECT: ${agent}\n\nHOOK (0–2s)\n${angle.hook}\n\nPROOF / BODY\n${angle.proof}\nShow the source, the official route and the uncertainty on screen. No fake savings, no guaranteed delivery, no hidden AI.\n\nCTA\n${angle.cta}\n\nCAPTION\nIndependent comparison. Official neutral links until a program is approved. Terms change—verify before checkout.\n\nPRODUCTION\n9:16 · 18–28 seconds · original voiceover · source labels · one CTA · no watermarked repost.`;});
qs("#copy-content").addEventListener("click",async()=>{await copyOps(qs("#content-result").textContent);opsToast("Content brief copied");});
qs("#copy-ops-packet").addEventListener("click",async()=>{await copyOps(qs("#ops-packet").textContent);opsToast("Activation packet copied");});
renderOps();updateMath();
