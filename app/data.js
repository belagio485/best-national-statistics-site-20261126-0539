// NusaAngka datasets — every figure carries its source and year in the views.
// Figures are published national statistics for Indonesia (BPS, Bank Indonesia,
// World Bank), rounded for reading. This file holds data only; charts.js draws
// and views.js presents.

export const HEADLINE = {
  population: { value: 283.5, unit: "million people", year: 2024, source: "BPS mid-year population estimate, 2024" },
  growth: { value: 1.11, unit: "% per year", year: 2024, source: "BPS, 2024" },
  density: { value: 149, unit: "people per km²", year: 2024, source: "BPS, 2024 (land area 1.9 million km²)" },
  medianAge: { value: 30.1, unit: "years", year: 2024, source: "BPS, 2024" },
  urbanShare: { value: 59.0, unit: "% living in cities", year: 2024, source: "BPS, 2024" },
  gdp: { value: 22.14, unit: "quadrillion rupiah", year: 2024, source: "BPS national accounts, 2024 (current prices)" },
  gdpGrowth: { value: 5.03, unit: "% real growth", year: 2024, source: "BPS, 2024" },
  gdpPerCapita: { value: 4960, unit: "US$ per person", year: 2024, source: "BPS, 2024 (converted at the year’s average rate)" },
  inflation: { value: 1.57, unit: "% year on year, Dec", year: 2024, source: "BPS consumer price index, Dec 2024" },
  unemployment: { value: 4.91, unit: "% of labour force, Aug", year: 2024, source: "BPS Sakernas, Aug 2024" },
  poverty: { value: 9.03, unit: "% below the poverty line, Mar", year: 2024, source: "BPS, Mar 2024" },
  lifeExpectancy: { value: 71.8, unit: "years at birth", year: 2023, source: "World Bank, 2023" },
  literacy: { value: 96.5, unit: "% of people aged 15+", year: 2023, source: "BPS Susenas, 2023" },
  forestShare: { value: 45.8, unit: "% of land area", year: 2023, source: "Ministry of Environment and Forestry, 2023" },
};

// Mid-year population, millions.
export const POPULATION_SERIES = [
  { year: 2015, people: 255.6 },
  { year: 2016, people: 258.7 },
  { year: 2017, people: 261.9 },
  { year: 2018, people: 265.0 },
  { year: 2019, people: 268.1 },
  { year: 2020, people: 270.2 },
  { year: 2021, people: 272.7 },
  { year: 2022, people: 275.8 },
  { year: 2023, people: 278.7 },
  { year: 2024, people: 283.5 },
];

// Real GDP growth, percent per year.
export const GDP_GROWTH_SERIES = [
  { year: 2015, growth: 4.88 },
  { year: 2016, growth: 5.03 },
  { year: 2017, growth: 5.07 },
  { year: 2018, growth: 5.17 },
  { year: 2019, growth: 5.02 },
  { year: 2020, growth: -2.07 },
  { year: 2021, growth: 3.70 },
  { year: 2022, growth: 5.31 },
  { year: 2023, growth: 5.05 },
  { year: 2024, growth: 5.03 },
];

// Age structure 2024, percent of population in each five-year group.
export const AGE_PYRAMID = [
  { group: "0–4", male: 4.1, female: 3.9 },
  { group: "5–9", male: 4.3, female: 4.0 },
  { group: "10–14", male: 4.4, female: 4.2 },
  { group: "15–19", male: 4.3, female: 4.1 },
  { group: "20–24", male: 4.2, female: 4.0 },
  { group: "25–29", male: 4.1, female: 4.0 },
  { group: "30–34", male: 4.0, female: 3.9 },
  { group: "35–39", male: 3.9, female: 3.8 },
  { group: "40–44", male: 3.6, female: 3.5 },
  { group: "45–49", male: 3.2, female: 3.1 },
  { group: "50–54", male: 2.8, female: 2.8 },
  { group: "55–59", male: 2.3, female: 2.4 },
  { group: "60–64", male: 1.8, female: 2.0 },
  { group: "65–69", male: 1.3, female: 1.5 },
  { group: "70–74", male: 0.9, female: 1.1 },
  { group: "75+", male: 0.8, female: 1.1 },
];

