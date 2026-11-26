// NusaAngka page views — each function returns the HTML for one hash route.
// Interactivity is wired in main.js after each render.

import {
  HEADLINE, POPULATION_SERIES, GDP_GROWTH_SERIES, AGE_PYRAMID, SECTORS,
  INFLATION_SERIES, PROVINCES, ISLANDS, WELLBEING, ENERGY_MIX, FOREST_SERIES, PALETTE,
} from "./data.js";
import { barChart, lineChart, hBars, donutChart, pyramidChart, fmt } from "./charts.js";

const esc = (s) => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;");

export function statCard(label, value, unit, detail, source, year) {
  // The source string already carries its year; show it once.
  const shown = source.includes(String(year)) ? source : `${source} · ${year}`;
  return `<article class="stat">
    <p class="label">${esc(label)}</p>
    <p class="value">${esc(value)} <small>${esc(unit)}</small></p>
    <p class="detail">${detail}</p>
    <p class="source">${esc(shown)}</p>
  </article>`;
}

function panel(title, body, source, extra = "") {
  return `<section class="panel"><div class="panel-head"><h3>${esc(title)}</h3>${extra}</div>${body}<p class="source">${esc(source)}</p></section>`;
}

export function homeView() {
  const popPoints = POPULATION_SERIES.map((d) => ({ label: String(d.year), value: d.people }));
  const gdpPoints = GDP_GROWTH_SERIES.map((d) => ({ label: String(d.year), value: d.growth }));
  const topProvinces = [...PROVINCES].sort((a, b) => b.people - a.people).slice(0, 8)
    .map((p, i) => ({ label: p.name, value: p.people / 1000, color: PALETTE[i % PALETTE.length] }));
  return `
  <section class="hero">
    <p class="kicker">National statistics · Indonesia</p>
    <h1>Indonesia, measured.</h1>
    <p class="lede">NusaAngka gathers the country’s headline numbers in one place — how many people live here, what the economy produces, how the 38 provinces compare, and how health, schooling and the environment are moving. Every figure is dated and sourced, and every chart below is drawn from the data on this site.</p>
    <div class="controls">
      <a class="btn" href="#/population">Explore population</a>
      <a class="btn btn-ghost" href="#/regions">Compare provinces</a>
      <a class="btn btn-ghost" href="#/sources">How to cite a figure</a>
    </div>
  </section>

  <div class="stat-grid">
    ${statCard("Population", "283.5", "million", `Growing at <span class="up">${HEADLINE.growth.value}% a year</span>; median age ${HEADLINE.medianAge.value} years.`, HEADLINE.population.source, 2024)}
    ${statCard("Economy (GDP)", "Rp22.14", "quadrillion", `Real growth <span class="up">${HEADLINE.gdpGrowth.value}%</span> in 2024; about US$${fmt(HEADLINE.gdpPerCapita.value)} per person.`, HEADLINE.gdp.source, 2024)}
    ${statCard("Inflation", "1.57%", "Dec, year on year", "The calmest December since 2020, after the 5.51% spike of 2022.", HEADLINE.inflation.source, 2024)}
    ${statCard("Unemployment", "4.91%", "of the labour force", "Measured each August; the lowest August reading in a decade.", HEADLINE.unemployment.source, 2024)}
    ${statCard("Poverty rate", "9.03%", "of the population", "About 25.2 million people below the national poverty line.", HEADLINE.poverty.source, 2024)}
    ${statCard("Life expectancy", "71.8", "years", "Up from 67.2 years in 2000 — a gain of 4.6 years in a generation.", HEADLINE.lifeExpectancy.source, 2023)}
  </div>

  <div class="two-col">
    ${panel("Population keeps climbing — 255.6m (2015) to 283.5m (2024)",
      lineChart(popPoints, { label: "Indonesia population 2015 to 2024, millions", digits: 0, color: "#0b3b4f" }),
      "BPS mid-year estimates, 2015–2024. The 2020 census counted 270.2 million.")}
    ${panel("Growth after the pandemic dip",
      barChart(gdpPoints, { label: "Real GDP growth percent per year", digits: 1, color: "#0e7c7b", showValues: false }),
      "BPS national accounts. 2020 (−2.07%) is the only contraction in the decade.")}
  </div>

  ${panel("Where people live: the eight largest provinces (million people)",
    hBars(topProvinces, { label: "Largest provinces by population", digits: 1, unit: "m" }),
    "BPS provincial estimates, mid-2024. West Java alone holds 50.3 million people — more than most countries. Full table under Regions.")}

  <h2>Start with a question</h2>
  <div class="card-grid">
    <article class="card"><h3>How old is Indonesia?</h3><p>Median age 30.1, with two-thirds of people of working age. See the full age pyramid and what it means for schools and jobs.</p><p><a class="more" href="#/population">Open Population →</a></p></article>
    <article class="card"><h3>What does the economy make?</h3><p>Manufacturing is the largest sector at 19.0% of GDP, ahead of trade and agriculture. Compare all ten sectors and their growth.</p><p><a class="more" href="#/economy">Open Economy →</a></p></article>
    <article class="card"><h3>Which province is richest per person?</h3><p>Jakarta leads at Rp321 million per person; resource provinces follow. Search, sort and compare any two provinces side by side.</p><p><a class="more" href="#/regions">Open Regions →</a></p></article>
    <article class="card"><h3>Are lives getting longer?</h3><p>Life expectancy, child survival, literacy and schooling have all improved since 2000. Eight indicators, each with its change.</p><p><a class="more" href="#/wellbeing">Open Wellbeing →</a></p></article>
  </div>

  <div class="callout"><strong>For students and journalists:</strong> every table on this site can be downloaded as CSV from its page, and the <a href="#/sources">Sources</a> page gives the exact publication to cite for each figure. Figures are rounded for reading; cite the source publication for official use.</div>`;
}

