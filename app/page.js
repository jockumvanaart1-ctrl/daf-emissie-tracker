"use client";
import { useState, useMemo } from "react";

const UPLIFT = 1.08;
const EF_FLIGHT = {
  short: { economy: 0.15102, premium: 0.18, business: 0.21893, first: 0.21893 },
  long: { economy: 0.14787, premium: 0.23659, business: 0.42882, first: 0.59235 },
};
const EF_TRAIN = 0.00371;
const HAUL_THRESHOLD = 3700;

const REGIONS = [
  { key: "africa", label: "Afrika — Posten", color: "#0f766e", data: [
    { city: "Algiers", country: "Algerije", lat: 36.75, lon: 3.04 },
    { city: "Luanda", country: "Angola", lat: -8.84, lon: 13.23 },
    { city: "Cotonou", country: "Benin", lat: 6.37, lon: 2.39 },
    { city: "Bujumbura", country: "Burundi", lat: -3.38, lon: 29.36 },
    { city: "Ndjamena", country: "Tsjaad", lat: 12.13, lon: 15.05 },
    { city: "Abidjan", country: "Ivoorkust", lat: 5.32, lon: -4.01 },
    { city: "Kinshasa", country: "DR Congo", lat: -4.32, lon: 15.31 },
    { city: "Caïro", country: "Egypte", lat: 30.04, lon: 31.24 },
    { city: "Addis Abeba", country: "Ethiopië", lat: 9.02, lon: 38.75 },
    { city: "Accra", country: "Ghana", lat: 5.56, lon: -0.19 },
    { city: "Nairobi", country: "Kenia", lat: -1.29, lon: 36.82 },
    { city: "Tripoli", country: "Libië", lat: 32.9, lon: 13.18 },
    { city: "Bamako", country: "Mali", lat: 12.64, lon: -8.0 },
    { city: "Rabat", country: "Marokko", lat: 34.02, lon: -6.84 },
    { city: "Casablanca", country: "Marokko", lat: 33.57, lon: -7.59 },
    { city: "Maputo", country: "Mozambique", lat: -25.97, lon: 32.57 },
    { city: "Niamey", country: "Niger", lat: 13.51, lon: 2.13 },
    { city: "Abuja", country: "Nigeria", lat: 9.06, lon: 7.49 },
    { city: "Lagos", country: "Nigeria", lat: 6.52, lon: 3.38 },
    { city: "Kigali", country: "Rwanda", lat: -1.94, lon: 29.87 },
    { city: "Dakar", country: "Senegal", lat: 14.69, lon: -17.44 },
    { city: "Pretoria", country: "Zuid-Afrika", lat: -25.75, lon: 28.19 },
    { city: "Kaapstad", country: "Zuid-Afrika", lat: -33.92, lon: 18.42 },
    { city: "Juba", country: "Zuid-Soedan", lat: 4.85, lon: 31.58 },
    { city: "Khartoum", country: "Soedan", lat: 15.59, lon: 32.53 },
    { city: "Dar es Salaam", country: "Tanzania", lat: -6.79, lon: 39.28 },
    { city: "Tunis", country: "Tunesië", lat: 36.81, lon: 10.18 },
    { city: "Kampala", country: "Oeganda", lat: 0.35, lon: 32.58 },
    { city: "Harare", country: "Zimbabwe", lat: -17.83, lon: 31.05 },
  ]},
  { key: "europe", label: "Europa — Hoofdsteden", color: "#154273", data: [
    { city: "Ankara", country: "Turkije", lat: 39.93, lon: 32.86 },
    { city: "Athene", country: "Griekenland", lat: 37.98, lon: 23.73 },
    { city: "Belgrado", country: "Servië", lat: 44.79, lon: 20.47 },
    { city: "Berlijn", country: "Duitsland", lat: 52.52, lon: 13.41 },
    { city: "Bern", country: "Zwitserland", lat: 46.95, lon: 7.45 },
    { city: "Bratislava", country: "Slowakije", lat: 48.15, lon: 17.11 },
    { city: "Brussel", country: "België", lat: 50.85, lon: 4.35 },
    { city: "Boekarest", country: "Roemenië", lat: 44.43, lon: 26.1 },
    { city: "Boedapest", country: "Hongarije", lat: 47.5, lon: 19.04 },
    { city: "Kopenhagen", country: "Denemarken", lat: 55.68, lon: 12.57 },
    { city: "Dublin", country: "Ierland", lat: 53.35, lon: -6.26 },
    { city: "Helsinki", country: "Finland", lat: 60.17, lon: 24.94 },
    { city: "Kyiv", country: "Oekraïne", lat: 50.45, lon: 30.52 },
    { city: "Lissabon", country: "Portugal", lat: 38.72, lon: -9.14 },
    { city: "Ljubljana", country: "Slovenië", lat: 46.06, lon: 14.51 },
    { city: "Londen", country: "VK", lat: 51.51, lon: -0.13 },
    { city: "Luxemburg", country: "Luxemburg", lat: 49.61, lon: 6.13 },
    { city: "Madrid", country: "Spanje", lat: 40.42, lon: -3.7 },
    { city: "Oslo", country: "Noorwegen", lat: 59.91, lon: 10.75 },
    { city: "Parijs", country: "Frankrijk", lat: 48.86, lon: 2.35 },
    { city: "Praag", country: "Tsjechië", lat: 50.08, lon: 14.44 },
    { city: "Reykjavik", country: "IJsland", lat: 64.15, lon: -21.94 },
    { city: "Riga", country: "Letland", lat: 56.95, lon: 24.11 },
    { city: "Rome", country: "Italië", lat: 41.9, lon: 12.5 },
    { city: "Sofia", country: "Bulgarije", lat: 42.7, lon: 23.32 },
    { city: "Stockholm", country: "Zweden", lat: 59.33, lon: 18.07 },
    { city: "Tallinn", country: "Estland", lat: 59.44, lon: 24.75 },
    { city: "Tirana", country: "Albanië", lat: 41.33, lon: 19.82 },
    { city: "Wenen", country: "Oostenrijk", lat: 48.21, lon: 16.37 },
    { city: "Vilnius", country: "Litouwen", lat: 54.69, lon: 25.28 },
    { city: "Warschau", country: "Polen", lat: 52.23, lon: 21.01 },
    { city: "Zagreb", country: "Kroatië", lat: 45.81, lon: 15.98 },
  ]},
  { key: "americas", label: "Amerika", color: "#7c3aed", data: [
    { city: "Bogotá", country: "Colombia", lat: 4.71, lon: -74.07 },
    { city: "Brasilia", country: "Brazilië", lat: -15.79, lon: -47.88 },
    { city: "Buenos Aires", country: "Argentinië", lat: -34.6, lon: -58.38 },
    { city: "Havana", country: "Cuba", lat: 23.11, lon: -82.37 },
    { city: "Lima", country: "Peru", lat: -12.05, lon: -77.04 },
    { city: "Mexico-Stad", country: "Mexico", lat: 19.43, lon: -99.13 },
    { city: "Ottawa", country: "Canada", lat: 45.42, lon: -75.7 },
    { city: "Panama-Stad", country: "Panama", lat: 8.98, lon: -79.52 },
    { city: "Paramaribo", country: "Suriname", lat: 5.85, lon: -55.2 },
    { city: "Port of Spain", country: "Trinidad en Tobago", lat: 10.66, lon: -61.51 },
    { city: "San José", country: "Costa Rica", lat: 9.93, lon: -84.08 },
    { city: "Santiago", country: "Chili", lat: -33.45, lon: -70.67 },
    { city: "Santo Domingo", country: "Dominicaanse Rep.", lat: 18.49, lon: -69.88 },
    { city: "Washington D.C.", country: "VS", lat: 38.91, lon: -77.04 },
  ]},
  { key: "asia", label: "Azië", color: "#b45309", data: [
    { city: "Bangkok", country: "Thailand", lat: 13.76, lon: 100.5 },
    { city: "Beijing", country: "China", lat: 39.9, lon: 116.4 },
    { city: "Colombo", country: "Sri Lanka", lat: 6.93, lon: 79.85 },
    { city: "Dhaka", country: "Bangladesh", lat: 23.81, lon: 90.41 },
    { city: "Hanoi", country: "Vietnam", lat: 21.03, lon: 105.85 },
    { city: "Islamabad", country: "Pakistan", lat: 33.69, lon: 73.04 },
    { city: "Jakarta", country: "Indonesië", lat: -6.21, lon: 106.85 },
    { city: "Kaboel", country: "Afghanistan", lat: 34.53, lon: 69.17 },
    { city: "Manila", country: "Filipijnen", lat: 14.6, lon: 120.98 },
    { city: "New Delhi", country: "India", lat: 28.61, lon: 77.21 },
    { city: "Phnom Penh", country: "Cambodja", lat: 11.56, lon: 104.92 },
    { city: "Seoul", country: "Zuid-Korea", lat: 37.57, lon: 126.98 },
    { city: "Singapore", country: "Singapore", lat: 1.35, lon: 103.82 },
    { city: "Tbilisi", country: "Georgië", lat: 41.72, lon: 44.79 },
    { city: "Tokio", country: "Japan", lat: 35.68, lon: 139.69 },
    { city: "Ulaanbaatar", country: "Mongolië", lat: 47.89, lon: 106.91 },
    { city: "Yangon", country: "Myanmar", lat: 16.87, lon: 96.2 },
  ]},
  { key: "mena", label: "Midden-Oosten", color: "#dc2626", data: [
    { city: "Abu Dhabi", country: "VAE", lat: 24.45, lon: 54.65 },
    { city: "Amman", country: "Jordanië", lat: 31.95, lon: 35.93 },
    { city: "Bagdad", country: "Irak", lat: 33.31, lon: 44.37 },
    { city: "Beiroet", country: "Libanon", lat: 33.89, lon: 35.5 },
    { city: "Doha", country: "Qatar", lat: 25.29, lon: 51.53 },
    { city: "Koeweit-Stad", country: "Koeweit", lat: 29.38, lon: 47.99 },
    { city: "Muscat", country: "Oman", lat: 23.59, lon: 58.54 },
    { city: "Ramallah", country: "Palestina", lat: 31.9, lon: 35.2 },
    { city: "Riyad", country: "Saoedi-Arabië", lat: 24.71, lon: 46.68 },
    { city: "Teheran", country: "Iran", lat: 35.69, lon: 51.39 },
    { city: "Tel Aviv", country: "Israël", lat: 32.09, lon: 34.78 },
  ]},
  { key: "oceania", label: "Oceanië", color: "#0891b2", data: [
    { city: "Canberra", country: "Australië", lat: -35.28, lon: 149.13 },
    { city: "Wellington", country: "Nieuw-Zeeland", lat: -41.29, lon: 174.78 },
  ]},
];