// GDP by sector, share of GDP at current prices, 2024.
export const SECTORS = [
  { name: "Manufacturing", share: 18.98, growth: 4.43 },
  { name: "Wholesale & retail trade", share: 12.71, growth: 4.86 },
  { name: "Agriculture, forestry & fishing", share: 12.61, growth: 1.20 },
  { name: "Construction", share: 9.92, growth: 5.01 },
  { name: "Mining & quarrying", share: 8.49, growth: 4.90 },
  { name: "Transport & storage", share: 5.80, growth: 8.69 },
  { name: "Financial services", share: 4.61, growth: 5.65 },
  { name: "Information & communication", share: 4.30, growth: 7.57 },
  { name: "Public administration", share: 3.42, growth: 4.10 },
  { name: "Other services", share: 19.16, growth: 5.20 },
];

// Inflation, December year-on-year percent.
export const INFLATION_SERIES = [
  { year: 2019, rate: 2.72 },
  { year: 2020, rate: 1.68 },
  { year: 2021, rate: 1.87 },
  { year: 2022, rate: 5.51 },
  { year: 2023, rate: 2.61 },
  { year: 2024, rate: 1.57 },
];

// All 38 provinces: mid-2024 population estimate (thousands), land area (km²),
// capital, island group, and GRDP per capita (million rupiah, 2024, current
// prices). Source: BPS provincial publications, 2024.
export const PROVINCES = [
  { name: "Aceh", capital: "Banda Aceh", island: "Sumatra", people: 5642, area: 57956, grdp: 45.2 },
  { name: "North Sumatra", capital: "Medan", island: "Sumatra", people: 15602, area: 72981, grdp: 62.8 },
  { name: "West Sumatra", capital: "Padang", island: "Sumatra", people: 5915, area: 42013, grdp: 52.4 },
  { name: "Riau", capital: "Pekanbaru", island: "Sumatra", people: 6844, area: 87024, grdp: 118.6 },
  { name: "Riau Islands", capital: "Tanjung Pinang", island: "Sumatra", people: 2219, area: 8202, grdp: 140.3 },
  { name: "Jambi", capital: "Jambi City", island: "Sumatra", people: 3645, area: 50058, grdp: 68.9 },
  { name: "South Sumatra", capital: "Palembang", island: "Sumatra", people: 8942, area: 91592, grdp: 61.7 },
  { name: "Bangka Belitung", capital: "Pangkal Pinang", island: "Sumatra", people: 1528, area: 16424, grdp: 66.5 },
  { name: "Bengkulu", capital: "Bengkulu City", island: "Sumatra", people: 2137, area: 19919, grdp: 47.8 },
  { name: "Lampung", capital: "Bandar Lampung", island: "Sumatra", people: 9440, area: 34624, grdp: 48.6 },
  { name: "Jakarta", capital: "Jakarta", island: "Java", people: 10720, area: 664, grdp: 321.4 },
  { name: "West Java", capital: "Bandung", island: "Java", people: 50345, area: 37040, grdp: 52.9 },
  { name: "Central Java", capital: "Semarang", island: "Java", people: 37914, area: 32801, grdp: 44.1 },
  { name: "Yogyakarta", capital: "Yogyakarta City", island: "Java", people: 3792, area: 3186, grdp: 46.8 },
  { name: "East Java", capital: "Surabaya", island: "Java", people: 41814, area: 47900, grdp: 66.2 },
  { name: "Banten", capital: "Serang", island: "Java", people: 12431, area: 9663, grdp: 58.4 },
  { name: "Bali", capital: "Denpasar", island: "Bali–Nusa Tenggara", people: 4433, area: 5780, grdp: 59.7 },
  { name: "West Nusa Tenggara", capital: "Mataram", island: "Bali–Nusa Tenggara", people: 5598, area: 18572, grdp: 34.9 },
  { name: "East Nusa Tenggara", capital: "Kupang", island: "Bali–Nusa Tenggara", people: 5656, area: 48718, grdp: 24.6 },
  { name: "West Kalimantan", capital: "Pontianak", island: "Kalimantan", people: 5649, area: 147307, grdp: 48.3 },
  { name: "Central Kalimantan", capital: "Palangka Raya", island: "Kalimantan", people: 2798, area: 153565, grdp: 64.7 },
  { name: "South Kalimantan", capital: "Banjarbaru", island: "Kalimantan", people: 4308, area: 38744, grdp: 55.1 },
  { name: "East Kalimantan", capital: "Samarinda", island: "Kalimantan", people: 4024, area: 129067, grdp: 189.2 },
  { name: "North Kalimantan", capital: "Tanjung Selor", island: "Kalimantan", people: 744, area: 75468, grdp: 112.5 },
  { name: "North Sulawesi", capital: "Manado", island: "Sulawesi", people: 2694, area: 13892, grdp: 59.3 },
  { name: "Central Sulawesi", capital: "Palu", island: "Sulawesi", people: 3121, area: 61841, grdp: 88.4 },
  { name: "South Sulawesi", capital: "Makassar", island: "Sulawesi", people: 9463, area: 46717, grdp: 62.1 },
  { name: "Southeast Sulawesi", capital: "Kendari", island: "Sulawesi", people: 2780, area: 38068, grdp: 55.8 },
  { name: "Gorontalo", capital: "Gorontalo City", island: "Sulawesi", people: 1217, area: 11257, grdp: 42.7 },
  { name: "West Sulawesi", capital: "Mamuju", island: "Sulawesi", people: 1469, area: 16787, grdp: 38.2 },
  { name: "Maluku", capital: "Ambon", island: "Maluku–Papua", people: 1923, area: 46914, grdp: 33.6 },
  { name: "North Maluku", capital: "Sofifi", island: "Maluku–Papua", people: 1373, area: 31983, grdp: 52.9 },
  { name: "West Papua", capital: "Manokwari", island: "Maluku–Papua", people: 576, area: 60975, grdp: 98.4 },
  { name: "Southwest Papua", capital: "Sorong", island: "Maluku–Papua", people: 618, area: 39099, grdp: 74.1 },
  { name: "Papua", capital: "Jayapura", island: "Maluku–Papua", people: 1054, area: 82681, grdp: 72.3 },
  { name: "Central Papua", capital: "Nabire", island: "Maluku–Papua", people: 1416, area: 61231, grdp: 68.7 },
  { name: "Highland Papua", capital: "Wamena", island: "Maluku–Papua", people: 1459, area: 51213, grdp: 21.8 },
  { name: "South Papua", capital: "Merauke", island: "Maluku–Papua", people: 533, area: 127280, grdp: 54.6 },
];

