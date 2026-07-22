const agents = [
  { id: "joyagoo", short: "JG", name: "JoyaGoo", url: "https://mgt.joyagoo.com/", note: "Priority application", checks: ["Official management portal", "Confirm delivered-parcel rule", "Save claim and payout evidence"] },
  { id: "superbuy", short: "SB", name: "Superbuy", url: "https://www.superbuy.com/en/page/about/affiliate/", note: "Popular established agent", checks: ["Official affiliate page", "Confirm current tier table", "Check EU withdrawal route"] },
  { id: "allchinabuy", short: "AC", name: "AllChinaBuy", url: "https://www.allchinabuy.com/en/page/about/affiliate/", note: "Priority application", checks: ["Official affiliate page", "Confirm attribution rules", "Request fresh share URL"] },
  { id: "kakobuy", short: "KB", name: "KakoBuy", url: "https://www.kakobuy.com/register", note: "Verify operating terms", checks: ["Official registration page", "Request written terms", "Confirm fresh link format"] }
];

const launchData = agents.map((agent, index) => ({ ...agent, order: String(index + 1).padStart(2, "0") }));
const stateKey = "findspilot:pages-launch:v1";
const $ = (selector) => document.querySelector(selector);
const partnerPitch = `Subject: EU launch sprint for [AGENT NAME]

Hello [AGENT NAME] partnerships team,

FindsPilot is an independent shopping-agent comparison and link-conversion platform for EU buyers. We are opening five founding partner sprints at €300 each.

The fixed scope includes a verified evidence profile, a fresh registration-link integration, 12 original hooks, six channel-ready creative briefs, a UTM map and a launch snapshot. Affiliate commission, if approved, stays separate and disclosed. Sponsorship cannot buy ranking or remove safety notes, and we do not guarantee traffic or sales.

Public launch page: https://hireatlasio.github.io/findspilot/#partners
Private intake: https://hireatlasio.github.io/findspilot/#partner-intake

Please send your current public program terms and the right commercial contact if this fits.

Regards,
FindsPilot`;

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
}

function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.add("show");
  window.setTimeout(() => element.classList.remove("show"), 1800);
}

function loadState() {
  try { return JSON.parse(localStorage.getItem(stateKey) || "{}"); } catch { return {}; }
}

function saveState(state) {
  try { localStorage.setItem(stateKey, JSON.stringify(state)); } catch { /* Local persistence is optional. */ }
}

function renderAgents() {
  $("#agent-grid").innerHTML = agents.map((agent) => `<article class="agent-card"><div class="agent-top"><b>${agent.short}</b><span>NEUTRAL ROUTE</span></div><h3>${agent.name}</h3><p>${agent.note}. No commission is active on this link.</p><ul>${agent.checks.map((item) => `<li>${item}</li>`).join("")}</ul><a href="${agent.url}" target="_blank" rel="nofollow noreferrer"><span>Open official page</span><span>↗</span></a></article>`).join("");
}

function renderLaunch() {
  const state = loadState();
  $("#launch-board").innerHTML = launchData.map((agent) => `<article class="launch-row ${state[agent.id] ? "done" : ""}" data-id="${agent.id}"><strong>${agent.order}</strong><div><h3>${agent.name}</h3><p>Register personally · save current terms · return only the non-secret activation packet</p></div><a href="${agent.url}" target="_blank" rel="noreferrer">Open official ↗</a><button type="button">${state[agent.id] ? "Evidence saved ✓" : "Mark after saved"}</button></article>`).join("");
  document.querySelectorAll(".launch-row button").forEach((button) => button.addEventListener("click", () => {
    const row = button.closest(".launch-row");
    const id = row.dataset.id;
    const next = loadState();
    next[id] = !next[id];
    saveState(next);
    renderLaunch();
  }));
}

function validMarketplaceUrl(raw) {
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    return ["weidian.com", "taobao.com", "1688.com", "tmall.com"].some((domain) => host === domain || host.endsWith(`.${domain}`)) ? url : null;
  } catch { return null; }
}

$("#converter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const raw = $("#source-url").value.trim();
  const source = validMarketplaceUrl(raw);
  if (!source) { toast("Use a valid Taobao, Weidian, 1688 or Tmall URL."); return; }
  $("#converter-empty").hidden = true;
  const result = $("#route-results");
  result.hidden = false;
  result.innerHTML = `<h3>Official routes prepared · keep this source: ${escapeHtml(source.hostname)}</h3>${agents.map((agent) => `<div class="route-card"><b>${agent.short}</b><span><strong>${agent.name}</strong><small>Neutral official route · paste the source after signup</small></span><a href="${agent.url}" target="_blank" rel="nofollow noreferrer">Open ↗</a></div>`).join("")}<button id="copy-source" type="button">Copy original product link</button>`;
  $("#copy-source").addEventListener("click", async () => { await copyText(source.toString()); toast("Source link copied"); });
});

$("#weight").addEventListener("input", (event) => {
  const kg = Math.max(.1, Math.min(30, Number(event.target.value) || .1));
  const low = Math.round(14 + kg * 5.5);
  const high = Math.round(21 + kg * 9);
  $("#estimate-output").textContent = `€${low}–€${high}`;
});

async function copyText(value) {
  try { await navigator.clipboard.writeText(value); }
  catch {
    const area = document.createElement("textarea");
    area.value = value;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
}

$("#copy-packet").addEventListener("click", async () => {
  await copyText($("#packet-text").textContent);
  toast("Activation packet copied");
});

$("#copy-pitch").addEventListener("click", async () => {
  await copyText(partnerPitch);
  toast("€300 partner pitch copied");
});

const intakeEndpoint = "https://acychihnodkzwngboinf.supabase.co/functions/v1/findspilot-partner-intake";
const partnerForm = $("#partner-form");
partnerForm.elements.startedAt.value = String(Date.now());
document.querySelectorAll("[data-scope]").forEach((link) => link.addEventListener("click", () => {
  partnerForm.elements.requestedScope.value = link.dataset.scope;
}));
partnerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submit = partnerForm.querySelector("button[type=submit]");
  const status = $("#partner-form-status");
  submit.disabled = true;
  status.className = "";
  status.textContent = "Submitting securely…";
  const data = new FormData(partnerForm);
  const payload = Object.fromEntries(data.entries());
  payload.consent = data.get("consent") === "on";
  payload.startedAt = Number(payload.startedAt);
  try {
    const response = await fetch(intakeEndpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "The request could not be submitted.");
    status.className = "success";
    status.textContent = result.message || "Request received.";
    partnerForm.reset();
    partnerForm.elements.startedAt.value = String(Date.now());
  } catch (error) {
    status.className = "error";
    status.textContent = error instanceof Error ? error.message : "The request could not be submitted.";
  } finally {
    submit.disabled = false;
  }
});

renderAgents();
renderLaunch();
