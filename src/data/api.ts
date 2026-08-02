export const fields = [
  { id: 1, name: "North Field", crop: "Wheat", cropType: "wheat", area: 42, health: 82, moisture: 34, ndvi: 0.71, lastAssessed: "2 days ago",
    sensor: [{d:"Mon",v:38},{d:"Tue",v:36},{d:"Wed",v:35},{d:"Thu",v:33},{d:"Fri",v:34},{d:"Sat",v:34},{d:"Sun",v:34}],
    yieldPred: { expected: 5.8, lastYear: 5.2, unit: "t/ha" },
    plan: "Nitrogen top-dressing scheduled Jul 12",
    econ: { revenue: 255780, cost: 92400, profit: 163380, margin: 64 },
    trap: { pest: "Cereal aphid · Sitobion avenae", unit: "aphids/tiller", threshold: 30, level: "Normal",
      data: [{d:"W1",v:5},{d:"W2",v:6},{d:"W3",v:5},{d:"W4",v:7},{d:"W5",v:6},{d:"W6",v:8}],
      recommendation: "Counts well below threshold — continue routine weekly monitoring." },
    satelliteImageUrl: "https://example.com/api/sat/field1.jpg", connectionStatus: "online" as const },
  { id: 2, name: "South Field", crop: "Corn", cropType: "corn", area: 58, health: 67, moisture: 22, ndvi: 0.58, lastAssessed: "1 day ago",
    sensor: [{d:"Mon",v:28},{d:"Tue",v:26},{d:"Wed",v:24},{d:"Thu",v:23},{d:"Fri",v:22},{d:"Sat",v:22},{d:"Sun",v:22}],
    yieldPred: { expected: 8.1, lastYear: 8.6, unit: "t/ha" },
    plan: "Irrigation cycle due — moisture trending down",
    econ: { revenue: 422820, cost: 150800, profit: 272020, margin: 64 },
    trap: { pest: "European corn borer · Ostrinia nubilalis", unit: "larvae/trap/week", threshold: 15, level: "Elevated",
      data: [{d:"W1",v:4},{d:"W2",v:6},{d:"W3",v:9},{d:"W4",v:11},{d:"W5",v:14},{d:"W6",v:16}],
      recommendation: "Just crossed threshold — increase trap checks to twice weekly and prepare a targeted treatment if counts keep rising." },
    satelliteImageUrl: "https://example.com/api/sat/field2.jpg", connectionStatus: "unstable" as const },
  { id: 3, name: "East Pasture", crop: "Pasture", cropType: "pasture", area: 30, health: 90, moisture: 45, ndvi: 0.80, lastAssessed: "5 hours ago",
    sensor: [{d:"Mon",v:42},{d:"Tue",v:43},{d:"Wed",v:44},{d:"Thu",v:44},{d:"Fri",v:45},{d:"Sat",v:45},{d:"Sun",v:45}],
    yieldPred: null,
    plan: "No action needed",
    econ: { revenue: 0, cost: 9000, profit: -9000, margin: null, note: "Grazing land — maintenance cost only; value captured via herd output, not tracked as direct field revenue." },
    trap: null, satelliteImageUrl: "https://example.com/api/sat/field3.jpg", connectionStatus: "online" as const },
  { id: 4, name: "West Field", crop: "Sunflower", cropType: "sunflower", area: 25, health: 54, moisture: 15, ndvi: 0.42, lastAssessed: "6 hours ago",
    sensor: [{d:"Mon",v:20},{d:"Tue",v:19},{d:"Wed",v:18},{d:"Thu",v:16},{d:"Fri",v:15},{d:"Sat",v:15},{d:"Sun",v:15}],
    yieldPred: { expected: 2.1, lastYear: 2.6, unit: "t/ha" },
    plan: "Fungicide application scheduled Jul 8 — downy mildew",
    econ: { revenue: 110250, cost: 48750, profit: 61500, margin: 56, note: "Includes recommended insecticide intervention (~150 RON/ha) — margin is 8 pts below the 3-year average for this lot due to pest pressure." },
    trap: { pest: "Sunflower moth · Homoeosoma nebulella", unit: "moths/trap/week", threshold: 20, level: "Critical",
      data: [{d:"W1",v:8},{d:"W2",v:12},{d:"W3",v:18},{d:"W4",v:27},{d:"W5",v:35},{d:"W6",v:42}],
      recommendation: "More than double the action threshold — apply a targeted insecticide within 24–48h and scout field margins before treatment." },
    satelliteImageUrl: "https://example.com/api/sat/field4.jpg", connectionStatus: "online" as const },
];