export function populationView() {
  const popPoints = POPULATION_SERIES.map((d) => ({ label: String(d.year), value: d.people }));
  const islandTotals = ISLANDS.slice(1).map((island, i) => ({
    label: island,
    value: PROVINCES.filter((p) => p.island === island).reduce((a, p) => a + p.people, 0) / 1000,
    color: PALETTE[i % PALETTE.length],
  }));
  const densest = [...PROVINCES].map((p) => ({ ...p, density: p.people * 1000 / p.area }))
    .sort((a, b) => b.density - a.density).slice(0, 8);
  const densestRows = densest.map((p, i) => ({ label: p.name, value: Math.round(p.density), color: PALETTE[i % PALETTE.length] }));
  return `
  <section class="hero">
    <p class="kicker">Population</p>
    <h1>283.5 million people, still growing.</h1>
    <p class="lede">Indonesia is the world’s fourth most populous country. Growth is slowing — from 1.49% a year in the 2000s to 1.11% now — but the population still adds roughly three million people a year, and about 59% now live in cities.</p>
  </section>

  <div class="stat-grid">
    ${statCard("Population", "283.5", "million", "Fourth largest in the world, after India, China and the United States.", HEADLINE.population.source, 2024)}
    ${statCard("Growth rate", "1.11%", "per year", "Down from 1.25% in 2020; fertility is near 2.1 children per woman.", HEADLINE.growth.source, 2024)}
    ${statCard("Median age", "30.1", "years", "Half of Indonesians are younger than 30 — a young country by global standards.", HEADLINE.medianAge.source, 2024)}
    ${statCard("Urban share", "59.0%", "in cities", "About 167 million urban residents; Java’s cities hold the largest share.", HEADLINE.urbanShare.source, 2024)}
  </div>

  ${panel("Population by year — drag to inspect a year",
    lineChart(popPoints, { label: "Population by year, millions", digits: 1, color: "#0b3b4f" }) +
    `<div class="controls"><label class="field">Year <input type="range" id="popYear" min="2015" max="2024" step="1" value="2024"></label><p class="result-count" id="popYearOut" aria-live="polite"></p></div>`,
    "BPS mid-year estimates. The slider reads the same series the chart draws.")}

  ${panel("The age pyramid: a wide base, a narrow top (percent of population)",
    pyramidChart(AGE_PYRAMID, { label: "Age pyramid 2024" }) +
    `<div class="legend"><span><i style="background:#0b3b4f"></i>Male</span><span><i style="background:#e4572e"></i>Female</span><span>Groups run youngest (bottom) to oldest (top). Ages 15–64 make up about 69% of the population — the “demographic bonus” window.</span></div>`,
    "BPS, 2024 age structure (rounded shares).")}

  <div class="two-col">
    ${panel("People by island group (million)",
      hBars(islandTotals, { label: "Population by island group", digits: 1, unit: "m" }),
      "BPS provincial estimates summed by island group, mid-2024. Java holds about 56% of all Indonesians on 7% of the land.")}
    ${panel("Densest provinces (people per km²)",
      hBars(densestRows, { label: "Densest provinces", digits: 0 }),
      "Computed from BPS 2024 population and land area. Jakarta: about 16,100 people per km²; South Papua: about 4.")}
  </div>

  <div class="callout"><strong>What this means:</strong> with a median age of 30 and a working-age share near 69%, Indonesia’s challenge is creating enough good jobs and classrooms for cohorts already born — while preparing health and pension systems for the older population visible at the pyramid’s top.</div>
  <p><button class="btn" id="dlPop" type="button">Download population series (CSV)</button></p>`;
}