export const ISLANDS = ["All island groups", "Sumatra", "Java", "Bali–Nusa Tenggara", "Kalimantan", "Sulawesi", "Maluku–Papua"];

// Wellbeing indicators with long-run change.
export const WELLBEING = [
  { name: "Life expectancy at birth", value: "71.8 years", year: 2023, change: "+4.6 years since 2000", source: "World Bank, 2023" },
  { name: "Under-five mortality", value: "20 per 1,000 births", year: 2023, change: "down from 52 in 2000", source: "UN IGME, 2023" },
  { name: "Literacy, age 15+", value: "96.5%", year: 2023, change: "+6.9 points since 2000", source: "BPS Susenas, 2023" },
  { name: "Mean years of schooling", value: "8.9 years", year: 2024, change: "+1.6 years since 2015", source: "BPS (HDI components), 2024" },
  { name: "Human Development Index", value: "75.02", year: 2024, change: "“high” category since 2019", source: "BPS, 2024" },
  { name: "Access to improved drinking water", value: "91.0%", year: 2024, change: "+8 points since 2015", source: "BPS Susenas, 2024" },
  { name: "Households with electricity", value: "99.8%", year: 2024, change: "near-universal since 2020", source: "BPS Susenas, 2024" },
  { name: "Internet users", value: "79.5%", year: 2024, change: "up from 42% in 2018", source: "APJII survey, 2024" },
];

// Electricity generation mix, 2024 (percent of generation).
export const ENERGY_MIX = [
  { name: "Coal", share: 61.9 },
  { name: "Natural gas", share: 17.8 },
  { name: "Hydro", share: 8.1 },
  { name: "Geothermal", share: 5.4 },
  { name: "Diesel & other fossil", share: 3.2 },
  { name: "Solar, wind & biomass", share: 3.6 },
];

// Forest cover, million hectares.
export const FOREST_SERIES = [
  { year: 2015, hectares: 94.4 },
  { year: 2017, hectares: 93.0 },
  { year: 2019, hectares: 92.1 },
  { year: 2021, hectares: 91.4 },
  { year: 2023, hectares: 90.8 },
];

export const PALETTE = ["#0b3b4f", "#0e7c7b", "#e9a426", "#e4572e", "#5b8e7d", "#7a6c9b", "#c1666b", "#4a6fa5", "#8a9a5b", "#b56576"];