const ALL = [];
let offset = 0;
const REGION_OFFSETS = {};
REGIONS.forEach((r) => {
  REGION_OFFSETS[r.key] = offset;
  r.data.forEach((d, i) => ALL.push({ ...d, region: r.key, gIdx: offset + i }));
  offset += r.data.length;
});

const AMS = { lat: 52.31, lon: 4.76 };

function hav(a, b) {
  const R = 6371,
    dLat = ((b.lat - a.lat) * Math.PI) / 180,
    dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function getLegCO2Flight(gcKm, cls) {
  const d = gcKm * UPLIFT;
  const band = gcKm >= HAUL_THRESHOLD ? "long" : "short";
  return (d * (EF_FLIGHT[band][cls] || EF_FLIGHT[band].economy)) / 1000;
}
function getLegCO2Train(gcKm) {
  return (gcKm * 1.2 * EF_TRAIN) / 1000;
}

function getP(idx) {
  return { lat: ALL[idx].lat, lon: ALL[idx].lon };
}
function getN(idx) {
  return ALL[idx].city;
}
function getR(idx) {
  const r = REGIONS.find((r) => r.key === ALL[idx].region);
  return r ? r.label.split(" —")[0] : "";
}

function calcRoute(stops, mode, cls) {
  if (!stops.length) return { legs: [], totalKm: 0, totalCO2: 0 };
  const pts = [AMS, ...stops.map(getP), AMS];
  const nms = ["AMS", ...stops.map(getN), "AMS"];
  const legs = [];
  let totalKm = 0,
    totalCO2 = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const gc = hav(pts[i], pts[i + 1]);
    const co2 = mode === "train" ? getLegCO2Train(gc) : getLegCO2Flight(gc, cls);
    legs.push({ from: nms[i], to: nms[i + 1], gc: Math.round(gc), co2 });
    totalKm += gc;
    totalCO2 += co2;
  }
  return { legs, totalKm, totalCO2 };
}