export const herds = [
  { id: 1, name: "Dairy Herd A", species: "Holstein cows", herdType: "dairy", count: 64, health: 88, bcs: 3.2, alerts: 0,
    milk: [{d:"W1",v:22.9},{d:"W2",v:23.4},{d:"W3",v:23.8},{d:"W4",v:24.5}],
    milkPred: { expected: 24.5, lastMonth: 23.8, unit: "L/cow/day" },
    plan: "FMD booster vaccination due Jul 15",
    econ: { period: "month", revenue: 131712, cost: 89600, profit: 42112, margin: 32 },
    parasite: { name: "Gastrointestinal nematodes", unit: "eggs/gram (FEC)", threshold: 200, level: "Normal",
      data: [{d:"W1",v:80},{d:"W2",v:95},{d:"W3",v:110},{d:"W4",v:120}],
      recommendation: "FEC within acceptable range — maintain the routine deworming schedule." },
    cameraFeedUrl: "https://example.com/api/cams/dairy", connectionStatus: "online" as const },
  { id: 2, name: "Herd B", species: "Merino sheep", herdType: "sheep", count: 210, health: 76, bcs: 2.8, alerts: 1,
    milk: null,
    plan: "Anti-parasitic treatment overdue — resistance risk with ivermectin, moxidectin drench recommended",
    econ: { period: "year", revenue: 79800, cost: 60900, profit: 18900, margin: 24, note: "Includes the moxidectin treatment run for the current barber pole worm outbreak — margin is well below Dairy Herd A's, largely due to parasite-related costs." },
    parasite: { name: "Barber pole worm · Haemonchus contortus", unit: "eggs/gram (FEC)", threshold: 400, level: "Critical",
      data: [{d:"W1",v:150},{d:"W2",v:280},{d:"W3",v:420},{d:"W4",v:610}],
      recommendation: "FEC well above threshold — treat immediately and isolate high-shedding animals. Consider a non-ivermectin class due to regional resistance." },
    cameraFeedUrl: "https://example.com/api/cams/sheep", connectionStatus: "offline" as const },
  { id: 3, name: "Layer Coop", species: "Leghorn chickens", herdType: "poultry", count: 240, health: 92, bcs: 3.5, alerts: 0,
    milk: null,
    plan: "Routine coop sanitation scheduled for next week",
    econ: { period: "month", revenue: 5400, cost: 2100, profit: 3300, margin: 61 },
    parasite: { name: "Poultry red mite", unit: "mites/trap", threshold: 50, level: "Normal",
      data: [{d:"W1",v:5},{d:"W2",v:8},{d:"W3",v:12},{d:"W4",v:15}],
      recommendation: "Mite pressure is very low — maintain standard biosecurity and diatomaceous earth dusting." },
    cameraFeedUrl: "https://example.com/api/cams/poultry", connectionStatus: "online" as const },
];

export const marketPrices = [
  { id: 1, name: "Wheat", cropType: "wheat", unit: "RON/t", local: 1080, global: 1015, trend: 1.2, assumption: 1050 },
  { id: 2, name: "Corn", cropType: "corn", unit: "RON/t", local: 920, global: 940, trend: -0.8, assumption: 900 },
  { id: 3, name: "Sunflower seed", cropType: "sunflower", unit: "RON/t", local: 2150, global: 2090, trend: 2.1, assumption: 2100 },
  { id: 4, name: "Raw milk", herdType: "dairy", unit: "RON/L", local: 2.85, global: 2.33, trend: 0, assumption: 2.8 },
  { id: 5, name: "Lamb liveweight", herdType: "sheep", unit: "RON/kg", local: 14.2, global: 15.3, trend: -1.4, assumption: null },
  { id: 6, name: "Farm-fresh eggs", herdType: "poultry", unit: "RON/10pcs", local: 12.5, global: 11.2, trend: 0.5, assumption: 12.0 },
];