export function economyView() {
  const gdpPoints = GDP_GROWTH_SERIES.map((d) => ({ label: String(d.year), value: d.growth }));
  const inflPoints = INFLATION_SERIES.map((d) => ({ label: String(d.year), value: d.rate }));
  const sectorBars = SECTORS.map((s, i) => ({ label: s.name, value: s.share, color: PALETTE[i % PALETTE.length] }));
  const sectorSlices = SECTORS.map((s, i) => ({ label: s.name, value: s.share, color: PALETTE[i % PALETTE.length] }));
  const sectorRows = SECTORS.map((s) => `<tr><td>${esc(s.name)}</td><td class="num">${fmt(s.share, 2)}%</td><td class="num">${fmt(s.growth, 2)}%</td><td class="bar-cell"><div class="mini-bar" style="width:${Math.round((s.share / 20) * 100)}%"></div></td></tr>`).join("");
  return `
  <section class="hero">
    <p class="kicker">Economy</p>
    <h1>A Rp22 quadrillion economy growing at 5%.</h1>
    <p class="lede">Indonesia’s GDP reached Rp22.14 quadrillion in 2024 — about US$1.40 trillion, or roughly US$4,960 per person. Growth has held near 5% for a decade outside the pandemic year, powered by manufacturing, trade and a fast-growing digital sector.</p>
  </section>

  <div class="stat-grid">
    ${statCard("GDP", "Rp22.14", "quadrillion", "About US$1.40 trillion at the year’s average exchange rate.", HEADLINE.gdp.source, 2024)}
    ${statCard("Real growth", "5.03%", "in 2024", "The tenth year near 5% in the last eleven; only 2020 contracted.", HEADLINE.gdpGrowth.source, 2024)}
    ${statCard("GDP per person", "US$4,960", "per year", "Up from about US$3,600 in 2015 — upper-middle income since 2020.", HEADLINE.gdpPerCapita.source, 2024)}
    ${statCard("Inflation", "1.57%", "Dec 2024, yoy", "Inside Bank Indonesia’s 2.5% ±1% target band for most of the year.", HEADLINE.inflation.source, 2024)}
  </div>

  ${panel("Real GDP growth, percent per year",
    barChart(gdpPoints, { label: "Real GDP growth", digits: 1, color: "#0e7c7b" }),
    "BPS national accounts, 2015–2024. The 2020 bar (−2.07%) is the pandemic contraction.")}

  <section class="panel">
    <div class="panel-head"><h3>What the economy produces — share of GDP, 2024</h3>
      <span class="toggle" role="group" aria-label="Sector chart type">
        <button type="button" id="sectorBarsBtn" class="active">Bars</button>
        <button type="button" id="sectorDonutBtn">Donut</button>
      </span>
    </div>
    <div id="sectorChart">${hBars(sectorBars, { label: "GDP by sector share", digits: 1, unit: "%" })}</div>
    <div id="sectorDonut" hidden>${donutChart(sectorSlices, { label: "GDP by sector donut", centerTop: "GDP", centerBottom: "by sector" })}<div class="legend">${sectorSlices.map((s) => `<span><i style="background:${s.color}"></i>${esc(s.label)} ${fmt(s.value, 1)}%</span>`).join("")}</div></div>
    <p class="source">BPS GDP by industry, current prices, 2024. “Other services” groups education, health, accommodation and personal services.</p>
  </section>

  <div class="table-wrap"><table>
    <thead><tr><th>Sector</th><th class="num">Share of GDP</th><th class="num">Real growth 2024</th><th>Share bar</th></tr></thead>
    <tbody>${sectorRows}</tbody>
  </table></div>
  <p class="source">BPS, 2024. Growth is the sector’s real (inflation-adjusted) expansion.</p>

  <div class="two-col">
    ${panel("Inflation has cooled (December, year on year)",
      lineChart(inflPoints, { label: "Inflation December year on year", digits: 1, color: "#e4572e" }),
      "BPS consumer price index. The 2022 peak (5.51%) followed fuel-price adjustments and global food prices.")}
    <section class="panel"><h3>Work and prices in plain words</h3>
      <ul class="fact-list">
        <li><strong>Unemployment 4.91%</strong> (Aug 2024) — about 7.5 million people seeking work, the lowest August rate in a decade. <span class="source">BPS Sakernas</span></li>
        <li><strong>Poverty 9.03%</strong> (Mar 2024) — down from 11.4% in 2015; the poverty line is about Rp582,000 per person per month. <span class="source">BPS</span></li>
        <li><strong>Minimum wages</strong> are set provincially; Jakarta’s 2025 minimum is about Rp5.4 million per month. <span class="source">Provincial decrees, 2024</span></li>
        <li><strong>Household spending</strong> drives about 54% of GDP — consumption, not exports, is the engine. <span class="source">BPS expenditure GDP, 2024</span></li>
      </ul>
    </section>
  </div>
  <p><button class="btn" id="dlSectors" type="button">Download sectors table (CSV)</button></p>`;
}