export default function Home() {
  const [baseYear, setBaseYear] = useState(2024);
  const [baseline, setBaseline] = useState(115);
  const [reductionPct, setReductionPct] = useState(15);
  const currentYear = 2026;
  const [trips, setTrips] = useState([]);
  const [traveler, setTraveler] = useState("");
  const [mode, setMode] = useState("flight");
  const [cls, setCls] = useState("economy");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stops, setStops] = useState([]);
  const [editIdx, setEditIdx] = useState(null);
  const [regionFilter, setRegionFilter] = useState("all");

  const toggle = (i) =>
    setStops((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  const mv = (i, d) =>
    setStops((p) => {
      const a = [...p],
        n = i + d;
      if (n < 0 || n >= a.length) return a;
      [a[i], a[n]] = [a[n], a[i]];
      return a;
    });
  const rm = (i) => setStops((p) => p.filter((_, j) => j !== i));

  const route = useMemo(() => calcRoute(stops, mode, cls), [stops, mode, cls]);
  const label =
    stops.length > 0
      ? ["AMS", ...stops.map(getN), "AMS"].join(" → ")
      : "Selecteer bestemmingen hieronder";

  const add = () => {
    if (!traveler.trim() || !startDate || !stops.length) return;
    const t = {
      traveler: traveler.trim(), stops: [...stops], route: label,
      km: route.totalKm, class: cls, co2: route.totalCO2,
      startDate, endDate: endDate || startDate, legs: route.legs, mode,
    };
    if (editIdx !== null) {
      setTrips((p) => p.map((x, i) => (i === editIdx ? t : x)));
      setEditIdx(null);
    } else setTrips((p) => [...p, t]);
    setTraveler(""); setStartDate(""); setEndDate(""); setStops([]);
  };
  const del = (i) => setTrips((p) => p.filter((_, j) => j !== i));
  const edit = (i) => {
    const t = trips[i];
    setTraveler(t.traveler); setStartDate(t.startDate); setEndDate(t.endDate);
    setCls(t.class); setMode(t.mode); setStops(t.stops); setEditIdx(i);
  };

  const totalCO2 = useMemo(() => trips.reduce((s, t) => s + t.co2, 0), [trips]);
  const target = baseline * (1 - reductionPct / 100);
  const pctOfTarget = target > 0 ? (totalCO2 / target) * 100 : 0;
  const pctOfBaseline = baseline > 0 ? (totalCO2 / baseline) * 100 : 0;
  const warningPct = 100 - reductionPct;
  const actualReduction =
    baseline > 0 ? ((baseline - totalCO2) / baseline) * 100 : 0;

  const byTraveler = useMemo(() => {
    const m = {};
    trips.forEach((t) => { m[t.traveler] = (m[t.traveler] || 0) + t.co2; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [trips]);
  const byDest = useMemo(() => {
    const m = {};
    trips.forEach((t) => t.stops.forEach((s) => { m[getN(s)] = (m[getN(s)] || 0) + 1; }));
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [trips]);

  const st = {
    inp: { padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14, boxSizing: "border-box", width: "100%" },
    lbl: { display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4, color: "#64748b" },
    card: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, marginBottom: 20 },
  };

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: 20 }}>
      <div style={{ background: "linear-gradient(135deg, #123552, #154273)", borderRadius: 16, padding: "32px 32px", color: "#fff", marginBottom: 24, textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, letterSpacing: 1 }}>DAF Emissie Tracker</h1>
      </div>

      {/* Doel & Voortgang */}
      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4 }}>Basisjaar</label>
            <input type="number" value={baseYear} onChange={(e) => setBaseYear(+e.target.value)} min={2020} max={currentYear - 1} style={{ width: 80, padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14 }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4 }}>{baseYear} Uitstoot (t CO₂e)</label>
            <input type="number" value={baseline} onChange={(e) => setBaseline(+e.target.value)} style={{ width: 100, padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14 }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4 }}>Reductiedoel (%)</label>
            <input type="number" value={reductionPct} onChange={(e) => setReductionPct(+e.target.value)} min={0} max={100} style={{ width: 80, padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14 }} />
          </div>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 14px", fontSize: 13 }}>
            <span style={{ color: "#64748b" }}>Doel {currentYear}: </span>
            <strong>{target.toFixed(1)} t CO₂e</strong>
            <span style={{ color: "#64748b" }}> ({reductionPct}% minder dan {baseYear})</span>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6, fontWeight: 600 }}>
            <span>Huidig {currentYear}: {totalCO2.toFixed(1)} t CO₂e</span>
            <span>Doel {currentYear}: {target.toFixed(1)} t CO₂e</span>
          </div>
          <div style={{ position: "relative", marginBottom: 6 }}>
            <div style={{ background: "#e2e8f0", borderRadius: 999, height: 32, overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${Math.min(pctOfTarget, warningPct)}%`, background: "linear-gradient(90deg, #10b981, #34d399)", transition: "width 0.5s ease" }} />
              <div style={{ position: "absolute", left: `${warningPct}%`, top: 0, height: "100%", width: `${100 - warningPct}%`, background: "repeating-linear-gradient(135deg, #fecaca, #fecaca 4px, #fee2e2 4px, #fee2e2 8px)", opacity: 0.6 }} />
              {pctOfTarget > warningPct && <div style={{ position: "absolute", left: `${warningPct}%`, top: 0, height: "100%", width: `${Math.min(pctOfTarget - warningPct, 100 - warningPct)}%`, background: "linear-gradient(90deg, #f87171, #dc2626)", transition: "width 0.5s ease" }} />}
              <div style={{ position: "absolute", left: `${warningPct}%`, top: 0, bottom: 0, width: 3, background: "#dc2626", zIndex: 2, boxShadow: "0 0 6px rgba(220,38,38,0.5)" }} />
              <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", fontWeight: 700, fontSize: 13, color: pctOfTarget > 40 ? "#fff" : "#334155", zIndex: 3, textShadow: pctOfTarget > 40 ? "0 1px 2px rgba(0,0,0,0.2)" : "none" }}>{pctOfTarget.toFixed(1)}% gebruikt</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94a3b8", marginTop: 4, position: "relative" }}>
              <span>0%</span>
              <span style={{ position: "absolute", left: `${warningPct}%`, transform: "translateX(-50%)", color: "#dc2626", fontWeight: 700 }}>⚑ {warningPct}%</span>
              <span>100%</span>
            </div>
          </div>
          {pctOfTarget > 100
            ? <p style={{ color: "#ef4444", fontWeight: 600, fontSize: 13, margin: 0 }}>Doel {currentYear} overschreden met {(totalCO2 - target).toFixed(1)} ton!</p>
            : pctOfTarget > warningPct
              ? <p style={{ color: "#ef4444", fontWeight: 600, fontSize: 13, margin: 0 }}>Voorbij {warningPct}% — nog maar {(target - totalCO2).toFixed(1)} ton over!</p>
              : <p style={{ color: "#10b981", fontWeight: 600, fontSize: 13, margin: 0 }}>Nog {(target - totalCO2).toFixed(1)} ton beschikbaar binnen het doel</p>}
        </div>

        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Reductie t.o.v. {baseYear}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, fontSize: 13 }}>
            <div style={{ textAlign: "center", padding: 10, background: "#f8fafc", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{baseYear} Basis</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{baseline.toFixed(1)}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>t CO₂e</div>
            </div>
            <div style={{ textAlign: "center", padding: 10, background: "#f8fafc", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Huidig {currentYear}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: totalCO2 <= target ? "#10b981" : "#ef4444" }}>{totalCO2.toFixed(1)}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>t CO₂e</div>
            </div>
            <div style={{ textAlign: "center", padding: 10, background: "#f8fafc", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Gebruikt van {baseYear}</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{pctOfBaseline.toFixed(1)}%</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>van basis</div>
            </div>
          </div>
          {totalCO2 > 0 && totalCO2 < baseline && (
            <p style={{ margin: "10px 0 0", fontSize: 12, color: "#64748b", textAlign: "center" }}>
              {actualReduction >= reductionPct
                ? `Op koers! Momenteel ${actualReduction.toFixed(1)}% onder ${baseYear} — ${(actualReduction - reductionPct).toFixed(1)} pp boven het reductiedoel van ${reductionPct}%`
                : `Nog ${(reductionPct - actualReduction).toFixed(1)} procentpunt te gaan om het reductiedoel van ${reductionPct}% te halen`}
            </p>
          )}
        </div>
      </div>

      {/* Reis registreren */}
      <div style={st.card}>
        <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>{editIdx !== null ? "Reis bewerken" : "Reis registreren"}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 16 }}>
          <div><label style={st.lbl}>Reiziger</label><input value={traveler} onChange={(e) => setTraveler(e.target.value)} placeholder="Naam" style={st.inp} /></div>
          <div><label style={st.lbl}>Vervoermiddel</label><select value={mode} onChange={(e) => setMode(e.target.value)} style={{ ...st.inp, background: "#fff" }}><option value="flight">Vlucht</option><option value="train">Trein</option></select></div>
          {mode === "flight" && (<div><label style={st.lbl}>Klasse</label><select value={cls} onChange={(e) => setCls(e.target.value)} style={{ ...st.inp, background: "#fff" }}><option value="economy">Economy</option><option value="premium">Premium Economy</option><option value="business">Business</option><option value="first">First</option></select></div>)}
          <div><label style={st.lbl}>Startdatum</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={st.inp} /></div>
          <div><label style={st.lbl}>Einddatum</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} style={st.inp} /></div>
        </div>

        <label style={st.lbl}>Route</label>
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 13, fontWeight: 600, color: "#166534", minHeight: 20 }}>
          {mode === "flight" ? "Vlucht:" : "Trein:"} {label}
        </div>

        {stops.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            {stops.map((sIdx, i) => (
              <div key={`${sIdx}-${i}`} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, padding: "6px 10px", fontSize: 13 }}>
                <span style={{ fontWeight: 700, color: "#0f766e", minWidth: 20 }}>{i + 1}.</span>
                <span style={{ flex: 1 }}>{getN(sIdx)}</span>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{getR(sIdx)}</span>
                <button onClick={() => mv(i, -1)} disabled={i === 0} style={{ background: "none", border: "none", cursor: i === 0 ? "default" : "pointer", opacity: i === 0 ? 0.3 : 1, fontSize: 14 }}>↑</button>
                <button onClick={() => mv(i, 1)} disabled={i === stops.length - 1} style={{ background: "none", border: "none", cursor: i === stops.length - 1 ? "default" : "pointer", opacity: i === stops.length - 1 ? 0.3 : 1, fontSize: 14 }}>↓</button>
                <button onClick={() => rm(i)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>✕</button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          <button onClick={() => setRegionFilter("all")} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: regionFilter === "all" ? "2px solid #154273" : "1px solid #cbd5e1", background: regionFilter === "all" ? "#154273" : "#fff", color: regionFilter === "all" ? "#fff" : "#475569" }}>Alles</button>
          {REGIONS.map((r) => (
            <button key={r.key} onClick={() => setRegionFilter(r.key)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: regionFilter === r.key ? `2px solid ${r.color}` : "1px solid #cbd5e1", background: regionFilter === r.key ? r.color : "#fff", color: regionFilter === r.key ? "#fff" : "#475569" }}>{r.label}</button>
          ))}
        </div>

        <div style={{ maxHeight: 220, overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: 8, padding: 8, marginBottom: 14 }}>
          {REGIONS.filter((r) => regionFilter === "all" || regionFilter === r.key).map((r) => (
            <div key={r.key} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: r.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{r.label}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {r.data.map((p, i) => {
                  const gIdx = REGION_OFFSETS[r.key] + i;
                  const active = stops.includes(gIdx);
                  return (
                    <button key={`${r.key}-${i}`} onClick={() => toggle(gIdx)} style={{ padding: "4px 9px", borderRadius: 5, fontSize: 11, cursor: "pointer", border: active ? `2px solid ${r.color}` : "1px solid #cbd5e1", background: active ? `${r.color}15` : "#fff", color: active ? r.color : "#475569", fontWeight: active ? 700 : 400 }}>
                      {p.city}{active ? ` (${stops.indexOf(gIdx) + 1})` : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {route.legs.length > 0 && (
          <div style={{ background: "#f8fafc", borderRadius: 8, padding: 12, marginBottom: 14, fontSize: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 6, color: "#475569" }}>Overzicht per traject:</div>
            {route.legs.map((leg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid #e2e8f0" }}>
                <span>{leg.from} → {leg.to}</span>
                <span style={{ color: "#64748b" }}>{leg.gc.toLocaleString()} km ({mode === "flight" ? (leg.gc >= HAUL_THRESHOLD ? "langeafstand" : "korteafstand") : "trein"}) · <strong>{(leg.co2 * 1000).toFixed(1)} kg</strong></span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0 0", fontWeight: 700 }}>
              <span>Totaal</span>
              <span>{Math.round(route.totalKm).toLocaleString()} km · {route.totalCO2.toFixed(3)} t CO₂e</span>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={add} style={{ padding: "10px 24px", background: "#154273", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>{editIdx !== null ? "Reis bijwerken" : "Reis toevoegen"}</button>
          {editIdx !== null && (<button onClick={() => { setEditIdx(null); setTraveler(""); setStartDate(""); setEndDate(""); setStops([]); }} style={{ padding: "10px 24px", background: "#e2e8f0", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Annuleren</button>)}
        </div>
      </div>

      {/* Reisoverzicht */}
      {trips.length > 0 && (
        <div style={st.card}>
          <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700 }}>Reisoverzicht ({trips.length} {trips.length === 1 ? "reis" : "reizen"})</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                  <th style={{ padding: "8px 6px" }}>Datum</th><th style={{ padding: "8px 6px" }}>Reiziger</th><th style={{ padding: "8px 6px" }}>Vervoer</th><th style={{ padding: "8px 6px" }}>Route</th><th style={{ padding: "8px 6px" }}>Klasse</th><th style={{ padding: "8px 6px", textAlign: "right" }}>km</th><th style={{ padding: "8px 6px", textAlign: "right" }}>CO₂e (t)</th><th style={{ padding: "8px 6px" }}></th>
                </tr>
              </thead>
              <tbody>
                {[...trips].sort((a, b) => a.startDate.localeCompare(b.startDate)).map((t, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "8px 6px", fontSize: 12, whiteSpace: "nowrap" }}>{t.startDate}{t.endDate && t.endDate !== t.startDate ? <><br /><span style={{ color: "#64748b" }}>→ {t.endDate}</span></> : ""}</td>
                    <td style={{ padding: "8px 6px", fontWeight: 600 }}>{t.traveler}</td>
                    <td style={{ padding: "8px 6px" }}>{t.mode === "flight" ? "Vlucht" : "Trein"}</td>
                    <td style={{ padding: "8px 6px", maxWidth: 220, fontSize: 12 }}>{t.route}</td>
                    <td style={{ padding: "8px 6px", textTransform: "capitalize" }}>{t.mode === "train" ? "—" : t.class}</td>
                    <td style={{ padding: "8px 6px", textAlign: "right" }}>{Math.round(t.km).toLocaleString()}</td>
                    <td style={{ padding: "8px 6px", textAlign: "right", fontWeight: 600 }}>{t.co2.toFixed(3)}</td>
                    <td style={{ padding: "8px 6px", whiteSpace: "nowrap" }}>
                      <button onClick={() => edit(i)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>✏️</button>
                      <button onClick={() => del(i)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Uitsplitsingen */}
      {trips.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 20 }}>
          <div style={st.card}>
            <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700 }}>Uitstoot per reiziger</h3>
            {byTraveler.map(([n, co2]) => (
              <div key={n} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}><span style={{ fontWeight: 600 }}>{n}</span><span>{co2.toFixed(3)} t</span></div>
                <div style={{ background: "#e2e8f0", borderRadius: 999, height: 8 }}><div style={{ background: "#154273", height: "100%", borderRadius: 999, width: `${(co2 / totalCO2) * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <div style={st.card}>
            <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700 }}>Meest bezochte bestemmingen</h3>
            {byDest.slice(0, 8).map(([d, c]) => (
              <div key={d} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}><span style={{ fontWeight: 600 }}>{d}</span><span>{c} {c === 1 ? "reis" : "reizen"}</span></div>
                <div style={{ background: "#e2e8f0", borderRadius: 999, height: 8 }}><div style={{ background: "#123552", height: "100%", borderRadius: 999, width: `${(c / byDest[0][1]) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Methodologie */}
      <details style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 20px", fontSize: 12, color: "#64748b" }}>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>Methodologie — South Pole / DEFRA 2024</summary>
        <div style={{ marginTop: 10 }}>
          <p style={{ margin: "0 0 8px" }}><strong>Vluchten</strong> — South Pole / DEFRA 2024 (met RF + WTT, internationaal):</p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginBottom: 8 }}>
            <thead><tr style={{ borderBottom: "1px solid #cbd5e1" }}><th style={{ textAlign: "left", padding: 4 }}>Categorie</th><th style={{ textAlign: "right", padding: 4 }}>Economy</th><th style={{ textAlign: "right", padding: 4 }}>Premium</th><th style={{ textAlign: "right", padding: 4 }}>Business</th><th style={{ textAlign: "right", padding: 4 }}>First</th></tr></thead>
            <tbody>
              <tr><td style={{ padding: 4 }}>Korteafstand (&lt;3700 km)</td><td style={{ textAlign: "right", padding: 4 }}>0.15102</td><td style={{ textAlign: "right", padding: 4 }}>0.18000</td><td style={{ textAlign: "right", padding: 4 }}>0.21893</td><td style={{ textAlign: "right", padding: 4 }}>0.21893</td></tr>
              <tr><td style={{ padding: 4 }}>Langeafstand (≥3700 km)</td><td style={{ textAlign: "right", padding: 4 }}>0.14787</td><td style={{ textAlign: "right", padding: 4 }}>0.23659</td><td style={{ textAlign: "right", padding: 4 }}>0.42882</td><td style={{ textAlign: "right", padding: 4 }}>0.59235</td></tr>
            </tbody>
          </table>
          <p style={{ margin: "0 0 4px" }}>Eenheden: kg CO₂e / passagier-km · +8% afstandsopslag voor indirecte routing</p>
          <p style={{ margin: "8px 0 8px" }}><strong>Trein</strong> — DEFRA 2024 internationaal spoor: <strong>0.00371 kg CO₂e / pkm</strong> · +20% afstandsopslag</p>
          <p style={{ margin: "0 0 4px" }}><strong>Berekening:</strong> Grootcirkelafstand (haversine) x opslag x emissiefactor per traject.</p>
          <p style={{ margin: "8px 0 0", fontStyle: "italic" }}>Bronnen: DESNZ/DEFRA GHG Conversion Factors 2024 · South Pole · GHG Protocol</p>
        </div>
      </details>
    </div>
  );
}
