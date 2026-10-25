import { createMap, addGeoJSON, fitMap, clearMap } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/map.js";
import { getGeoJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/geo.js";
import { addMarker } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/mapmarker.js";
import { findRoute } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/georoute.js";
import { setInner } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/element.js";

const TARIF_PER_KM = 4000;

createMap("peta", { center: [107.5759, -6.8736], zoom: 16 });

let jalan = null;
const pinA = addMarker("peta", [107.5759, -6.8736], { label: "A", draggable: true, onDragEnd: hitung });
const pinB = addMarker("peta", [107.5790, -6.8760], { label: "B", draggable: true, onDragEnd: hitung, color: "#2563eb" });

getGeoJSON("jalan.geojson", (response) => {
  if (!response.data) return;
  jalan = response.data;
  hitung();
});

function hitung() {
  if (!jalan) return;
  const rute = findRoute(pinA.getPosition(), pinB.getPosition(), jalan);
  clearMap("peta");
  addGeoJSON("peta", jalan, { style: { stroke: "#9ca3af", strokeWidth: 1 } });
  if (!rute) {
    setInner("info", "Kedua titik tidak terhubung lewat jalan.");
    return;
  }
  addGeoJSON("peta", rute, { style: { stroke: "#16a34a", strokeWidth: 5 } });
  fitMap("peta", rute);
  const km = rute.properties.distance / 1000;
  const harga = Math.round((km * TARIF_PER_KM) / 500) * 500;
  setInner("info", `Jarak ${km.toFixed(2)} km, estimasi Rp${harga.toLocaleString("id-ID")}`);
}