export function regionsView() {
  const options = PROVINCES.map((p) => `<option value="${esc(p.name)}">${esc(p.name)}</option>`).join("");
  const islandOptions = ISLANDS.map((i) => `<option value="${esc(i)}">${esc(i)}</option>`).join("");
  return `
  <section class="hero">
    <p class="kicker">Regions</p>
    <h1>38 provinces, from 16,100 people per km² to 4.</h1>
    <p class="lede">Indonesia’s provinces differ more than many countries do. West Java holds 50 million people; South Papua holds half a million across an area larger than England. Search the table, filter by island group, or compare any two provinces directly.</p>
  </section>

  <div class="controls">
    <label class="field">Search province or capital <input type="search" id="provSearch" placeholder="e.g. Surabaya, Bali, Papua…" autocomplete="off"></label>
    <label class="field">Island group <select id="provIsland">${islandOptions}</select></label>
    <label class="field">Sort by <select id="provSort">
      <option value="people">Population (largest first)</option>
      <option value="name">Name (A–Z)</option>
      <option value="density">Density (densest first)</option>
      <option value="grdp">Income per person (highest first)</option>
      <option value="area">Land area (largest first)</option>
    </select></label>
    <p class="result-count" id="provCount" aria-live="polite"></p>
  </div>

  <div class="table-wrap"><table>
    <thead><tr><th>Province</th><th>Capital</th><th>Island group</th><th class="num">Population</th><th class="num">Density /km²</th><th class="num">Income per person</th></tr></thead>
    <tbody id="provBody"></tbody>
  </table></div>
  <p class="source">BPS provincial publications, mid-2024. Population in people; income per person is GRDP per capita at current prices (million rupiah). Density computed from population ÷ land area.</p>

  <section class="panel">
    <h3>Compare two provinces</h3>
    <div class="controls">
      <label class="field">Province A <select id="cmpA">${options}</select></label>
      <label class="field">Province B <select id="cmpB">${options}</select></label>
      <button class="btn" id="cmpBtn" type="button">Compare</button>
    </div>
    <div id="cmpOut" aria-live="polite"><p class="empty">Pick two provinces and press Compare — population, density, land area and income per person appear here side by side.</p></div>
  </section>

  <div class="callout"><strong>Reading tip:</strong> income per person is highest where oil, gas, coal and nickel are produced (East Kalimantan, Riau, Central Sulawesi) and in Jakarta — it measures output per resident, not what a typical household earns.</div>
  <p><button class="btn" id="dlProvinces" type="button">Download provinces table (CSV)</button></p>`;
}

