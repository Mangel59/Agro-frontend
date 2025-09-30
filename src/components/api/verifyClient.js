// src/api/verifyClient.js
import axios from "axios";

// Usa VITE_BACKEND_URI tal cual y SOLO quita un /api final si viniera.
// NO elimines /coagronet.
const BACKEND_BASE = (import.meta.env.VITE_BACKEND_URI || "").replace(/\/api\/?$/, "");

// Cliente "público" SOLO para verify (sin interceptores ni /api)
const verifyAxios = axios.create({
  baseURL: BACKEND_BASE, // p.ej. https://dev.api.inmero.co/coagronet
  headers: { "Content-Type": "application/json" },
});

// (opcional) para ver qué estás llamando
console.log("[verifyAxios] baseURL =", verifyAxios.defaults.baseURL);

// exporta una función para verificar
export function verifyEmail(token) {
  return verifyAxios.get("/auth/verify", {
    params: { token },
    headers: { Authorization: undefined }, // sin bearer
  });
}
