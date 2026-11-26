// NusaAngka entry point — hash router and all page interactions.

import { homeView, populationView, economyView, regionsView, wellbeingView, environmentView, sourcesView } from "./views.js";
import { POPULATION_SERIES, SECTORS, PROVINCES } from "./data.js";
import { fmt } from "./charts.js";

const appEl = document.getElementById("app");

const ROUTES = {
  "": { title: "Overview", render: homeView },
  "/": { title: "Overview", render: homeView },
  "/population": { title: "Population", render: populationView, wire: wirePopulation },
  "/economy": { title: "Economy", render: economyView, wire: wireEconomy },
  "/regions": { title: "Regions", render: regionsView, wire: wireRegions },
  "/wellbeing": { title: "Wellbeing", render: wellbeingView },
  "/environment": { title: "Environment", render: environmentView },
  "/sources": { title: "Sources", render: sourcesView },
};

function currentPath() {
  const hash = window.location.hash.replace(/^#/, "");
  return hash === "" ? "/" : hash;
}

function markActiveNav(path) {
  const key = path === "/" ? "home" : path.slice(1);
  document.querySelectorAll(".nav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.route === key);
  });
}

function downloadCsv(filename, rows) {
  const text = rows.map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function wirePopulation() {
  const slider = document.getElementById("popYear");
  const out = document.getElementById("popYearOut");
  const show = () => {
    const year = Number(slider.value);
    const row = POPULATION_SERIES.find((d) => d.year === year);
    const prev = POPULATION_SERIES.find((d) => d.year === year - 1);
    const delta = prev ? ` (+${fmt(row.people - prev.people, 1)}m on ${year - 1})` : "";
    out.textContent = `${year}: ${fmt(row.people, 1)} million people${delta}. Source: BPS mid-year estimate.`;
  };
  slider.addEventListener("input", show);
  show();
  document.getElementById("dlPop").addEventListener("click", () => {
    downloadCsv("nusaangka-population.csv", [["year", "population_millions", "source"], ...POPULATION_SERIES.map((d) => [d.year, d.people, "BPS mid-year estimate"])]);
  });
}

function wireEconomy() {
  const barsBtn = document.getElementById("sectorBarsBtn");
  const donutBtn = document.getElementById("sectorDonutBtn");
  const barsEl = document.getElementById("sectorChart");
  const donutEl = document.getElementById("sectorDonut");
  const showBars = (bars) => {
    barsEl.hidden = !bars;
    donutEl.hidden = bars;
    barsBtn.classList.toggle("active", bars);
    donutBtn.classList.toggle("active", !bars);
  };
  barsBtn.addEventListener("click", () => showBars(true));
  donutBtn.addEventListener("click", () => showBars(false));
  document.getElementById("dlSectors").addEventListener("click", () => {
    downloadCsv("nusaangka-sectors-2024.csv", [["sector", "share_of_gdp_percent", "real_growth_percent_2024", "source"], ...SECTORS.map((s) => [s.name, s.share, s.growth, "BPS 2024"])]);
  });
}

function provinceRows() {
  return PROVINCES.map((p) => ({ ...p, density: (p.people * 1000) / p.area }));
}

function renderProvinceTable() {
  const query = document.getElementById("provSearch").value.trim().toLowerCase();
  const island = document.getElementById("provIsland").value;
  const sort = document.getElementById("provSort").value;
  let rows = provinceRows().filter((p) => {
    const matchesText = query === "" || p.name.toLowerCase().includes(query) || p.capital.toLowerCase().includes(query);
    const matchesIsland = island === "All island groups" || p.island === island;
    return matchesText && matchesIsland;
  });
  const sorters = {
    people: (a, b) => b.people - a.people,
    name: (a, b) => a.name.localeCompare(b.name),
    density: (a, b) => b.density - a.density,
    grdp: (a, b) => b.grdp - a.grdp,
    area: (a, b) => b.area - a.area,
  };
  rows = rows.sort(sorters[sort]);
  const body = document.getElementById("provBody");
  if (rows.length === 0) {
    body.innerHTML = `<tr><td colspan="6"><p class="empty">No province matches that search. Try a different name, or clear the island filter.</p></td></tr>`;
  } else {
    body.innerHTML = rows.map((p) => `<tr>
      <td><strong>${p.name}</strong></td><td>${p.capital}</td><td>${p.island}</td>
      <td class="num">${fmt(p.people * 1000)}</td><td class="num">${fmt(Math.round(p.density))}</td><td class="num">Rp${fmt(p.grdp, 1)}m</td>
    </tr>`).join("");
  }
  document.getElementById("provCount").textContent = `Showing ${rows.length} of ${PROVINCES.length} provinces.`;
}

function compareCard(p, other) {
  const density = (p.people * 1000) / p.area;
  const otherDensity = (other.people * 1000) / other.area;
  const lead = (a, b) => (a > b ? ' <span class="up">▲ higher</span>' : a < b ? "" : "");
  return `<article class="card">
    <h3>${p.name}</h3>
    <p>Capital: <strong>${p.capital}</strong> · ${p.island}</p>
    <ul class="fact-list">
      <li>Population: <strong>${fmt(p.people * 1000)}</strong>${lead(p.people, other.people)}</li>
      <li>Density: <strong>${fmt(Math.round(density))} people/km²</strong>${lead(density, otherDensity)}</li>
      <li>Land area: <strong>${fmt(p.area)} km²</strong>${lead(p.area, other.area)}</li>
      <li>Income per person: <strong>Rp${fmt(p.grdp, 1)} million</strong>${lead(p.grdp, other.grdp)}</li>
    </ul>
    <p class="source">BPS provincial publications, 2024.</p>
  </article>`;
}

function wireRegions() {
  ["provSearch", "provIsland", "provSort"].forEach((id) => {
    document.getElementById(id).addEventListener("input", renderProvinceTable);
    document.getElementById(id).addEventListener("change", renderProvinceTable);
  });
  renderProvinceTable();
  const selA = document.getElementById("cmpA");
  const selB = document.getElementById("cmpB");
  selA.value = "West Java";
  selB.value = "Jakarta";
  document.getElementById("cmpBtn").addEventListener("click", () => {
    const a = PROVINCES.find((p) => p.name === selA.value);
    const b = PROVINCES.find((p) => p.name === selB.value);
    const out = document.getElementById("cmpOut");
    if (a.name === b.name) {
      out.innerHTML = `<p class="empty">You picked ${a.name} twice — choose two different provinces to compare.</p>`;
      return;
    }
    out.innerHTML = `<div class="compare-out">${compareCard(a, b)}${compareCard(b, a)}</div>`;
  });
  document.getElementById("dlProvinces").addEventListener("click", () => {
    downloadCsv("nusaangka-provinces-2024.csv", [["province", "capital", "island_group", "population_people", "land_area_km2", "density_per_km2", "grdp_per_capita_million_rupiah", "source"],
      ...provinceRows().map((p) => [p.name, p.capital, p.island, p.people * 1000, p.area, Math.round(p.density), p.grdp, "BPS 2024"])]);
  });
}

function render() {
  const path = currentPath();
  const route = ROUTES[path] ?? ROUTES["/"];
  document.title = `NusaAngka — ${route.title}`;
  appEl.innerHTML = route.render();
  markActiveNav(path);
  if (route.wire) route.wire();
  document.getElementById("main").focus({ preventScroll: true });
  window.scrollTo({ top: 0 });
  const nav = document.getElementById("siteNav");
  nav.classList.remove("open");
  document.getElementById("menuBtn").setAttribute("aria-expanded", "false");
}

document.getElementById("menuBtn").addEventListener("click", () => {
  const nav = document.getElementById("siteNav");
  const open = nav.classList.toggle("open");
  document.getElementById("menuBtn").setAttribute("aria-expanded", String(open));
});
document.getElementById("toTopBtn").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("hashchange", render);
render();