export function wellbeingView() {
  const cards = WELLBEING.map((w) => `<article class="card">
    <h3>${esc(w.name)}</h3>
    <p><strong style="font-size:1.3rem;color:#0b3b4f">${esc(w.value)}</strong> <span>(${w.year})</span></p>
    <p>${esc(w.change)}.</p>
    <p class="source">${esc(w.source)}</p>
  </article>`).join("");
  return `
  <section class="hero">
    <p class="kicker">Wellbeing</p>
    <h1>Longer lives, more schooling, near-universal electricity.</h1>
    <p class="lede">Indonesia’s Human Development Index reached 75.02 in 2024 — the “high” category. Behind that single number sit eight measurable improvements, from child survival to internet access.</p>
  </section>

  <div class="stat-grid">
    ${statCard("Life expectancy", "71.8", "years", "+4.6 years since 2000; women live about 4 years longer than men.", HEADLINE.lifeExpectancy.source, 2023)}
    ${statCard("Literacy (15+)", "96.5%", "can read & write", "Youth literacy (15–24) is above 99%; the gap is concentrated in older cohorts.", HEADLINE.literacy.source, 2023)}
    ${statCard("HDI", "75.02", "of 100", "Health, schooling and income combined — “high” since 2019.", "BPS, 2024", 2024)}
    ${statCard("Poverty rate", "9.03%", "Mar 2024", "Down from 11.4% in 2015, despite the 2020 pandemic setback.", HEADLINE.poverty.source, 2024)}
  </div>

  <h2>Eight indicators, each with its change</h2>
  <div class="card-grid">${cards}</div>

  <div class="two-col">
    <section class="panel"><h3>Schooling in numbers</h3>
      <ul class="fact-list">
        <li><strong>Mean schooling 8.9 years</strong> — the average adult finished roughly junior secondary school. <span class="source">BPS, 2024</span></li>
        <li><strong>Expected schooling 13.2 years</strong> — a child starting school today can expect to reach senior secondary. <span class="source">BPS, 2024</span></li>
        <li><strong>About 58 million students</strong> are enrolled from primary to tertiary level. <span class="source">Ministry of Education, 2024</span></li>
        <li><strong>1,100+ universities</strong> and institutes, with about 9.6 million students. <span class="source">Ministry of Higher Education, 2024</span></li>
      </ul>
    </section>
    <section class="panel"><h3>Health in numbers</h3>
      <ul class="fact-list">
        <li><strong>Under-five mortality 20 per 1,000</strong> births — down from 52 in 2000. <span class="source">UN IGME, 2023</span></li>
        <li><strong>About 3,200 hospitals</strong> and 10,400 community health centres (puskesmas). <span class="source">Ministry of Health, 2024</span></li>
        <li><strong>National health insurance (JKN)</strong> covers about 98% of the population. <span class="source">BPJS Kesehatan, 2024</span></li>
        <li><strong>Stunting 21.5%</strong> of children under five (2023), down from 30.8% in 2018 — still the top nutrition priority. <span class="source">SSGI, 2023</span></li>
      </ul>
    </section>
  </div>

  <div class="callout"><strong>What to watch:</strong> the HDI gap between Jakarta (about 84) and Highland Papua (about 53) is wider than the gap between many countries. National averages hide regional differences — the <a href="#/regions">Regions</a> page shows the income side of that gap.</div>`;
}

