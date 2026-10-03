// Central API Base URL configuration for FG User app
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://groc-back.vercel.app");
