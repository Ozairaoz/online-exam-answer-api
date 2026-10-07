/**
 * API base URL for production (Render). Leave empty in local dev to use Vite proxy.
 */
const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export function apiUrl(path) {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${base}${normalized}`;
}