export function environmentView() {
  const mixSlices = ENERGY_MIX.map((e, i) => ({ label: e.name, value: e.share, color: PALETTE[i % PALETTE.length] }));
  const forestPoints = FOREST_SERIES.map((d) => ({ label: String(d.year), value: d.hectares }));
  return `
  <section class="hero">
    <p class="kicker">Environment</p>
    <h1>90.8 million hectares of forest — and a coal-heavy grid.</h1>
    <p class="lede">Indonesia holds some of the world’s largest tropical forests and peatlands, and also one of its most coal-dependent electricity systems. Both facts shape the country’s climate footprint.</p>
  </section>

  <div class="stat-grid">
    ${statCard("Forest cover", "90.8", "million hectares", "45.8% of land area — the third-largest tropical forest estate on Earth.", HEADLINE.forestShare.source, 2023)}
    ${statCard("Renewable electricity", "13.5%", "of generation", "Hydro and geothermal lead; solar is still under 1% despite equatorial sun.", "Ministry of Energy (ESDM), 2024", 2024)}
    ${statCard("Land area", "1.90", "million km²", "17,000+ islands across three time zones; about 6,000 are inhabited.", "BPS / BIG, 2024", 2024)}
    ${statCard("CO₂ per person", "2.3", "tonnes a year", "Well below the world average of about 4.7 tonnes, but rising with income.", "World Bank, 2022", 2022)}
  </div>

  <div class="two-col">
    <section class="panel"><h3>Where electricity comes from, 2024</h3>
      ${donutChart(mixSlices, { label: "Electricity generation mix", centerTop: "61.9%", centerBottom: "coal" })}
      <div class="legend">${mixSlices.map((s) => `<span><i style="background:${s.color}"></i>${esc(s.label)} ${fmt(s.value, 1)}%</span>`).join("")}</div>
      <p class="source">Ministry of Energy and Mineral Resources, 2024 (share of generation, approximate).</p>
    </section>
    ${panel("Forest area is shrinking slowly (million hectares)",
      lineChart(forestPoints, { label: "Forest area million hectares", digits: 0, color: "#5b8e7d" }),
      "Ministry of Environment and Forestry. Loss has slowed since 2016; fire years (2015, 2019) caused the sharpest drops.")}
  </div>

  <h2>Land, sea and weather</h2>
  <div class="card-grid">
    <article class="card"><h3>Peatlands</h3><p>About 13.4 million hectares of peat — carbon-rich wetlands concentrated in Sumatra, Kalimantan and Papua. Drained peat is Indonesia’s largest land-emission source.</p><p class="source">Ministry of Environment and Forestry, 2023</p></article>
    <article class="card"><h3>Coastline & seas</h3><p>Over 108,000 km of coastline and 6.4 million km² of waters. Fisheries produce about 7 million tonnes of capture fish a year.</p><p class="source">Ministry of Marine Affairs, 2024</p></article>
    <article class="card"><h3>Rainfall</h3><p>Most regions receive 1,750–3,000 mm of rain a year. The wet season runs roughly November–March, with the east (Nusa Tenggara) markedly drier.</p><p class="source">BMKG climate normals</p></article>
    <article class="card"><h3>Earthquakes & volcanoes</h3><p>Indonesia sits on the Ring of Fire: 127 active volcanoes and thousands of recorded tremors a year — most too small to feel.</p><p class="source">BMKG / PVMBG, 2024</p></article>
  </div>

  <div class="callout"><strong>The tension in one line:</strong> forests and peatlands store carbon on a global scale, while coal supplies three-fifths of electricity — Indonesia’s energy transition is therefore one of the most consequential in the world.</div>`;
}