export const plans = [
  { id: 1, type: "Crop", target: "West Field", title: "Fungicide application — downy mildew", product: "Ridomil Gold, 2.5 kg/ha", date: "Jul 8", status: "Scheduled" },
  { id: 2, type: "Animal", target: "Herd B", title: "Anti-parasitic treatment — barber pole worm", product: "Recommended: moxidectin drench (resistance-aware)", date: "Immediate", status: "Recommended" },
  { id: 3, type: "Animal", target: "Dairy Herd A", title: "Routine vaccination — FMD booster", product: "—", date: "Jul 15", status: "Scheduled" },
  { id: 4, type: "Crop", target: "South Field", title: "Nitrogen top-dressing", product: "Urea 46%, 150 kg/ha", date: "Jun 30", status: "Completed" },
  { id: 5, type: "Crop", target: "North Field", title: "Herbicide pass — broadleaf weeds", product: "MCPA 750, 1 L/ha", date: "Jun 24", status: "Completed" },
  { id: 6, type: "Crop", target: "West Field", title: "Insecticide application — sunflower moth larvae", product: "Recommended: lambda-cyhalothrin, 0.2 L/ha", date: "Within 48h", status: "Recommended" },
];

export const schemes = [
  { id: 1, name: "SAPS — Single Area Payment", deadline: "15 Aug 2026", status: "Docs pending", progress: 60,
    docs: [
      { label: "Land parcel declaration (IACS)", done: true },
      { label: "Proof of land use rights", done: true },
      { label: "Updated crop rotation plan", done: false },
    ] },
  { id: 2, name: "Eco-scheme — permanent soil cover", deadline: "01 Sep 2026", status: "On track", progress: 85,
    docs: [
      { label: "Soil cover photo evidence", done: true },
      { label: "Field-by-field cover log", done: true },
      { label: "Final self-declaration", done: false },
    ] },
  { id: 3, name: "Young farmer top-up", deadline: "20 Jul 2026", status: "Action needed", progress: 30,
    docs: [
      { label: "Proof of installation <= 5 years", done: true },
      { label: "Qualification certificate", done: false },
      { label: "Bank account (RON) confirmation", done: false },
    ] },
];

export const traceability = [
  { id: 1, text: "West Field — Fungicide application (Ridomil Gold) completed", time: "Jul 8, 14:30" },
  { id: 2, text: "South Field — Nitrogen top-dressing (Urea 46%) completed", time: "Jun 30, 09:15" },
  { id: 3, text: "North Field — Herbicide pass (MCPA 750) completed", time: "Jun 24, 11:00" },
];

export const notifications = [
  { id: 1, icon: "Bug", level: "bad", text: "West Field — sunflower moth trap count 42/wk, threshold 20", time: "12 min ago",
    recommendation: "Apply targeted insecticide within 24–48h.", target: "field", targetId: 4 },
  { id: 2, icon: "Bug", level: "bad", text: "Herd B — FEC 610 epg, threshold 400 (barber pole worm)", time: "40 min ago",
    recommendation: "Treat immediately; isolate high-shedding animals.", target: "herd", targetId: 2 },
  { id: 3, icon: "Droplet", level: "warn", text: "West Field — soil moisture critically low (15%)", time: "1h ago",
    recommendation: "Prioritize irrigation before any insecticide application.", target: "field", targetId: 4 },
  { id: 4, icon: "FileText", level: "warn", text: "APIA young-farmer top-up due in 15 days", time: "3h ago",
    recommendation: "Submit qualification certificate and bank confirmation.", target: "compliance", targetId: 3 },
];