export function sourcesView() {
  return `
  <section class="hero">
    <p class="kicker">Sources & methods</p>
    <h1>Where every number comes from.</h1>
    <p class="lede">NusaAngka is an original publication, not an official release. Figures are taken from the public publications below, rounded for reading, and always shown with their year. For official use, cite the source publication — not this page.</p>
  </section>

  <div class="table-wrap"><table>
    <thead><tr><th>Figure on this site</th><th>Publication to cite</th><th>Year used</th></tr></thead>
    <tbody>
      <tr><td>Population, growth, median age, urban share</td><td>BPS — Indonesian Population Projections & mid-year estimates</td><td class="num">2024</td></tr>
      <tr><td>Provincial population, area, GRDP per capita</td><td>BPS — Provincial publications (Dalam Angka series)</td><td class="num">2024</td></tr>
      <tr><td>GDP, growth, GDP per capita, sectors</td><td>BPS — National accounts (GDP by industry & expenditure)</td><td class="num">2024</td></tr>
      <tr><td>Inflation</td><td>BPS — Consumer Price Index, December release</td><td class="num">2024</td></tr>
      <tr><td>Unemployment</td><td>BPS — Sakernas (National Labour Force Survey), August</td><td class="num">2024</td></tr>
      <tr><td>Poverty rate</td><td>BPS — Poverty profile, March release</td><td class="num">2024</td></tr>
      <tr><td>Life expectancy, CO₂ per person</td><td>World Bank — World Development Indicators</td><td class="num">2023 / 2022</td></tr>
      <tr><td>Literacy, water, electricity access</td><td>BPS — Susenas (National Socio-Economic Survey)</td><td class="num">2023–2024</td></tr>
      <tr><td>HDI and schooling years</td><td>BPS — Human Development Index release</td><td class="num">2024</td></tr>
      <tr><td>Under-five mortality</td><td>UN IGME — Levels and Trends in Child Mortality</td><td class="num">2023</td></tr>
      <tr><td>Forest area, peatlands</td><td>Ministry of Environment and Forestry — forest statistics</td><td class="num">2023</td></tr>
      <tr><td>Electricity mix</td><td>Ministry of Energy and Mineral Resources (ESDM)</td><td class="num">2024</td></tr>
      <tr><td>Internet users</td><td>APJII — Indonesian Internet Profile survey</td><td class="num">2024</td></tr>
    </tbody>
  </table></div>

  <h2>How to read this site</h2>
  <div class="two-col">
    <section class="panel"><h3>Definitions that matter</h3>
      <ul class="fact-list">
        <li><strong>Mid-year estimate:</strong> population on 1 July, projected from the last census (2020) with births, deaths and migration.</li>
        <li><strong>Real growth:</strong> change after removing inflation, so years are comparable.</li>
        <li><strong>Current prices:</strong> values in the rupiah of that year — good for shares, not for long-run comparisons.</li>
        <li><strong>GRDP per capita:</strong> a province’s output divided by its residents. It is not household income.</li>
        <li><strong>Poverty line:</strong> the monthly spending needed for basic food and non-food needs (about Rp582,000 per person, Mar 2024).</li>
      </ul>
    </section>
    <section class="panel"><h3>Rounding & reuse</h3>
      <ul class="fact-list">
        <li>Figures are rounded (e.g. 283.5 million, 5.03%) so charts stay readable; small sums may differ by 0.1 from 100%.</li>
        <li>CSV downloads on the Population, Economy and Regions pages contain the exact values plotted on this site.</li>
        <li>Charts are drawn by this site’s own code from the datasets above — no external images or libraries.</li>
        <li>To cite: “BPS (2024), via NusaAngka” — always name the original publisher first.</li>
      </ul>
    </section>
  </div>

  <div class="callout"><strong>About NusaAngka:</strong> an independent statistics reader built to answer “what are this country’s numbers?” at a glance. It runs entirely from its own files — open it offline, on a phone or a desktop, and every page, chart and control works the same.</div>`;
}
